/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import JobEscrowAbi from "@abis/JobEscrow.json";
import { useAuth } from "@context/AuthContext";
import { client } from "../../client";
import { useGetWorkerJobDetails } from "./useGetWorkerJobDetails";
import { useGetMilestones, Milestone } from "@hooks/milestone/useGetMilestones";
import { useGetJobPaymentInfo } from "@hooks/job/useGetJobPaymentInfo";

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
        address: selectedJob as `0x${string}`,
        chain: BLOCKCHAIN_CONFIG.defaultChain,
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
    tokenSymbol,
    tokenName,
    tokenLoading,
    tokenError,
  } = useGetJobPaymentInfo(selectedJob ?? "");

  // 8) milestone submission
  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const submitMilestone = async (index: number) => {
    if (!selectedJob) return;
    const ctr = getContract({
      address: selectedJob,
      chain: BLOCKCHAIN_CONFIG.defaultChain,
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
