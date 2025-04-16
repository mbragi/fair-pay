import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useGetWorkerJobs = (worker: string) => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method: "function getWorkerJobs(address) view returns (address[])",
    params: [worker],
  });

  return { jobs: data as string[] | undefined, isLoading, error };
};
