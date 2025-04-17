import { useEffect, useState } from "react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { FairPayCore } from "../abis/addresses";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";

export interface Organization {
  id: number;
  name: string;
  description: string;
  owner: string;
  isActive: boolean;
  createdAt: number;
  isOwner: boolean;
}

const contract = getContract({
  address: FairPayCore,
  chain: baseSepolia,
  client,
});

export const useOrganizations = () => {
  const { address, isConnected } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
 const [loading, setLoading] = useState(false);

 

  const { mutateAsync: sendTx, isPending } = useSendTransaction();

  // 📤 WRITE METHODS
  const createOrganization = async (name: string, description: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function createOrganization(string,string)",
      params: [name, description],
    });
    await sendTx(tx);
  };
  const addJobToOrganization = async (orgId: number, jobAddress: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function addJobToOrganization(uint256,address)",
      params: [BigInt(orgId), jobAddress],
    });
    await sendTx(tx);
  };

  const addMember = async (orgId: number, memberAddress: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function addMember(uint256,address)",
      params: [BigInt(orgId), memberAddress],
    });
    await sendTx(tx);
  };

  // 📥 READ METHODS using readContract
  const getOrganizationJobs = async (orgId: number): Promise<readonly string[]> => {
    return await readContract({
      contract,
      method: "function getOrganizationJobs(uint256) returns (address[])",
      params: [BigInt(orgId)],
    });
  };

  const isOrganizationMember = async (
    orgId: number,
    member: string
  ): Promise<boolean> => {
    return await readContract({
      contract,
      method: "function isOrganizationMember(uint256,address) returns (bool)",
      params: [BigInt(orgId), member],
    });
  };

  const fetchOrganizationsByOwner = async (owner: string) => {
    setLoading(true);
    try {
      const [ids, names, descriptions, statuses, timestamps] =
        await readContract({
          contract,
          method: "function getOrganizationsByOwner(address) returns (uint256[],string[],string[],bool[],uint256[])",
          params: [owner],
        });
  
      const mapped: Organization[] = ids.map((id: bigint, i: number) => ({
        id: Number(id),
        name: names[i],
        description: descriptions[i],
        owner,
        isActive: statuses[i],
        createdAt: Number(timestamps[i]),
        isOwner: address?.toLowerCase() === owner.toLowerCase(),
      }));
  
      setOrganizations(mapped);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    } finally {
      setLoading(false);
    }
  };
 
 const fetchOrganizationJobs = async (
   orgId: number
 ): Promise<string[]> => {
 
   try {
    const jobs = await readContract({
       contract,
       method: "function getOrganizationJobs(uint256) returns (address[])",
       params: [BigInt(orgId)],
     });

     return jobs as unknown as string[];
   } catch (err) {
     console.error("Error fetching organization jobs:", err);
     return [];
   }
 };

  // 🔁 Auto fetch on connect
  useEffect(() => {
    if (isConnected && address) {
      fetchOrganizationsByOwner(address);
    }
  }, [isConnected, address]);

  return {
    organizations,
    setOrganizations,
    loading,
    isPending,
    refetch: () => address ? fetchOrganizationsByOwner(address) : Promise.resolve(),

    // exposed methods
    createOrganization,
    fetchOrganizationJobs,
    addJobToOrganization,
    addMember,
    getOrganizationJobs,
    isOrganizationMember,
    fetchOrganizationsByOwner,
  };
};
