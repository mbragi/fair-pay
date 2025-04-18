import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { jobEscrowAbi } from "../abis/jobEscrowAbi";

export const useAssignWorker = () => {
    const { mutateAsync, isPending, error } = useSendTransaction();

    const assignWorker = async (jobAddress: string, workerAddress: string) => {
        // Get the specific job contract
        const jobContract = getContract({
            address: jobAddress,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi,
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