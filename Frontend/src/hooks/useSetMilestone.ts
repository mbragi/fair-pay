// hooks/useSetMilestones.ts
import { prepareContractCall } from "thirdweb";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../client";
import { useSendTransaction } from "thirdweb/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jobEscrowAbi:any = [
  {
    type: "function",
    name: "setMilestones",
    inputs: [
      { name: "_indices", type: "uint256[]", internalType: "uint256[]" },
      { name: "_titles", type: "string[]", internalType: "string[]" },
      { name: "_description", type: "string[]", internalType: "string[]" },
      { name: "_amounts", type: "uint256[]", internalType: "uint256[]" },
      { name: "_deadlines", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

export const useSetMilestones = (jobAddress: string) => {
 const { mutateAsync: sendTx, isPending , error} = useSendTransaction();
  const setMilestones = async (
    titles: string[],
    descriptions: string[],
    amounts: string[],
    deadlines: string[]
  ) => {
      const indices = titles.map((_, i) => BigInt(i));
      const convertedAmounts = amounts.map((a) =>
        BigInt(Math.floor(parseFloat(a) * 1e18))
      );
      const convertedDeadlines = deadlines.map((d) =>
        BigInt(Math.floor(new Date(d).getTime() / 1000))
      );

      const contract = getContract({
        address: jobAddress,
        abi: jobEscrowAbi,
        chain: baseSepolia,
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

  return { setMilestones, isPending, error};
};
