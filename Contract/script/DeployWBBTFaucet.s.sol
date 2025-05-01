// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import "../src/Token/WBBTFaucet.sol";
import "../src/Token/SimpleToken.sol";

contract DeployWBBTFaucet is Script {
    SimpleERC20 public token;
    WBBTFaucet public faucet;
    
    error DeploymentFailed(string message);
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        if (deployerPrivateKey == 0) {
            revert DeploymentFailed("PRIVATE_KEY not set in environment");
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        console.log("\n======= WBBT Faucet Deployment =======");
        console.log("Deployer: %s", deployer);
        console.log("Deployer balance: %s ETH", deployer.balance / 1 ether);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy token if needed or use existing token address
        bool deployNewToken = vm.envBool("DEPLOY_NEW_TOKEN");
        address tokenAddress;
        
        if (deployNewToken) {
            // Deploy a new token for testing
            uint256 initialSupply = 1_000_000 ether; // 1 million tokens with 18 decimals
            token = new SimpleERC20("WBBT Token", "WBBT", initialSupply);
            tokenAddress = address(token);
            console.log("Deployed new WBBT token at: %s", tokenAddress);
        } else {
            // Use existing token address
            tokenAddress = vm.envAddress("TOKEN_ADDRESS");
            if (tokenAddress == address(0)) {
                revert DeploymentFailed("TOKEN_ADDRESS not set in environment");
            }
            console.log("Using existing token at: %s", tokenAddress);
        }
        
        // Deploy faucet
        faucet = new WBBTFaucet(tokenAddress);
        console.log("Deployed WBBTFaucet at: %s", address(faucet));
        
        // Fund the faucet if deploying new token
        if (deployNewToken) {
            uint256 fundAmount = 10_000 ether; // 10,000 tokens for the faucet
            token.approve(address(faucet), fundAmount);
            faucet.fundFaucet(fundAmount);
            console.log("Funded faucet with %s WBBT tokens", fundAmount / 1 ether);
        }
        
        vm.stopBroadcast();
        
        console.log("\n======= Deployment Summary =======");
        console.log("WBBT Token: %s", tokenAddress);
        console.log("WBBTFaucet: %s", address(faucet));
        console.log("Daily claim amount: %s WBBT", faucet.DAILY_CLAIM_AMOUNT() / 1 ether);
        console.log("Maximum claim amount: %s WBBT", faucet.MAX_CLAIM_AMOUNT() / 1 ether);
        console.log("Claim period: %s seconds", faucet.CLAIM_PERIOD());
        console.log("=====================================");
    }
}