
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

contract JobEscrow {
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    enum MilestoneStatus { NotStarted, InProgress, Completed, Disputed }
    
    struct Milestone {
        string title;
        string description;
        uint256 amount;
        uint256 deadline; // Optional deadline timestamp
        MilestoneStatus status;
    }
    
    // Job information
    address public platform;
    address public employer;
    uint256 public organizationId;
    string public title;
    string public description;
    uint256 public totalPayment;
    JobStatus public status;
    address public token; // Address of ERC20 token or address(0) for ETH
    uint256 public platformFee; // Fee in basis points
    uint256 public createdAt;
    
    
    address public worker;
    bool public workerConfirmed;
    
    
    Milestone[] public milestones;
    uint256 public currentMilestoneIndex;
    
    // Dispute resolution 
    uint256 public constant DISPUTE_RESOLUTION_PERIOD = 7 days;
    mapping(uint256 => uint256) public disputeTimestamps;
    
    event JobStarted(address indexed worker);
    event MilestoneAdded(uint256 indexed index, string title, uint256 amount);
    event MilestoneUpdated(uint256 indexed index, MilestoneStatus status);
    event MilestoneCompleted(uint256 indexed index, uint256 amount);
    event FundsDeposited(uint256 amount);
    event PaymentReleased(address indexed worker, uint256 amount);
    event JobCompleted();
    event JobCancelled();
    event DisputeRaised(uint256 indexed milestoneIndex);
    event DisputeResolved(uint256 indexed milestoneIndex, bool workerFavored);
    
    
    constructor(
        address _platform,
        address _employer,
        uint256 _organizationId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token,
        uint256 _platformFee
    ) {
        platform = _platform;
        employer = _employer;
        organizationId = _organizationId;
        title = _title;
        description = _description;
        totalPayment = _totalPayment;
        token = _token;
        platformFee = _platformFee;
        status = JobStatus.Created;
        createdAt = block.timestamp;
        
        for (uint256 i = 0; i < _milestoneCount; i++) {
            milestones.push(Milestone({
                title: "",
                description: "",
                amount: 0,
                deadline: 0,
                status: MilestoneStatus.NotStarted
            }));
        }
    }
    
    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer can call this");
        _;
    }
    
    modifier onlyWorker() {
        require(msg.sender == worker && workerConfirmed, "Only confirmed worker can call this");
        _;
    }
    
    modifier onlyPlatform() {
        require(msg.sender == platform, "Only platform can call this");
        _;
    }
    
    modifier jobActive() {
        require(status == JobStatus.InProgress, "Job is not active");
        _;
    }
    
    
    function depositFunds() external payable {
        require(status == JobStatus.Created || status == JobStatus.InProgress, "Cannot deposit funds now");
        
        if (token == address(0)) {
            // ETH payment
            require(msg.value == totalPayment, "Incorrect payment amount");
        } else {
            // ERC20 payment
            require(msg.value == 0, "ETH not accepted for this job");
            IERC20(token).transferFrom(msg.sender, address(this), totalPayment);
        }
        
        emit FundsDeposited(totalPayment);
    }
    
    /**
     * @dev Initialize milestone details
     * @param _indices Array of milestone indices to update
     * @param _titles Array of milestone titles
     * @param _descriptions Array of milestone descriptions
     * @param _amounts Array of milestone amounts
     * @param _deadlines Array of milestone deadlines (optional, 0 for none)
     */
    function setMilestones(
        uint256[] calldata _indices,
        string[] calldata _titles,
        string[] calldata _descriptions,
        uint256[] calldata _amounts,
        uint256[] calldata _deadlines
    ) external onlyEmployer {
        require(status == JobStatus.Created, "Can only set milestones before job starts");
        require(
            _indices.length == _titles.length &&
            _indices.length == _descriptions.length &&
            _indices.length == _amounts.length &&
            _indices.length == _deadlines.length,
            "Input arrays must have same length"
        );
        
        uint256 totalAmount = 0;
        
        for (uint256 i = 0; i < _indices.length; i++) {
            uint256 index = _indices[i];
            require(index < milestones.length, "Milestone index out of bounds");
            
            milestones[index].title = _titles[i];
            milestones[index].description = _descriptions[i];
            milestones[index].amount = _amounts[i];
            milestones[index].deadline = _deadlines[i];
            
            totalAmount += _amounts[i];
            
            emit MilestoneAdded(index, _titles[i], _amounts[i]);
        }
        
        require(totalAmount == totalPayment, "Total milestone amounts must equal total payment");
    }
    
    function assignWorker(address _worker) external onlyEmployer {
        require(status == JobStatus.Created, "Job already started");
        require(_worker != address(0) && _worker != employer, "Invalid worker address");
        
        worker = _worker;
    }
    
    function confirmJob() external {
        require(msg.sender == worker, "Only assigned worker can confirm");
        require(!workerConfirmed, "Already confirmed");
        require(status == JobStatus.Created, "Job not in created state");
        
        // Check if all milestones are properly set
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < milestones.length; i++) {
            require(bytes(milestones[i].title).length > 0, "Milestone details incomplete");
            totalAmount += milestones[i].amount;
        }
        require(totalAmount == totalPayment, "Total milestone amounts must equal total payment");
        
        // Check if funds are in escrow
        if (token == address(0)) {
            require(address(this).balance >= totalPayment, "Insufficient funds in escrow");
        } else {
            require(
                IERC20(token).balanceOf(address(this)) >= totalPayment,
                "Insufficient tokens in escrow"
            );
        }
        
        workerConfirmed = true;
        status = JobStatus.InProgress;
        milestones[0].status = MilestoneStatus.InProgress;
        
        emit JobStarted(worker);
    }
    
    /**
     * @dev Worker submits a milestone as complete
     * @param _milestoneIndex Index of the completed milestone
     */
    function submitMilestone(uint256 _milestoneIndex) external onlyWorker jobActive {
        require(_milestoneIndex == currentMilestoneIndex, "Can only submit current milestone");
        require(milestones[_milestoneIndex].status == MilestoneStatus.InProgress, "Milestone not in progress");
        
        milestones[_milestoneIndex].status = MilestoneStatus.Completed;
        
        emit MilestoneUpdated(_milestoneIndex, MilestoneStatus.Completed);
    }
    
    
    function approveMilestone(uint256 _milestoneIndex) external onlyEmployer jobActive {
        require(milestones[_milestoneIndex].status == MilestoneStatus.Completed, "Milestone not completed");
        
        uint256 paymentAmount = milestones[_milestoneIndex].amount;
        uint256 fee = (paymentAmount * platformFee) / 10000;
        uint256 workerPayment = paymentAmount - fee;
        
        // Transfer funds to worker
        if (token == address(0)) {
            // ETH payment
            (bool success, ) = worker.call{value: workerPayment}("");
            require(success, "ETH transfer to worker failed");
            
            // Transfer fee to platform
            (bool feeSent, ) = platform.call{value: fee}("");
            require(feeSent, "ETH fee transfer failed");
        } else {
            // ERC20 payment
            require(IERC20(token).transfer(worker, workerPayment), "Token transfer to worker failed");
            require(IERC20(token).transfer(platform, fee), "Token fee transfer failed");
        }
        
        emit PaymentReleased(worker, workerPayment);
        emit MilestoneCompleted(_milestoneIndex, paymentAmount);
        
        // Move to next milestone or complete job
        currentMilestoneIndex++;
        if (currentMilestoneIndex < milestones.length) {
            milestones[currentMilestoneIndex].status = MilestoneStatus.InProgress;
        } else {
            status = JobStatus.Completed;
            emit JobCompleted();
        }
    }
    
    
    function raiseDispute(uint256 _milestoneIndex) external onlyEmployer jobActive {
        require(milestones[_milestoneIndex].status == MilestoneStatus.Completed, "Can only dispute completed milestones");
        
        milestones[_milestoneIndex].status = MilestoneStatus.Disputed;
        disputeTimestamps[_milestoneIndex] = block.timestamp;
        
        emit DisputeRaised(_milestoneIndex);
    }
    
    /**
     * @dev Platform resolves a dispute (simplified implementation)
     * @param _milestoneIndex Index of the disputed milestone
     * @param _workerFavored Whether the worker's claim is upheld
     * @param _employerRefundAmount Amount to refund to employer (if not worker-favored)
     */
    function resolveDispute(
        uint256 _milestoneIndex, 
        bool _workerFavored,
        uint256 _employerRefundAmount
    ) external onlyPlatform {
        require(milestones[_milestoneIndex].status == MilestoneStatus.Disputed, "Milestone not disputed");
        
        if (_workerFavored) {
            // Worker's claim upheld - continue with payment
            uint256 paymentAmount = milestones[_milestoneIndex].amount;
            uint256 fee = (paymentAmount * platformFee) / 10000;
            uint256 workerPayment = paymentAmount - fee;
            
            if (token == address(0)) {
                (bool success, ) = worker.call{value: workerPayment}("");
                require(success, "ETH transfer to worker failed");
                (bool feeSent, ) = platform.call{value: fee}("");
                require(feeSent, "ETH fee transfer failed");
            } else {
                require(IERC20(token).transfer(worker, workerPayment), "Token transfer to worker failed");
                require(IERC20(token).transfer(platform, fee), "Token fee transfer failed");
            }
            
            emit PaymentReleased(worker, workerPayment);
        } else {
            // Employer's claim upheld - partial refund
            require(_employerRefundAmount <= milestones[_milestoneIndex].amount, "Refund exceeds milestone amount");
            
            if (_employerRefundAmount > 0) {
                if (token == address(0)) {
                    (bool success, ) = employer.call{value: _employerRefundAmount}("");
                    require(success, "ETH refund to employer failed");
                } else {
                    require(IERC20(token).transfer(employer, _employerRefundAmount), "Token refund to employer failed");
                }
            }
            
            // Remaining amount goes to worker
            uint256 remainingAmount = milestones[_milestoneIndex].amount - _employerRefundAmount;
            if (remainingAmount > 0) {
                uint256 fee = (remainingAmount * platformFee) / 10000;
                uint256 workerPayment = remainingAmount - fee;
                
                if (token == address(0)) {
                    (bool success, ) = worker.call{value: workerPayment}("");
                    require(success, "ETH transfer to worker failed");
                    (bool feeSent, ) = platform.call{value: fee}("");
                    require(feeSent, "ETH fee transfer failed");
                } else {
                    require(IERC20(token).transfer(worker, workerPayment), "Token transfer to worker failed");
                    require(IERC20(token).transfer(platform, fee), "Token fee transfer failed");
                }
                
                emit PaymentReleased(worker, workerPayment);
            }
        }
        
        emit DisputeResolved(_milestoneIndex, _workerFavored);
        
        // Move to next milestone or complete job
        currentMilestoneIndex++;
        if (currentMilestoneIndex < milestones.length) {
            milestones[currentMilestoneIndex].status = MilestoneStatus.InProgress;
        } else {
            status = JobStatus.Completed;
            emit JobCompleted();
        }
    }
    
    /**
     * @dev Auto-resolve disputes after timeout period (can be called by worker)
     * @param _milestoneIndex Index of the disputed milestone
     */
    function autoResolveDispute(uint256 _milestoneIndex) external onlyWorker {
        require(milestones[_milestoneIndex].status == MilestoneStatus.Disputed, "Milestone not disputed");
        require(
            block.timestamp > disputeTimestamps[_milestoneIndex] + DISPUTE_RESOLUTION_PERIOD,
            "Dispute resolution period not over"
        );
        
        // Auto-resolve in worker's favor after timeout
        uint256 paymentAmount = milestones[_milestoneIndex].amount;
        uint256 fee = (paymentAmount * platformFee) / 10000;
        uint256 workerPayment = paymentAmount - fee;
        
        if (token == address(0)) {
            (bool success, ) = worker.call{value: workerPayment}("");
            require(success, "ETH transfer to worker failed");
            (bool feeSent, ) = platform.call{value: fee}("");
            require(feeSent, "ETH fee transfer failed");
        } else {
            require(IERC20(token).transfer(worker, workerPayment), "Token transfer to worker failed");
            require(IERC20(token).transfer(platform, fee), "Token fee transfer failed");
        }
        
        emit PaymentReleased(worker, workerPayment);
        emit DisputeResolved(_milestoneIndex, true);
        
        // Move to next milestone or complete job
        currentMilestoneIndex++;
        if (currentMilestoneIndex < milestones.length) {
            milestones[currentMilestoneIndex].status = MilestoneStatus.InProgress;
        } else {
            status = JobStatus.Completed;
            emit JobCompleted();
        }
    }
    
    /**
     * @dev Cancel a job (only possible before worker confirms)
     */
    function cancelJob() external onlyEmployer {
        require(status == JobStatus.Created, "Can only cancel before job starts");
        require(!workerConfirmed, "Worker already confirmed job");
        
        status = JobStatus.Cancelled;
        
        // Return funds to employer
        if (token == address(0)) {
            if (address(this).balance > 0) {
                (bool success, ) = employer.call{value: address(this).balance}("");
                require(success, "ETH return failed");
            }
        } else {
            uint256 tokenBalance = IERC20(token).balanceOf(address(this));
            if (tokenBalance > 0) {
                require(IERC20(token).transfer(employer, tokenBalance), "Token return failed");
            }
        }
        
        emit JobCancelled();
    }

    
    function getAllMilestones() external view returns (
        string[] memory titles,
        string[] memory descriptions,
        uint256[] memory amounts,
        uint256[] memory deadlines,
        uint8[] memory statuses
    ) {
        uint256 length = milestones.length;
        titles = new string[](length);
        descriptions = new string[](length);
        amounts = new uint256[](length);
        deadlines = new uint256[](length);
        statuses = new uint8[](length);
        
        for (uint256 i = 0; i < length; i++) {
            titles[i] = milestones[i].title;
            descriptions[i] = milestones[i].description;
            amounts[i] = milestones[i].amount;
            deadlines[i] = milestones[i].deadline;
            statuses[i] = uint8(milestones[i].status);
        }
        
        return (titles, descriptions, amounts, deadlines, statuses);
    }
    
   
    function getJobDetails() external view returns (
        address _employer,
        address _worker,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint8 _status,
        uint256 _milestoneCount,
        uint256 _currentMilestone
    ) {
        return (
            employer,
            worker,
            title,
            description,
            totalPayment,
            uint8(status),
            milestones.length,
            currentMilestoneIndex
        );
    }
    
    
    receive() external payable {}
}