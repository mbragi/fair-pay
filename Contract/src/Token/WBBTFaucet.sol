// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title WBBTFaucet
 * @dev A faucet contract that allows users to claim WBBT tokens with daily limits
 */
contract WBBTFaucet is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable wbbtToken;

    uint256 private constant DAILY_CLAIM_AMOUNT = 0.5 ether; // 0.5 tokens with 18 decimals
    uint256 private constant MAX_CLAIM_AMOUNT = 1.5 ether; // 1.5 tokens maximum
    uint48 private constant CLAIM_PERIOD = 1 days;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount);
    event FaucetFunded(address indexed funder, uint256 amount);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    error InvalidTokenAddress();
    error MaximumClaimLimitReached();
    error ClaimPeriodNotElapsed();
    error FaucetEmpty();
    error TokenTransferFailed();
    error AmountMustBeGreaterThanZero();
    error InsufficientBalance(uint256 requested, uint256 available);

    constructor(address _wbbtToken) Ownable(msg.sender) {
        if (_wbbtToken == address(0)) revert InvalidTokenAddress();
        wbbtToken = IERC20(_wbbtToken);
    }

    /**
     * @dev Allows users to claim tokens once per day
     */
    function claimTokens() external nonReentrant {
        address user = msg.sender;
        uint256 userTotalClaimed = totalClaimed[user];

        // Check if user has already claimed the maximum amount
        if (userTotalClaimed >= MAX_CLAIM_AMOUNT) revert MaximumClaimLimitReached();

        // Check if enough time has passed since last claim
        uint256 userLastClaimTime = lastClaimTime[user];
        if (userLastClaimTime != 0 && block.timestamp < userLastClaimTime + CLAIM_PERIOD) {
            revert ClaimPeriodNotElapsed();
        }

        // Calculate how much the user can claim
        uint256 claimAmount = DAILY_CLAIM_AMOUNT;
        if (userTotalClaimed + claimAmount > MAX_CLAIM_AMOUNT) {
            claimAmount = MAX_CLAIM_AMOUNT - userTotalClaimed;
        }

        // Check if the faucet has enough tokens
        uint256 faucetBalance = wbbtToken.balanceOf(address(this));
        if (faucetBalance < claimAmount) revert FaucetEmpty();

        // Update state before transfer to prevent reentrancy
        lastClaimTime[user] = block.timestamp;
        totalClaimed[user] = userTotalClaimed + claimAmount;

        // Transfer tokens to the user using SafeERC20
        wbbtToken.safeTransfer(user, claimAmount);

        emit TokensClaimed(user, claimAmount);
    }

    /**
     * @dev Returns the time remaining until the user can claim again
     * @param user The address to check
     * @return The time remaining in seconds, 0 if can claim now
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 userTotalClaimed = totalClaimed[user];
        if (userTotalClaimed >= MAX_CLAIM_AMOUNT) {
            return type(uint256).max; // Max value to indicate they can never claim again
        }

        uint256 userLastClaimTime = lastClaimTime[user];
        if (userLastClaimTime == 0) {
            return 0; // Never claimed before
        }

        uint256 nextClaimTime = userLastClaimTime + CLAIM_PERIOD;
        if (block.timestamp >= nextClaimTime) {
            return 0; // Can claim now
        }

        return nextClaimTime - block.timestamp;
    }

    /**
     * @dev Allows anyone to fund the faucet with tokens
     * @param amount The amount of tokens to add to the faucet
     */
    function fundFaucet(uint256 amount) external nonReentrant {
        if (amount <= 0) revert AmountMustBeGreaterThanZero();

        // Transfer tokens from the sender to the faucet using SafeERC20
        wbbtToken.safeTransferFrom(msg.sender, address(this), amount);

        emit FaucetFunded(msg.sender, amount);
    }

    /**
     * @dev Allows the owner to withdraw tokens from the faucet in case of emergency
     * @param amount The amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external nonReentrant onlyOwner {
        if (amount <= 0) revert AmountMustBeGreaterThanZero();

        uint256 faucetBalance = wbbtToken.balanceOf(address(this));
        if (faucetBalance < amount) revert InsufficientBalance(amount, faucetBalance);

        // Transfer tokens to the owner using SafeERC20
        wbbtToken.safeTransfer(owner(), amount);

        emit TokensWithdrawn(owner(), amount);
    }

    /**
     * @dev Returns the remaining amount a user can claim in total
     * @param user The address to check
     * @return The remaining amount the user can claim
     */
    function remainingClaimableAmount(address user) external view returns (uint256) {
        uint256 userTotalClaimed = totalClaimed[user];
        if (userTotalClaimed >= MAX_CLAIM_AMOUNT) {
            return 0;
        }
        return MAX_CLAIM_AMOUNT - userTotalClaimed;
    }

    /**
     * @dev Returns the daily claim amount
     */
    function getDailyClaimAmount() external pure returns (uint256) {
        return DAILY_CLAIM_AMOUNT;
    }

    /**
     * @dev Returns the maximum claim amount
     */
    function getMaxClaimAmount() external pure returns (uint256) {
        return MAX_CLAIM_AMOUNT;
    }

    /**
     * @dev Returns the claim period in seconds
     */
    function getClaimPeriod() external pure returns (uint48) {
        return CLAIM_PERIOD;
    }
}
