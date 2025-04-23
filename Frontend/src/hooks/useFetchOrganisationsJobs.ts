/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useReadContract } from "thirdweb/react";
import { readContract, getContract } from "thirdweb";
import { OrganizationManager } from "../abis/addresses";
import organizationManagerAbi from "../abis/OrganizationManager.json";
import jobEscrowAbi from "../abis/JobEscrow.json";
import { baseSepolia } from "thirdweb/chains";
import { client } from "../client";
import { Job } from "../types/generated";

export const useFetchOrganizationJobs = (orgId: number) => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 1) read just the array of jobAddresses
  const managerContract = getContract({
    address: OrganizationManager,
    chain: baseSepolia,
    client,
    abi: organizationManagerAbi.abi as any,
  });
  const {
    data: jobAddresses,
    isLoading: addressesLoading,
    error: addressesError,
    refetch: refetchAddresses,
  } = useReadContract({
    contract: managerContract,
    method: "getOrganizationJobs",
    params: [BigInt(orgId)],
  });

  // 2) fetch full details for each address
  const fetchJobDetails = useCallback(
    async (addresses: string[]) => {
      if (!addresses || addresses.length === 0) {
        setJobsData([]);
        return;
      }

      setIsLoadingDetails(true);
      try {
        const detailPromises = addresses.map(async (address) => {
          const jobContract = getContract({
            address,
            chain: baseSepolia,
            client,
            abi: jobEscrowAbi.abi as any,
          });

          const raw = await readContract({
            contract: jobContract,
            method: "getJobDetails",
          });

          return {
            address,
            employer: raw[0] as string,
            worker: raw[1] as string,
            title: raw[2] as string,
            description: raw[3] as string,
            totalPayment: raw[4] as any,
            status: raw[5] as any,
            milestoneCount: raw[6] as any,
            currentMilestone: raw[7] as any,
          } as Job;
        });

        const results = await Promise.all(detailPromises);
        setJobsData(results);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    []
  );

  // auto-fetch details whenever the addresses array changes
  useEffect(() => {
    if (jobAddresses) {
      // cast to string[]
      fetchJobDetails(jobAddresses as string[]);
    } else {
      setJobsData([]);
    }
  }, [jobAddresses, fetchJobDetails]);

  // 3) two ways to re-run:
  // — refetch(): rerun the on-chain addresses call (and then auto-fetch details)
  const refetch = useCallback(() => {
    return refetchAddresses();
  }, [refetchAddresses]);

  // — refetchDetails(): rerun only the detail fetch on existing addresses
  const refetchDetails = useCallback(() => {
    if (jobAddresses) {
      fetchJobDetails(jobAddresses as string[]);
    }
  }, [jobAddresses, fetchJobDetails]);

  return {
    data: jobsData,
    jobAddresses,
    isLoading: addressesLoading || isLoadingDetails,
    error: addressesError,
    refetch,
    refetchDetails,
  };
};
