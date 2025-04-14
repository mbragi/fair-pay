import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Job } from "../types/generated";

export const useJobs = (selectedOrgId: number | null) => {
 const { address } = useAuth();
 const [jobs, setJobs] = useState<Job[]>([]);

 useEffect(() => {
  if (!selectedOrgId) return;

  setJobs([
   {
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    title: "Landing Page Design",
    description: "Marketing site for our DeFi product",
    totalPayment: "0.5",
    status: 0,
    employer: address || "",
    worker: null,
    milestoneCount: 3,
    currentMilestone: 0,
    organizationId: selectedOrgId,
   },
   {
    address: "0x0987654321fedcba0987654321fedcba09876543",
    title: "Smart Contract Audit",
    description: "Security audit for token contract",
    totalPayment: "2.0",
    status: 1,
    employer: address || "",
    worker: "0x2468135790246813579024681357902468135790",
    milestoneCount: 2,
    currentMilestone: 0,
    organizationId: selectedOrgId,
   },
  ]);
 }, [selectedOrgId, address]);

 return {
  jobs,
  setJobs,
 };
};
