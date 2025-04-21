// components/JobCard.tsx
import { motion } from "framer-motion";
import { CheckCircle, Briefcase,DollarSign } from "lucide-react";
import ConfirmJobButton from "./ConfirmJobButton";

interface JobCardProps {
  job: {
    address: string;
    title: string;
    description: string;
    status: string;
    worker: string;
    workerConfirmed: boolean;
    totalPayment?: string;
    currentMilestone?: number;
    milestoneCount?: number;
  };
  currentAddress: string;
  onClick?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentAddress, onClick }) => {
  const isAssignedToMe = job.worker.toLowerCase() === currentAddress.toLowerCase();
  const canConfirm = isAssignedToMe && !job.workerConfirmed && job.status === "Created";

  // Helper function to get progress percentage
  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.05)" }}
      className={`p-4 cursor-pointer transition-all`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 truncate">
          {job.title}
        </h3>
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            job.status === "Completed"
              ? "bg-green-100 text-green-800 border-green-200"
              : job.status === "InProgress"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : job.status === "Created"
              ? "bg-purple-100 text-purple-800 border-purple-200"
              : job.status === "Disputed"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {job.status}
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {job.description}
      </p>

      <div className="mt-2">
        <div className="text-sm text-gray-600 flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-green-500" />
          <span>{job.totalPayment || "0"} ETH</span>
        </div>
        
        {job.currentMilestone !== undefined && job.milestoneCount !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">
                Progress: {job.currentMilestone}/{job.milestoneCount}
              </span>
              <span className="text-xs text-gray-600">
                {getProgressPercentage(job.currentMilestone, job.milestoneCount)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${getProgressPercentage(
                    job.currentMilestone,
                    job.milestoneCount
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {canConfirm && (
        <div className="mt-4">
          <ConfirmJobButton 
            jobAddress={job.address} 
            onSuccess={() => {
              // You might want to add a notification here
              console.log("Job confirmed successfully!");
            }} 
          />
        </div>
      )}

      {job.workerConfirmed && (
        <div className="mt-2 flex items-center text-green-500 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          Job confirmed
        </div>
      )}
    </motion.div>
  );
};

export default JobCard;