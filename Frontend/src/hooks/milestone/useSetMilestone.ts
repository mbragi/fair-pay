/* eslint-disable @typescript-eslint/no-explicit-any */
import { prepareContractCall } from "thirdweb";
import { getContract } from "thirdweb";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { client } from "../../client";
import { useSendTransaction } from "thirdweb/react";
import jobEscrowAbi from "@abis/JobEscrow.json";
import { ethers } from "ethers";

export const useSetMilestones = (jobAddress: string) => {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const setMilestones = async (
    titles: string[],
    descriptions: string[],
    amounts: string[],
    deadlines: string[]
  ) => {
    const count = titles.length;
    if (
      count === 0 ||
      descriptions.length !== count ||
      amounts.length !== count ||
      deadlines.length !== count
    ) {
      throw new Error(
        "All milestone arrays must be non-empty and of equal length."
      );
    }

    const indices = titles.map((_, i) => BigInt(i));

    const convertedAmounts = amounts.map((a) => {
      try {
        const bn = ethers.utils.parseEther(a);
        return BigInt(bn.toString());
      } catch {
        return 0n;
      }
    });

    const convertedDeadlines = deadlines.map((d) => {
      const ms = new Date(d).getTime();
      if (!Number.isFinite(ms)) return 0n;
      return BigInt(Math.floor(ms / 1000));
    });

    console.log("🚀 setMilestones params:", {
      indices,
      titles,
      descriptions,
      convertedAmounts,
      convertedDeadlines,
    });

    const contract = getContract({
      address: jobAddress,
      abi: jobEscrowAbi.abi as any,
      chain: BLOCKCHAIN_CONFIG.defaultChain,
      client,
    });

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
