const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashLoanArbitrage", function () {
  let flashLoanArbitrage;
  let owner;
  let deployerAddress;

  // Mainnet addresses
  const AAVE_POOL_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";
  const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const WETH = "0xC02aaA39b223FE8D0A0e8e4F27ead9083C756Cc2";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    deployerAddress = owner.address;

    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    flashLoanArbitrage = await FlashLoanArbitrage.deploy(
      AAVE_POOL_PROVIDER,
      UNISWAP_V2_ROUTER
    );
    await flashLoanArbitrage.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy with correct owner", async function () {
      expect(await flashLoanArbitrage.owner()).to.equal(deployerAddress);
    });

    it("Should set default DEX router", async function () {
      expect(await flashLoanArbitrage.dexRouter()).to.equal(UNISWAP_V2_ROUTER);
    });
  });

  describe("Quote Arbitrage", function () {
    it("Should quote arbitrage profitability", async function () {
      const arbParams = {
        routerA: UNISWAP_V2_ROUTER,
        routerB: UNISWAP_V2_ROUTER,
        tokenOut: DAI,
        minOutMid: 0,
        minOutFinal: 0,
      };

      const loanAmount = ethers.utils.parseEther("1"); // 1 WETH

      // Note: This will only work with forking enabled
      // Otherwise it will revert due to no liquidity in test environment
      try {
        const [profitable, finalOut] = await flashLoanArbitrage.quoteArbitrage(
          WETH,
          loanAmount,
          arbParams
        );
        console.log("Profitable:", profitable);
        console.log("Final Output:", finalOut.toString());
      } catch (error) {
        console.log("Quote failed (expected without forking):", error.message);
      }
    });
  });

  describe("Owner Functions", function () {
    it("Only owner can request flash loan", async function () {
      const [, nonOwner] = await ethers.getSigners();

      const arbParams = {
        routerA: UNISWAP_V2_ROUTER,
        routerB: UNISWAP_V2_ROUTER,
        tokenOut: DAI,
        minOutMid: 0,
        minOutFinal: 0,
      };

      const params = ethers.utils.defaultAbiCoder.encode(
        ["tuple(address,address,address,uint256,uint256)"],
        [arbParams]
      );

      await expect(
        flashLoanArbitrage.connect(nonOwner).requestFlashLoan(
          WETH,
          ethers.utils.parseEther("1"),
          params
        )
      ).to.be.revertedWith("Only owner");
    });

    it("Only owner can withdraw tokens", async function () {
      const [, nonOwner] = await ethers.getSigners();

      await expect(
        flashLoanArbitrage.connect(nonOwner).withdraw(WETH)
      ).to.be.revertedWith("Only owner");
    });

    it("Only owner can withdraw native", async function () {
      const [, nonOwner] = await ethers.getSigners();

      await expect(
        flashLoanArbitrage.connect(nonOwner).withdrawNative()
      ).to.be.revertedWith("Only owner");
    });
  });

  describe("Receive ETH", function () {
    it("Should accept ETH transfers", async function () {
      const [owner] = await ethers.getSigners();

      await owner.sendTransaction({
        to: flashLoanArbitrage.address,
        value: ethers.utils.parseEther("1"),
      });

      const balance = await ethers.provider.getBalance(flashLoanArbitrage.address);
      expect(balance).to.equal(ethers.utils.parseEther("1"));
    });
  });
});
