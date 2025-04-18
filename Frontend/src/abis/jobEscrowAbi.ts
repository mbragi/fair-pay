import { type Abi } from "thirdweb";
export const jobEscrowAbi: Abi = [
  {
    type: "function",
    name: "DISPUTE_PERIOD",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approveMilestone",
    inputs: [{ name: "_index", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "assignWorker",
    inputs: [{ name: "_worker", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelJob",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "completeMilestone",
    inputs: [{ name: "_index", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "confirmJob",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createdAt",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "currentMilestoneIndex",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "depositFunds",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "description",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "disputeTimestamps",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "employer",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getJobDetails",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint8", internalType: "uint8" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMilestone",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "_status", type: "uint8", internalType: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPaymentInfo",
    inputs: [],
    outputs: [
      {
        name: "_totalPayment",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "paidAmount", type: "uint256", internalType: "uint256" },
      {
        name: "remainingAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "platformFeeAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_platform", type: "address", internalType: "address" },
      { name: "_employer", type: "address", internalType: "address" },
      {
        name: "_organizationId",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" },
      {
        name: "_totalPayment",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_milestoneCount",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_token", type: "address", internalType: "address" },
      { name: "_platformFee", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "milestones",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      {
        name: "status",
        type: "uint8",
        internalType: "enum JobEscrow.MilestoneStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizationId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platform",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resolveDispute",
    inputs: [
      { name: "_index", type: "uint256", internalType: "uint256" },
      { name: "_workerFavored", type: "bool", internalType: "bool" },
      {
        name: "_employerRefund",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMilestones",
    inputs: [
      {
        name: "_indices",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      { name: "_titles", type: "string[]", internalType: "string[]" },
      {
        name: "_description",
        type: "string[]",
        internalType: "string[]",
      },
      {
        name: "_amounts",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "_deadlines",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "status",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum JobEscrow.JobStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "title",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalPayment",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "worker",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "workerConfirmed",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "DisputeRaise",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DisputeResolve",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "workerFavored",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FundsDeposited",
    inputs: [
      {
        name: "depositor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  { type: "event", name: "JobCancel", inputs: [], anonymous: false },
  {
    type: "event",
    name: "JobComplete",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "JobStart",
    inputs: [
      {
        name: "worker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MilestoneAdd",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "title",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MilestoneCompleted",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MilestoneUpdate",
    inputs: [
      {
        name: "index",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "status",
        type: "uint8",
        indexed: false,
        internalType: "enum JobEscrow.MilestoneStatus",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MilestonesSet",
    inputs: [
      {
        name: "indices",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "titles",
        type: "string[]",
        indexed: false,
        internalType: "string[]",
      },
      {
        name: "amounts",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "deadlines",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Payment",
    inputs: [
      {
        name: "worker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentReleased",
    inputs: [
      {
        name: "milestoneIndex",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WorkerAssigned",
    inputs: [
      {
        name: "worker",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyConfirmed", inputs: [] },
  { type: "error", name: "AmountMismatch", inputs: [] },
  { type: "error", name: "DisputePeriodActive", inputs: [] },
  { type: "error", name: "InsufficientFunds", inputs: [] },
  { type: "error", name: "InvalidAddress", inputs: [] },
  { type: "error", name: "InvalidAmount", inputs: [] },
  { type: "error", name: "InvalidArrayLength", inputs: [] },
  { type: "error", name: "InvalidInitialization", inputs: [] },
  { type: "error", name: "InvalidMilestone", inputs: [] },
  { type: "error", name: "InvalidRefund", inputs: [] },
  { type: "error", name: "JobNotActive", inputs: [] },
  { type: "error", name: "JobStarted", inputs: [] },
  { type: "error", name: "NotDisputed", inputs: [] },
  { type: "error", name: "NotInitializing", inputs: [] },
  { type: "error", name: "OnlyAssignedWorker", inputs: [] },
  { type: "error", name: "OnlyEmployer", inputs: [] },
  { type: "error", name: "OnlyPlatform", inputs: [] },
  { type: "error", name: "OnlyWorker", inputs: [] },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  { type: "error", name: "TooEarly", inputs: [] },
  { type: "error", name: "WorkerAlreadyAssigned", inputs: [] },
];


export const organizationManagerAbi: Abi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "addJobToOrganization",
    inputs: [
      { name: "_orgId", type: "uint256", internalType: "uint256" },
      { name: "_jobAddress", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addMember",
    inputs: [
      { name: "_orgId", type: "uint256", internalType: "uint256" },
      { name: "_member", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createOrganization",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      { name: "_name", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getOrganizationJobs",
    inputs: [{ name: "_orgId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrganizationsByOwner",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    outputs: [
      { name: "ids", type: "uint256[]", internalType: "uint256[]" },
      { name: "names", type: "string[]", internalType: "string[]" },
      {
        name: "descriptions",
        type: "string[]",
        internalType: "string[]",
      },
      {
        name: "activeStatuses",
        type: "bool[]",
        internalType: "bool[]",
      },
      {
        name: "creationTimes",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isOrganizationMember",
    inputs: [
      { name: "_orgId", type: "uint256", internalType: "uint256" },
      { name: "_member", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidOrganization",
    inputs: [{ name: "_orgId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizationCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizationJobs",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizationMembers",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizations",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "name", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "isActive", type: "bool", internalType: "bool" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeMember",
    inputs: [
      { name: "_orgId", type: "uint256", internalType: "uint256" },
      { name: "_member", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MemberAdded",
    inputs: [
      {
        name: "orgId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "member",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MemberRemoved",
    inputs: [
      {
        name: "orgId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "member",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrganizationCreated",
    inputs: [
      {
        name: "orgId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];
