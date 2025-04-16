/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getContract, readContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { WorkerDashboard } from "../abis/addresses";
import { client } from "../client";
import { useAuth } from "../context/AuthContext";

const contract = getContract({
  address: WorkerDashboard,
  client,
  chain: baseSepolia,
});

interface Milestone {
  title: string;
  description: string;
  amount: string;
  deadline: number;
  status: number;
}

interface JobDetails {
  jobAddress: `0x${string}`;
  employer: `0x${string}`;
  title: string;
  description: string;
  totalPayment: string;
  status: number;
  milestoneCount: number;
  currentMilestone: number;
  milestones: Milestone[];
}

export const useWorkerJobs = () => {
  const { address, isConnected } = useAuth();

  const [myJobs, setMyJobs] = useState<`0x${string}`[]>([]);
  const [jobDetailsMap, setJobDetailsMap] = useState<
    Record<string, JobDetails>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all jobs assigned to this worker
  const fetchMyJobs = async () => {
    if (!address || !isConnected) return;
    setLoading(true);
    setError(null);
    try {
      const jobs = (await readContract({
        contract,
        method: "function getMyJobs() view returns (address[])",
      })) as `0x${string}`[];

      setMyJobs(jobs);
    } catch (err) {
      setError("Failed to load your jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch details for a specific job
  const fetchJobDetails = async (jobAddress: `0x${string}`) => {
    setLoading(true);
    setError(null);
    try {
      const job: any = await readContract({
        contract,
        method: "function getJobDetails(address) view returns (tuple)",
        params: [jobAddress],
      });
      console.log(job)

      const parsed: JobDetails = {
        jobAddress: job.jobAddress,
        employer: job.employer,
        title: job.title,
        description: job.description,
        totalPayment: job.totalPayment.toString(),
        status: Number(job.status),
        milestoneCount: Number(job.milestoneCount),
        currentMilestone: Number(job.currentMilestone),
        milestones: job.milestones.map((m: any) => ({
          title: m.title,
          description: m.description,
          amount: m.amount.toString(),
          deadline: Number(m.deadline),
          status: Number(m.status),
        })),
      };

      setJobDetailsMap((prev) => ({ ...prev, [jobAddress]: parsed }));
    } catch (err) {
      setError(`Failed to load job details for ${jobAddress}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [address]);

  return {
    myJobs,
    jobDetailsMap,
    fetchJobDetails,
    loading,
    error,
  };
};
