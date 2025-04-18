import { useReadContract } from "thirdweb/react";
import React from "react";
import { getContract } from "thirdweb";
import { FairPayCore } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { organizationManagerAbi } from "../abis/jobEscrowAbi";

interface Organization {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: number;
}

export const useFetchOrganizationsByOwner = (owner: string) => {

 
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
    abi:organizationManagerAbi
  });


  const { data, isLoading,error, refetch } = useReadContract({
    contract,
    method: "getOrganizationsByOwner",
    params: [owner],
  });


  
  const organizations = React.useMemo(() => {
    if (!data) return [];

    const [ids, names, descriptions, activeStatuses, creationTimes] = data as [
      bigint[],
      string[],
      string[],
      boolean[],
      bigint[]
    ];

    return ids.map((id, index) => ({
      id: Number(id),
      name: names[index],
      description: descriptions[index],
      isActive: activeStatuses[index],
      createdAt: Number(creationTimes[index]),
    }));
  }, [data]);

  return {
    data: organizations,
    isLoading,
    refetch,
  };
};