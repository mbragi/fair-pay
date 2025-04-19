// components/JobManagementModal.tsx
import React, { useState } from "react";
import { formatEther } from "ethers/lib/utils";

import { useAssignWorker } from "../../hooks/useAssignWoker";
import { Job } from "../../types/generated";
import { ethers } from "ethers";

interface JobManagementModalProps {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

function getStatusText(status: number): string {
  switch (status) {
    case 0: return "Created";
    case 1: return "In Progress";
    case 2: return "Completed";
    case 3: return "Cancelled";
    default: return "Unknown";
  }
}

const JobManagementModal: React.FC<JobManagementModalProps> = ({ isOpen, job, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<"details" | "assignWorker">("details");
  const [workerAddress, setWorkerAddress] = useState("");

  const isZero = job?.worker?.toLowerCase() === ethers.constants.AddressZero?.toLowerCase();
  const isValidAddress = ethers.utils.isAddress(workerAddress);
  const isNotEmployer = workerAddress.toLowerCase() !== job?.employer?.toLowerCase();
  const canAssign = isValidAddress && isNotEmployer;

  const { assignWorker, isPending: isAssigning, error } = useAssignWorker();

const handleAssignWorker = async () => {
    try {

      await assignWorker(job.address, workerAddress);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to assign worker:", err);
    }
};

  if (!isOpen) return null;

  const formattedPayment = formatEther(job.totalPayment.toString());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold truncate">{job.title}</h3>
          <button onClick={onClose} className="text-gray-500">×</button>
        </header>

        <nav className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "assignWorker" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("assignWorker")}
          >
            Assign Worker
          </button>
        </nav>

        {activeTab === "details" && (
          <div className="space-y-4">
            <p className="text-gray-700 truncate">{job.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Payment</p>
                <p>{formattedPayment} ETH</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p>{getStatusText(job.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Milestones</p>
                <p>{job.milestoneCount.toString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Milestone</p>
                <p>{job.currentMilestone.toString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Worker</p>
              <p className="truncate">{isZero ? "Unassigned" : job.worker}</p>
            </div>
          </div>
        )}
        {activeTab === "assignWorker" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Worker Address</label>
              <input
                type="text"
                value={workerAddress}
                onChange={(e) => setWorkerAddress(e.target.value)}
                placeholder={isZero ? "0x…" : job.worker as string}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAssignWorker}
              disabled={isAssigning || !canAssign}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isAssigning ? "Assigning…" : isZero ? "Assign Worker" : "Reassign Worker"}
            </button>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManagementModal;

