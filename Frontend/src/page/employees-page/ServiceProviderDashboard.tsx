
import { useState, useEffect } from "react";

import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  BarChart,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Shield,
  Layers,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useServiceProvider } from "../../hooks/useServiceProvider";
import JobCard from "../../components/workers/myJobCard";
import { motion, AnimatePresence } from "framer-motion";

const ServiceProviderDashboard = () => {
  const { address: account } = useAuth();

  const { jobs, jobDetails, milestones, loading, confirmJob, submitMilestone } =
    useServiceProvider();

  // State
  const [activeJob, setActiveJob] = useState<`0x${string}` | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: string }[]
  >([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Set active job from URL or first job when jobs load
  useEffect(() => {
    if (jobs.length > 0 && !activeJob) {
      setActiveJob(jobs[0].address as `0x${string}`);
    }
  }, [jobs, activeJob]);

  const autoResolveDispute = async (milestoneIndex: number) => {
    if (!activeJob) return;

    try {
      // Mock resolution for demo
      const updatedMilestones = [...milestones];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        status: "Completed",
      };

      // Show success notification
      addNotification(
        `Dispute for milestone "${milestones[milestoneIndex].title}" resolved successfully`,
        "success"
      );
    } catch (err) {
      console.error("Error resolving dispute:", err);
      addNotification("Failed to resolve dispute. Please try again.", "error");
    }
  };

  const addNotification = (message: string, type: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
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
  // Helper function for status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "InProgress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Created":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Disputed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper function to get progress percentage
  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md ">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Service Provider Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                  <User className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-indigo-800 truncate max-w-xs">
                    {account
                      ? `${account.slice(0, 6)}...${account.slice(-4)}`
                      : "Not connected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`rounded-lg shadow-lg p-4 ${
                notification.type === "success"
                  ? "bg-green-50 border-l-4 border-green-500"
                  : notification.type === "error"
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "bg-blue-50 border-l-4 border-blue-500"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : notification.type === "error" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="inline-flex text-gray-400 hover:text-gray-500"
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      )
                    }
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
            <p className="text-center mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-md p-5 flex items-center"
          >
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-md p-5 flex items-center"
          >
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  jobs.filter((job) => job.status.toString() === "Completed")
                    .length
                }
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-md p-5 flex items-center"
          >
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  jobs.filter((job) => job.status.toString() === "InProgress")
                    .length
                }
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl shadow-md p-5 flex items-center"
          >
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">
                {jobs
                  .reduce(
                    (sum, job) =>
                      sum + parseFloat(job.totalPayment?.toString() || "0"),
                    0
                  )
                  .toFixed(2)}{" "}
                ETH
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  My Assigned Jobs
                </h2>
                <span className="bg-white text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {jobs.length}
                </span>
              </div>

              {jobs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="bg-indigo-50 p-4 rounded-full inline-flex mb-4">
                    <Briefcase className="h-8 w-8 text-indigo-400" />

                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No jobs assigned yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Jobs assigned to you will appear here
                  </p>
                </div>

              ) : (
                <div className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.address}
                      job={{
                        ...job,
                        status: job.status.toString(), // Convert to string if needed
                        worker: job.worker || "", // Provide fallback for null worker
                        workerConfirmed: job.workerConfirmed || false, // Add this if missing
                      }}
                      currentAddress={account || ""}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {jobDetails ? (
                <motion.div
                  key="job-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Job Details
                      </h2>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                          jobDetails.status
                        )}`}
                      >
                        {jobDetails.status}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {jobDetails.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {jobDetails.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                          whileHover={{ y: -2 }}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <User className="w-4 h-4 mr-1 text-indigo-500" />
                            Employer
                          </h4>
                          <div className="font-mono text-sm text-gray-700 truncate bg-white p-2 rounded border border-gray-200">
                            {jobDetails.employer}
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -2 }}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                            Total Payment
                          </h4>
                          <div className="text-xl font-bold text-indigo-600">
                            {jobDetails.totalPayment} ETH
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -2 }}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <BarChart className="w-4 h-4 mr-1 text-blue-500" />
                            Progress
                          </h4>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
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
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -2 }}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <Layers className="w-4 h-4 mr-1 text-purple-500" />
                            Current Milestone
                          </h4>
                          <div className="text-lg font-semibold text-gray-800">
                            {jobDetails.currentMilestone < milestones.length
                              ? milestones[jobDetails.currentMilestone]
                                  ?.title || "Unnamed Milestone"
                              : "All milestones completed"}
                          </div>
                        </motion.div>
                      </div>

                      {jobDetails.status === "Created" &&
                        jobDetails.worker === account && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => confirmJob(activeJob as string)}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center"
                            disabled={loading}
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Accept Job
                          </motion.button>
                        )}
                    </div>
                  </div>

                  <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Layers className="w-5 h-5 mr-2" />
                        Milestones
                      </h2>
                      <span className="bg-white text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {milestones.length}
                      </span>
                    </div>

                    {milestones.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="bg-indigo-50 p-4 rounded-full inline-flex mb-4">
                          <Layers className="h-8 w-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No milestones found
                        </h3>
                        <p className="text-gray-500">
                          This job doesn't have any milestones yet
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {milestones.map((milestone, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-6"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div
                                  className={`mr-3 p-2 rounded-full ${
                                    milestone.status === "Completed"
                                      ? "bg-green-100"
                                      : milestone.status === "InProgress"
                                      ? "bg-blue-100"
                                      : milestone.status === "Disputed"
                                      ? "bg-yellow-100"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {getStatusIcon(milestone.status)}
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500">
                                    Milestone {index + 1}
                                  </span>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {milestone.title || "Unnamed Milestone"}
                                  </h3>
                                </div>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeStyle(
                                  milestone.status
                                )}`}
                              >
                                {milestone.status}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 pl-12">
                              {milestone.description ||
                                "No description provided"}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pl-12">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                                  Payment Amount
                                </h4>
                                <div className="text-lg font-bold text-indigo-600">
                                  {milestone.amount} ETH
                                </div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 text-red-500" />
                                  Deadline
                                </h4>
                                <div className="text-gray-800">
                                  {milestone.deadline}
                                </div>
                              </div>
                            </div>

                            <div className="pl-12 space-y-3">
                              {index === jobDetails.currentMilestone &&
                                milestone.status === "InProgress" &&
                                jobDetails.status === "InProgress" && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                      submitMilestone(jobDetails.address, index)
                                    }
                                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center"
                                    disabled={loading}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submit Milestone for Approval
                                  </motion.button>
                                )}

                              {milestone.status === "Disputed" && (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => autoResolveDispute(index)}
                                  className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center"
                                  disabled={loading}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Auto-Resolve Dispute
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white shadow-lg rounded-xl p-12 text-center"
                >
                  <div className="bg-indigo-50 p-6 rounded-full inline-flex mb-6">
                    <FileText className="h-12 w-12 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                    No Job Selected
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Select a job from the list to view its details and manage
                    milestones
                  </p>
                  {jobs.length > 0 && (
                    <button
                      onClick={() =>
                        setActiveJob(jobs[0].address as `0x${string}`)
                      }
                      className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors font-medium"
                    >
                      <ChevronRight className="w-5 h-5 mr-2" />
                      Select First Job
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;
