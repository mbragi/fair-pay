// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/FairPay.sol";
import "../src/JobEscrow.sol";

contract DeployFairPaySystem is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FairPay fairPay = new FairPay();
        
        fairPay.createOrganization("Test Organization", "A test organization");
        
        uint256 orgId = 1;
        string memory title = "Product Manager";
        string memory description = "Manage Product";
        uint256 totalPayment = 1 ether;
        uint256 milestoneCount = 3;
        address token = address(0); 
        
        fairPay.createJob(
            orgId,
            title,
            description,
            totalPayment,
            milestoneCount,
            token
        );
        
        address platform = address(fairPay);
        address employer = vm.addr(deployerPrivateKey); 
        uint256 platformFee = 250; 
        
        new JobEscrow(
            platform,
            employer,
            orgId,
            "Standalone Job",
            "A standalone job escrow instance",
            totalPayment,
            milestoneCount,
            token,
            platformFee
        );
        
        vm.stopBroadcast();
    }
}