import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Briefcase,
  ArrowRight,
  Calendar,
  DollarSign,
  ChevronRight,
  User,
  Layers,
  AlertCircle
} from "lucide-react";
import { useServiceProvider } from "../../hooks/useServiceProvider";
import { formatEth, getStatusColor, getStatusText } from "../../utils/contractUtils";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const ServiceProviderDashboard = () => {
   const { address, isConnected } = useAuth();
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
    paymentInfo,
    tokenName,
    tokenSymbol,
    tokenLoading,
  } = useServiceProvider();


  

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
  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
        <div className="bg-gray-300 shadow-xl rounded-xl p-10 max-w-md text-center transform transition-all hover:scale-105">
          <div className="mb-6">
            <AlertCircle className="mx-auto h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            To access FairPay's powerful employer tools, please login your smart wallet account.
          </p>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-10">
      {/* Top Header Bar */}
      <div className="bg-white shadow-md max-w-7xl mx-auto  border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Service Provider Dashboard
            </h1>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all">
              My Profile
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50 transition-all hover:shadow-lg">
            <div className="p-5 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
                <p className="text-xl font-bold text-gray-800">{jobs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50 transition-all hover:shadow-lg">
            <div className="p-5 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-xl font-bold text-gray-800">
                  {jobs.filter(job => getStatusText(job.status) === "Completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50 transition-all hover:shadow-lg">
            <div className="p-5 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">In Progress</p>
                <p className="text-xl font-bold text-gray-800">
                  {jobs.filter(job => getStatusText(job.status) === "In Progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50 transition-all hover:shadow-lg">
            <div className="p-5 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Disputed</p>
                <p className="text-xl font-bold text-gray-800">
                  {jobs.filter(job => getStatusText(job.status) === "Disputed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-indigo-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto" />
              <p className="text-center mt-6 text-gray-700 font-medium">Loading your data...</p>
              <p className="text-center mt-2 text-gray-500 text-sm">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-5 mb-8 animate-fade-in">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Something went wrong</p>
                <p className="text-red-700 mt-1">{error.message}</p>
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  My Assigned Jobs
                </h2>
              </div>

              {jobs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="bg-indigo-50 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-indigo-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No jobs assigned yet</p>
                  <p className="text-gray-500 text-sm mt-1">Jobs will appear here once assigned</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {jobs.map((job) => {
                    const isActive = job.address === selectedJob;
                    return (
                      <div
                        key={job.address}
                        onClick={() => setSelectedJob(job.address)}
                        className={`
                          p-4 cursor-pointer transition-all hover:bg-indigo-50
                          ${isActive ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800 flex items-center">
                            {job.title}
                            {isActive && <ChevronRight className="ml-2 h-4 w-4 text-indigo-600" />}
                          </h3>
                          <div className={`rounded-full p-1 ${job.status === "Completed" ? "bg-green-100" :
                            job.status === "InProgress" ? "bg-blue-100" :
                              job.status === "Disputed" ? "bg-yellow-100" :
                                job.status === "Cancelled" ? "bg-red-100" : "bg-gray-100"
                            }`}>
                            {getStatusIcon(job.status?.toString() ?? '')}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="font-medium">{formatEth(job.totalPayment)}</span>
                        </div>

                        {isActive ? (
                          <>
                            <div className="flex justify-between text-xs text-gray-600 mt-3">
                              <span className="font-medium">
                                Milestone Progress: {currentMilestone
                                  ? `${milestones.indexOf(currentMilestone)}`
                                  : jobSummary?.num_of_milestones} / {jobSummary?.num_of_milestones}
                              </span>
                              <span className="font-semibold text-indigo-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 text-xs text-indigo-500 flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            <span>Select to view details</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-2">
            {selectedJob && jobSummary ? (
              <div className="space-y-6">
                <>   <div className="bg-white rounded-xl shadow-md border border-indigo-50 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 p-5 rounded-xl shadow-sm w-auto">
                    <p className="text-sm text-purple-800 mb-2">Total Payment</p>
                    <p className="text-2xl font-bold">{formatEth(paymentInfo?.totalPayment ?? 0)}</p>
                  </div>
                  <div className="bg-green-50 p-5 rounded-xl shadow-sm">
                    <p className="text-sm text-green-800 mb-2">Paid Amount</p>
                    <p className="text-2xl font-bold">{formatEth(paymentInfo?.paidAmount ?? 0)}</p>
                  </div>
                  <div className="bg-red-50 p-5 rounded-xl shadow-sm">
                    <p className="text-sm text-red-800 mb-2">Remaining</p>
                    <p className="text-2xl font-bold">{formatEth(paymentInfo?.remainingAmount ?? 0)}</p>
                  </div>
                  <div className="col-span-full bg-indigo-50 p-5 rounded-xl shadow-sm flex items-center">
                    <DollarSign className="h-6 w-6 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-700">Token</p>
                      {tokenLoading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                      ) : (
                        <p className="text-sm text-gray-500">{tokenName} ({tokenSymbol})</p>
                      )}
                    </div>
                  </div>
                </div></>

                {/* Job Details Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Job Details
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${jobs.find(j => j.address === selectedJob)?.status === "Completed" ? "bg-green-500 text-white" :
                      jobs.find(j => j.address === selectedJob)?.status === "InProgress" ? "bg-blue-500 text-white" :
                        jobs.find(j => j.address === selectedJob)?.status === "Disputed" ? "bg-yellow-500 text-white" :
                          jobs.find(j => j.address === selectedJob)?.status === "Cancelled" ? "bg-red-500 text-white" : "bg-white text-indigo-600"
                      }`}>
                      {jobs.find((j) => j.address === selectedJob)?.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {jobs.find((j) => j.address === selectedJob)?.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {jobs.find((j) => j.address === selectedJob)?.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-indigo-50 p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center mb-3">
                          <User className="h-5 w-5 text-indigo-600 mr-2" />
                          <h4 className="text-sm font-semibold text-indigo-800">
                            Employer
                          </h4>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="font-mono text-sm text-gray-700 truncate">
                            {jobSummary.employer}
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center mb-3">
                          <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                          <h4 className="text-sm font-semibold text-purple-800">
                            Total Payment
                          </h4>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {formatEth(jobSummary.totalPayment)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center mb-3">
                          <Layers className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="text-sm font-semibold text-blue-800">
                            Progress
                          </h4>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentMilestone
                                ? `${milestones.indexOf(currentMilestone)} of ${jobSummary.num_of_milestones
                                } milestones completed`
                                : "All milestones completed"}
                            </div>
                          </div>
                          <div className="ml-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
                            {progress}%
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center mb-3">
                          <Calendar className="h-5 w-5 text-green-600 mr-2" />
                          <h4 className="text-sm font-semibold text-green-800">
                            Current Milestone
                          </h4>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-lg font-semibold text-gray-800">
                            {currentMilestone
                              ? currentMilestone.title
                              : "All Complete"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-50">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <Layers className="mr-2 h-5 w-5" />
                      Milestones
                    </h2>
                  </div>

                  <div>
                    {milestones.map((m, idx) => (
                      <div key={idx} className={`p-6 ${idx !== milestones.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`mr-3 rounded-full p-2 ${m.status.toString() === "Completed" ? "bg-green-100" :
                              m.status.toString() === "InProgress" ? "bg-blue-100" :
                                m.status.toString() === "Disputed" ? "bg-yellow-100" :
                                  "bg-gray-100"
                              }`}>
                              {getStatusIcon(m.status.toString())}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {m.title}
                            </h3>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(
                              m.status)
                              }`}
                          >
                            {getStatusText(m.status)}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-5 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                          {m.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                          <div className="flex items-center">
                            <div className="rounded-full bg-indigo-100 p-2 mr-3">
                              <DollarSign className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Payment Amount
                              </h4>
                              <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {formatEth(m.amount)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="rounded-full bg-purple-100 p-2 mr-3">
                              <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Deadline
                              </h4>
                              <div className="text-lg font-medium text-gray-800">
                                {new Date(Number(m.deadline) * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => submitMilestone(idx)}
                          className={`w-full py-3 font-medium rounded-lg transition-all transform hover:translate-y-px focus:ring-2 focus:ring-offset-2 focus:outline-none ${getStatusText(m.status) === "Completed" ? "bg-gray-200 text-gray-500 cursor-not-allowed" :
                            "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                            }`}
                          disabled={isPending || getStatusText(m.status) === "Completed"}
                        >
                          {isPending ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Processing...
                            </div>
                          ) : getStatusText(m.status) === "Completed" ?
                            "Milestone Completed" :
                            "Submit for Approval"
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-indigo-50">
                <div className="bg-indigo-50 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
                  <Briefcase className="h-12 w-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  No Job Selected
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Select a job from the list to view detailed information, track progress, and manage milestones.
                </p>
                <div className="inline-flex items-center text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full text-sm font-medium">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Select a job to get started
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;