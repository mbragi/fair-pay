import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export interface Organization {
  id: number;
  name: string;
  description: string;
  owner: string;
  isActive: boolean;
  createdAt: number;
  isOwner: boolean;
}

export const useOrganizations = () => {
  const { address, isConnected } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    if (!isConnected || !address) return;

    setOrganizations([
      {
        id: 1,
        name: "Design Studio",
        description: "UI/UX Design Agency",
        owner: address,
        isActive: true,
        createdAt: Date.now() / 1000 - 2592000,
        isOwner: true,
      },
      {
        id: 2,
        name: "Web3 Developers",
        description: "Blockchain Team",
        owner: "0x1234567890123456789012345678901234567890",
        isActive: true,
        createdAt: Date.now() / 1000 - 5184000,
        isOwner: false,
      },
    ]);
  }, [isConnected, address]);

  return {
    organizations,
    setOrganizations,
  };
};
