import { getContract } from "thirdweb/contract";
import { useReadContract } from "thirdweb/react";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";

export const useFetchJobDetails = (jobAddress: string) => {
  const contract = getContract({
    address: jobAddress,
    chain: BLOCKCHAIN_CONFIG.defaultChain,
    client,
  });

  const { data, isLoading, error, refetch } = useReadContract({
    contract,
    method: "function getJobDetails()",
  });

  return { data, isLoading, error, refetch };
};
