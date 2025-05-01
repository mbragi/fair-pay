import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { FairPayCore } from "@abis/addresses";

export const useCreateOrganization = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: BLOCKCHAIN_CONFIG.defaultChain,
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
