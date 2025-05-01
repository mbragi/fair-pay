import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract } from "thirdweb";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { FairPayCore } from "@abis/addresses";

export const useAddOrganizationMember = () => {
  const contract = getContract({
    address: FairPayCore,
    chain: BLOCKCHAIN_CONFIG.defaultChain,
    client,
  });

  const { mutateAsync, isPending, error } = useSendTransaction();

  const addMember = async (orgId: number, member: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function addOrganizationMember(uint256,address)",
      params: [BigInt(orgId), member],
    });
    return await mutateAsync(tx);
  };

  return { addMember, isPending, error };
};
