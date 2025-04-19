/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { FairPayCore } from "../abis/addresses";
import { ethers } from "ethers";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";
import { Job, Milestone } from "../types/generated";
import FairPay from "../abis/FairPayCore.json"


const contract = getContract({
  address: FairPayCore,
  chain: baseSepolia,
  client,
  abi: FairPay.abi as any,
});

const JobEscrow = getContract({
  address:  FairPayCore,
  chain: baseSepolia,
  client,

});

export const useServiceProvider = () => {
  const { address, isConnected } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendTx, isPending } = useSendTransaction();


  // _________________📤 WRITE METHODS____________________________

  const confirmJob = async (jobAddress: string) => {
    const tx= prepareContractCall({
      contract,
      method: "function confirmJob()",
      params: [],
    });
    await sendTx(tx);
    await fetchJobDetails(jobAddress)
}


  const submitMilestone = async (jobAddress: string, milestoneIndex: number) => {
   const tx = prepareContractCall({
       contract,
      method: "function submitMilestone(uint256)",
      params: [BigInt(milestoneIndex)],
    });
    await sendTx(tx);
    await fetchJobDetails(jobAddress); 
  };






  //________________________ 📥 READ METHODS__________________________
  
  const fetchAssignedJobs = async () => {
    setLoading(true);
    try {
      const jobAddresses = await readContract({
        contract,
        method: "function getWorkerJobs(address) returns (address[])",
        params: [address ?? "0x0"],
      });

      console.log("Assigned jobs:", jobAddresses);

      const jobsData: Job[] = await Promise.all(
        jobAddresses.map(async (address: string) => {
          const jobEscrow = getContract({
            address,
            abi: JobEscrow.abi as any,
            chain: baseSepolia,
            client,
          });

          const [
            employer,
            worker,
            title,
            description,
            totalPayment,
            status,
            milestoneCount,
            currentMilestone,
          ] = await readContract({
            contract: jobEscrow,
            method: "function getJobDetails() returns (address,address,string,string,uint256,uint8,uint256,uint256)",
            params: [],
          });

          return {
            address,
            worker,
            employer,
            title,
            description,
            totalPayment: ethers.utils.formatEther(totalPayment),
            status: ['Created', 'InProgress', 'Completed', 'Cancelled'][status],
            currentMilestone: Number(currentMilestone),
            milestoneCount: Number(milestoneCount),
          } as unknown as Job;
        })
      );

      setJobs(jobsData as Job[]);
      if (jobsData.length > 0 && !selectedJob) {
        setSelectedJob(jobsData[0].address);
      }
    } catch (err) {
      console.error("Failed to fetch assigned jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async (jobAddress: string) => {
    const jobEscrow = getContract({
      address: jobAddress,
      abi: JobEscrow.abi as any,
      chain: baseSepolia,
      client,
    });
    setLoading(true);
    try {
      

      const [
        employer,
        worker,
        title,
        description,
        totalPayment,
        status,
        milestoneCount,
        currentMilestone,
      ] = await readContract({
        contract: jobEscrow,
        method: "function getJobDetails() returns (address,address,string,string,uint256,uint8,uint256,uint256)",
        params: [],
      });

      // Get milestones
      const [
        milestoneTitles,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDeadlines,
        milestoneStatuses,
      ] = await readContract({
        contract: jobEscrow,
        method: "function getAllMilestones() returns (string[],string[],uint256[],uint256[],uint8[])",
        params: [],
      });

      const formattedMilestones = milestoneTitles.map((title: string, i: number) => ({
        title,
        description: milestoneDescriptions[i],
        amount: ethers.utils.formatEther(milestoneAmounts[i]),
        deadline: new Date(Number(milestoneDeadlines[i]) * 1000).toISOString().split('T')[0],
        status: ['NotStarted', 'InProgress', 'Completed', 'Disputed'][Number(milestoneStatuses[i])] as unknown as Milestone['status'],
      }));

      setJobDetails({
        employer,
        worker,
        title,
        description,
        totalPayment: ethers.utils.formatEther(totalPayment),
        status: ['Created', 'InProgress', 'Completed', 'Cancelled'][status],
        currentMilestone: Number(currentMilestone),
        milestoneCount: Number(milestoneCount),
      });

      setMilestones(formattedMilestones);
    } catch (err) {
      console.error("Failed to fetch job details", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto fetch on connect and job selection change
  useEffect(() => {
    if (isConnected && address) {
      fetchAssignedJobs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  useEffect(() => {
    if (selectedJob) {
      fetchJobDetails(selectedJob);
    }
  }, [selectedJob]);

  return {
    jobs,
    selectedJob,
    setSelectedJob,
    jobDetails,
    milestones,
    loading,
    isPending,

    // exposed methods
    confirmJob,
    submitMilestone,
    fetchAssignedJobs,
    fetchJobDetails,
  };
};