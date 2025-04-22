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
        uint8 status;
        uint256 milestoneCount;
        uint256 currentMilestone;
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

    function getJobBasicDetails(address _jobAddress) external view returns (JobInfo memory) {
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
            bool jobFunded
        ) = jobEscrow.getJobDetails();
        
        // Create and return job info struct
        JobInfo memory job;
        job.jobAddress = _jobAddress;
        job.employer = employer;
        job.title = title;
        job.description = description;
        job.totalPayment = totalPayment;
        job.status = status;
        job.milestoneCount = milestoneCount;
        job.currentMilestone = currentMilestone;
        job.isFunded = jobFunded;
        
        return job;
    }

    function getJobMilestones(address _jobAddress) external view returns (MilestoneInfo[] memory) {
        require(fairPayCore.isWorkerAssignedToJob(msg.sender, _jobAddress), "Job not assigned to caller");
        
        IJobEscrow jobEscrow = IJobEscrow(_jobAddress);
        
        // Get job milestone count
        (,,,,,, uint256 milestoneCount,,) = jobEscrow.getJobDetails();
        
        // Create milestone info array
        MilestoneInfo[] memory milestones = new MilestoneInfo[](milestoneCount);
        
        // Populate milestone details one by one to avoid stack depth issues
        for (uint256 i = 0; i < milestoneCount; i++) {
            (
                string memory title,
                string memory description,
                uint256 amount,
                uint256 deadline,
                uint8 status
            ) = jobEscrow.getMilestone(i);
            
            milestones[i] = MilestoneInfo({
                title: title,
                description: description,
                amount: amount,
                deadline: deadline,
                status: status
            });
        }
        
        return milestones;
    }
    
    
    
    function getWorkerJobs(address _worker) external view onlyOwner returns (address[] memory) {
        return fairPayCore.getWorkerJobs(_worker);
    }

 
}