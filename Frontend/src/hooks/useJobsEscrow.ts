/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../client";
import { useAuth } from "../context/AuthContext";
import { FairPayCore } from "../abis/addresses";
import { formatEther } from "viem";

interface Milestone {
  title: string;
  description: string;
  amount: string;
  deadline: number;
  status: number;
}

interface Job {
  address: string;
  title: string;
  description: string;
  totalPayment: string;
  status: number;
  employer: string;
  worker: string | null;
  milestoneCount: number;
  currentMilestone: number;
  milestones?: Milestone[];
}

export const useJobs = (selectedOrgId: number | null) => {
  const { address } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { mutateAsync: sendTx, isPending } = useSendTransaction();

  // 📦 Write: Create Job
  const createJob = async (
    orgId: number,
    title: string,
    description: string,
    totalPaymentEth: string,
    milestoneCount: number,
    tokenAddress: string
  ) => {
    const paymentWei = BigInt(parseFloat(totalPaymentEth) * 1e18);

    const tx = prepareContractCall({
      contract,
      method:
        "function createJob(uint256,string,string,uint256,uint256,address) returns (address)",
      params: [
        BigInt(orgId),
        title,
        description,
        paymentWei,
        BigInt(milestoneCount),
        tokenAddress,
      ],
    });

    await sendTx(tx);
  };

  // 💸 Write: Withdraw Platform Fees
  const withdrawFees = async (tokenAddress: string) => {
    const tx = prepareContractCall({
      contract,
      method: "function withdrawFees(address)",
      params: [tokenAddress],
    });

    return await sendTx(tx);
  };

  // 📖 Read: Get Jobs by Worker (or fallback to mock if orgId present)
  const fetchWorkerJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!address) throw new Error("No wallet address");

      const jobsResult: any = await readContract({
        contract,
        method: "function getWorkerJobDetails(address)",
        params: [address],
      });
     
     console.log(jobsResult)

      const structuredJobs: Job[] = (jobsResult?.[0] || []).map(
        (addr: string, i: number) => ({
          address: addr,
          title: jobsResult[1][i],
          description: jobsResult[2][i],
          totalPayment: formatEther(BigInt(jobsResult[3][i])),
          status: Number(jobsResult[4][i]),
          employer: "", // Not returned here
          worker: address,
          milestoneCount: 0,
          currentMilestone: 0,
        })
      );

      setJobs(structuredJobs);
    } catch (err) {
      setError("Failed to load jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedOrgId) return;
    fetchWorkerJobs(); // or fetchOrganizationJobs(selectedOrgId)
  }, [selectedOrgId]);

  return {
    jobs,
    setJobs,
    loading,
    error,
    isPending,
    createJob,
    withdrawFees,
    refetch: fetchWorkerJobs,
  };
};
