import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useCreateOrganization = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const createOrganization = async (name: string, description: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function createOrganization(string,string)",
      params: [name, description],
    });
    return await mutateAsync(tx);
  };

  return { createOrganization, isPending, error };
};
