// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./JobFactory.sol";
import "./FeesManager.sol";
import "./OrganizationManager.sol";

contract FairPayCore is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    OrganizationManager public organizationManager;
    FeesManager public feesManager;
    address public jobFactory;
    
    event JobCreated(uint256 indexed orgId, address indexed jobAddress);
    
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
        
        organizationManager.addJobToOrganization(_orgId, newJob);
        emit JobCreated(_orgId, newJob);
        return newJob;
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
    
    receive() external payable {}
    fallback() external payable {}
}