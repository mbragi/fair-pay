import { useReadContract } from "thirdweb/react";
import React from "react";
import { getContract } from "thirdweb";
import { FairPayCore } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

export const useFetchOrganizationsByOwner = (owner: string) => {

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const organizationManagerAbi: any = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_organizationManager",
          "type": "address",
          "internalType": "address"
        },
        { "name": "_feesManager", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "fallback", "stateMutability": "payable" },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "addOrganizationMember",
      "inputs": [
        { "name": "_orgId", "type": "uint256", "internalType": "uint256" },
        { "name": "_member", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createJob",
      "inputs": [
        { "name": "_orgId", "type": "uint256", "internalType": "uint256" },
        { "name": "_title", "type": "string", "internalType": "string" },
        { "name": "_description", "type": "string", "internalType": "string" },
        {
          "name": "_totalPayment",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_milestoneCount",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "_token", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createOrganization",
      "inputs": [
        { "name": "name", "type": "string", "internalType": "string" },
        { "name": "description", "type": "string", "internalType": "string" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "feesManager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract FeesManager"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getJobPaymentInfo",
      "inputs": [
        { "name": "_jobAddress", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "token", "type": "address", "internalType": "address" },
        {
          "name": "totalPayment",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "paidAmount", "type": "uint256", "internalType": "uint256" },
        {
          "name": "remainingAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getOrganizationsByOwner",
      "inputs": [
        { "name": "_owner", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "ids", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "names", "type": "string[]", "internalType": "string[]" },
        {
          "name": "descriptions",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "activeStatuses",
          "type": "bool[]",
          "internalType": "bool[]"
        },
        {
          "name": "creationTimes",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWorkerJobDetails",
      "inputs": [
        { "name": "_worker", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        {
          "name": "jobAddresses",
          "type": "address[]",
          "internalType": "address[]"
        },
        { "name": "titles", "type": "string[]", "internalType": "string[]" },
        {
          "name": "descriptions",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "totalPayments",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        { "name": "statuses", "type": "uint8[]", "internalType": "uint8[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWorkerJobs",
      "inputs": [
        { "name": "_worker", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "", "type": "address[]", "internalType": "address[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isWorkerAssignedToJob",
      "inputs": [
        { "name": "_worker", "type": "address", "internalType": "address" },
        { "name": "_jobAddress", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "jobFactory",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "organizationManager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract OrganizationManager"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "registerWorkerJob",
      "inputs": [
        { "name": "_worker", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setJobFactory",
      "inputs": [
        { "name": "_jobFactory", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updatePlatformFee",
      "inputs": [
        { "name": "_newFee", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "validJobContracts",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "withdrawFees",
      "inputs": [
        { "name": "_token", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "workerJobs",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "JobCreated",
      "inputs": [
        {
          "name": "orgId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "jobAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WorkerAssigned",
      "inputs": [
        {
          "name": "worker",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "jobAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    }
  ]
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
    abi:organizationManagerAbi
  });


  const { data, isLoading,error, refetch } = useReadContract({
    contract,
    method: "getOrganizationsByOwner",
    params: [owner],
  });


  
  const organizations = React.useMemo(() => {
    if (!data) return [];

    const [ids, names, descriptions, activeStatuses, creationTimes] = data as [
      bigint[],
      string[],
      string[],
      boolean[],
      bigint[]
    ];

    return ids.map((id, index) => ({
      id: Number(id),
      name: names[index],
      description: descriptions[index],
      isActive: activeStatuses[index],
      createdAt: Number(creationTimes[index]),
    }));
  }, [data]);

  return {
    data: organizations,
    isLoading,
    refetch,
    error,
  };
};