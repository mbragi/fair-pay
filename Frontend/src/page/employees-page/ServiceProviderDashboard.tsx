import React, { useState, useEffect } from "react";
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useWriteContract,
} from "../../../node_modules/wagmi/dist/types/exports";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";

interface Job {
  address: `0x${string}`;
  employer: string;
  worker: string;
  title: string;
  totalPayment: string;
  status: string;
  currentMilestone: number;
  milestoneCount: number;
}

interface JobDetails {
  employer: string;
  worker: string;
  title: string;
  description: string;
  totalPayment: string;
  status: string;
  currentMilestone: number;
  milestoneCount: number;
}

interface Milestone {
  title: string;
  description: string;
  amount: string;
  deadline: string;
  status: string;
}

// Sample ABI - replace with actual ABI
const JobEscrowABI = [];

const ServiceProviderDashboard = () => {
  // Wagmi hooks
  const { address: account, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // State
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<`0x${string}` | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all jobs assigned to this worker
  useEffect(() => {
    if (isConnected && account) {
      fetchAssignedJobs(account);
    }
  }, [isConnected, account]);

  // When active job changes, fetch its details
  useEffect(() => {
    if (activeJob && walletClient) {
      loadJobDetails();
    }
  }, [activeJob, walletClient]);

  const fetchAssignedJobs = async (workerAddress: `0x${string}`) => {
    setLoading(true);
    try {
      // For demo purposes, using mock data
      const mockJobs: Job[] = [
        {
          address:
            "0x123456789abcdef123456789abcdef123456789a" as `0x${string}`,
          employer: "0xabcdef123456789abcdef123456789abcdef1234",
          worker: workerAddress,
          title: "Website Redesign for TechCorp",
          totalPayment: "2.5",
          status: "InProgress",
          currentMilestone: 1,
          milestoneCount: 4,
        },
        {
          address:
            "0x987654321fedcba987654321fedcba987654321f" as `0x${string}`,
          employer: "0xfedcba987654321fedcba987654321fedcba9876",
          worker: workerAddress,
          title: "Logo Design for StartupX",
          totalPayment: "0.8",
          status: "Created",
          currentMilestone: 0,
          milestoneCount: 2,
        },
        {
          address: "0xaabbcc112233445566778899aabbcc112233445" as `0x${string}`,
          employer: "0x112233445566778899aabbcc112233445566778",
          worker: workerAddress,
          title: "Smart Contract Audit",
          totalPayment: "3.2",
          status: "Completed",
          currentMilestone: 2,
          milestoneCount: 3,
        },
      ];

      setAssignedJobs(mockJobs);
      // Auto-select the first job for the mockup
      setActiveJob(mockJobs[0].address);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load assigned jobs");
    }
    setLoading(false);
  };

  const loadJobDetails = async () => {
    if (!activeJob) return;

    try {
      setLoading(true);

      // Mock job details for the demo
      const mockJobDetails: JobDetails = {
        employer: "0xabcdef123456789abcdef123456789abcdef1234",
        worker: account as string,
        title: "Website Redesign for TechCorp",
        description:
          "Complete redesign of TechCorp's corporate website. The project includes UI/UX design, frontend development, and integration with their existing CMS system.",
        totalPayment: "2.5",
        status: "InProgress",
        currentMilestone: 1,
        milestoneCount: 4,
      };

      const mockMilestones: Milestone[] = [
        {
          title: "UI/UX Design",
          description: "Create wireframes and design mockups for all pages",
          amount: "0.5",
          deadline: "2025-04-20",
          status: "Completed",
        },
        {
          title: "Frontend Development",
          description: "Implement the approved designs with responsive layout",
          amount: "0.8",
          deadline: "2025-05-05",
          status: "InProgress",
        },
        {
          title: "CMS Integration",
          description:
            "Connect the frontend with the existing content management system",
          amount: "0.7",
          deadline: "2025-05-20",
          status: "NotStarted",
        },
        {
          title: "Testing and Launch",
          description: "Perform cross-browser testing and deploy to production",
          amount: "0.5",
          deadline: "2025-06-01",
          status: "NotStarted",
        },
      ];

      setJobDetails(mockJobDetails);
      setMilestones(mockMilestones);
      setLoading(false);
    } catch (err) {
      console.error("Error loading job details:", err);
      setError("Failed to load job details");
      setLoading(false);
    }
  };

  const confirmJob = async () => {
    if (!activeJob) return;

    try {
      setLoading(true);
      // Mock confirmation for demo
      const updatedDetails = {
        ...jobDetails,
        status: "InProgress",
      } as JobDetails;
      setJobDetails(updatedDetails);
      setLoading(false);
    } catch (err) {
      console.error("Error confirming job:", err);
      setError("Failed to confirm job");
      setLoading(false);
    }
  };

  const submitMilestone = async (milestoneIndex: number) => {
    if (!activeJob) return;

    try {
      setLoading(true);
      // Mock submission for demo
      const updatedMilestones = [...milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        status: "Completed",
      };
      setMilestones(updatedMilestones);

      // Update current milestone if applicable
      if (jobDetails && jobDetails.currentMilestone === milestoneIndex) {
        setJobDetails({
          ...jobDetails,
          currentMilestone: milestoneIndex + 1,
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error submitting milestone:", err);
      setError("Failed to submit milestone");
      setLoading(false);
    }
  };

  const autoResolveDispute = async (milestoneIndex: number) => {
    if (!activeJob) return;

    try {
      setLoading(true);
      // Mock resolution for demo
      const updatedMilestones = [...milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        status: "Completed",
      };
      setMilestones(updatedMilestones);
      setLoading(false);
    } catch (err) {
      console.error("Error resolving dispute:", err);
      setError("Failed to resolve dispute");
      setLoading(false);
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "InProgress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "Disputed":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Helper function to get progress percentage
  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className=" mx-auto p-6 bg-gradient-to-r from-indigo-50 to-blue-50 ">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">
        Service Provider Dashboard
      </h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-center mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
          <div className="flex">
            <div className="py-1">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Connected Account
            </h2>
            <p className="text-sm font-mono text-gray-500">{account}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 bg-indigo-600">
              <h2 className="text-xl font-semibold text-white">
                My Assigned Jobs
              </h2>
            </div>

            {assignedJobs.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500">No jobs assigned yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {assignedJobs.map((job) => (
                  <div
                    key={job.address}
                    className={`p-4 cursor-pointer transition-colors hover:bg-indigo-50 ${
                      activeJob === job.address
                        ? "bg-indigo-100 border-l-4 border-indigo-600"
                        : ""
                    }`}
                    onClick={() => setActiveJob(job.address)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">{job.title}</h3>
                      {getStatusIcon(job.status)}
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Payment:</span>{" "}
                        {job.totalPayment} ETH
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">
                            Progress: {job.currentMilestone}/
                            {job.milestoneCount}
                          </span>
                          <span className="text-xs text-gray-600">
                            {getProgressPercentage(
                              job.currentMilestone,
                              job.milestoneCount
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(
                                job.currentMilestone,
                                job.milestoneCount
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {jobDetails ? (
            <div className="space-y-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 bg-indigo-600 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Job Details
                  </h2>
                  <div className="px-3 py-1 bg-white rounded-full text-indigo-600 text-sm font-medium">
                    {jobDetails.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {jobDetails.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{jobDetails.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Employer
                      </h4>
                      <div className="font-mono text-sm text-gray-700 truncate">
                        {jobDetails.employer}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Total Payment
                      </h4>
                      <div className="text-xl font-bold text-indigo-600">
                        {jobDetails.totalPayment} ETH
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Progress
                      </h4>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{
                                width: `${getProgressPercentage(
                                  jobDetails.currentMilestone,
                                  jobDetails.milestoneCount
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {jobDetails.currentMilestone} of{" "}
                            {jobDetails.milestoneCount} milestones completed
                          </div>
                        </div>
                        <div className="ml-4 text-2xl font-bold text-indigo-600">
                          {getProgressPercentage(
                            jobDetails.currentMilestone,
                            jobDetails.milestoneCount
                          )}
                          %
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Current Milestone
                      </h4>
                      <div className="text-lg font-semibold text-gray-800">
                        {jobDetails.currentMilestone < milestones.length
                          ? milestones[jobDetails.currentMilestone].title
                          : "All milestones completed"}
                      </div>
                    </div>
                  </div>

                  {jobDetails.status === "Created" &&
                    jobDetails.worker === account && (
                      <button
                        onClick={confirmJob}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center"
                        disabled={loading}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Accept Job
                      </button>
                    )}
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 bg-indigo-600">
                  <h2 className="text-xl font-semibold text-white">
                    Milestones
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getStatusIcon(milestone.status)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {milestone.title}
                          </h3>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            milestone.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : milestone.status === "InProgress"
                              ? "bg-blue-100 text-blue-800"
                              : milestone.status === "Disputed"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {milestone.status}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {milestone.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Payment Amount
                          </h4>
                          <div className="text-lg font-bold text-indigo-600">
                            {milestone.amount} ETH
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Deadline
                          </h4>
                          <div className="text-gray-800">
                            {milestone.deadline}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {index === jobDetails.currentMilestone &&
                          milestone.status === "InProgress" &&
                          jobDetails.status === "InProgress" && (
                            <button
                              onClick={() => submitMilestone(index)}
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow"
                              disabled={loading}
                            >
                              Submit Milestone for Approval
                            </button>
                          )}

                        {milestone.status === "Disputed" && (
                          <button
                            onClick={() => autoResolveDispute(index)}
                            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors shadow"
                            disabled={loading}
                          >
                            Auto-Resolve Dispute
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-12 text-center">
              <svg
                className="h-16 w-16 text-gray-400 mx-auto mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Job Selected
              </h3>
              <p className="text-gray-500">
                Select a job from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
