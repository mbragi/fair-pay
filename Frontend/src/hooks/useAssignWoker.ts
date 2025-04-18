import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { parseEther, formatUnits } from 'ethers/lib/utils';
import { FairPayCore } from "../abis/addresses";

export const useAssignWorker = () => {
    const { mutateAsync, isPending, error } = useSendTransaction();
    
    const assignWorker = async (jobAddress: string, workerAddress: string) => {
        const jobContract = getContract({
            address: jobAddress,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi, // Make sure you have this ABI
        });

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
}