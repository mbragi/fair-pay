// components/JobManagementModal.tsx
import React, { useState, useEffect } from "react";
import { formatEther } from "ethers/lib/utils";
import { useAssignWorker } from "../../hooks/useAssignWoker";
import { Job } from "../../types/generated";
import { ethers } from "ethers";
import { 
  Briefcase, 
  User, 
  CheckCircle, 
  XCircle, 
  Hourglass, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  Clock,
  Shield,
  Users,
  AlertCircle
} from "lucide-react";

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

function getStatusIcon(status: number) {
  switch (status) {
    case 0: return <PlusCircle className="text-blue-500" />;
    case 1: return <Hourglass className="text-amber-500" />;
    case 2: return <CheckCircle className="text-green-500" />;
    case 3: return <XCircle className="text-red-500" />;
    default: return <AlertCircle className="text-gray-500" />;
  }
}

const JobManagementModal: React.FC<JobManagementModalProps> = ({ isOpen, job, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<"details" | "assignWorker">("details");
  const [workerAddress, setWorkerAddress] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation after modal is mounted
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const isZero = job?.worker?.toLowerCase() === ethers?.constants?.AddressZero?.toLowerCase(); 
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

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isOpen) return null;

  const formattedPayment = formatEther(job.totalPayment.toString());
  
  // Calculate milestone progress percentage
  const milestoneProgress = (parseInt(job.currentMilestone?.toString() || '0') / parseInt(job.milestoneCount?.toString() || '1')) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div 
        className={`bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl transform transition-all duration-300 ease-in-out ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white truncate">{job.title}</h3>
                <div className="flex items-center mt-1 text-indigo-100 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> Created: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(job.status)}
            <span className="font-medium">{getStatusText(job.status)}</span>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-gray-600 mr-3">Milestone Progress:</div>
            <div className="w-40 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${milestoneProgress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{job.currentMilestone?.toString()}/{job.milestoneCount?.toString()}</span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex px-6 border-b border-gray-200">
          <button
            className={`px-4 py-3 flex items-center gap-2 font-medium transition-colors ${
              activeTab === "details" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <Shield size={18} />
            Job Details
          </button>
          <button
            className={`px-4 py-3 flex items-center gap-2 font-medium transition-colors ${
              activeTab === "assignWorker" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("assignWorker")}
          >
            <Users size={18} />
            Assign Worker
          </button>
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Description card */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Description</h4>
                <p className="text-gray-700">{job.description}</p>
              </div>
              
              {/* Job details cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Total Payment</h4>
                      <p className="text-lg font-semibold text-green-600">{formattedPayment} ETH</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Milestones</h4>
                      <p className="text-lg font-semibold">{job.milestoneCount?.toString()} total</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Worker information */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Worker Assignment</h4>
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isZero ? 'bg-amber-100' : 'bg-indigo-100'}`}>
                    <User className={isZero ? 'text-amber-600' : 'text-indigo-600'} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700 font-medium">
                        {isZero ? "No Worker Assigned" : "Worker Address"}
                      </p>
                      {!isZero && (
                        <div className="relative">
                          <button 
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <AlertCircle size={16} />
                          </button>
                          {showTooltip && (
                            <div className="absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -top-1 left-6">
                              This is the current worker's wallet address. They are responsible for completing this job.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isZero ? (
                      <button 
                        onClick={() => setActiveTab("assignWorker")}
                        className="mt-2 text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <PlusCircle size={14} /> Assign a worker now
                      </button>
                    ) : (
                      <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded truncate">
                        {job.worker}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assignWorker" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Assign Worker to Job</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Worker Wallet Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={workerAddress}
                        onChange={(e) => setWorkerAddress(e.target.value)}
                        placeholder={isZero ? "0x..." : job.worker as string}
                        className="w-full pl-10 p-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all"
                      />
                    </div>
                    
                    {/* Input validation feedback */}
                    {workerAddress && !isValidAddress && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} /> Please enter a valid Ethereum address
                      </p>
                    )}
                    
                    {isValidAddress && !isNotEmployer && (
                      <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                        <AlertCircle size={14} /> The employer cannot be assigned as the worker
                      </p>
                    )}
                    
                    {isValidAddress && isNotEmployer && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Valid worker address
                      </p>
                    )}
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error.message}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveTab("details")}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft size={18} /> Back to Details
                </button>
                
                <button
                  onClick={handleAssignWorker}
                  disabled={isAssigning || !canAssign}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${canAssign 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  {isAssigning ? (
                    <>Processing <Hourglass size={18} className="animate-pulse" /></>
                  ) : (
                    <>{isZero ? "Assign Worker" : "Reassign Worker"} <ChevronRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementModal;