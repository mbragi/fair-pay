// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/FairPayCore.sol";
import "../src/OrganizationManager.sol";
import "../src/FeesManager.sol";
import "../src/JobFactory.sol";
import "../src/JobEscrowFactory.sol";
import "../src/JobEscrow.sol";
import "../src/WorkerDashboard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/interfaces/IFairPay.sol";

contract MockERC20 is IERC20 {
    string public name = "Test Token";
    string public symbol = "TEST";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    function transfer(address to, uint256 value) external returns (bool) {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
    
    // Function to mint tokens for testing
    function mint(address to, uint256 value) external {
        balanceOf[to] += value;
        totalSupply += value;
        emit Transfer(address(0), to, value);
    }
}

contract FairPayTest is Test {
    FairPayCore public fairPay;
    OrganizationManager public orgManager;
    FeesManager public feesManager;
    JobEscrowFactory public escrowFactory;
    JobFactory public jobFactory;
    WorkerDashboard public workerDashboard;
    
    address public admin = address(0x1);
    address public orgOwner = address(0x2);
    address public worker = address(0x3);
    address public otherUser = address(0x4);
    
    // Test token for payments
    MockERC20 public testToken;
    
    function setUp() public virtual {
        vm.startPrank(admin);
        
        // Deploy mock token
        testToken = new MockERC20();
        
        // Deploy core contracts
        orgManager = new OrganizationManager();
        feesManager = new FeesManager(admin);
        fairPay = new FairPayCore(address(orgManager), address(feesManager));
        
        // Deploy factories
        JobEscrow jobEscrowImpl = new JobEscrow();
        escrowFactory = new JobEscrowFactory(address(jobEscrowImpl));
        jobFactory = new JobFactory(address(escrowFactory));
        
        // Link contracts in the RIGHT ORDER
        // 1. Set JobFactory in FairPayCore
        fairPay.setJobFactory(address(jobFactory));
        
        // 2. Set FairPayCore in JobFactory
        jobFactory.setFairPayCore(address(fairPay));
        
        // 3. Set FairPayCore as the coreContract in JobEscrowFactory
        escrowFactory.setCoreContract(address(fairPay));
        
        // Transfer ownerships
        orgManager.transferOwnership(address(fairPay));
        feesManager.transferOwnership(address(fairPay));
        
        vm.stopPrank();
    }
}

contract OrganizationTest is FairPayTest {
    function test_CreateOrganization() public {
        vm.prank(orgOwner);
        uint256 orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        // Verify organization creation
        assertTrue(orgManager.isValidOrganization(orgId));
        assertTrue(orgManager.isOrganizationMember(orgId, orgOwner));
        
        (uint256[] memory ids, string[] memory names, , , ) = fairPay.getOrganizationsByOwner(orgOwner);
        assertEq(ids[0], orgId);
        assertEq(names[0], "Test Org");

        vm.prank(orgOwner);
        uint256 orgId2 = fairPay.createOrganization("Test Org1", "Test Description");
        
        // Verify organization creation
        assertTrue(orgManager.isValidOrganization(orgId2));
        assertTrue(orgManager.isOrganizationMember(orgId2, orgOwner));
        
        (uint256[] memory ids1, string[] memory names1, , , ) = fairPay.getOrganizationsByOwner(orgOwner);
        assertEq(ids1[1], orgId2);
        assertEq(names1[1], "Test Org1");
    }
    
    function test_AddRemoveMember() public {
        vm.prank(orgOwner);
        uint256 orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        // Add member
        vm.prank(orgOwner);
        fairPay.addOrganizationMember(orgId, worker);
        assertTrue(orgManager.isOrganizationMember(orgId, worker));
        // Note: remove member would need to be implemented
    }
    
    function test_NonOwnerCannotAddMembers() public {
        vm.prank(orgOwner);
        uint256 orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        vm.prank(otherUser);
        vm.expectRevert("Not a member");
        fairPay.addOrganizationMember(orgId, worker);
    }
}

contract JobLifecycleTest is FairPayTest {
    uint256 public orgId;
    address public jobAddress;
    
    function setUp() public override {
        super.setUp();
        testToken.mint(orgOwner, 10 ether);
        
        // Create organization
        vm.prank(orgOwner);
        orgId = fairPay.createOrganization("Test Org", "Test Description");
       
        vm.prank(orgOwner);
        jobAddress = fairPay.createJob(
            orgId,
            "Web Development",
            "Build a website",
            1 ether,
            3, // milestones
            address(testToken)
        );
        // Approve job contract to spend tokens
        vm.prank(orgOwner);
        testToken.approve(jobAddress, 2 ether);
    }
    
    function test_JobCreation() public view {
        // Verify job creation
        assertTrue(fairPay.validJobContracts(jobAddress));
        
        // Verify job details
        (address employer, , string memory title, , uint256 payment, , ,, bool isFunded) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(employer, orgOwner);
        assertEq(title, "Web Development");
        assertEq(payment, 1 ether);
        assertEq(isFunded, false);
    }
    
    function test_JobFundingAndMilestones() public {
        // Mint tokens to orgOwner
        vm.prank(admin);
        testToken.mint(orgOwner, 10 ether); 
        
        // Fund the job
        vm.startPrank(orgOwner);
        testToken.approve(jobAddress, 1 ether);
        IJobEscrow(jobAddress).depositFunds();
        vm.stopPrank();
        
        // Setup milestones
        uint256[] memory indices = new uint256[](3);
        string[] memory titles = new string[](3);
        string[] memory descriptions = new string[](3);
        uint256[] memory amounts = new uint256[](3);
        uint256[] memory deadlines = new uint256[](3);
        
        for (uint256 i = 0; i < 3; i++) {
            indices[i] = i;
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i + 1)));
            descriptions[i] = string(abi.encodePacked("Description for milestone ", vm.toString(i + 1)));
            amounts[i] = (i + 1) * 0.25 ether; // 0.25, 0.5, 0.25
            deadlines[i] = block.timestamp + (i + 1) * 1 weeks;
        }
        amounts[2] = 0.25 ether; 
        
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).setMilestones(indices, titles, descriptions, amounts, deadlines);
        
        // Verify milestones
        for (uint256 i = 0; i < 3; i++) {
            (string memory title, , uint256 amount, , ) = IJobEscrow(jobAddress).getMilestone(i);
            assertEq(title, titles[i]);
            assertEq(amount, amounts[i]);
        }
    }
    
    function test_CompleteJobFlow() public {
        // Setup job with funding and milestones
        test_JobFundingAndMilestones();
        
        // Assign worker
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);
        
        
        
        // Complete milestones
        for (uint256 i = 0; i < 3; i++) {
            // Mark milestone as completed
            vm.prank(worker);
            IJobEscrow(jobAddress).completeMilestone(i);
            
            // Approve milestone
            vm.prank(orgOwner);
            IJobEscrow(jobAddress).approveMilestone(i);
            
            // Verify payment
            (, , uint256 remaining, ) = IJobEscrow(jobAddress).getPaymentInfo();
            if (i < 2) {
                assertGt(remaining, 0);
            } else {
                assertEq(remaining, 0);
            }
        }
        
        // Verify job completion
        (, , , , , uint8 status, , ,bool isFunded) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(uint256(status), uint256(IJobEscrow.JobStatus.Completed));
        assertEq(isFunded, true);
    }

    function test_CompleteJobFlow01() public {
      
        uint256[] memory indices = new uint256[](3);
        string[] memory titles = new string[](3);
        string[] memory descs = new string[](3);
        uint256[] memory amounts = new uint256[](3);
        uint256[] memory deadlines = new uint256[](3);
        
        for (uint i = 0; i < 3; i++) {
            indices[i] = i;
            titles[i] = string(abi.encodePacked("Milestone ", i+1));
            descs[i] = string(abi.encodePacked("Description ", i+1));
            amounts[i] = 0.33 ether;
            deadlines[i] = block.timestamp + 1 weeks;
        }
        amounts[2] = 0.34 ether; 
        
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).setMilestones(indices, titles, descs, amounts, deadlines);
        
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).depositFunds();


        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);

        
        // Verify job is active
        (,,,,,uint8 status,,,bool isFunded) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(status, uint8(IJobEscrow.JobStatus.InProgress));
        assertEq(isFunded, true);
    }

    function test_ResolveDispute_ErrorConditions() public {
  
        test_JobFundingAndMilestones();
        
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);
        
    

        vm.prank(orgOwner);
        IJobEscrow(jobAddress).approveMilestone(0);
        
        vm.prank(worker);
        (bool success, bytes memory data) = jobAddress.call(
            abi.encodeWithSignature(
                "resolveDispute(uint256,bool,uint256)", 
                0, 
                true, 
                0 
            )
        );
        
        assertFalse(success, "Non-platform address should not be able to call resolveDispute");
        
        if (data.length > 4) {
            bytes4 errorSelector = bytes4(data);
            bytes4 onlyPlatformSelector = bytes4(keccak256("OnlyPlatform()"));
            assertEq(errorSelector, onlyPlatformSelector, "Should revert with OnlyPlatform error");
        }
    }
}

