/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useGetMilestones.ts
import { useState, useEffect, useCallback } from "react";
import { readContract, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import abi from "../abis/JobEscrow.json";

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
export function useGetMilestones(jobAddress: string, count: number) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchMilestones = useCallback(async () => {
    if (!jobAddress || count <= 0) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const contract = getContract({
      address: jobAddress,
      abi: abi.abi as any,
      chain: baseSepolia,
      client,
    });

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
  }, [jobAddress, count]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return { milestones, isLoading, error, refetch: fetchMilestones };
}
