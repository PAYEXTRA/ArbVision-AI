// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title IFlashLoanArbitrage
 * @dev Interface for the FlashLoanArbitrage contract
 */
interface IFlashLoanArbitrage {
    /// @dev Payload describing a two-hop arbitrage round trip.
    struct ArbParams {
        address routerA;       // DEX used for the first leg (asset -> tokenOut)
        address routerB;       // DEX used for the second leg (tokenOut -> asset)
        address tokenOut;      // intermediate token to cycle through
        uint256 minOutMid;     // min tokenOut expected from leg 1 (slippage guard)
        uint256 minOutFinal;   // min asset expected from leg 2 (must repay + profit)
    }

    /**
     * @notice Initiates the Flash Loan
     * @param _token Address of the asset to borrow
     * @param _amount Amount to borrow
     * @param _params abi.encode(ArbParams) payload describing the round trip
     */
    function requestFlashLoan(address _token, uint256 _amount, bytes memory _params) external;

    /**
     * @notice Read-only profitability check
     * @param asset The borrowed asset
     * @param amount The flash loan amount
     * @param p The arbitrage parameters
     * @return profitable Whether the arbitrage is profitable
     * @return finalOut The estimated output amount
     */
    function quoteArbitrage(
        address asset,
        uint256 amount,
        ArbParams calldata p
    ) external view returns (bool profitable, uint256 finalOut);

    /**
     * @notice Withdraw any ERC20 balance
     * @param _tokenAddress Address of the token to withdraw
     */
    function withdraw(address _tokenAddress) external;

    /**
     * @notice Rescue native gas tokens
     */
    function withdrawNative() external;
}
