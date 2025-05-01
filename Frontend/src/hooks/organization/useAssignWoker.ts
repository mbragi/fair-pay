import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import jobEscrowAbi from "@abis/JobEscrow.json"; // Make sure you have this ABI

export const useAssignWorker = () => {
  const { mutateAsync, isPending, error } = useSendTransaction();

  const assignWorker = async (jobAddress: string, workerAddress: string) => {
    // Get the specific job contract
    const jobContract = getContract({
      address: jobAddress,
      chain: BLOCKCHAIN_CONFIG.defaultChain,
      client,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abi: jobEscrowAbi.abi as any, // Make sure you have this ABI
    });

    // Prepare the transaction
    const tx = prepareContractCall({
      contract: jobContract,
      method: "function assignWorker(address)",
      params: [workerAddress],
    });

    return await mutateAsync(tx);
  };

  return {
    assignWorker,
    isPending,
    error,
  };
};
