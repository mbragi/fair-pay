import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { parseEther } from 'ethers/lib/utils';
import { FairPayCore } from "../abis/addresses";

export const useCreateJob = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const createJob = async (
    orgId: number,
    title: string,
    description: string,
    totalPayment: string,
    milestoneCount: number,
    tokenAddress: string
  ) => {
    const tx = prepareContractCall({
      contract,
      method:
        "function createJob(uint256,string,string,uint256,uint256,address)",
      params: [
        BigInt(orgId),
        title,
        description,
        BigInt(parseEther(totalPayment).toString()),
        BigInt(milestoneCount),
        tokenAddress,
      ],
    });
    return await mutateAsync(tx);
  };

  return { createJob, isPending, error };
};
