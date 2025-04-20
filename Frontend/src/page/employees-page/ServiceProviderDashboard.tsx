import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";
import { useServiceProvider } from "../../hooks/useServiceProvider";
import { formatEth, getStatusColor, getStatusText } from "../../utils/contractUtils";

const ServiceProviderDashboard = () => {
  const {
    jobs,
    loading,
    error,
    selectedJob,
    setSelectedJob,
    jobSummary,
    milestones,
    progress,
    currentMilestone,
    submitMilestone,
    isPending,
  } = useServiceProvider();

  console.log("Jobs:", jobs);
  console.log("Selected Job:", selectedJob);
  console.log("Job Summary:", jobSummary);
  console.log("Milestones:", milestones);
  console.log("Progress:", progress);

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

  return (
    <div className="mx-auto min-h-screen p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">
        Service Provider Dashboard
      </h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
            <p className="text-center mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <p className="font-bold">Error</p>
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 bg-indigo-600">
              <h2 className="text-xl font-semibold text-white">
                My Assigned Jobs
              </h2>
            </div>

            {jobs.length === 0 ? (
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
                {jobs.map((job) => {
                  const isActive = job.address === selectedJob;
                  return (
                    <div
                      key={job.address}
                      onClick={() => setSelectedJob(job.address)}
                      className={`
        p-4 cursor-pointer hover:bg-indigo-50
        ${isActive ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}
      `}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{job.title}</h3>
                        {getStatusIcon(job.status?.toString() ?? '')}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Payment:</span> {formatEth(job.totalPayment)}{' '}
                      </div>

                      {isActive ? (
                        <>
                          <div className="flex justify-between text-xs text-gray-600 mt-2">
                            <span>
                              Progress:{' '}
                              {currentMilestone
                                ? `${milestones.indexOf(currentMilestone)}`
                                : jobSummary?.num_of_milestones}{' '}
                              / {jobSummary?.num_of_milestones}
                            </span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="mt-2 text-xs text-gray-500">Select to view progress</div>
                      )}
                    </div>
                  )
                })}

              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedJob && jobSummary ? (
            <div className="space-y-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 bg-indigo-600 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Job Details
                  </h2>
                  <div className="px-3 py-1 bg-white rounded-full text-indigo-600 text-sm font-medium">
                    {jobs.find((j) => j.address === selectedJob)?.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {jobs.find((j) => j.address === selectedJob)?.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {
                      jobs.find((j) => j.address === selectedJob)
                        ?.description
                    }
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Employer
                      </h4>
                      <div className="font-mono text-sm text-gray-700 truncate">
                        {jobSummary.employer}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Total Payment
                      </h4>
                      <div className="text-xl font-bold text-indigo-600">
                         {formatEth(jobSummary.totalPayment)}
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
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentMilestone
                              ? `${milestones.indexOf(currentMilestone)} of ${jobSummary.num_of_milestones
                              } milestones completed`
                              : "All done"}
                          </div>
                        </div>
                        <div className="ml-4 text-2xl font-bold text-indigo-600">
                          {progress}%
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Current Milestone
                      </h4>
                      <div className="text-lg font-semibold text-gray-800">
                        {currentMilestone
                          ? currentMilestone.title
                          : "Completed"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 bg-indigo-600">
                  <h2 className="text-xl font-semibold text-white">
                    Milestones
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="mr-3">{getStatusIcon(m.status.toString())}</div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {m.title}
                          </h3>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            m.status)
                            }`}
                        >
                          {getStatusIcon(m.status.toString())}
                          {getStatusText(m.status)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{m.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Payment Amount
                          </h4>
                          <div className="text-lg font-bold text-indigo-600">
                            {formatEth(m.amount)}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Deadline
                          </h4>
                          <div className="text-gray-800">
                            {new Date(Number(m.deadline) * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => submitMilestone(idx)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow mb-2"
                        disabled={isPending}
                      >
                        Submit Milestone for Approval
                      </button>
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
