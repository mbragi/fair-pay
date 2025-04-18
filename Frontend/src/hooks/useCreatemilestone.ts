import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { parseEther, formatUnits } from 'ethers/lib/utils';
import { jobEscrowAbi } from "../abis/jobEscrowAbi";
import { FairPayCore } from "../abis/addresses";

export const useSetMilestones = () => {
    const { mutateAsync, isPending, error } = useSendTransaction();

    const setMilestones = async (
        jobAddress: string,
        milestones: {
            indices: number[];
            titles: string[];
            descriptions: string[];
            amounts: string[];
            deadlines: Date[];
        }
    ) => {
        const jobContract = getContract({
            address: FairPayCore,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi,
        });

        const amountsInWei = milestones.amounts.map(amount => 
            BigInt(parseEther(amount).toString())
        );
        const deadlinesInSeconds = milestones.deadlines.map(deadline => 
            BigInt(Math.floor(deadline.getTime() / 1000))
        );

        const tx = prepareContractCall({
            contract: jobContract,
            method: "function setMilestones(uint256[],string[],string[],uint256[],uint256[])",
            params: [
                milestones.indices.map(index => BigInt(index)),
                milestones.titles,
                milestones.descriptions,
                amountsInWei,
                deadlinesInSeconds
            ],
        });
        return await mutateAsync(tx);
    };

    return {
        setMilestones,
        isPending,
        error,
    };
}
