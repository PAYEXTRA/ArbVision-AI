# ArbVision-AI

**WEB3 AI DeFi Agent Flash Loan Arbitrage Trading Engine**

A production-ready Solidity smart contract for executing flash loan-based arbitrage on Ethereum Mainnet using Aave V3 and DEX protocols (Uniswap V2, SushiSwap, etc.).

## 🎯 Features

✅ **Aave V3 Flash Loans** - Borrow large amounts without collateral  
✅ **Multi-DEX Arbitrage** - Execute round-trip trades across different DEXes  
✅ **Slippage Protection** - Configurable minimum output amounts  
✅ **Profitability Checks** - Pre-verify arbitrage opportunities before execution  
✅ **Gas Optimized** - Compiled with optimization enabled (runs: 200)  
✅ **Mainnet Ready** - Fully tested and auditable code  
✅ **Owner Controls** - Secure access control via onlyOwner modifier  

## 📋 Contract Overview

### FlashLoanArbitrage

**Main contract** that:
1. Requests flash loans from Aave V3 Pool
2. Executes two-leg arbitrage across DEXes
3. Returns loan + premium to Aave
4. Sends profit to contract owner

**Key Functions:**

| Function | Description |
|----------|-------------|
| `requestFlashLoan()` | Initiates the flash loan request |
| `quoteArbitrage()` | Simulates arbitrage profitability (view function) |
| `withdraw()` | Withdraws ERC20 tokens to owner |
| `withdrawNative()` | Withdraws ETH to owner |

## 🚀 Quick Start

### Prerequisites

- Node.js v14+
- npm or yarn
- Mainnet RPC URL (Alchemy/Infura)
- Private key for deployment
- Etherscan API key (optional, for verification)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### Compilation

```bash
npm run compile
```

### Testing

```bash
npm run test
npm run gas-report        # Generate gas reports
npm run fork              # Run tests with Mainnet forking
```

### Deployment

```bash
npm run deploy:mainnet
```

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 📖 Usage Example

```javascript
const { ethers } = require("hardhat");

async function executeArbitrage() {
  const contract = await ethers.getContractAt(
    "FlashLoanArbitrage",
    "0xYourContractAddress"
  );

  // Define arbitrage parameters
  const arbParams = {
    routerA: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",  // Uniswap V2
    routerB: "0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7",   // SushiSwap
    tokenOut: "0x6B175474E89094C44Da98b954EedeAC495271d0F",  // DAI
    minOutMid: ethers.utils.parseUnits("100", 18),
    minOutFinal: ethers.utils.parseUnits("1", 18)
  };

  // Encode parameters
  const params = ethers.utils.defaultAbiCoder.encode(
    ["tuple(address,address,address,uint256,uint256)"],
    [arbParams]
  );

  // Quote profitability first
  const [profitable, finalOut] = await contract.quoteArbitrage(
    "0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2",  // WETH
    ethers.utils.parseEther("10"),
    arbParams
  );

  if (profitable) {
    // Execute flash loan
    const tx = await contract.requestFlashLoan(
      "0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2",
      ethers.utils.parseEther("10"),
      params
    );
    await tx.wait();
    console.log("✅ Arbitrage executed successfully");
  } else {
    console.log("❌ Arbitrage not profitable");
  }
}
```

## 🏗️ Architecture

```
ArbVision-AI/
├── contracts/
│   ├── FlashLoanArbitrage.sol        # Main contract
│   └── interfaces/
│       └── IFlashLoanArbitrage.sol   # Contract interface
├── scripts/
│   └── deploy.js                      # Deployment script
├── test/
│   └── FlashLoanArbitrage.test.js    # Unit tests
├── hardhat.config.js                  # Hardhat config
├── package.json                       # Dependencies
├── .env.example                       # Environment template
└── DEPLOY.md                          # Deployment guide
```

## 🔐 Security Features

- **Access Control**: `onlyOwner` modifier on sensitive functions
- **Reentrancy Protection**: Safe approval patterns
- **Slippage Guards**: Configurable `minOutMid` and `minOutFinal`
- **Flash Loan Verification**: Validates Aave Pool callback
- **Balance Checks**: Ensures arbitrage covers loan + premium

## 📊 Mainnet Addresses

| Contract | Address |
|----------|----------|
| Aave V3 Pool Provider | `0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e` |
| Uniswap V2 Router | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| SushiSwap Router | `0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7` |
| WETH | `0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2` |
| DAI | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |

## 💰 Fees

- **Aave V3 Flash Loan Fee**: 0.09% (9 basis points)
- **DEX Swap Fees**: 0.25%-1.0% depending on pool tier
- **Gas Costs**: ~500K-1M gas per transaction

## ⚙️ Compilation & Deployment

**Solidity Version**: 0.8.10  
**Optimization**: Enabled (runs: 200)  
**License**: MIT

```bash
# Compile
npm run compile

# Deploy to Mainnet
npm run deploy:mainnet

# Verify on Etherscan
npm run verify -- --network mainnet <address> <constructor-args>
```

## 📝 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npx hardhat coverage

# Run with gas reports
npm run gas-report

# Run with Mainnet forking
npm run fork
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Insufficient balance" | Ensure wallet has enough ETH for gas (~500K gas) |
| "Invalid RPC URL" | Check `MAINNET_RPC_URL` in `.env` |
| "Flash loan reverts" | Verify liquidity exists and `minOutFinal` is achievable |
| "Nonce too low" | Don't submit multiple transactions simultaneously |

## 📚 Documentation

- [DEPLOY.md](./DEPLOY.md) - Detailed deployment guide
- [Aave V3 Docs](https://docs.aave.com/developers/)
- [Uniswap V2 Docs](https://docs.uniswap.org/protocol/V2/)
- [Hardhat Docs](https://hardhat.org/)

## ⚠️ Disclaimer

This code is provided as-is for educational and research purposes. Before deploying to Mainnet:

1. **Get a professional security audit**
2. **Test extensively on testnet first**
3. **Use hardware wallets for production**
4. **Verify all contract interactions**
5. **Monitor gas prices and transaction costs**
6. **Understand DeFi risks** (slippage, impermanent loss, smart contract risk)

The authors assume no liability for any losses incurred through the use of this code.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Open a GitHub Issue
- Check existing documentation in [DEPLOY.md](./DEPLOY.md)
- Review security considerations in [SECURITY.md](./SECURITY.md)

---

**Version**: 1.0.0  
**Author**: PAYEXTRA  
**Updated**: 2026-06-23  
**Network**: Ethereum Mainnet (Chainid: 1)
