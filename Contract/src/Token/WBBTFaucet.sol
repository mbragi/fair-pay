// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title WBBTFaucet
 * @dev A faucet contract that allows users to claim WBBT tokens with daily limits
 */
contract WBBTFaucet is Ownable, ReentrancyGuard {
    IERC20 public wbbtToken;
    
    uint256 public constant DAILY_CLAIM_AMOUNT = 0.5 ether; // 0.5 tokens with 18 decimals
    uint256 public constant MAX_CLAIM_AMOUNT = 1.5 ether;  // 1.5 tokens maximum
    uint256 public constant CLAIM_PERIOD = 1 days;
    
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;
    
    event TokensClaimed(address indexed user, uint256 amount);
    event FaucetFunded(address indexed funder, uint256 amount);
    
    constructor(address _wbbtToken) Ownable(msg.sender) {
        require(_wbbtToken != address(0), "Invalid token address");
        wbbtToken = IERC20(_wbbtToken);
    }
    
    /**
     * @dev Allows users to claim tokens once per day
     */
    function claimTokens() external nonReentrant {
        address user = msg.sender;
        
        // Check if user has already claimed the maximum amount
        require(totalClaimed[user] < MAX_CLAIM_AMOUNT, "Maximum claim limit reached");
        
        // Check if enough time has passed since last claim
        require(
            lastClaimTime[user] == 0 || block.timestamp >= lastClaimTime[user] + CLAIM_PERIOD,
            "Can only claim once per day"
        );
        
        // Calculate how much the user can claim
        uint256 claimAmount = DAILY_CLAIM_AMOUNT;
        if (totalClaimed[user] + claimAmount > MAX_CLAIM_AMOUNT) {
            claimAmount = MAX_CLAIM_AMOUNT - totalClaimed[user];
        }
        
        // Check if the faucet has enough tokens
        require(wbbtToken.balanceOf(address(this)) >= claimAmount, "Faucet is empty");
        
        // Update state before transfer to prevent reentrancy
        lastClaimTime[user] = block.timestamp;
        totalClaimed[user] += claimAmount;
        
        // Transfer tokens to the user
        require(wbbtToken.transfer(user, claimAmount), "Token transfer failed");
        
        emit TokensClaimed(user, claimAmount);
    }
    
    /**
     * @dev Returns the time remaining until the user can claim again
     * @param user The address to check
     * @return The time remaining in seconds, 0 if can claim now
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return type(uint256).max; // Max value to indicate they can never claim again
        }
        
        if (lastClaimTime[user] == 0) {
            return 0; // Never claimed before
        }
        
        uint256 nextClaimTime = lastClaimTime[user] + CLAIM_PERIOD;
        if (block.timestamp >= nextClaimTime) {
            return 0; // Can claim now
        }
        
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @dev Allows the owner to fund the faucet with tokens
     * @param amount The amount of tokens to add to the faucet
     */
    function fundFaucet(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from the sender to the faucet
        require(wbbtToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        emit FaucetFunded(msg.sender, amount);
    }
    
    /**
     * @dev Allows the owner to withdraw tokens from the faucet in case of emergency
     * @param amount The amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(wbbtToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        
        require(wbbtToken.transfer(owner(), amount), "Token transfer failed");
    }
    
    /**
     * @dev Returns the remaining amount a user can claim in total
     * @param user The address to check
     * @return The remaining amount the user can claim
     */
    function remainingClaimableAmount(address user) external view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return 0;
        }
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }
}