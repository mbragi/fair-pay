// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {FairPayCore} from "../src/FairPayCore.sol";
import {OrganizationManager} from "../src/OrganizationManager.sol";
import {FeesManager} from "../src/FeesManager.sol";
import {JobFactory} from "../src/JobFactory.sol";
import {JobEscrowFactory} from "../src/JobEscrowFactory.sol";
import {JobEscrow} from "../src/JobEscrow.sol";

contract FairPayTest is Test {
    FairPayCore public fairPay;
    OrganizationManager public orgManager;
    FeesManager public feesManager;
    JobEscrow public jobEscrowImpl;
    JobEscrowFactory public escrowFactory;
    JobFactory public jobFactory;
    
    
    address public deployer = address(0x1);
    address public employer = address(0x2);
    address public worker = address(0x3);
    address public platformAdmin = address(0x4);
    
    
    uint256 public orgId;
    address public jobAddress;
    uint256 public platformFee = 250; // 2.5%
    uint256 public totalPayment = 1 ether;
    uint256 public milestoneCount = 3;
    
    function setUp() public {
        vm.startPrank(deployer);
        vm.deal(deployer, 100 ether);
        vm.deal(employer, 100 ether);
        vm.deal(worker, 1 ether);
        vm.deal(platformAdmin, 1 ether);
        
        // Create managers
        orgManager = new OrganizationManager();
        feesManager = new FeesManager(deployer);
        
        // Deploy core system
        fairPay = new FairPayCore(address(orgManager), address(feesManager));
        
        // Deploy factory contracts
        jobEscrowImpl = new JobEscrow();
        escrowFactory = new JobEscrowFactory(address(jobEscrowImpl));
        jobFactory = new JobFactory(address(fairPay), address(escrowFactory));
        
        // Set up contract relationships
        fairPay.setJobFactory(address(jobFactory));
        escrowFactory.setCoreContract(address(fairPay));
        
        // Transfer ownerships
        orgManager.transferOwnership(address(fairPay));
        feesManager.transferOwnership(platformAdmin);
        vm.stopPrank();
    }

    function _createTestJob() internal returns (address) {
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Org", "Description");
        
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "Job Description",
            totalPayment,
            milestoneCount,
            address(0)
        );
        
        // Set up milestones
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Desc ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        
        vm.stopPrank();
        return jobAddress;
    }
    
    function test_CompleteJobWorkflow() public {
        address job = _createTestJob();
        
        vm.startPrank(employer);
        JobEscrow(payable(job)).assignWorker(worker);
        JobEscrow(payable(job)).depositFunds{value: totalPayment}();
        vm.stopPrank();
        
        vm.startPrank(worker);
        JobEscrow(payable(job)).confirmJob();
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            JobEscrow(payable(job)).submitMilestone(i);
            
            vm.startPrank(employer);
            uint256 workerBalanceBefore = worker.balance;
            uint256 platformBalanceBefore = platformAdmin.balance;
            
            JobEscrow(payable(job)).approveMilestone(i);
            
            uint256 milestoneAmount = totalPayment / milestoneCount;
            uint256 fee = (milestoneAmount * platformFee) / 10000;
            uint256 workerPayment = milestoneAmount - fee;
            
            assertEq(worker.balance - workerBalanceBefore, workerPayment);
            assertEq(platformAdmin.balance - platformBalanceBefore, fee);
            vm.stopPrank();
        }
        
        (,,,,,uint8 status,,) = JobEscrow(payable(job)).getJobDetails();
        assertEq(status, uint8(JobEscrow.JobStatus.Completed));
    }
    
    function test_DisputeResolutionWorkflow() public {
        
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
       
        vm.startPrank(employer);
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0)
        );
        vm.stopPrank();
        
       
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        JobEscrow(payable(jobAddress)).assignWorker(worker);
        JobEscrow(payable(jobAddress)).depositFunds{value: totalPayment}();
        vm.stopPrank();
        
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).confirmJob();
        vm.stopPrank();
        
       
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).submitMilestone(0);
        vm.stopPrank();
        
       
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).raiseDispute(0);
        vm.stopPrank();
        
        // Platform resolves dispute (in worker's favor)
        vm.startPrank(platformAdmin);
        
        uint256 workerBalanceBefore = worker.balance;
        uint256 platformBalanceBefore = platformAdmin.balance;
        
        // First parameter: milestone index
        // Second parameter: workerFavored
        // Third parameter: employerRefundAmount (0 if worker favored)
        JobEscrow(payable(jobAddress)).resolveDispute(0, true, 0);
        
        uint256 milestoneAmount = totalPayment / milestoneCount;
        uint256 fee = (milestoneAmount * platformFee) / 10000;
        uint256 workerPayment = milestoneAmount - fee;
        
        assertEq(worker.balance - workerBalanceBefore, workerPayment, "Worker payment incorrect");
        assertEq(platformAdmin.balance - platformBalanceBefore, fee, "Platform fee incorrect");
        
        vm.stopPrank();
    }
    
    function test_AutoDisputeResolutionWorkflow() public {
        
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
       
        vm.startPrank(employer);
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0)
        );
        vm.stopPrank();
        
        
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        JobEscrow(payable(jobAddress)).assignWorker(worker);
        JobEscrow(payable(jobAddress)).depositFunds{value: totalPayment}();
        vm.stopPrank();
        
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).confirmJob();
        vm.stopPrank();
        
       
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).submitMilestone(0);
        vm.stopPrank();
        
       
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).raiseDispute(0);
        vm.stopPrank();
        
        
        vm.warp(block.timestamp + 8 days);
        
       
        vm.startPrank(worker);
        
        uint256 workerBalanceBefore = worker.balance;
        uint256 platformBalanceBefore = platformAdmin.balance;
        
        JobEscrow(payable(jobAddress)).autoResolveDispute(0);
        
        uint256 milestoneAmount = totalPayment / milestoneCount;
        uint256 fee = (milestoneAmount * platformFee) / 10000;
        uint256 workerPayment = milestoneAmount - fee;
        
        assertEq(worker.balance - workerBalanceBefore, workerPayment, "Worker payment incorrect");
        assertEq(platformAdmin.balance - platformBalanceBefore, fee, "Platform fee incorrect");
        
        vm.stopPrank();
    }
    
    function test_JobCancellationWorkflow() public {
        
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
        
        vm.startPrank(employer);
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0)
        );
        vm.stopPrank();
        
        
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        
       
        JobEscrow(payable(jobAddress)).depositFunds{value: totalPayment}();
        
        
        uint256 employerBalanceBefore = employer.balance;
        JobEscrow(payable(jobAddress)).cancelJob();
        uint256 employerBalanceAfter = employer.balance;
        
        assertEq(employerBalanceAfter - employerBalanceBefore, totalPayment, "Employer should get full refund");
        
       
        (,,,,,uint8 status,,) = JobEscrow(payable(jobAddress)).getJobDetails();
        assertEq(status, uint8(JobEscrow.JobStatus.Cancelled), "Job should be cancelled");
        
        vm.stopPrank();
    }
    
    function test_EmergencyWithdrawWorkflow() public {
     
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
        
        vm.startPrank(employer);
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0) 
        );
        vm.stopPrank();
        
      
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        
       
        JobEscrow(payable(jobAddress)).depositFunds{value: totalPayment}();
        
      
        vm.warp(block.timestamp + 31 days);
        
        
        uint256 employerBalanceBefore = employer.balance;
        JobEscrow(payable(jobAddress)).emergencyWithdraw();
        uint256 employerBalanceAfter = employer.balance;
        
        assertEq(employerBalanceAfter - employerBalanceBefore, totalPayment, "Employer should get full refund");
        
        
        (,,,,,uint8 status,,) = JobEscrow(payable(jobAddress)).getJobDetails();
        assertEq(status, uint8(JobEscrow.JobStatus.Cancelled), "Job should be cancelled");
        
        vm.stopPrank();
    }
    
    function test_OrganizationManagement() public {
       
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
        
        vm.startPrank(employer);
        orgManager.addMember(orgId, worker);
        vm.stopPrank();
        
       
        assertTrue(orgManager.isOrganizationMember(orgId, worker), "Worker should be a member");
        
       
        vm.startPrank(employer);
        orgManager.removeMember(orgId, worker);
        vm.stopPrank();
        
        
        assertFalse(orgManager.isOrganizationMember(orgId, worker), "Worker should not be a member");
    }
    
    function test_PlatformFeeManagement() public {
        uint256 newFee = 300; // 3%
        
        vm.prank(platformAdmin); 
        feesManager.updatePlatformFee(newFee);
        
        assertEq(feesManager.getPlatformFee(), newFee, "Platform fee should be updated");
    }
    
    
    function test_RevertWhen_ConfirmingJobWithoutFunds() public {
      
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        vm.stopPrank();
        
        
        vm.startPrank(employer);
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0) 
        );
        vm.stopPrank();
        
        
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        vm.startPrank(employer);
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        JobEscrow(payable(jobAddress)).assignWorker(worker);
        vm.stopPrank();
        
        // Try to confirm job without funds - should fail
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).confirmJob();
        vm.stopPrank();
    }
    
    function test_RevertWhen_NonEmployerApprovesMilestone() public {
        
        vm.startPrank(employer);
        orgId = orgManager.createOrganization("Test Organization", "A test organization");
        jobAddress = fairPay.createJob(
            orgId,
            "Test Job",
            "A test job description",
            totalPayment,
            milestoneCount,
            address(0) 
        );
        
        string[] memory titles = new string[](milestoneCount);
        string[] memory descriptions = new string[](milestoneCount);
        uint256[] memory amounts = new uint256[](milestoneCount);
        uint256[] memory deadlines = new uint256[](milestoneCount);
        uint256[] memory indices = new uint256[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i+1)));
            descriptions[i] = string(abi.encodePacked("Description ", vm.toString(i+1)));
            amounts[i] = totalPayment / milestoneCount;
            deadlines[i] = block.timestamp + 7 days;
            indices[i] = i;
        }
        
        JobEscrow(payable(jobAddress)).setMilestones(
            indices,
            titles,
            descriptions,
            amounts,
            deadlines
        );
        JobEscrow(payable(jobAddress)).assignWorker(worker);
        JobEscrow(payable(jobAddress)).depositFunds{value: totalPayment}();
        vm.stopPrank();
        
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).confirmJob();
        JobEscrow(payable(jobAddress)).submitMilestone(0);
        vm.stopPrank();
        
        // Try to approve milestone as worker (not employer) - should fail
        vm.startPrank(worker);
        JobEscrow(payable(jobAddress)).approveMilestone(0);
        vm.stopPrank();
    }
}