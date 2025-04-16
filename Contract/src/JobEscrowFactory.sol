// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./JobEscrow.sol";

contract JobEscrowFactory is Ownable {
    address public immutable implementation;
    address public coreContract;
    
    event CloneCreated(address indexed clone);
    
    constructor(address _implementation) Ownable(msg.sender) {
        implementation = _implementation;
    }
    
    modifier onlyCore() {
        require(msg.sender == coreContract, "Only core contract can call");
        _;
    }
    
    function setCoreContract(address _coreContract) external onlyOwner {
        require(_coreContract != address(0), "Invalid core contract address");
        coreContract = _coreContract;
    }
    
    function createJobEscrow(
        address _employer,
        uint256 _orgId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token,
        uint256 _platformFee
    ) external returns (address) {
        address clone = Clones.clone(implementation);
        
        JobEscrow(payable(clone)).initialize(
            coreContract,
            _employer,
            _orgId,
            _title,
            _description,
            _totalPayment,
            _milestoneCount,
            _token,
            _platformFee
        );
        
        emit CloneCreated(clone);
        return clone;
    }
}