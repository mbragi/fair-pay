// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./JobEscrow.sol";


/**
 * @title FreelancePlatform
 * @dev Main contract for managing organizations and job creation
 */
contract FairPay is Ownable(msg.sender) {
    // Platform fee in basis points (e.g., 250 = 2.5%)
    uint256 public platformFee = 250;

    struct Organization {
        address owner;
        string name;
        string description;
        bool isActive;
        uint256 createdAt;
    }
    
    // Mapping from organization ID to Organization data
    mapping(uint256 => Organization) public organizations;
    uint256 public organizationCount;
    
    // Mapping from organization ID to its members
    mapping(uint256 => mapping(address => bool)) public organizationMembers;
    
    // Deployed jobs by organization
    mapping(uint256 => address[]) public organizationJobs;
    
    event OrganizationCreated(uint256 indexed orgId, address indexed owner, string name);
    event MemberAdded(uint256 indexed orgId, address indexed member);
    event MemberRemoved(uint256 indexed orgId, address indexed member);
    event JobCreated(uint256 indexed orgId, address indexed jobAddress);
    event PlatformFeeUpdated(uint256 newFee);
    
    function createOrganization(string memory _name, string memory _description) external {
        organizationCount++;
        organizations[organizationCount] = Organization({
            owner: msg.sender,
            name: _name,
            description: _description,
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Add creator as member
        organizationMembers[organizationCount][msg.sender] = true;
        
        emit OrganizationCreated(organizationCount, msg.sender, _name);
    }
    
   
    function addMember(uint256 _orgId, address _member) external {
        require(organizations[_orgId].owner == msg.sender, "Not organization owner");
        require(organizations[_orgId].isActive, "Organization not active");
        require(!organizationMembers[_orgId][_member], "Already a member");
        
        organizationMembers[_orgId][_member] = true;
        emit MemberAdded(_orgId, _member);
    }
    
   
    function removeMember(uint256 _orgId, address _member) external {
        require(organizations[_orgId].owner == msg.sender, "Not organization owner");
        require(organizationMembers[_orgId][_member], "Not a member");
        require(_member != organizations[_orgId].owner, "Cannot remove owner");
        
        organizationMembers[_orgId][_member] = false;
        emit MemberRemoved(_orgId, _member);
    }
    
    function createJob(
        uint256 _orgId, 
        string memory _title, 
        string memory _description, 
        uint256 _totalPayment,
        uint256 _milestoneCount,
        address _token
    ) external returns (address) {
        require(organizationMembers[_orgId][msg.sender], "Not a member of organization");
        require(organizations[_orgId].isActive, "Organization not active");
        require(_milestoneCount > 0, "Must have at least one milestone");
        
        // Create new job contract
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
        
        // Add job to organization's job list
        organizationJobs[_orgId].push(address(newJob));
        
        emit JobCreated(_orgId, address(newJob));
        return address(newJob);
    }
    
    /**
     * @dev Updates the platform fee
     * @param _newFee New fee in basis points
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    /**
     * @dev Withdraws platform fees to owner
     * @param _token Address of token to withdraw (address(0) for ETH)
     */
    function withdrawFees(address _token) external onlyOwner {
        if (_token == address(0)) {
            // Withdraw ETH
            uint256 balance = address(this).balance;
            require(balance > 0, "No ETH to withdraw");
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "ETH transfer failed");
        } else {
            // Withdraw ERC20
            IERC20 token = IERC20(_token);
            uint256 balance = token.balanceOf(address(this));
            require(balance > 0, "No tokens to withdraw");
            require(token.transfer(owner(), balance), "Token transfer failed");
        }
    }
    
    /**
     * @dev Getter function to retrieve jobs for an organization
     * @param _orgId The organization ID
     */
    function getOrganizationJobs(uint256 _orgId) external view returns (address[] memory) {
        return organizationJobs[_orgId];
    }
    
    // Function to receive ETH
    receive() external payable {}
    fallback() external payable {}
}