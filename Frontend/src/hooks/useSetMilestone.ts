// hooks/useSetMilestones.ts
import { prepareContractCall } from "thirdweb";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../client";
import { useSendTransaction } from "thirdweb/react";
import jobEscrowAbi from "../abis/JobEscrow.json";

export const useSetMilestones = (jobAddress: string) => {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const setMilestones = async (
    titles: string[],
    descriptions: string[],
    amounts: string[],
    deadlines: string[]
  ) => {
    // Basic validation
    const count = titles.length;
    if (
      !count ||
      descriptions.length !== count ||
      amounts.length !== count ||
      deadlines.length !== count
    ) {
      throw new Error(
        "All milestone arrays must be non-empty and of equal length."
      );
    }

    // Prepare indices
    const indices = titles.map((_, i) => BigInt(i));

    // Safely convert amounts to BigInt (wei)
    const convertedAmounts = amounts.map((a) => {
      const num = parseFloat(a);
      const valid = Number.isFinite(num) ? num : 0;
      return BigInt(Math.floor(valid * 1e18));
    });

    // Safely convert deadlines to BigInt (unix seconds)
    const convertedDeadlines = deadlines.map((d) => {
      const ts = new Date(d).getTime();
      const validTs = Number.isFinite(ts) ? ts : 0;
      return BigInt(Math.floor(validTs / 1000));
    });

    // Get contract instance
    const contract = getContract({
      address: jobAddress,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abi: jobEscrowAbi.abi as any,
      chain: baseSepolia,
      client,
    });

    // Prepare and send transaction
    const tx = prepareContractCall({
      contract,
      method: "setMilestones",
      params: [
        indices,
        titles,
        descriptions,
        convertedAmounts,
        convertedDeadlines,
      ],
    });

    await sendTx(tx);
  };

  return { setMilestones, isPending, error };
};
