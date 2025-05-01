import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useWithdrawFees = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const withdrawFees = async (tokenAddress: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function withdrawFees(address)",
      params: [tokenAddress],
    });
    return await mutateAsync(tx);
  };

  return { withdrawFees, isPending, error };
};
