// useFetchOrganizationJobs.ts
import { useEffect,useState } from "react";
import { useReadContract,  } from "thirdweb/react";
import { readContract } from "thirdweb"
import { OrganizationManager, WorkerDashboard } from "../abis/addresses";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { jobEscrowAbi,organizationManagerAbi } from "../abis/jobEscrowAbi";


export const useFetchOrganizationJobs = (orgId: number) => {
  const [jobsData, setJobsData] = useState<Array<any>>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  

  
  const contract = getContract({
    address: OrganizationManager,
    chain: baseSepolia,
    client,
    abi: organizationManagerAbi,
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
            abi: jobEscrowAbi,
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
