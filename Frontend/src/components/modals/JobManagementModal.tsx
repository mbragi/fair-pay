// JobManagementModal.tsx
import { useState, useEffect } from "react";
import { formatEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useSetMilestones } from "../../hooks/useCreatemilestone";
import { useAssignWorker } from "../../hooks/useAssignWoker";

interface JobManagementModalProps {
  isOpen: boolean;
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

const JobManagementModal = ({ 
  isOpen, 
  job, 
  onClose, 
  onSuccess 
}: JobManagementModalProps) => {
  const [activeTab, setActiveTab] = useState<"details"|"milestones"|"assignWorker">("details");
  const [milestones, setMilestones] = useState<Array<{
    title: string;
    description: string;
    amount: string;
    deadline: Date;
  }>>([]);
  const [workerAddress, setWorkerAddress] = useState("");

  const { setMilestones: setContractMilestones, isPending: isSettingMilestones } = useSetMilestones();
  const { assignWorker, isPending: isAssigning } = useAssignWorker();

  useEffect(() => {
    if (job && job.milestoneCount) {
      const count = Number(job.milestoneCount);
      setMilestones(Array(count).fill(0).map(() => ({
        title: "",
        description: "",
        amount: "",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })));
    }
  }, [job]);

  const handleSetMilestones = async () => {
    try {
      await setContractMilestones(job.address, {
        indices: milestones.map((_, i) => i),
        titles: milestones.map(m => m.title),
        descriptions: milestones.map(m => m.description),
        amounts: milestones.map(m => m.amount),
        deadlines: milestones.map(m => m.deadline)
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to set milestones:", error);
    }
  };

  const handleAssignWorker = async () => {
    try {
      await assignWorker(job.address, workerAddress);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign worker:", error);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{job.title}</h3>
          <button onClick={onClose} className="text-gray-500">×</button>
        </div>

        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'milestones' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            Set Milestones
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'assignWorker' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('assignWorker')}
          >
            Assign Worker
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-4">
            <p className="text-gray-700">{job.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Payment</p>
                <p>{formatEther(job.totalPayment.toString())} ETH</p>
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
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="border p-4 rounded">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].title = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Amount (ETH)</label>
                    <input
                      type="text"
                      value={milestone.amount}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].amount = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].description = e.target.value;
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Deadline</label>
                    <input
                      type="date"
                      value={milestone.deadline.toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newMilestones = [...milestones];
                        newMilestones[index].deadline = new Date(e.target.value);
                        setMilestones(newMilestones);
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleSetMilestones}
              disabled={isSettingMilestones}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSettingMilestones ? 'Saving...' : 'Save Milestones'}
            </button>
          </div>
        )}

        {activeTab === 'assignWorker' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Worker Address</label>
              <input
                type="text"
                value={workerAddress}
                onChange={(e) => setWorkerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAssignWorker}
              disabled={isAssigning || !workerAddress}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isAssigning ? 'Assigning...' : 'Assign Worker'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function getStatusText(status: number): string {
  switch(status) {
    case 0: return "Created";
    case 1: return "In Progress";
    case 2: return "Completed";
    case 3: return "Cancelled";
    default: return "Unknown";
  }
}

export default JobManagementModal;