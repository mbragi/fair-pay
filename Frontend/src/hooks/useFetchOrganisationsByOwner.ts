// useFetchOrganizationsByOwner.ts
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { OrganizationManager } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

export const useFetchOrganizationsByOwner = (owner: string) => {
  const contract = getContract({
    address: OrganizationManager,
    chain: baseSepolia,
    client,
  });

  return useReadContract({
    contract,
    method: "getOrganizationsByOwner",
    params: [owner],
  });
};
