// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {FairPayCore} from "../src/FairPayCore.sol";
import {OrganizationManager} from "../src/OrganizationManager.sol";
import {FeesManager} from "../src/FeesManager.sol";
import {JobFactory} from "../src/JobFactory.sol";
import {JobEscrowFactory} from "../src/JobEscrowFactory.sol";
import {JobEscrow} from "../src/JobEscrow.sol";
import {WorkerDashboard} from "../src/WorkerDashboard.sol";

contract DeployFairPay is Script {
   
    FairPayCore public fairPay;
    OrganizationManager public orgManager;
    FeesManager public feesManager;
    JobEscrow public jobEscrowImpl;
    JobEscrowFactory public escrowFactory;
    JobFactory public jobFactory;
    WorkerDashboard public workerDashboard;

    error DeploymentFailed(string message);
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        if (deployerPrivateKey == 0) {
            revert DeploymentFailed("PRIVATE_KEY not set in environment");
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        console.log("\n======= FairPay System Deployment =======");
        console.log("Deployer: %s", deployer);
        console.log("Deployer balance: %s ETH", deployer.balance / 1 ether);
        
         vm.startBroadcast(deployerPrivateKey);

        // Phase 1: Deploy Manager Contracts 
        console.log("\n[1/7] Deploying manager contracts...");
        orgManager = new OrganizationManager();
        feesManager = new FeesManager(deployer);
        _verifyDeployment(address(orgManager), "OrganizationManager");
        _verifyDeployment(address(feesManager), "FeesManager");

        // Phase 2: Deploy Core Contract 
        console.log("\n[2/7] Deploying FairPayCore...");
        fairPay = new FairPayCore(address(orgManager), address(feesManager));
        _verifyDeployment(address(fairPay), "FairPayCore");

        // Phase 3: Deploy Job Escrow Implementation
        console.log("\n[3/7] Deploying JobEscrow implementation...");
        jobEscrowImpl = new JobEscrow();
        _verifyDeployment(address(jobEscrowImpl), "JobEscrow Implementation");

        // Phase 4: Deploy Factories
        console.log("\n[4/7] Deploying factories...");
        escrowFactory = new JobEscrowFactory(address(jobEscrowImpl));
        jobFactory = new JobFactory(address(escrowFactory)); 
        
        _verifyDeployment(address(escrowFactory), "JobEscrowFactory");
        _verifyDeployment(address(jobFactory), "JobFactory");

        // Phase 5: Deploy WorkerDashboard 
        console.log("\n[5/7] Deploying WorkerDashboard...");
        workerDashboard = new WorkerDashboard(address(fairPay));
        _verifyDeployment(address(workerDashboard), "WorkerDashboard");

        // Phase 6: Connect Contracts 
        console.log("\n[6/7] Connecting contracts...");
        
        // 1. First set FairPayCore in JobFactory
        jobFactory.setFairPayCore(address(fairPay));
        
        // 2. Then set JobFactory in FairPayCore
        fairPay.setJobFactory(address(jobFactory));
        
        // 3. Then set FairPayCore in JobEscrowFactory
        escrowFactory.setCoreContract(address(fairPay));
        
        // Verify connections
        require(jobFactory.fairPayCore() == address(fairPay), "FairPayCore connection in JobFactory failed");
        require(fairPay.jobFactory() == address(jobFactory), "JobFactory connection failed");
        require(escrowFactory.coreContract() == address(fairPay), "Core contract connection failed");

        // Phase 7: Transfer Ownership
        console.log("\n[7/7] Transferring ownership...");
        orgManager.transferOwnership(address(fairPay));
        feesManager.transferOwnership(address(fairPay));
        
        require(orgManager.owner() == address(fairPay), "OrgManager ownership transfer failed");
        require(feesManager.owner() == address(fairPay), "FeesManager ownership transfer failed");


        vm.stopBroadcast();


        console.log("\n======== Deployment Successful ========");
        console.log("Block: %s", block.number);
        console.log("FairPayCore: %s", address(fairPay));
        console.log("WorkerDashboard: %s", address(workerDashboard));
        console.log("OrganizationManager: %s", address(orgManager));
        console.log("FeesManager: %s", address(feesManager));
        console.log("JobFactory: %s", address(jobFactory));
        console.log("JobEscrowFactory: %s", address(escrowFactory));
        console.log("JobEscrow Implementation: %s", address(jobEscrowImpl));
        console.log("=====================================");
    }

    
    function _verifyDeployment(address _contract, string memory _name) private view {
        if (_contract == address(0)) {
            revert DeploymentFailed(string(abi.encodePacked(_name, " deployment failed")));
        }
        console.log("%s deployed at: %s", _name, _contract);
        
        // Basic code check (non-empty contract)
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(_contract)
        }
        require(codeSize > 0, string(abi.encodePacked(_name, " has no code")));
    }
}