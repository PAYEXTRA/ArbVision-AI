# FlashLoanArbitrage Contract Deployment Guide

## Overview

This guide walks you through compiling and deploying the `FlashLoanArbitrage` smart contract to Ethereum Mainnet.

## Prerequisites

1. **Node.js & npm** (v14+)
2. **Hardhat** - Ethereum development framework
3. **Alchemy/Infura RPC URL** - For Mainnet access
4. **Private Key** - For deploying the contract
5. **Etherscan API Key** - For contract verification (optional but recommended)

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `hardhat` - Development framework
- `@aave/core-v3` - Aave V3 contracts
- `openzeppelin-contracts` - OpenZeppelin utilities
- `ethers` - Ethereum library
- `solidity-coverage` - Test coverage tool

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT**: Never commit `.env` to version control! It's already in `.gitignore`.

## Compilation

### Compile the Contract

```bash
npm run compile
```

This will:
- Compile `FlashLoanArbitrage.sol` to bytecode
- Generate ABI files in `./artifacts`
- Validate Solidity syntax

**Expected Output:**
```
Solidity 0.8.10 compilation successful
✓ Compiled successfully
```

## Deployment to Mainnet

### 1. Deploy the Contract

```bash
npm run deploy:mainnet
```

The deployment script will:
- Deploy `FlashLoanArbitrage` with constructor parameters:
  - `AAVE_POOL_PROVIDER`: `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e`
  - `UNISWAP_V2_ROUTER`: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
- Output the deployed contract address
- Save deployment info to `./deployments/mainnet.json`

**Example Output:**
```
Deploying FlashLoanArbitrage contract...
✅ FlashLoanArbitrage deployed to: 0xYourContractAddressHere

Contract Details:
  - Aave V3 Pool Provider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
  - Default DEX Router (RouterA): 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
  - Network: Ethereum Mainnet

Next steps:
1. Verify contract on Etherscan...
```

### 2. Verify on Etherscan (Optional but Recommended)

```bash
npx hardhat verify --network mainnet 0xYourContractAddress 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
```

This allows everyone to view and audit the source code on Etherscan.

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests with Gas Reports

```bash
npm run gas-report
```

This generates a gas cost analysis for each function.

### Test with Mainnet Forking

To test with real Mainnet state:

```bash
FORKING=true hardhat test
```

## Contract Functions

### Request Flash Loan

```solidity
function requestFlashLoan(
    address _token,
    uint256 _amount,
    bytes memory _params
) external onlyOwner
```

**Parameters:**
- `_token`: Address of the asset to borrow (e.g., WETH: `0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2`)
- `_amount`: Amount to borrow in wei
- `_params`: ABI-encoded `ArbParams` struct

**Example:**
```javascript
const arbParams = {
  routerA: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",  // Uniswap V2
  routerB: "0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7",   // SushiSwap
  tokenOut: "0x6B175474E89094C44Da98b954EedeAC495271d0F",  // DAI
  minOutMid: ethers.utils.parseUnits("100", 18),
  minOutFinal: ethers.utils.parseUnits("1", 18)
};

const params = ethers.utils.defaultAbiCoder.encode(
  ["tuple(address,address,address,uint256,uint256)"],
  [arbParams]
);

await contract.requestFlashLoan(
  wethAddress,
  ethers.utils.parseEther("10"),
  params
);
```

### Quote Arbitrage

```solidity
function quoteArbitrage(
    address asset,
    uint256 amount,
    ArbParams calldata p
) external view returns (bool profitable, uint256 finalOut)
```

**Use this to verify profitability before executing the flash loan.**

### Withdraw Profits

```solidity
function withdraw(address _tokenAddress) external onlyOwner
```

Withdraws accumulated ERC20 tokens to owner.

```solidity
function withdrawNative() external onlyOwner
```

Withdraws ETH/POL to owner.

## Mainnet Configuration

### Key Addresses

| Contract | Address |
|----------|----------|
| Aave V3 Pool Provider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` |
| Uniswap V2 Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| SushiSwap Router | `0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7` |
| WETH | `0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2` |
| DAI | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |

### Aave V3 Flash Loan Fee

- **Fee**: 0.09% (9 basis points) of borrowed amount
- Calculated as: `amount + (amount * 9) / 10000`

## Gas Optimization

The contract is compiled with the following optimization settings:

```javascript
{
  enabled: true,
  runs: 200
}
```

This balances bytecode size and runtime gas cost.

## Security Considerations

⚠️ **Before deploying to Mainnet:**

1. **Audit**: Have the contract audited by security professionals
2. **Reentrancy**: The contract uses safe approval patterns
3. **Slippage Protection**: Always set minimum output amounts
4. **Flash Loan Premium**: Account for 0.09% Aave V3 fee
5. **Private Key Safety**: Use hardware wallets or secure key management
6. **Test on Testnet First**: Always test with real DEX data first

## Troubleshooting

### "Insufficient balance" Error
Ensure your wallet has enough ETH for gas fees (~500K gas units).

### "Invalid RPC URL" Error
Check your `MAINNET_RPC_URL` in `.env` is correct and accessible.

### "Nonce too low" Error
Check that you're not submitting multiple transactions simultaneously.

### Flash Loan Reverts
Ensure:
- Pool has sufficient liquidity
- `minOutFinal` is achievable
- Contract has approvals set correctly
- Arbitrage spreads exist between DEXes

## Support

For more information:
- [Aave V3 Documentation](https://docs.aave.com/developers/v/2.0/)
- [Uniswap V2 Documentation](https://docs.uniswap.org/protocol/V2/introduction)
- [Hardhat Documentation](https://hardhat.org/getting-started)

---

**Deployed Version**: 1.0.0  
**Solidity Version**: 0.8.10  
**License**: MIT
