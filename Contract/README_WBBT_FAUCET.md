# WBBT Faucet Contract

This README provides instructions for testing and deploying the WBBTFaucet contract, which allows users to claim WBBT tokens with daily limits.

## Features

- Daily token claim limits (0.5 WBBT per day)
- Maximum total claim amount per user (1.5 WBBT)
- 24-hour cooldown period between claims
- Reentrancy protection
- Owner functions for funding and emergency withdrawals

## Testing

The contract includes comprehensive tests that verify all functionality:

```bash
# Run all tests for the WBBTFaucet contract
forge test --match-contract WBBTFaucetTest -vv

# Run a specific test
forge test --match-test testClaimTokens -vv
```

The tests cover:
- Initial state validation
- Token claiming functionality
- Daily claim limits
- Maximum claim amount restrictions
- Time-based claiming rules
- Owner-only functions
- Edge cases like empty faucet handling

## Deployment

### Environment Setup

Before deploying, configure the environment variables in the `.env` file:

```
# Required for all deployments
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url

# Choose deployment mode
DEPLOY_NEW_TOKEN=true  # Set to false to use existing token

# Required if DEPLOY_NEW_TOKEN=false
TOKEN_ADDRESS=0xYourTokenAddress

# Optional for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Deployment Commands

```bash
# Load environment variables
source .env

# Deploy with a new token
forge script script/DeployWBBTFaucet.s.sol:DeployWBBTFaucet --rpc-url $RPC_URL --broadcast

# Deploy with an existing token
# Make sure TOKEN_ADDRESS is set in .env and DEPLOY_NEW_TOKEN=false
forge script script/DeployWBBTFaucet.s.sol:DeployWBBTFaucet --rpc-url $RPC_URL --broadcast

# Deploy with contract verification
forge script script/DeployWBBTFaucet.s.sol:DeployWBBTFaucet --rpc-url $RPC_URL --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

## Contract Integration

After deployment, you can integrate the faucet with your frontend using the contract address and ABI. The main functions to interact with are:

- `claimTokens()`: Allows users to claim tokens once per day
- `timeUntilNextClaim(address user)`: Returns time until user can claim again
- `remainingClaimableAmount(address user)`: Returns how much more a user can claim in total

For admin/owner functions:
- `fundFaucet(uint256 amount)`: Add more tokens to the faucet
- `withdrawTokens(uint256 amount)`: Emergency withdrawal of tokens (owner only)

## Security Considerations

- The contract uses OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks
- State changes are made before external calls to follow checks-effects-interactions pattern
- The contract has a maximum claim limit to prevent excessive token distribution