contract DisputeAndCancellationTest is FairPayTest {
    uint256 public orgId;
    address public jobAddress;
    
    function setUp() public override {
        super.setUp();
        
        // Mint tokens to the organization owner
        testToken.mint(orgOwner, 10 ether);
        
        // Create organization
        vm.prank(orgOwner);
        orgId = fairPay.createOrganization("Test Org", "Test Description");
       
        // Create job
        vm.prank(orgOwner);
        jobAddress = fairPay.createJob(
            orgId,
            "Web Development",
            "Build a website",
            1 ether,
            3, // milestones
            address(testToken)
        );
        
        // Approve job contract to spend tokens
        vm.prank(orgOwner);
        testToken.approve(jobAddress, 2 ether);
    }
    
    function setupJobWithMilestones() public {
        // Fund the job
        vm.startPrank(orgOwner);
        testToken.approve(jobAddress, 1 ether);
        IJobEscrow(jobAddress).depositFunds();
        vm.stopPrank();
        
        // Setup milestones
        uint256[] memory indices = new uint256[](3);
        string[] memory titles = new string[](3);
        string[] memory descriptions = new string[](3);
        uint256[] memory amounts = new uint256[](3);
        uint256[] memory deadlines = new uint256[](3);
        
        // Create three milestones with equal distribution
        for (uint256 i = 0; i < 3; i++) {
            indices[i] = i;
            titles[i] = string(abi.encodePacked("Milestone ", vm.toString(i + 1)));
            descriptions[i] = string(abi.encodePacked("Description for milestone ", vm.toString(i + 1)));
            amounts[i] = 0.33 ether;
            deadlines[i] = block.timestamp + (i + 1) * 1 weeks;
        }
        // Adjust the last milestone to make the total exactly 1 ether
        amounts[2] = 0.34 ether;
        
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).setMilestones(indices, titles, descriptions, amounts, deadlines);
        
        // Assign worker
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);
    }
    
    
    
    function test_DisputeResolutionWorkerFavored() public {
        // Setup job with funding and milestones
        setupJobWithMilestones();
        
        
        
        // Worker completes first milestone
        vm.prank(worker);
        IJobEscrow(jobAddress).completeMilestone(0);
        
        // Capture worker's balance before dispute resolution
        uint256 workerBalanceBefore = testToken.balanceOf(worker);
        
        // Assume first milestone is now in a disputed state
        // This would normally happen through a dispute process that isn't shown here
        // We'll simulate by directly calling resolveDispute from platform admin
        
        vm.prank(address(fairPay));
        IJobEscrow(jobAddress).resolveDispute(0, true, 0);
        
        // Verify worker received payment
        uint256 workerBalanceAfter = testToken.balanceOf(worker);
        uint256 expectedPayment = 0.33 ether * (10000 - feesManager.getPlatformFee()) / 10000;
        assertEq(workerBalanceAfter - workerBalanceBefore, expectedPayment);
        
        // Verify milestone status is now completed and next milestone is in progress
        (, , , , uint8 milestone0Status) = IJobEscrow(jobAddress).getMilestone(0);
        (, , , , uint8 milestone1Status) = IJobEscrow(jobAddress).getMilestone(1);
        
        // First milestone should be completed now
        assertEq(milestone0Status, uint8(IJobEscrow.MilestoneStatus.Completed));
        
        // Second milestone should be in progress
        assertEq(milestone1Status, uint8(IJobEscrow.MilestoneStatus.InProgress));
    }
    
    function test_DisputeResolutionEmployerFavored() public {
        // Setup job with funding and milestones
        setupJobWithMilestones();
        
       
        
        // Worker completes first milestone
        vm.prank(worker);
        IJobEscrow(jobAddress).completeMilestone(0);
        
        // Capture balances before dispute resolution
        uint256 workerBalanceBefore = testToken.balanceOf(worker);
        uint256 employerBalanceBefore = testToken.balanceOf(orgOwner);
        
        // Employer favored with partial refund (half the milestone amount)
        uint256 employerRefund = 0.165 ether; // Half of 0.33 ether
        
        vm.prank(address(fairPay));
        IJobEscrow(jobAddress).resolveDispute(0, false, employerRefund);
        
        // Verify employer received refund
        uint256 employerBalanceAfter = testToken.balanceOf(orgOwner);
        assertEq(employerBalanceAfter - employerBalanceBefore, employerRefund);
        
        // Verify worker received reduced payment
        uint256 workerBalanceAfter = testToken.balanceOf(worker);
        uint256 remainingForWorker = 0.33 ether - employerRefund;
        uint256 expectedPayment = remainingForWorker * (10000 - feesManager.getPlatformFee()) / 10000;
        assertEq(workerBalanceAfter - workerBalanceBefore, expectedPayment);
        
        // Verify next milestone is now in progress
        (, , , , uint8 milestone1Status) = IJobEscrow(jobAddress).getMilestone(1);
        assertEq(milestone1Status, uint8(IJobEscrow.MilestoneStatus.InProgress));
    }
    
    function test_DisputeResolutionEmptyEmployerRefund() public {
        // Setup job with funding and milestones
        setupJobWithMilestones();
        
        
        
        // Worker completes first milestone
        vm.prank(worker);
        IJobEscrow(jobAddress).completeMilestone(0);
        
        // Capture balances before dispute resolution
        uint256 workerBalanceBefore = testToken.balanceOf(worker);
        
        // Employer gets no refund, but decision is still employer-favored (e.g., no penalties)
        vm.prank(address(fairPay));
        IJobEscrow(jobAddress).resolveDispute(0, false, 0);
        
        // Verify worker still received full payment
        uint256 workerBalanceAfter = testToken.balanceOf(worker);
        uint256 expectedPayment = 0.33 ether * (10000 - feesManager.getPlatformFee()) / 10000;
        assertEq(workerBalanceAfter - workerBalanceBefore, expectedPayment);
    }
    
    function test_InvalidDisputeResolution() public {
        // Setup job with funding and milestones
        setupJobWithMilestones();
        
       
        
        // Test 1: Non-platform account cannot resolve dispute
        vm.expectRevert();
        vm.prank(otherUser);
        IJobEscrow(jobAddress).resolveDispute(0, true, 0);
        
        // Test 2: Cannot resolve dispute with excessive refund
        vm.expectRevert();
        vm.prank(address(fairPay));
        IJobEscrow(jobAddress).resolveDispute(0, false, 1 ether); // More than milestone amount
    }

    // NOTE: tests are assuming that the milestone status is already Disputed, but there's no code in your test that actually sets the milestone status to Disputed
}


