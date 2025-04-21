// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFairPay.sol";

contract WorkerDashboard is Ownable {
    IFairPayCore public fairPayCore;
    
    struct MilestoneInfo {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        uint8 status;
    }
    
    struct JobInfo {
        address jobAddress;
        address employer;
        string title;
        string description;
        uint256 totalPayment;
        IJobEscrow.JobStatus status;
        uint256 milestoneCount;
        uint256 currentMilestone;
        MilestoneInfo[] milestones;
        bool isFunded;
    }
    
    constructor(address _fairPayCore) Ownable(msg.sender) {
        fairPayCore = IFairPayCore(_fairPayCore);
    }
    
    function updateFairPayCore(address _fairPayCore) external onlyOwner {
        fairPayCore = IFairPayCore(_fairPayCore);
    }
    
    function getMyJobs() external view returns (address[] memory) {
        return fairPayCore.getWorkerJobs(msg.sender);
    }
    
    function getJobDetails(address _jobAddress) external view returns (JobInfo memory job) {
        require(fairPayCore.isWorkerAssignedToJob(msg.sender, _jobAddress), "Job not assigned to caller");
        
        IJobEscrow jobEscrow = IJobEscrow(_jobAddress);
        
        // Get basic job details
        (
            address employer,
            ,  // worker
            string memory title,
            string memory description,
            uint256 totalPayment,
            uint8 status,
            uint256 milestoneCount,
            uint256 currentMilestone,
            bool isFunded
        ) = jobEscrow.getJobDetails();
        
        // Get milestone details
        (
            string[] memory milestoneTitles,
            string[] memory milestoneDescriptions,
            uint256[] memory milestoneAmounts,
            uint256[] memory milestoneDeadlines,
            uint8[] memory milestoneStatuses
        ) = jobEscrow.getAllMilestones();
        
        // Create milestone info array
        MilestoneInfo[] memory milestones = new MilestoneInfo[](milestoneCount);
        for (uint256 i = 0; i < milestoneCount; i++) {
            milestones[i] = MilestoneInfo({
                title: milestoneTitles[i],
                description: milestoneDescriptions[i],
                amount: milestoneAmounts[i],
                deadline: milestoneDeadlines[i],
                status: milestoneStatuses[i]
            });
        }
        
        // Create and return job info struct
        job.jobAddress = _jobAddress;
        job.employer = employer;
        job.title = title;
        job.description = description;
        job.totalPayment = totalPayment;
        job.status = IJobEscrow.JobStatus(status);
        job.milestoneCount = milestoneCount;
        job.currentMilestone = currentMilestone;
        job.milestones = milestones;
        job.isFunded = isFunded;
        
        return job;
    }
    
    function getWorkerJobs(address _worker) external view onlyOwner returns (address[] memory) {
        return fairPayCore.getWorkerJobs(_worker);
    }

 
}