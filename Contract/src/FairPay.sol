// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./JobEscrow.sol";

contract FairPay is Ownable(msg.sender){
    using SafeERC20 for IERC20;

    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public organizationCount;
    
    struct Organization {
        address owner;
        string name;
        string description;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(uint256 => Organization) public organizations;
    mapping(uint256 => mapping(address => bool)) public organizationMembers;
    mapping(uint256 => address[]) public organizationJobs;
    
    event OrganizationCreated(uint256 indexed orgId, address indexed owner, string name);
    event MemberAdded(uint256 indexed orgId, address indexed member);
    event MemberRemoved(uint256 indexed orgId, address indexed member);
    event JobCreated(uint256 indexed orgId, address indexed jobAddress);
    event PlatformFeeUpdated(uint256 newFee);

    // ========== MODIFIERS ========== //
    modifier validOrganization(uint256 _orgId) {
        require(_orgId > 0 && _orgId <= organizationCount, "Invalid organization ID");
        require(organizations[_orgId].isActive, "Organization not active");
        _;
    }

    modifier onlyOrgOwnerOrAdmin(uint256 _orgId) {
        require(
            organizations[_orgId].owner == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    // ========== ORGANIZATION MANAGEMENT ========== //
    function createOrganization(
        string memory _name, 
        string memory _description
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        organizationCount++;
        organizations[organizationCount] = Organization({
            owner: msg.sender,
            name: _name,
            description: _description,
            isActive: true,
            createdAt: block.timestamp
        });
        
        organizationMembers[organizationCount][msg.sender] = true;
        
        emit OrganizationCreated(organizationCount, msg.sender, _name);
        return organizationCount;
    }

    function addMember(
        uint256 _orgId, 
        address _member
    ) external validOrganization(_orgId) onlyOrgOwnerOrAdmin(_orgId) {
        require(_member != address(0), "Invalid member address");
        require(!organizationMembers[_orgId][_member], "Already a member");
        
        organizationMembers[_orgId][_member] = true;
        emit MemberAdded(_orgId, _member);
    }

    function removeMember(
        uint256 _orgId, 
        address _member
    ) external validOrganization(_orgId) onlyOrgOwnerOrAdmin(_orgId) {
        require(organizationMembers[_orgId][_member], "Not a member");
        require(_member != organizations[_orgId].owner, "Cannot remove owner");
        
        organizationMembers[_orgId][_member] = false;
        emit MemberRemoved(_orgId, _member);
    }

    // ========== JOB CREATION ========== //
    function createJob(
        uint256 _orgId,
        string memory _title,
        string memory _description,
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token
    ) external validOrganization(_orgId) returns (address) {
        require(organizationMembers[_orgId][msg.sender], "Not a member");
        require(_milestoneCount > 0 && _milestoneCount <= 20, "Invalid milestone count");
        require(_totalPayment > 0, "Payment must be > 0");
        require(bytes(_title).length > 0, "Title cannot be empty");

        JobEscrow newJob = new JobEscrow(
            address(this),
            msg.sender,
            _orgId,
            _title,
            _description,
            _totalPayment,
            _milestoneCount,
            _token,
            platformFee
        );
        
        organizationJobs[_orgId].push(address(newJob));
        
        emit JobCreated(_orgId, address(newJob));
        return address(newJob);
    }

    // ========== FEE MANAGEMENT ========== //
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    function withdrawFees(address _token) external onlyOwner {
        if (_token == address(0)) {
            uint256 balance = address(this).balance;
            require(balance > 0, "No ETH to withdraw");
            payable(owner()).transfer(balance);
        } else {
            uint256 balance = IERC20(_token).balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            IERC20(_token).safeTransfer(owner(), balance);
        }
    }

    // ========== VIEW FUNCTIONS ========== //
    function getOrganizationJobs(
        uint256 _orgId
    ) external view validOrganization(_orgId) returns (address[] memory) {
        return organizationJobs[_orgId];
    }

    function isOrganizationMember(
        uint256 _orgId, 
        address _member
    ) external view validOrganization(_orgId) returns (bool) {
        return organizationMembers[_orgId][_member];
    }

   
    receive() external payable {}
    fallback() external payable {}
}