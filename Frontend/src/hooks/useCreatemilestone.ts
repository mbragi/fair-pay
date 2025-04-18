import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { parseEther, formatUnits } from 'ethers/lib/utils';
import { jobEscrowAbi } from "../abis/jobEscrowAbi";


export const useSetMilestones = () => {
    const { mutateAsync, isPending, error } = useSendTransaction();

    const setMilestones = async (
        jobAddress: string,
        milestones: Array<{
            title: string;
            description: string;
            amount: string;
            deadline: Date;
        }>
    ) => {
        const jobContract = getContract({
            address: jobAddress,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi,
        });

        // Convert to the format expected by the contract
        const indices = milestones.map((_, index) => BigInt(index));
        const titles = milestones.map(m => m.title);
        const descriptions = milestones.map(m => m.description);
        const amounts = milestones.map(m => BigInt(parseEther(m.amount).toString()));
        const deadlines = milestones.map(m => 
            BigInt(Math.floor(m.deadline.getTime() / 1000))
        );

        // Validate total amount matches job's totalPayment
        const totalAmount = amounts.reduce((sum, amount) => sum + BigInt(amount), BigInt(0));
        const jobDetails = await readContract({
            contract: jobContract,
            method: "getJobDetails",
        });
        const jobTotalPayment = jobDetails[4]; // totalPayment is at index 4

        if (totalAmount !== BigInt(jobTotalPayment)) {
            throw new Error("Total milestone amounts must equal job's total payment");
        }

        const tx = prepareContractCall({
            contract: jobContract,
            method: "function setMilestones(uint256[],string[],string[],uint256[],uint256[])",
            params: [indices, titles, descriptions, amounts, deadlines],
        });

        return await mutateAsync(tx);
    };

    return {
        setMilestones,
        isPending,
        error,
    };
};