// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IFairPay.sol";

contract JobEscrow is ReentrancyGuard, Initializable {
    using SafeERC20 for IERC20;
    
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    enum MilestoneStatus { NotStarted, InProgress, Completed, Disputed }
    
    error OnlyEmployer();
    error OnlyWorker();
    error OnlyPlatform();
    error JobNotActive();
    error InvalidAddress();
    error InvalidMilestone();
    error InsufficientFunds();
    error TooEarly();
    error NotDisputed();
    error DisputePeriodActive();
    error AlreadyConfirmed();
    error JobStarted();
    error InvalidArrayLength();
    error AmountMismatch();
    error InvalidRefund();
    error InvalidAmount();
    error WorkerAlreadyAssigned();
    error OnlyAssignedWorker();
    error JobNotFunded();

    
    address public platform;
    address public employer;
    JobStatus public status;
    uint256 public organizationId;
    
    string public title;
    string public description;
    uint256 public totalPayment;
    address public token;
    uint256 public platformFee;
    uint256 public createdAt;
    address public worker;
    uint256 public currentMilestoneIndex;
    bool public isFunded;
    
    struct Milestone {
        string title;
        string description;
        uint256 amount;     
        uint256 deadline;
        MilestoneStatus status;
    }
    
    Milestone[] public milestones;
    uint256 public constant DISPUTE_PERIOD = 7 days;
    mapping(uint256 => uint256) public disputeTimestamps;
    
    event FundsDeposited(address indexed depositor, uint256 amount);
    event MilestoneCompleted(uint256 indexed index);
    event PaymentReleased(uint256 indexed milestoneIndex, address indexed recipient, uint256 amount);
    event JobStart(address worker);
    event MilestonesSet(uint256[] indices, string[] titles, uint256[] amounts, uint256[] deadlines);
    event MilestoneAdd(uint256 index, string title, uint256 amount);
    event MilestoneUpdate(uint256 index, MilestoneStatus status);
    event Payment(address worker, uint256 amount);
    event JobComplete();
    event JobCancel();
    event DisputeRaise(uint256 index);
    event DisputeResolve(uint256 index, bool workerFavored);
    event WorkerAssigned(address worker);
    event JobFunded();

    function initialize(
        address _platform,
        address _employer,
        uint256 _organizationId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token,
        uint256 _platformFee
    ) external initializer {
        if (_platform == address(0) || _employer == address(0)) revert InvalidAddress();
        
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
        isFunded = false;
        
        for (uint256 i = 0; i < _milestoneCount; i++) {
            milestones.push(Milestone("", "", 0, 0, MilestoneStatus.NotStarted));
        }
    }
    
    modifier onlyEmployer() {
        if (msg.sender != employer) revert OnlyEmployer();
        _;
    }
    
    modifier onlyWorker() {
        if (!(msg.sender == worker)) revert OnlyWorker();
        _;
    }
    
    modifier jobActive() {
        if (status != JobStatus.InProgress) revert JobNotActive();
        _;
    }

    modifier requireFunded() {
        if (!isFunded) revert JobNotFunded();
        _;
    }

    function depositFunds() external payable {
        if (status > JobStatus.InProgress) revert JobNotActive();
        
        if (token == address(0)) {
            if (msg.value != totalPayment) revert InsufficientFunds();
        } else {
            if (msg.value != 0) revert InvalidAddress();
            IERC20(token).safeTransferFrom(msg.sender, address(this), totalPayment);
        }
        
        isFunded = true;
        emit FundsDeposited(msg.sender, totalPayment);
        emit JobFunded();
    }

    function assignWorker(address _worker) external onlyEmployer requireFunded  {
        if (status != JobStatus.Created) revert JobStarted();
        if (_worker == address(0)) revert InvalidAddress();
        if (worker != address(0)) revert WorkerAlreadyAssigned();
        
        worker = _worker;
        status = JobStatus.InProgress;
        milestones[0].status = MilestoneStatus.InProgress;
        
        // Automatically register with FairPayCore
        IFairPayCore(platform).registerWorkerJob(_worker);
        
        emit WorkerAssigned(_worker);
        emit JobStart(_worker);
    }
    
    function setMilestones(
        uint256[] calldata _indices,
        string[] calldata _titles,
        string[] calldata _description,
        uint256[] calldata _amounts,
        uint256[] calldata _deadlines
    ) external onlyEmployer {
        if (status != JobStatus.Created) revert JobStarted();
        if (_indices.length != _titles.length || 
            _indices.length != _amounts.length || 
            _indices.length != _deadlines.length) revert InvalidArrayLength();
        
        uint256 totalAmount;
        for (uint256 i = 0; i < _indices.length; i++) {
            if (_indices[i] >= milestones.length) revert InvalidMilestone();
            if (_amounts[i] == 0) revert InvalidAmount();
            
            milestones[_indices[i]] = Milestone(
                _titles[i],
                _description[i],
                _amounts[i],
                _deadlines[i],
                MilestoneStatus.NotStarted
            );
            totalAmount += _amounts[i];
        }
        
        if (totalAmount != totalPayment) revert AmountMismatch();
        
        emit MilestonesSet(_indices, _titles, _amounts, _deadlines);
    }
    
    
    function approveMilestone(uint256 _index) external onlyEmployer jobActive nonReentrant {
        if (_index >= milestones.length) revert InvalidMilestone();
        if (milestones[_index].status != MilestoneStatus.Completed) revert InvalidMilestone();
        
        uint256 amount = milestones[_index].amount;
        uint256 fee = amount * platformFee / 10000;
        
        if (token == address(0)) {
            (bool success, ) = worker.call{value: amount - fee}("");
            require(success, "ETH transfer failed");
            (bool platformSuccess, ) = platform.call{value: fee}("");
            require(platformSuccess, "Platform fee transfer failed");
        } else {
            IERC20(token).safeTransfer(worker, amount - fee);
            IERC20(token).safeTransfer(platform, fee);
        }
        
        emit Payment(worker, amount - fee);
        
        if (++currentMilestoneIndex >= milestones.length) {
            status = JobStatus.Completed;
            emit JobComplete();
        } else {
            milestones[currentMilestoneIndex].status = MilestoneStatus.InProgress;
            emit MilestoneUpdate(currentMilestoneIndex, MilestoneStatus.InProgress);
        }
        emit MilestoneCompleted(_index);
        emit PaymentReleased(_index, worker, amount - fee);
    }

    function resolveDispute(
        uint256 _index, 
        bool _workerFavored,
        uint256 _employerRefund
    ) external nonReentrant {
        if (msg.sender != platform) revert OnlyPlatform();
        if (milestones[_index].status != MilestoneStatus.Disputed) revert NotDisputed();
        
        uint256 amount = milestones[_index].amount;
        if (_workerFavored) {
            uint256 fee = amount * platformFee / 10000;
            if (token == address(0)) {
                (bool success, ) = worker.call{value: amount - fee}("");
                require(success, "ETH transfer failed");
                (bool platformSuccess, ) = platform.call{value: fee}("");
                require(platformSuccess, "Platform fee transfer failed");
            } else {
                IERC20(token).safeTransfer(worker, amount - fee);
                IERC20(token).safeTransfer(platform, fee);
            }
            emit Payment(worker, amount - fee);
        } else {
            if (_employerRefund > amount) revert InvalidRefund();
            if (_employerRefund > 0) {
                if (token == address(0)) {
                    (bool success, ) = employer.call{value: _employerRefund}("");
                    require(success, "ETH refund failed");
                } else {
                    IERC20(token).safeTransfer(employer, _employerRefund);
                }
            }
            
            uint256 remaining = amount - _employerRefund;
            if (remaining > 0) {
                uint256 fee = remaining * platformFee / 10000;
                if (token == address(0)) {
                    (bool success, ) = worker.call{value: remaining - fee}("");
                    require(success, "ETH transfer failed");
                    (bool platformSuccess, ) = platform.call{value: fee}("");
                    require(platformSuccess, "Platform fee transfer failed");
                } else {
                    IERC20(token).safeTransfer(worker, remaining - fee);
                    IERC20(token).safeTransfer(platform, fee);
                }
                emit Payment(worker, remaining - fee);
            }
        }
        
        if (++currentMilestoneIndex >= milestones.length) {
            status = JobStatus.Completed;
            emit JobComplete();
        } else {
            milestones[currentMilestoneIndex].status = MilestoneStatus.InProgress;
        }
        
        emit DisputeResolve(_index, _workerFavored);
    }

    function cancelJob() external onlyEmployer nonReentrant {
        if (status != JobStatus.Created) revert JobStarted();
        
        status = JobStatus.Cancelled;
        
        // Return funds if the job was funded
        if (isFunded) {
            uint256 balance = token == address(0) 
                ? address(this).balance 
                : IERC20(token).balanceOf(address(this));
            
            if (balance > 0) {
                if (token == address(0)) {
                    (bool success, ) = employer.call{value: balance}("");
                    require(success, "ETH refund failed");
                } else {
                    IERC20(token).safeTransfer(employer, balance);
                }
            }
        }
        emit JobCancel();
    }

    function getJobDetails() external view returns (
        address, address, string memory, string memory, 
        uint256, uint8, uint256, uint256, bool _isFunded
    ) {
        return (
            employer,
            worker,
            title,
            description,
            totalPayment,
            uint8(status),
            milestones.length,
            currentMilestoneIndex,
            isFunded
        );
    }

    function isJobFunded() external view returns (bool) {
        return isFunded;
    }

    function getMilestone(uint256 index) external view returns (
        string memory _title,
        string memory _description,
        uint256 amount,
        uint256 deadline,
        uint8 _status
    ) {
        require(index < milestones.length, "Invalid milestone index");
        Milestone memory m = milestones[index];
        return (m.title, m.description, m.amount, m.deadline, uint8(m.status));
    }

    function completeMilestone(uint256 _index) external onlyWorker jobActive {
    if (_index >= milestones.length) revert InvalidMilestone();
    if (_index != currentMilestoneIndex) revert InvalidMilestone();
    if (milestones[_index].status != MilestoneStatus.InProgress) revert InvalidMilestone();
    
    milestones[_index].status = MilestoneStatus.Completed;
    emit MilestoneUpdate(_index, MilestoneStatus.Completed);
}



    function getPaymentInfo() external view returns (
        uint256 _totalPayment,
        uint256 paidAmount,
        uint256 remainingAmount,
        uint256 platformFeeAmount
    ) {
        uint256 paid;
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].status == MilestoneStatus.Completed) {
                paid += milestones[i].amount;
            }
        }
        
        uint256 fee = platformFee;
        return (
            totalPayment,
            paid,
            totalPayment - paid,
            fee
        );
    }

    function getAllMilestones() external view returns (
        string[] memory titles,
        string[] memory descriptions, 
        uint256[] memory amounts,
        uint256[] memory deadlines,
        uint8[] memory statuses
    ) {
        uint256 milestoneCount = milestones.length;
        titles = new string[](milestoneCount);
        descriptions = new string[](milestoneCount);
        amounts = new uint256[](milestoneCount);
        deadlines = new uint256[](milestoneCount);
        statuses = new uint8[](milestoneCount);
        
        for (uint256 i = 0; i < milestoneCount; i++) {
            Milestone memory m = milestones[i];
            titles[i] = m.title;
            descriptions[i] = m.description;
            amounts[i] = m.amount;
            deadlines[i] = m.deadline;
            statuses[i] = uint8(m.status);
        }
        
        return (titles, descriptions, amounts, deadlines, statuses);
    }
}