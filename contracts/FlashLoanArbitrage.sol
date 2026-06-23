// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

// Interfaces for DEX Swaps (Uniswap V2 compatible: Uniswap V2, SushiSwap, etc.)
interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] calldata path)
        external view returns (uint[] memory amounts);
}

/**
 * @title FlashLoanArbitrage
 * @dev A smart contract that executes an arbitrage using Aave V3 Flash Loans.
 */
contract FlashLoanArbitrage is FlashLoanSimpleReceiverBase {
    address public owner;
    address public dexRouter; // default router (router A) set at deploy time

    /// @dev Payload describing a two-hop arbitrage round trip.
    struct ArbParams {
        address routerA;       // DEX used for the first leg (asset -> tokenOut)
        address routerB;       // DEX used for the second leg (tokenOut -> asset)
        address tokenOut;      // intermediate token to cycle through
        uint256 minOutMid;     // min tokenOut expected from leg 1 (slippage guard)
        uint256 minOutFinal;   // min asset expected from leg 2 (must repay + profit)
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _addressProvider, address _dexRouter)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = msg.sender;
        dexRouter = _dexRouter;
    }

    /**
     * @notice Initiates the Flash Loan
     * @param _token Address of the asset to borrow
     * @param _amount Amount to borrow
     * @param _params abi.encode(ArbParams) payload describing the round trip
     */
    function requestFlashLoan(address _token, uint256 _amount, bytes memory _params) public onlyOwner {
        POOL.flashLoanSimple(
            address(this),
            _token,
            _amount,
            _params,
            0 // referralCode
        );
    }

    /**
     * @dev Internal helper: swap exact _amountIn of _from into _to on _router.
     *      Returns the amount of _to actually received.
     */
    function _swap(
        address _router,
        address _from,
        address _to,
        uint256 _amountIn,
        uint256 _minOut
    ) internal returns (uint256) {
        // Reset + set allowance for the router to pull _from.
        IERC20(_from).approve(_router, 0);
        IERC20(_from).approve(_router, _amountIn);

        address[] memory path = new address[](2);
        path[0] = _from;
        path[1] = _to;

        uint256 balBefore = IERC20(_to).balanceOf(address(this));
        IUniswapV2Router(_router).swapExactTokensForTokens(
            _amountIn,
            _minOut,
            path,
            address(this),
            block.timestamp
        );
        return IERC20(_to).balanceOf(address(this)) - balBefore;
    }

    /**
     * @notice Callback executed by Aave Pool after sending the borrowed funds
     * @dev This is where the arbitrage logic takes place
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // Only the Aave Pool may invoke this callback, and only via our own request.
        require(msg.sender == address(POOL), "Caller must be Aave Pool");
        require(initiator == address(this), "Initiator must be this contract");

        // 1. Decode the arbitrage instructions.
        ArbParams memory p = abi.decode(params, (ArbParams));

        // 2. Leg 1 on DEX A: borrowed asset -> intermediate token.
        uint256 midReceived = _swap(p.routerA, asset, p.tokenOut, amount, p.minOutMid);

        // 3. Leg 2 on DEX B: intermediate token -> borrowed asset.
        uint256 finalReceived = _swap(p.routerB, p.tokenOut, asset, midReceived, p.minOutFinal);

        // 4. Verify the round trip earned enough to cover principal + Aave premium.
        uint256 amountOwed = amount + premium;
        require(finalReceived >= amountOwed, "Arbitrage not profitable");

        // 5. Approve the Aave Pool to pull back the loan + fee.
        IERC20(asset).approve(address(POOL), 0);
        IERC20(asset).approve(address(POOL), amountOwed);

        // 6. Send the pure profit (anything above what is owed) to the owner.
        uint256 currentBalance = IERC20(asset).balanceOf(address(this));
        if (currentBalance > amountOwed) {
            IERC20(asset).transfer(owner, currentBalance - amountOwed);
        }

        return true;
    }

    /**
     * @notice Read-only profitability check. Simulates the round trip off-chain
     *         so callers can avoid sending a doomed (reverting) transaction.
     * @return profitable Whether finalOut covers principal + Aave premium
     * @return finalOut   Estimated asset returned after both legs
     */
    function quoteArbitrage(
        address asset,
        uint256 amount,
        ArbParams calldata p
    ) external view returns (bool profitable, uint256 finalOut) {
        address[] memory path1 = new address[](2);
        path1[0] = asset;
        path1[1] = p.tokenOut;
        uint256 mid = IUniswapV2Router(p.routerA).getAmountsOut(amount, path1)[1];

        address[] memory path2 = new address[](2);
        path2[0] = p.tokenOut;
        path2[1] = asset;
        finalOut = IUniswapV2Router(p.routerB).getAmountsOut(mid, path2)[1];

        // Aave V3 flash loan premium is 0.09% (9 bps) of the borrowed amount.
        uint256 amountOwed = amount + (amount * 9) / 10000;
        profitable = finalOut >= amountOwed;
    }

    /**
     * @notice Withdraw any ERC20 balance (e.g. accumulated profit) to the owner.
     */
    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner, balance);
    }

    /**
     * @notice Rescue native gas tokens (ETH/POL) sent to the contract.
     */
    function withdrawNative() external onlyOwner {
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "Native withdraw failed");
    }

    receive() external payable {}
}
