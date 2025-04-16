import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useGetWorkerJobDetails = (worker: string) => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
      "function getWorkerJobDetails(address) view returns (address[],string[],string[],uint256[],uint8[])",
    params: [worker],
  });

  return {
    jobDetails: data as
      | {
          jobAddresses: string[];
          titles: string[];
          descriptions: string[];
          totalPayments: bigint[];
          statuses: number[];
        }
      | undefined,
    isLoading,
    error,
  };
};
