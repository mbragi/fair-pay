import { BigNumberish, ethers } from "ethers";
import { PlusCircle, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

/**
 * Format a BigNumberish value as ETH using ethers.js
 */
export const formatEth = (value: BigNumberish): string => {
  try {
    const etherString = ethers.utils.formatEther(value);
    const [whole, fraction = ""] = etherString.split(".");
    const padded = (fraction + "0000").slice(0, 4);
    return `${whole}.${padded} ETH`;
  } catch {
    return "0.0000 ETH";
  }
};

export function getStatusText(status: number): string {
  switch (status) {
    case 0: return "Created";
    case 1: return "In Progress";
    case 2: return "Completed";
    case 3: return "Cancelled";
    default: return "Unknown";
  }
}

export function getStatusColor(status: number): string {
  switch (status) {
    case 0: return "bg-blue-500";
    case 1: return "bg-amber-500";
    case 2: return "bg-green-500";
    case 3: return "bg-red-500";
    default: return "bg-gray-500";
  }
}

export function getStatusIcon(status: number) {
  switch (status) {
    case 0: return <PlusCircle size={16} />;
    case 1: return <Clock size={16} />;
    case 2: return <CheckCircle size={16} />;
    case 3: return <XCircle size={16} />;
    default: return <AlertTriangle size={16} />;
  }
}