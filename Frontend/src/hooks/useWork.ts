import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Job } from "../types/generated";

export const useMyWork = () => {
  const { address, isConnected } = useAuth();
  const [myWork, setMyWork] = useState<Job[]>([]);

  useEffect(() => {
    if (!isConnected || !address) return;

    setMyWork([
      {
        address: "0x13579024681357902468135790246813579abcde",
        title: "NFT Website",
        description: "Website for an NFT collection",
        totalPayment: "0.001",
        status: 1,
        employer: "0x9876543210abcdef9876543210abcdef98765432",
        worker: address,
        milestoneCount: 4,
        currentMilestone: 1,
        organizationId: 1,
      },
    ]);
  }, [isConnected, address]);

  return {
    myWork,
    setMyWork,
  };
};
