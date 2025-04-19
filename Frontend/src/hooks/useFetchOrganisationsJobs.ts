/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useReadContract,  } from "thirdweb/react";
import { readContract } from "thirdweb"
import { OrganizationManager } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { Job } from "../types/generated";
import organizationManagerAbi from "../abis/OrganizationManager.json";
import jobEscrowAbi from "../abis/JobEscrow.json";

export const useFetchOrganizationJobs = (orgId: number) => {
  const [jobsData, setJobsData] = useState<Array<Job>>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  const contract = getContract({
    address: OrganizationManager,
    chain: baseSepolia,
    client,
    abi: organizationManagerAbi.abi as any,
  });


  const { data:jobAddresses, isLoading: addressesLoading, error: addressesError, refetch } = useReadContract({
    contract,
    method: "getOrganizationJobs",
    params: [BigInt(orgId)],
  });
  

  
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobAddresses || jobAddresses.length === 0) {
        setJobsData([]); 
        return;
      }
    
      setIsLoadingDetails(true);
      try {
        const detailPromises = jobAddresses.map(async (address: string) => {
          const jobContract = getContract({
            address,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi.abi as any,
          });
    
          const details = await readContract({
            contract: jobContract,
            method: "getJobDetails",
          });
    
         
          return {
            address,
            employer: details[0],
            worker: details[1],
            title: details[2],
            description: details[3],
            totalPayment: details[4],
            status: details[5],
            milestoneCount: details[6],
            currentMilestone: details[7]
          };
        });
    
        const results = await Promise.all(detailPromises);
        setJobsData(results);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchJobDetails();
  }, [jobAddresses]);



  const isLoading = addressesLoading || isLoadingDetails;

  return {
    data: jobsData,
    jobAddresses,
    isLoading,
    error: addressesError,
    refetch,
  };
};
