/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useIsJobFunded.ts
import { useState, useEffect, useCallback } from "react";
import { readContract, getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import abi from "../abis/FairPayCore.json";

export function useIsJobFunded(jobAddress: string) {
  const [isFunded, setIsFunded] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchIsFunded = useCallback(async () => {
    if (!jobAddress) {
      setIsFunded(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = getContract({
        address: jobAddress,
        abi: abi.abi as any,
        chain: baseSepolia,
        client,
      });

      const result: boolean = await readContract({
        contract,
        method: "isJobFunded",
        params: [jobAddress],
      });

      setIsFunded(result);
    } catch (err) {
      console.error("useIsJobFunded error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [jobAddress]);

  useEffect(() => {
    fetchIsFunded();
  }, [fetchIsFunded]);

  return { isFunded, isLoading, error, refetch: fetchIsFunded };
}
