import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useUpdatePlatformFee = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const updateFee = async (newFee: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function updatePlatformFee(uint256)",
      params: [BigInt(newFee)],
    });
    return await mutateAsync(tx);
  };

  return { updateFee, isPending, error };
};
