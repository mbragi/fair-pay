# FairPay: Decentralized Freelance Platform with Smart Escrow

## Overview

FairPay is a transparent, trustless freelance platform built on blockchain technology. This project implements a comprehensive escrow system with milestone-based payments, dispute resolution mechanisms, and organization management to create a fair and secure environment for both employers and freelancers.

Unlike traditional freelance platforms that charge high fees and rely on centralized dispute resolution, FairPay utilizes smart contracts to automate payments, enforce agreed-upon terms, and provide an immutable record of work agreements and delivery.

## Table of Contents

- [Features](#features)
- [Technical Implementation](#technical-implementation)
  - [Smart Contract Architecture](#smart-contract-architecture)
  - [Contract Interactions](#contract-interactions)
  - [Job Escrow System](#job-escrow-system)
  - [Payment Mechanism](#payment-mechanism)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Decentralized Escrow**: Secure funds in smart contracts until work is completed and verified
- **Milestone-based Payments**: Break projects into manageable milestones with individual deadlines and payments
- **Multi-token Support**: Pay with ETH or any ERC20 token
- **Organization Management**: Create and manage teams with multiple members
- **Dispute Resolution System**: Fair mechanism for resolving disagreements between parties
- **Minimal Platform Fees**: Transparent fee structure with lower costs than traditional platforms
- **Job Assignment**: Secure worker assignment and confirmation process
- **Full Transparency**: All terms, milestones and payments recorded on-chain
- **Automatic Payouts**: Immediate payment release when milestones are approved

## Technical Implementation

### Smart Contract Architecture

FairPay uses a modular architecture with the following key contracts:

```
                  +---------------+
                  |               |
                  |  FairPayCore  |
                  |               |
                  +-------+-------+
                          |
          +---------------+---------------+
          |               |               |
+---------v---------+ +---v---+ +---------v---------+
|                   | |       | |                   |
| OrganizationManager| | JobFactory | | FeesManager |
|                   | |       | |                   |
+---------+---------+ +---+---+ +-----------------+
          |               |
          |         +-----v------+
          |         |            |
          |         | JobEscrow  |
          |         |            |
          +---------+------------+
```

### Contract Interactions

Here's how the key components interact:

1. **FairPayCore** is the central hub that coordinates all other contracts
2. **JobFactory** creates new JobEscrow contracts when employers request new jobs
3. **JobEscrow** instances manage individual job agreements between employers and workers
4. **OrganizationManager** tracks company/team structures and member permissions
5. **FeesManager** handles platform fee calculations and collection

### Job Escrow System

The JobEscrow contract is the heart of the FairPay system:

```solidity
contract JobEscrow is ReentrancyGuard, Initializable {
    enum JobStatus { Created, InProgress, Completed, Cancelled }
    enum MilestoneStatus { NotStarted, InProgress, Completed, Disputed }
    
    address public platform;
    address public employer;
    address public worker;
    JobStatus public status;
    
    struct Milestone {
        string title;
        string description;
        uint256 amount;     
        uint256 deadline;
        MilestoneStatus status;
    }
    
    Milestone[] public milestones;
    // Additional state variables...
}
```

Each JobEscrow instance:
- Is initialized with job parameters from the JobFactory
- Holds the full payment amount in escrow
- Tracks milestone completion and status
- Enforces access controls (only employer/worker can perform certain actions)
- Manages dispute resolution processes
- Automatically distributes payments when milestones are approved

When a new job is created through FairPayCore, the flow is:

1. FairPayCore calls JobFactory's `createJob()` function
2. JobFactory uses JobEscrowFactory to deploy a new JobEscrow contract
3. JobEscrow is initialized with job parameters (employer, payment terms, etc.)
4. The new JobEscrow address is registered in FairPayCore
5. The employer deposits funds into the JobEscrow contract
6. The assigned worker confirms acceptance of the job terms
7. FairPayCore registers the job-worker relationship

### Payment Mechanism

The payment flow works as follows:

1. Employer creates a job and deposits the full payment amount
2. Worker accepts the job and terms
3. Work begins on the first milestone
4. Worker completes milestones and submits for review
5. Employer approves each milestone, triggering automatic payment
6. In case of disputes, a resolution process is initiated
7. Platform fees are automatically deducted from each payment

```solidity
function approveMilestone(uint256 _index) external onlyEmployer jobActive nonReentrant {
    // Verification logic
    
    uint256 amount = milestones[_index].amount;
    uint256 fee = amount * platformFee / 10000;
    
    IERC20(token).safeTransfer(worker, amount - fee);
    IERC20(token).safeTransfer(platform, fee);
    
}
```

## How It Works

### For Organizations

1. **Create an Organization**: Set up your team with a name and description
2. **Add Team Members**: Invite collaborators to join your organization
3. **Create Jobs**: Post work opportunities with detailed requirements
4. **Fund Escrow**: Deposit payment for the entire project
5. **Set Milestones**: Define project phases with deadlines and payment allocation
6. **Assign Workers**: Select qualified freelancers for your projects
7. **Review Work**: Approve completed milestones to release payments

### For Freelancers

1. **Browse Available Jobs**: Find work opportunities matching your skills
2. **Review Terms**: Examine job details, milestones, and payment terms
3. **Confirm Jobs**: Accept assignments to begin work
4. **Complete Milestones**: Work through project phases according to specifications
5. **Submit Work**: Present completed milestones for approval
6. **Receive Payments**: Get paid automatically when work is approved
7. **Build Reputation**: Establish a verifiable on-chain work history

## Installation

### Prerequisites

- Node.js >= 14.0.0
- Yarn >= 1.22.0
- Foundry (forge, anvil, cast)

### Setup

1. Clone the repository

```bash
git clone https://github.com/jerrymusaga/fair-pay.git
cd fair-pay
```

2. Install dependencies

```bash
yarn install
```


## Deployment

### Testing Environment

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url <RPC_URL> \
  --private-key <DEPLOYER_PRIVATE_KEY> \
  --broadcast
```

## Testing

Run tests using Foundry:

```bash
forge test
```


## Security

The FairPay contracts implement several security mechanisms:

- **Access Control**: Uses OpenZeppelin's Ownable for admin functions
- **Reentrancy Protection**: Guards against reentrancy attacks with ReentrancyGuard
- **Input Validation**: Thorough validation of all input parameters
- **SafeERC20**: Proper handling of token transfers
- **State Management**: Careful tracking of job states to prevent exploitation
- **Error Handling**: Custom errors for gas-efficient reverts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the decentralized freelance ecosystem