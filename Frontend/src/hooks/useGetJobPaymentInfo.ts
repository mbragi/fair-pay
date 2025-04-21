import { useState, useEffect } from "react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, readContract } from "thirdweb";
import { FairPayCore } from "../abis/addresses";
import FairPayCoreAbi from "../abis/FairPayCore.json";
import { client } from "../client";

/**
 * Payment information for a given job.
 */
export interface JobPaymentInfo {
  token: string;
  totalPayment: bigint;
  paidAmount: bigint;
  remainingAmount: bigint;
}

/**
 * Hook to fetch payment details from FairPayCore for a specific job address.
 */
export function useGetJobPaymentInfo(jobAddress: string) {
  const [paymentInfo, setPaymentInfo] = useState<JobPaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!jobAddress) return;
    setIsLoading(true);
    (async () => {
      try {
        const core = getContract({
          address: FairPayCore,
          chain: baseSepolia,
          client,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          abi: FairPayCoreAbi.abi as any,
        });
        const [token, totalPayment, paidAmount, remainingAmount] =
          (await readContract({
            contract: core,
            method: "getJobPaymentInfo",
            params: [jobAddress],
          })) as [string, bigint, bigint, bigint];

        setPaymentInfo({ token, totalPayment, paidAmount, remainingAmount });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [jobAddress]);

  return { paymentInfo, isLoading, error };
}
