// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {FairPayCore} from "../src/FairPayCore.sol";
import {OrganizationManager} from "../src/OrganizationManager.sol";
import {FeesManager} from "../src/FeesManager.sol";
import {JobFactory} from "../src/JobFactory.sol";
import {JobEscrowFactory} from "../src/JobEscrowFactory.sol";
import {JobEscrow} from "../src/JobEscrow.sol";

contract DeployFairPay is Script {
    
    FairPayCore public fairPay;
    OrganizationManager public orgManager;
    FeesManager public feesManager;
    JobEscrow public jobEscrowImpl;
    JobEscrowFactory public escrowFactory;
    JobFactory public jobFactory;

    function run() external {
      
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying FairPay system with deployer:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);

        orgManager = new OrganizationManager();
        feesManager = new FeesManager(deployer);
        
        console.log("Deployed manager contracts");
        
        fairPay = new FairPayCore(
            address(orgManager),
            address(feesManager)
        );
        
        console.log("Deployed FairPayCore");
        
       
        jobEscrowImpl = new JobEscrow();
        
        console.log("Deployed JobEscrow implementation");
        
        escrowFactory = new JobEscrowFactory(address(jobEscrowImpl));
        
        console.log("Deployed JobEscrowFactory");
        
        jobFactory = new JobFactory(
            address(fairPay),
            address(escrowFactory)
        );
        
        console.log("Deployed JobFactory");
        
        fairPay.setJobFactory(address(jobFactory));
        escrowFactory.setCoreContract(address(fairPay));
        
        console.log("Connected contracts");
        
       
        orgManager.transferOwnership(address(fairPay));
        feesManager.transferOwnership(address(fairPay));
        
        console.log("Transferred ownership to FairPayCore");
        
        vm.stopBroadcast();

        console.log("======== FairPay System Deployment ========");
        console.log("Deployer: ", deployer);
        console.log("FairPayCore: ", address(fairPay));
        console.log("OrganizationManager: ", address(orgManager));
        console.log("FeesManager: ", address(feesManager));
        console.log("JobFactory: ", address(jobFactory));
        console.log("JobEscrowFactory: ", address(escrowFactory));
        console.log("JobEscrow Implementation: ", address(jobEscrowImpl));
        console.log("==========================================");
    }
}