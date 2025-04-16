// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OrganizationManager {
    uint256 public organizationCount;
    address public owner;
    
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
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier validOrganization(uint256 _orgId) {
        require(_orgId > 0 && _orgId <= organizationCount, "Invalid organization ID");
        require(organizations[_orgId].isActive, "Organization not active");
        _;
    }

    modifier onlyOrgOwnerOrAdmin(uint256 _orgId) {
        require(
            organizations[_orgId].owner == msg.sender || msg.sender == owner,
            "Not authorized"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     
     */
    function _transferOwnership(address newOwner) internal {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    
    
    function createOrganization(
        address _owner,  
        string memory _name, 
        string memory _description
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        organizationCount++;
        organizations[organizationCount] = Organization({
            owner: _owner,  
            name: _name,
            description: _description,
            isActive: true,
            createdAt: block.timestamp
        });
        
        organizationMembers[organizationCount][_owner] = true;  
        
        emit OrganizationCreated(organizationCount, _owner, _name);
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
    
    /**
     * @dev Adds a job to an organization (only called by main contract)
     */
    function addJobToOrganization(uint256 _orgId, address _jobAddress) external onlyOwner {
        require(isValidOrganization(_orgId), "Invalid organization");
        organizationJobs[_orgId].push(_jobAddress);
    }
    
    function isValidOrganization(uint256 _orgId) public view returns (bool) {
        return (_orgId > 0 && _orgId <= organizationCount && organizations[_orgId].isActive);
    }
    
    
    function isOrganizationMember(uint256 _orgId, address _member) public view validOrganization(_orgId) returns (bool) {
        return organizationMembers[_orgId][_member];
    }
    
   
    function getOrganizationJobs(uint256 _orgId) external view validOrganization(_orgId) returns (address[] memory) {
        return organizationJobs[_orgId];
    }

    function getOrganizationsByOwner(address _owner) external view returns (
        uint256[] memory ids,
        string[] memory names,
        string[] memory descriptions,
        bool[] memory activeStatuses,
        uint256[] memory creationTimes
    ) {
        // First, count how many organizations the address owns
        uint256 count = 0;
        for (uint256 i = 1; i <= organizationCount; i++) {
            if (organizations[i].owner == _owner) {
                count++;
            }
        }
        
        // Initialize return arrays
        ids = new uint256[](count);
        names = new string[](count);
        descriptions = new string[](count);
        activeStatuses = new bool[](count);
        creationTimes = new uint256[](count);
        
        // Populate arrays with full organization details
        uint256 index = 0;
        for (uint256 i = 1; i <= organizationCount; i++) {
            if (organizations[i].owner == _owner) {
                Organization storage org = organizations[i];
                ids[index] = i;
                names[index] = org.name;
                descriptions[index] = org.description;
                activeStatuses[index] = org.isActive;
                creationTimes[index] = org.createdAt;
                index++;
            }
        }
        
        return (ids, names, descriptions, activeStatuses, creationTimes);
    }
}