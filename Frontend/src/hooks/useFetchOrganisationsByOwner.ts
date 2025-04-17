import { useEffect, useState } from "react";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { FairPayCore } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

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
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, refetch } = useReadContract({
    contract,
    method: "getOrganizationsByOwner",
    params: [owner],
  });

  // Update organizations when data changes
  useEffect(() => {
    if (!data) return;

    try {
      const [ids, names, descriptions, activeStatuses, creationTimes] = data as [
        bigint[],
        string[],
        string[],
        boolean[],
        bigint[]
      ];

      const mappedOrganizations = ids.map((id, index) => ({
        id: Number(id),
        name: names[index],
        description: descriptions[index],
        isActive: activeStatuses[index],
        createdAt: Number(creationTimes[index]),
      }));

      setOrganizations(mappedOrganizations);
      setError(null);
    } catch (err) {
      setError("Failed to parse contract data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Trigger initial load
  useEffect(() => {
    if (owner) {
      setIsLoading(true);
      refetch().catch((err) => {
        setError("Failed to fetch data");
        console.error(err);
      });
    }
  }, [owner, refetch]);

  return {
    data: organizations,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      await refetch();
    },
  };
};