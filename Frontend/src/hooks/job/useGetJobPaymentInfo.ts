import { useState, useEffect } from "react";
import { getContract, readContract } from "thirdweb";
import { FairPayCore } from "@abis/addresses";
import FairPayCoreAbi from "@abis/FairPayCore.json";
import { client } from "../../client";
import { BLOCKCHAIN_CONFIG } from "@constants/config";

/**
 * Payment information for a given job.
 */
export interface JobPaymentInfo {
  token: string;
  totalPayment: bigint;
  paidAmount: bigint;
  remainingAmount: bigint;
}
const BLOCKSCOUT_API_URL = "https://base-sepolia.blockscout.com/api";

/**
 * Hook to fetch payment details from FairPayCore for a specific job address.
 */
export function useGetJobPaymentInfo(jobAddress: string) {
  const [paymentInfo, setPaymentInfo] = useState<JobPaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // 7) fetch token metadata via Blockscout
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  // decimals are not used in the UI, but we can fetch them if needed
  const [tokenDecimals, setTokenDecimals] = useState<number>(0);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<Error | null>(null);

  useEffect(() => {
    const tokenAddr = paymentInfo?.token;
    if (!tokenAddr) {
      setTokenSymbol("");
      setTokenName("");
      return;
    }

    setTokenLoading(true);
    setTokenError(null);
    console.log("Fetching token data from Blockscout for address:", tokenAddr);
    const url = `${BLOCKSCOUT_API_URL}?module=token&action=getToken&contractaddress=${tokenAddr}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "1" || !data.result) {
          throw new Error(data.message || "Blockscout token lookup failed");
        }
        setTokenSymbol(data.result.symbol);
        setTokenName(data.result.name);
        setTokenDecimals(data.result.decimals);
      })
      .catch((err) => {
        console.error("Blockscout token error:", err);
        setTokenError(err);
      })
      .finally(() => setTokenLoading(false));
  }, [paymentInfo?.token]);

  useEffect(() => {
    if (!jobAddress) return;
    setIsLoading(true);
    (async () => {
      try {
        const core = getContract({
          address: FairPayCore,
          chain: BLOCKCHAIN_CONFIG.defaultChain,
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

  return {
    paymentInfo,
    isLoading,
    error,
    tokenSymbol,
    tokenName,
    tokenLoading,
    tokenError,
    tokenDecimals,
  };
}
