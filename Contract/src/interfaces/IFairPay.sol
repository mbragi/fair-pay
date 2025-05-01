// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFairPayCore {
    function registerWorkerJob(address _worker) external;
    function validJobContracts(address) external view returns (bool);
    function createOrganization(address owner, string memory _name, string memory _description) external returns (uint256);
    function createJob(
        uint256 _orgId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token
    ) external returns (address);
    function getWorkerJobs(address _worker) external view returns (address[] memory);
    function isWorkerAssignedToJob(address _worker, address _jobAddress) external view returns (bool);

}

interface IJobEscrow {
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    enum MilestoneStatus { NotStarted, InProgress, Completed, Disputed }

   
    function getMilestone(uint256 index) external view returns (
        string memory _title,
        string memory _description,
        uint256 amount,
        uint256 deadline,
        uint8 _status
    );
    function token() external view returns (address);
    function isJobFunded() external view returns (bool);
    function assignWorker(address _worker) external;
    function cancelJob() external;
    function completeMilestone(uint256 index) external;
    function approveMilestone(uint256 index) external;
    function getPaymentInfo() external view returns (
        uint256 totalPayment,
        uint256 paidAmount,
        uint256 remainingAmount,
        uint256 platformFeeAmount
    );
    function resolveDispute(
        uint256 _index, 
        bool _workerFavored,
        uint256 _employerRefund
    ) external;
    function depositFunds() external payable;
    function setMilestones(
        uint256[] calldata _indices,
        string[] calldata _titles,
        string[] calldata _descriptions,
        uint256[] calldata _amounts,
        uint256[] calldata _deadlines
    ) external;
    function getJobDetails() external view returns (
        address _employer,
        address _worker,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint8 _status,
        uint256 _milestoneCount,
        uint256 _currentMilestone,
        bool _isFunded
    );
    
    function getAllMilestones() external view returns (
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory amounts,
        uint256[] memory deadlines,
        uint8[] memory statuses
    );



}

interface IWorkerDashboard {
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
    }
    
    struct MilestoneInfo {
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        uint8 status;
    }
    
    function getMyJobs() external view returns (address[] memory);
    function getJobDetails(address _jobAddress) external view returns (JobInfo memory);
    function getJobPaymentDetails(address _jobAddress) external view returns (
        address token,
        uint256 totalPayment,
        uint256 paidAmount,
        uint256 remainingAmount
    );
    function getUpcomingMilestones() external view returns (
        address[] memory jobAddresses,
        uint256[] memory milestoneIndices,
        string[] memory titles,
        uint256[] memory deadlines
    );
}