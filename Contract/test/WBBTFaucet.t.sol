// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Token/WBBTFaucet.sol";
import "../src/Token/SimpleToken.sol";

contract WBBTFaucetTest is Test {
    WBBTFaucet public faucet;
    SimpleERC20 public token;
    
    address public owner;
    address public user1;
    address public user2;
    
    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether;
    uint256 public constant DAILY_CLAIM_AMOUNT = 0.5 ether;
    uint256 public constant MAX_CLAIM_AMOUNT = 1.5 ether;
    uint256 public constant CLAIM_PERIOD = 1 days;
    
    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        vm.deal(owner, 100 ether);
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        
        // Deploy token
        token = new SimpleERC20("WBBT Token", "WBBT", INITIAL_SUPPLY);
        
        // Deploy faucet
        faucet = new WBBTFaucet(address(token));
        
        // Fund the faucet
        token.approve(address(faucet), 1000 ether);
        faucet.fundFaucet(1000 ether);
    }
    
    function testInitialState() public view {
        assertEq(address(faucet.wbbtToken()), address(token));
        assertEq(faucet.DAILY_CLAIM_AMOUNT(), DAILY_CLAIM_AMOUNT);
        assertEq(faucet.MAX_CLAIM_AMOUNT(), MAX_CLAIM_AMOUNT);
        assertEq(faucet.CLAIM_PERIOD(), CLAIM_PERIOD);
        assertEq(token.balanceOf(address(faucet)), 1000 ether);
    }
    
    function testClaimTokens() public {
        vm.startPrank(user1);
        
        // Check initial state
        assertEq(faucet.lastClaimTime(user1), 0);
        assertEq(faucet.totalClaimed(user1), 0);
        assertEq(token.balanceOf(user1), 0);
        
        // Claim tokens
        faucet.claimTokens();
        
        // Check state after claim
        assertEq(faucet.totalClaimed(user1), DAILY_CLAIM_AMOUNT);
        assertEq(token.balanceOf(user1), DAILY_CLAIM_AMOUNT);
        assertEq(faucet.lastClaimTime(user1), block.timestamp);
        
        vm.stopPrank();
    }
    
    function testCannotClaimTwiceInOneDay() public {
        vm.startPrank(user1);
        
        // First claim
        faucet.claimTokens();
        
        // Try to claim again
        vm.expectRevert("Can only claim once per day");
        faucet.claimTokens();
        
        vm.stopPrank();
    }
    
    function testCanClaimAfterOneDay() public {
        vm.startPrank(user1);
        
        // First claim
        faucet.claimTokens();
        assertEq(token.balanceOf(user1), DAILY_CLAIM_AMOUNT);
        
        // Advance time by 1 day
        vm.warp(block.timestamp + 1 days + 1);
        
        // Claim again
        faucet.claimTokens();
        assertEq(token.balanceOf(user1), DAILY_CLAIM_AMOUNT * 2);
        assertEq(faucet.totalClaimed(user1), DAILY_CLAIM_AMOUNT * 2);
        
        vm.stopPrank();
    }
    
    function testMaxClaimLimit() public {
        vm.startPrank(user1);
        
        // First claim
        faucet.claimTokens();
        assertEq(token.balanceOf(user1), DAILY_CLAIM_AMOUNT);
        
        // Advance time by 1 day
        vm.warp(block.timestamp + 1 days + 1);
        
        // Second claim
        faucet.claimTokens();
        assertEq(token.balanceOf(user1), DAILY_CLAIM_AMOUNT * 2);
        
        // Advance time by 1 day
        vm.warp(block.timestamp + 1 days + 1);
        
        // Third claim (should be partial to reach MAX_CLAIM_AMOUNT)
        faucet.claimTokens();
        assertEq(token.balanceOf(user1), MAX_CLAIM_AMOUNT);
        assertEq(faucet.totalClaimed(user1), MAX_CLAIM_AMOUNT);
        
        // Advance time by 1 day
        vm.warp(block.timestamp + 1 days + 1);
        
        // Try to claim again after reaching max
        vm.expectRevert("Maximum claim limit reached");
        faucet.claimTokens();
        
        vm.stopPrank();
    }
    
    function testTimeUntilNextClaim() public {
        vm.startPrank(user1);
        
        // Before first claim
        assertEq(faucet.timeUntilNextClaim(user1), 0);
        
        // First claim
        faucet.claimTokens();
        
        // Right after claim
        assertEq(faucet.timeUntilNextClaim(user1), CLAIM_PERIOD);
        
        // Advance time by half a day
        vm.warp(block.timestamp + 12 hours);
        assertEq(faucet.timeUntilNextClaim(user1), CLAIM_PERIOD - 12 hours);
        
        // Advance time to just after the claim period
        vm.warp(block.timestamp + 12 hours + 1);
        assertEq(faucet.timeUntilNextClaim(user1), 0);
        
        vm.stopPrank();
    }
    
    function testRemainingClaimableAmount() public {
        vm.startPrank(user1);
        
        // Before first claim
        assertEq(faucet.remainingClaimableAmount(user1), MAX_CLAIM_AMOUNT);
        
        // First claim
        faucet.claimTokens();
        assertEq(faucet.remainingClaimableAmount(user1), MAX_CLAIM_AMOUNT - DAILY_CLAIM_AMOUNT);
        
        // Claim until max
        vm.warp(block.timestamp + 1 days + 1);
        faucet.claimTokens();
        
        vm.warp(block.timestamp + 1 days + 1);
        faucet.claimTokens();
        
        // After reaching max
        assertEq(faucet.remainingClaimableAmount(user1), 0);
        
        vm.stopPrank();
    }
    
    function testFundFaucet() public {
        uint256 initialBalance = token.balanceOf(address(faucet));
        
        // Fund the faucet with more tokens
        token.approve(address(faucet), 500 ether);
        faucet.fundFaucet(500 ether);
        
        assertEq(token.balanceOf(address(faucet)), initialBalance + 500 ether);
    }
    
    function testWithdrawTokens() public {
        uint256 initialBalance = token.balanceOf(owner);
        uint256 faucetBalance = token.balanceOf(address(faucet));
        
        // Withdraw tokens
        faucet.withdrawTokens(100 ether);
        
        assertEq(token.balanceOf(owner), initialBalance + 100 ether);
        assertEq(token.balanceOf(address(faucet)), faucetBalance - 100 ether);
    }
    
    function testOnlyOwnerCanWithdraw() public {
        vm.startPrank(user1);
        
        vm.expectRevert();
        faucet.withdrawTokens(100 ether);
        
        vm.stopPrank();
    }
    
    function testEmptyFaucet() public {
        // Withdraw all tokens from faucet
        uint256 faucetBalance = token.balanceOf(address(faucet));
        faucet.withdrawTokens(faucetBalance);
        
        vm.startPrank(user1);
        
        // Try to claim from empty faucet
        vm.expectRevert("Faucet is empty");
        faucet.claimTokens();
        
        vm.stopPrank();
    }
}