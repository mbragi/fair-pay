// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/JobEscrow.sol";

contract DeployJobEscrow is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        address platform = deployer; 
        address employer = deployer; 
        uint256 organizationId = 1;
        string memory title = "Product Manager";
        string memory description = "Manage Product";
        uint256 totalPayment = 1 ether;
        uint256 milestoneCount = 3;
        address token = address(0); 
        uint256 platformFee = 250; 
        
        JobEscrow jobEscrow = new JobEscrow(
            platform,
            employer,
            organizationId,
            title,
            description,
            totalPayment,
            milestoneCount,
            token,
            platformFee
        );
        
        console.log("JobEscrow deployed at:", address(jobEscrow));
        
        vm.stopBroadcast();
    }
}