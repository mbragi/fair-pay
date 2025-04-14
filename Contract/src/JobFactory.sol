// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./JobEscrowFactory.sol";

contract JobFactory {
    address public coreContract;
    JobEscrowFactory public escrowFactory;
    
    event JobEscrowCreated(address indexed jobEscrow);
    
    constructor(address _coreContract, address _escrowFactory) {
        coreContract = _coreContract;
        escrowFactory = JobEscrowFactory(_escrowFactory);
    }
    
    modifier onlyCore() {
        require(msg.sender == coreContract, "Only core contract can call");
        _;
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
    ) external onlyCore returns (address) {
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