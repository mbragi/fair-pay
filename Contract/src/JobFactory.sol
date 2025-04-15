// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./JobEscrowFactory.sol";
import "./interfaces/IFairPay.sol";

contract JobFactory is Ownable {
    address public fairPayCore;
    JobEscrowFactory public escrowFactory;
    
    event JobEscrowCreated(address indexed jobEscrow);
    event FairPayCoreUpdated(address indexed newFairPayCore);
    
    constructor(address _escrowFactory) Ownable(msg.sender) {
        require(_escrowFactory != address(0), "Invalid EscrowFactory address");
        escrowFactory = JobEscrowFactory(_escrowFactory);
    }
    
    function setFairPayCore(address _fairPayCore) external onlyOwner {
        require(_fairPayCore != address(0), "Invalid FairPayCore address");
        fairPayCore = _fairPayCore;
        emit FairPayCoreUpdated(_fairPayCore);
    }
    
    function createJob(
        address _employer,
        uint256 _orgId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token,
        uint256 _platformFee
    ) external returns (address) {
        require(msg.sender == fairPayCore, "Only FairPayCore can create jobs");
        require(fairPayCore != address(0), "FairPayCore not set");
        require(_milestoneCount > 0 && _milestoneCount <= 20, "Invalid milestone count");
        require(_totalPayment > 0, "Payment must be > 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        address jobEscrow = escrowFactory.createJobEscrow(
            _employer,
            _orgId,
            _title,
            _description,
            _totalPayment,
            _milestoneCount,
            _token,
            _platformFee
        );
        
        emit JobEscrowCreated(jobEscrow);
        return jobEscrow;
    }
}