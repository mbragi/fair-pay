// useFetchOrganizationJobs.ts
import { useReadContract } from "thirdweb/react";
import { FairPayCore } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";

export const useFetchOrganizationJobs = (orgId: number) => {
  const contract = getContract({
      address: FairPayCore,
     chain: baseSepolia,
     client,
   });
 
   const { data, isLoading, error, refetch } = useReadContract({
     contract,
     method: "function getOrganizationJobs(uint)",
     params: [BigInt(orgId)],
   });
   return {data, isLoading, error, refetch}
};
