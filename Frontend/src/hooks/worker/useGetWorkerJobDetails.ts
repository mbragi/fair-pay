/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { FairPayCore } from "@constants/contracts";
import FairPayCoreAbi from "@abis/FairPayCore.json";

export const useGetWorkerJobDetails = (worker: string) => {
  const contract = getContract({
    address: FairPayCore,
    chain: BLOCKCHAIN_CONFIG.defaultChain,
    client,
    abi: FairPayCoreAbi.abi as any,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
      "function getWorkerJobDetails(address) view returns (address[],string[],string[],uint256[],uint8[])",
    params: [worker],
  });

  const jobDetails: any[] = data
    ? (data[0] as string[]).map((jobAddress: string, index: number) => ({
        address: jobAddress,
        title: data[1][index] as string,
        description: data[2][index] as string,
        totalPayment: BigInt(data[3][index]) as unknown as number,
        status: data[4][index] as number,
      }))
    : [];

  return {
    jobDetails,
    isLoading,
    error,
  };
};
