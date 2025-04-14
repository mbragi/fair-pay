
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/FairPay.sol";
import "../src/JobEscrow.sol";

contract FairPayTest is Test {
    FairPay public fairPay;
    address payable public platformAdmin = payable(address(1));
    address payable public employer = payable(address(2));
    address payable public worker = payable(address(3));
    
    function setUp() public {
        vm.startPrank(platformAdmin);
        fairPay = new FairPay();
        vm.stopPrank();
        
        
        vm.deal(employer, 10 ether);
        vm.deal(worker, 1 ether);
        vm.deal(platformAdmin, 1 ether);
    }
    
    function testCreateOrganization() public {
        vm.prank(employer);
        uint256 orgId = fairPay.createOrganization("Test Org", "Description");
        
        (address owner, string memory name, , bool isActive,) = fairPay.organizations(orgId);
        assertEq(owner, address(employer));
        assertEq(name, "Test Org");
        assertTrue(isActive);
    }
    

    function testFullJobWorkflow() public {
     
        vm.prank(employer);
        uint256 orgId = fairPay.createOrganization("Test Org", "Description");
        
        
        vm.prank(employer);
        address jobAddress = fairPay.createJob(
            orgId,
            "Web Development",
            "Build a website",
            1 ether, 
            2,      
            address(0) 
        );
        JobEscrow job = JobEscrow(payable(jobAddress));
        
        
        uint256 initialEmployerBalance = employer.balance;
        vm.prank(employer);
        (bool success,) = payable(jobAddress).call{value: 1 ether}("");
        require(success, "Funding failed");
        
        
        vm.prank(employer);
        job.assignWorker(worker);
        
       
        string[] memory titles = new string[](2);
        titles[0] = "Design";
        titles[1] = "Development";
        
        string[] memory descs = new string[](2);
        descs[0] = "Complete UI design";
        descs[1] = "Build frontend and backend";
        
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 0.4 ether;
        amounts[1] = 0.6 ether;
        
        uint256[] memory deadlines = new uint256[](2);
        deadlines[0] = block.timestamp + 7 days;
        deadlines[1] = block.timestamp + 14 days;
        
        uint256[] memory indices = new uint256[](2);
        indices[0] = 0;
        indices[1] = 1;
        
        vm.prank(employer);
        job.setMilestones(indices, titles, descs, amounts, deadlines);
        
       
        vm.prank(worker);
        job.confirmJob();
        
       
        vm.prank(worker);
        job.submitMilestone(0);
        
       
        uint256 workerBalanceBefore = worker.balance;
        uint256 initialPlatformBalance = platformAdmin.balance;
        
        vm.prank(employer);
        job.approveMilestone(0);
        
        // Check payments (0.4 ether - 2.5% fee = 0.39 ether to worker, 0.01 ether to platform)
        assertEq(worker.balance - workerBalanceBefore, 0.39 ether, "Worker should receive 0.39 ether");
        
        // Platform fee should be sent to FairPay contract, not platformAdmin directly
        assertEq(
            address(fairPay).balance,
            initialPlatformBalance + 0.01 ether - platformAdmin.balance,
            "Platform fee should be sent to FairPay contract"
        );
        
        
        vm.prank(worker);
        job.submitMilestone(1);
        
        vm.prank(employer);
        job.approveMilestone(1);
        
        
        assertEq(uint(job.status()), uint(JobEscrow.JobStatus.Completed), "Job should be completed");
    }
    
    function testDisputeResolution() public {
      
        vm.prank(employer);
        uint256 orgId = fairPay.createOrganization("Test Org", "Description");
        
        vm.prank(employer);
        address jobAddress = fairPay.createJob(
            orgId,
            "Disputed Job",
            "Job with dispute",
            1 ether,
            1, 
            address(0)
        );
        JobEscrow job = JobEscrow(payable(jobAddress));
        
        
        vm.prank(employer);
        (bool funded,) = payable(jobAddress).call{value: 1 ether}("");
        require(funded, "Funding failed");
        
        vm.prank(employer);
        job.assignWorker(worker);
        
       
        string[] memory titles = new string[](1);
        titles[0] = "Only Milestone";
        
        string[] memory descs = new string[](1);
        descs[0] = "Complete everything";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;
        
        uint256[] memory deadlines = new uint256[](1);
        deadlines[0] = 0;
        
        uint256[] memory indices = new uint256[](1);
        indices[0] = 0;
        
        vm.prank(employer);
        job.setMilestones(indices, titles, descs, amounts, deadlines);
        
       
        vm.prank(worker);
        job.confirmJob();
        
        
        vm.prank(worker);
        job.submitMilestone(0);
        
        
        vm.prank(employer);
        job.raiseDispute(0);
        
        // Platform resolves dispute (worker gets 80%, employer gets 20% back)
        uint256 workerBalanceBefore = worker.balance;
        uint256 employerBalanceBefore = employer.balance;
        uint256 platformBalanceBefore = platformAdmin.balance;
        
        // Must use platform admin to resolve dispute
        vm.prank(platformAdmin);
        job.resolveDispute(0, false, 0.2 ether); // 0.2 ether refund to employer
        
        // Check payments:
        // - 0.2 ether returned to employer
        // - 0.8 ether distributed (0.78 to worker, 0.02 to platform)
        assertEq(employer.balance - employerBalanceBefore, 0.2 ether, "Employer should get 0.2 ether refund");
        assertEq(worker.balance - workerBalanceBefore, 0.78 ether, "Worker should receive 0.78 ether");
        assertEq(platformAdmin.balance - platformBalanceBefore, 0.02 ether, "Platform should receive 0.02 ether fee");
    }

    function testJobCancellation() public {
        
        vm.prank(employer);
        uint256 orgId = fairPay.createOrganization("Test Org", "Description");
        
        vm.prank(employer);
        address jobAddress = fairPay.createJob(
            orgId,
            "Cancelled Job",
            "Will be cancelled",
            1 ether,
            2,
            address(0)
        );
        JobEscrow job = JobEscrow(payable(jobAddress));
        
        
        uint256 employerBalanceBefore = employer.balance;
        vm.prank(employer);
        (bool success,) = payable(jobAddress).call{value: 1 ether}("");
        require(success, "Funding failed");
        
        
        vm.prank(employer);
        job.cancelJob();
        
      
        assertEq(employer.balance, employerBalanceBefore);
    }
}