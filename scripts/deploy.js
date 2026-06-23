const hre = require("hardhat");
const { ethers } = require("hardhat");

// Mainnet Addresses
const AAVE_POOL_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e"; // Aave V3 PoolAddressesProvider
const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";  // Uniswap V2 Router
const SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE31b8eC6c6EB8da912F8a7";    // SushiSwap Router

async function main() {
  console.log("Deploying FlashLoanArbitrage contract...");

  const FlashLoanArbitrage = await hre.ethers.getContractFactory("FlashLoanArbitrage");
  
  // Deploy with Aave V3 Pool Provider and default DEX router (Uniswap V2)
  const contract = await FlashLoanArbitrage.deploy(
    AAVE_POOL_PROVIDER,
    UNISWAP_V2_ROUTER
  );

  await contract.deployed();

  console.log("✅ FlashLoanArbitrage deployed to:", contract.address);
  console.log("");
  console.log("Contract Details:");
  console.log("  - Aave V3 Pool Provider:", AAVE_POOL_PROVIDER);
  console.log("  - Default DEX Router (RouterA):", UNISWAP_V2_ROUTER);
  console.log("  - Network: Ethereum Mainnet");
  console.log("");
  console.log("Next steps:");
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network mainnet ${contract.address} ${AAVE_POOL_PROVIDER} ${UNISWAP_V2_ROUTER}`);
  console.log("");
  console.log("2. Fund the contract with the base asset (e.g., WETH, DAI, USDC)");
  console.log("");
  console.log("3. Call requestFlashLoan() with:");
  console.log("   - _token: address of the token to borrow");
  console.log("   - _amount: amount to borrow (in wei)");
  console.log("   - _params: encoded ArbParams struct");

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    aavePoolProvider: AAVE_POOL_PROVIDER,
    defaultRouter: UNISWAP_V2_ROUTER,
    network: "mainnet",
    deploymentTime: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "./deployments/mainnet.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📋 Deployment info saved to ./deployments/mainnet.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
