// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./JobFactory.sol";
import "./FeesManager.sol";
import "./OrganizationManager.sol";
import "./interfaces/IFairPay.sol";

contract FairPayCore is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    OrganizationManager public organizationManager;
    FeesManager public feesManager;
    address public jobFactory;
    
    // Mapping to track jobs assigned to workers
    mapping(address => address[]) public workerJobs;
    // Mapping to verify if an address is a valid job contract
    mapping(address => bool) public validJobContracts;
    
    event JobCreated(uint256 indexed orgId, address indexed jobAddress);
    event WorkerAssigned(address indexed worker, address indexed jobAddress);
    
    constructor(
    address _organizationManager,
    address _feesManager
    ) Ownable(msg.sender) {
        organizationManager = OrganizationManager(_organizationManager);
        feesManager = FeesManager(payable(_feesManager));  
    }
    
    function setJobFactory(address _jobFactory) external onlyOwner {
        require(_jobFactory != address(0), "Invalid JobFactory address");
        require(jobFactory == address(0), "JobFactory already set");
        jobFactory = _jobFactory;
    }

    function createOrganization(string memory name, string memory description) external returns (uint256) 
    {
        uint256 orgId = organizationManager.createOrganization(msg.sender, name, description);
        return orgId;
    }

    function addOrganizationMember(uint256 _orgId, address _member) external {
        require(organizationManager.isValidOrganization(_orgId), "Invalid org");
        require(organizationManager.isOrganizationMember(_orgId, msg.sender), "Not a member");
        organizationManager.addMember(_orgId, _member);
    }

    function getOrganizationsByOwner(address _owner) external view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        bool[] memory activeStatuses,
        uint256[] memory creationTimes
    ) {
        return organizationManager.getOrganizationsByOwner(_owner);
    }
    
    function createJob(
        uint256 _orgId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token
    ) external returns (address) {
        require(jobFactory != address(0), "JobFactory not set");
        require(organizationManager.isValidOrganization(_orgId), "Invalid organization");
        require(organizationManager.isOrganizationMember(_orgId, msg.sender), "Not a member");
        
        address newJob = JobFactory(jobFactory).createJob(
            msg.sender,
            _orgId,
            _title,
            _description,
            _totalPayment,
            _milestoneCount,
            _token,
            feesManager.getPlatformFee()
        );
        
        // Register the new job contract as valid
        validJobContracts[newJob] = true;
        
        organizationManager.addJobToOrganization(_orgId, newJob);
        emit JobCreated(_orgId, newJob);
        return newJob;
    }
    
    // Function to register a worker for a job
    function registerWorkerJob(address _worker) external {
        require(validJobContracts[msg.sender], "Caller is not a valid job contract");
        
        // just verify worker is assigned
        (, address assignedWorker,,,,,,) = IJobEscrow(msg.sender).getJobDetails();
        require(assignedWorker == _worker, "Worker not assigned to this job");
        
        workerJobs[_worker].push(msg.sender);
        emit WorkerAssigned(_worker, msg.sender);
    }
    
    // Function to retrieve all jobs assigned to a worker
    function getWorkerJobs(address _worker) external view returns (address[] memory) {
        return workerJobs[_worker];
    }
    
    // Function to check if a job is assigned to a worker
    function isWorkerAssignedToJob(address _worker, address _jobAddress) external view returns (bool) {
        address[] memory jobs = workerJobs[_worker];
        for (uint256 i = 0; i < jobs.length; i++) {
            if (jobs[i] == _jobAddress) {
                return true;
            }
        }
        return false;
    }
    
    // Function to get job details for all jobs assigned to a worker
    function getWorkerJobDetails(address _worker) external view returns (
        address[] memory jobAddresses,
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory totalPayments,
        uint8[] memory statuses
    ) {
        address[] memory jobs = workerJobs[_worker];
        jobAddresses = new address[](jobs.length);
        titles = new string[](jobs.length);
        descriptions = new string[](jobs.length);
        totalPayments = new uint256[](jobs.length);
        statuses = new uint8[](jobs.length);
        
        for (uint256 i = 0; i < jobs.length; i++) {
            jobAddresses[i] = jobs[i];
            
            // Get job details from the JobEscrow contract
            (
                ,  // employer
                ,  // worker
                string memory title,
                string memory description,
                uint256 totalPayment,
                uint8 status,
                ,  // milestoneCount
                   // currentMilestone
            ) = IJobEscrow(jobs[i]).getJobDetails();
            
            titles[i] = title;
            descriptions[i] = description;
            totalPayments[i] = totalPayment;
            statuses[i] = status;
        }
        
        return (jobAddresses, titles, descriptions, totalPayments, statuses);
    }
    
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        feesManager.updatePlatformFee(_newFee);
    }
    
    function withdrawFees(address _token) external onlyOwner nonReentrant {
        if (_token == address(0)) {
            uint256 balance = address(this).balance;
            require(balance > 0, "No ETH to withdraw");
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "ETH transfer failed");
        } else {
            uint256 balance = IERC20(_token).balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            IERC20(_token).safeTransfer(owner(), balance);
        }
    }

    function getJobPaymentInfo(address _jobAddress) external view returns (
        address token,
        uint256 totalPayment,
        uint256 paidAmount,
        uint256 remainingAmount
    ) {
        require(validJobContracts[_jobAddress], "Invalid job contract");
        
        IJobEscrow job = IJobEscrow(_jobAddress);
        (, , , , uint256 payment, , uint256 milestoneCount, ) = job.getJobDetails();
        
        // Calculate paid amount
        uint256 paid;
        for (uint256 i = 0; i < milestoneCount; i++) {
            (, , uint256 amount, , uint8 status) = job.getMilestone(i);
            if (status == uint8(IJobEscrow.MilestoneStatus.Completed)) {
                paid += amount;
            }
        }
        
        return (
            job.token(),
            payment,
            paid,
            payment - paid
        );
    }
    
    receive() external payable {}
    fallback() external payable {}
}

