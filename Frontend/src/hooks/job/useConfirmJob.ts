import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import jobEscrowAbi from "@abis/JobEscrow.json";

export const useConfirmJob = () => {
  const { mutateAsync, isPending, error } = useSendTransaction();

  const confirmJob = async (jobAddress: string) => {
    const jobContract = getContract({
      address: jobAddress,
      chain: BLOCKCHAIN_CONFIG.defaultChain,
      client,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abi: jobEscrowAbi.abi as any,
    });

    const tx = prepareContractCall({
      contract: jobContract,
      method: "function confirmJob()",
      params: [],
    });

    return await mutateAsync(tx);
  };

  return {
    confirmJob,
    isPending,
    error,
  };
};
