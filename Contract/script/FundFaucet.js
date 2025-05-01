// Script to approve and fund the WBBTFaucet contract
// Usage: node FundFaucet.js <amount>

require("dotenv").config({ path: "../.env"});
const { ethers } = require("ethers");
const fs = require("fs");

// Load ABIs
const tokenABI = JSON.parse(fs.readFileSync("../ABIs/SimpleToken.json")).abi;
const faucetABI = JSON.parse(fs.readFileSync("../ABIs/WBBTFaucet.json")).abi;

async function main() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length !== 1) {
      console.log("Usage: node FundFaucet.js <amount>");
      console.log("Example: node FundFaucet.js 10");
      process.exit(1);
    }

    // Parse amount (in tokens, will be converted to wei)
    const amount = ethers.parseEther(args[0]);

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    // Add 0x prefix to private key if it doesn't have one
    const privateKey = process.env.PRIVATE_KEY.startsWith("0x")
      ? process.env.PRIVATE_KEY
      : `0x${process.env.PRIVATE_KEY}`;
    const wallet = new ethers.Wallet(privateKey, provider);

    // Get contract addresses
    const tokenAddress = process.env.TOKEN_ADDRESS;

    // Get faucet address from deployment file
    const deploymentData = JSON.parse(
      fs.readFileSync(
        "../broadcast/DeployWBBTFaucet.s.sol/84532/run-latest.json"
      )
    );
    const faucetAddress = deploymentData.transactions.find(
      (tx) => tx.transactionType === "CREATE"
    ).contractAddress;

    console.log(`Token address: ${tokenAddress}`);
    console.log(`Faucet address: ${faucetAddress}`);
    console.log(`Funding amount: ${ethers.formatEther(amount)} WBBT`);

    // Connect to contracts
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);
    const faucetContract = new ethers.Contract(
      faucetAddress,
      faucetABI,
      wallet
    );

    // Step 1: Approve the faucet to spend tokens
    console.log("Approving tokens...");
    const approveTx = await tokenContract.approve(faucetAddress, amount);
    await approveTx.wait();
    console.log(`Approval successful! Transaction hash: ${approveTx.hash}`);

    // Step 2: Fund the faucet
    console.log("Funding faucet...");
    const fundTx = await faucetContract.fundFaucet(amount);
    await fundTx.wait();
    console.log(`Funding successful! Transaction hash: ${fundTx.hash}`);

    console.log("Done!");
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main();
