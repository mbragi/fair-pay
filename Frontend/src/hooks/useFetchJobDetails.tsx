import { getContract } from "thirdweb/contract";
import { useReadContract } from "thirdweb/react";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

export const useFetchJobDetails = (jobAddress: string) => {
  const contract = getContract({
    address: jobAddress,
    chain: baseSepolia,
    client,
  });

  const { data, isLoading } = useReadContract({
    contract,
    method: "function getJobDetails()", // Replace with your actual method
  });

  return { data, isLoading };
};