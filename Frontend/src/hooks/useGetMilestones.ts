/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useGetMilestones.ts
import { useState, useEffect } from "react";
import { readContract, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

// Minimal ABI for fetching a single milestone by index
const abi = [
  {
    type: "function",
    name: "milestones",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
    stateMutability: "view",
  },
];

export interface Milestone {
  title: string;
  description: string;
  amount: bigint;
  deadline: bigint;
  status: number;
}

/**
 * Fetches milestones[0..count-1] from a JobEscrow contract at jobAddress.
 */
export function useGetMilestones(
  jobAddress: string,
  count: number
){
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!jobAddress || count <= 0) {
      setMilestones([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const contract = getContract({
      address: jobAddress,
      abi: abi as any,
      chain: baseSepolia,
      client,
    });

    (async () => {
      try {
        const results: Milestone[] = [];
        for (let i = 0; i < count; i++) {
          const raw: any = await readContract({
            contract,
            method: "milestones",
            params: [BigInt(i)],
          });
          results.push({
            title: raw[0],
            description: raw[1],
            amount: raw[2] as bigint,
            deadline: raw[3] as bigint,
            status: Number(raw[4]),
          });
        }
        setMilestones(results);
      } catch (err) {
        console.error("useGetMilestones error", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobAddress, count]);

  return { milestones, isLoading, error };
}
