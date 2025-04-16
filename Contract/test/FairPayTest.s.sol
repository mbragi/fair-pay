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
    
    
    MockERC20 public testToken;
    
    function setUp() public virtual {
        vm.startPrank(admin);
        
        
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
        
     
        assertTrue(orgManager.isValidOrganization(orgId));
        assertTrue(orgManager.isOrganizationMember(orgId, orgOwner));
        
        (uint256[] memory ids, string[] memory names, , , ) = orgManager.getOrganizationsByOwner(orgOwner);
        assertEq(ids[0], orgId);
        assertEq(names[0], "Test Org");
    }
    
    function test_AddRemoveMember() public {
    
        vm.prank(orgOwner);
        uint256 orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        // Add member through FairPayCore
        vm.prank(orgOwner);
        fairPay.addOrganizationMember(orgId, worker);
        assertTrue(orgManager.isOrganizationMember(orgId, worker));
        
        // Note: Remove member would need to be implemented in FairPayCore similarly
    }
    
    function test_NonOwnerCannotAddMembers() public {
        // Create organization
        vm.prank(orgOwner);
        uint256 orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        // Try to add member as non-owner
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
        
        vm.prank(orgOwner);
        orgId = fairPay.createOrganization("Test Org", "Test Description");
        
        vm.prank(orgOwner);
        fairPay.addOrganizationMember(orgId, otherUser);
        
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
        (address employer, , string memory title, , uint256 payment, , , ) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(employer, orgOwner);
        assertEq(title, "Web Development");
        assertEq(payment, 1 ether);
    }
    
    function test_CompleteJobFlow01() public {
      
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);
        
        
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
        
        // Deposit funds
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).depositFunds();
        
        // Worker confirms
        vm.prank(worker);
        IJobEscrow(jobAddress).confirmJob();
        
        // Verify job is active
        (,,,,,uint8 status,,) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(status, uint8(IJobEscrow.JobStatus.InProgress));
    }

    function test_JobFundingAndMilestones() public {
       
        vm.prank(admin);
        testToken.mint(orgOwner, 10 ether);
        
        
        vm.startPrank(orgOwner);
        testToken.approve(jobAddress, 2 ether);
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
        
        for (uint256 i = 0; i < 3; i++) {
            (string memory title, , uint256 amount, , ) = IJobEscrow(jobAddress).getMilestone(i);
            assertEq(title, titles[i]);
            assertEq(amount, amounts[i]);
        }
    }
    
    function test_CompleteJobFlow() public {
        
        test_JobFundingAndMilestones();
        
       
        vm.prank(orgOwner);
        IJobEscrow(jobAddress).assignWorker(worker);
        
        vm.prank(worker);
        IJobEscrow(jobAddress).confirmJob();
        
     
        for (uint256 i = 0; i < 3; i++) {
            vm.prank(worker);
            IJobEscrow(jobAddress).completeMilestone(i);
            
            vm.prank(orgOwner);
            IJobEscrow(jobAddress).approveMilestone(i);
            
            (, , uint256 remaining, ) = IJobEscrow(jobAddress).getPaymentInfo();
            if (i < 2) {
                assertGt(remaining, 0);
            } else {
                assertEq(remaining, 0);
            }
        }
        
        (, , , , , uint8 status, , ) = IJobEscrow(jobAddress).getJobDetails();
        assertEq(uint256(status), uint256(IJobEscrow.JobStatus.Completed));
    }
}