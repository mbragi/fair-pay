/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { FairPayCore } from "../abis/addresses";
import FairPayCoreAbi from "../abis/FairPayCore.json";
import JobEscrowAbi from "../abis/JobEscrow.json";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";
import { useGetWorkerJobDetails } from "./useGetWorkerJobDetails";
import { useGetMilestones, Milestone } from "./useGetMilestones";

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

  const {
    jobDetails: jobs,
    isLoading: loading,
    error,
  } = useGetWorkerJobDetails(address);

  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedJob && jobs.length > 0) {
      setSelectedJob(jobs[0].address);
    }
  }, [jobs, selectedJob]);

  const [jobSummary, setJobSummary] = useState<JobSummary | null>(null);
  useEffect(() => {
    if (!selectedJob) {
      setJobSummary(null);
      return;
    }
    (async () => {
      const jobCtr = getContract({
        address: selectedJob,
        chain: baseSepolia,
        client,
        abi: JobEscrowAbi.abi as any,
      });

      const raw = (await readContract({
        contract: jobCtr,
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

  const {
    milestones,
    isLoading: loadingMilestones,
    error: milestonesError,
  } = useGetMilestones(selectedJob ?? "", jobSummary?.num_of_milestones ?? 0);

  const progress = useMemo(() => {
    if (!jobSummary || jobSummary.num_of_milestones === 0) return 0;
    return Math.round(
      (jobSummary.currentMilestoneIndex / jobSummary.num_of_milestones) * 100
    );
  }, [jobSummary]);

  const currentMilestone: Milestone | null = useMemo(() => {
    if (!jobSummary || jobSummary.currentMilestoneIndex >= milestones.length) {
      return null;
    }
    return milestones[jobSummary.currentMilestoneIndex];
  }, [milestones, jobSummary]);

  const { mutateAsync: sendTx, isPending } = useSendTransaction();
  const submitMilestone = async (index: number) => {
    if (!selectedJob) return;
    const core = getContract({
      address: FairPayCore,
      chain: baseSepolia,
      client,
      abi: FairPayCoreAbi.abi as any,
    });
    const tx = prepareContractCall({
      contract: core,
      method: "submitMilestone(uint256)",
      params: [BigInt(index)],
    });
    return sendTx(tx);
  };

  return {
    jobs,
    loading,
    error,
    selectedJob,
    setSelectedJob,
    jobSummary,
    milestones,
    loadingMilestones,
    milestonesError,
    progress,
    currentMilestone,
    submitMilestone,
    isPending,
  };
}
