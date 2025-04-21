/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import JobEscrowAbi from "../abis/JobEscrow.json";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";
import { useGetWorkerJobDetails } from "./useGetWorkerJobDetails";
import { useGetMilestones, Milestone } from "./useGetMilestones";
import { useGetJobPaymentInfo } from "./useGetJobPaymentInfo";

interface JobSummary {
  employer: string;
  worker: string;
  title: string;
  description: string;
  totalPayment: number;
  status: string;
  num_of_milestones: number;
  currentMilestoneIndex: number;
}

// Hard‑coded Sepolia Blockscout API endpoint
const BLOCKSCOUT_API_URL = "https://eth-sepolia.blockscout.com/api";

export function useServiceProvider() {
  const { address = "" } = useAuth();

  // 1) fetch assigned jobs
  const {
    jobDetails: jobs,
    isLoading: loading,
    error,
  } = useGetWorkerJobDetails(address);

  // 2) track selected job
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedJob && jobs.length > 0) {
      setSelectedJob(jobs[0].address);
    }
  }, [jobs, selectedJob]);

  // 3) load job summary
  const [jobSummary, setJobSummary] = useState<JobSummary | null>(null);
  useEffect(() => {
    if (!selectedJob) {
      setJobSummary(null);
      return;
    }
    (async () => {
      const ctr = getContract({
        address: selectedJob,
        chain: baseSepolia,
        client,
        abi: JobEscrowAbi.abi as any,
      });
      const raw = (await readContract({
        contract: ctr,
        method: "getJobDetails",
      })) as any[];

      const [
        employer,
        worker,
        title,
        description,
        totalPayment,
        status,
        num_of_milestones,
        currentMilestoneIndex,
      ] = raw;

      setJobSummary({
        employer,
        worker,
        title,
        description,
        totalPayment: Number(totalPayment),
        status: status.toString(),
        num_of_milestones: Number(num_of_milestones),
        currentMilestoneIndex: Number(currentMilestoneIndex),
      });
    })();
  }, [selectedJob]);

  // 4) fetch milestones
  const {
    milestones,
    isLoading: loadingMilestones,
    error: milestonesError,
  } = useGetMilestones(selectedJob ?? "", jobSummary?.num_of_milestones ?? 0);

  // 5) compute progress %
  const progress = useMemo(() => {
    if (!jobSummary || jobSummary.num_of_milestones === 0) return 0;
    return Math.round(
      (jobSummary.currentMilestoneIndex / jobSummary.num_of_milestones) * 100
    );
  }, [jobSummary]);

  const currentMilestone: Milestone | null = useMemo(() => {
    if (!jobSummary || jobSummary.currentMilestoneIndex >= milestones.length)
      return null;
    return milestones[jobSummary.currentMilestoneIndex];
  }, [milestones, jobSummary]);

  // 6) fetch payment info from FairPayCore
  const {
    paymentInfo,
    error: paymentInfoError,
    isLoading: paymentInfoLoading,
  } = useGetJobPaymentInfo(selectedJob ?? "");

  // 7) fetch token metadata via Blockscout
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
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

    const url = `${BLOCKSCOUT_API_URL}?module=token&action=getToken&contractaddress=${tokenAddr}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "1" || !data.result) {
          throw new Error(data.message || "Blockscout token lookup failed");
        }
        setTokenSymbol(data.result.symbol);
        setTokenName(data.result.name);
      })
      .catch((err) => {
        console.error("Blockscout token error:", err);
        setTokenError(err);
      })
      .finally(() => setTokenLoading(false));
  }, [paymentInfo?.token]);

  // 8) milestone submission
  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const submitMilestone = async (index: number) => {
    if (!selectedJob) return;
    const ctr = getContract({
      address: selectedJob,
      chain: baseSepolia,
      client,
      abi: JobEscrowAbi.abi as any,
    });
    const tx = prepareContractCall({
      contract: ctr,
      method: "completeMilestone",
      params: [BigInt(index)],
    });
    return sendTx(tx);
  };

  return {
    // jobs
    jobs,
    loading,
    error,

    // selection
    selectedJob,
    setSelectedJob,

    // summary & milestones
    jobSummary,
    milestones,
    loadingMilestones,
    milestonesError,
    progress,
    currentMilestone,

    // actions
    submitMilestone,
    isPending,

    // payment info
    paymentInfo,
    paymentInfoError,
    paymentInfoLoading,

    // token metadata
    tokenSymbol,
    tokenName,
    tokenLoading,
    tokenError,

  };
}
