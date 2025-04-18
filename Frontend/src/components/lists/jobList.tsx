/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ArrowLeft } from "lucide-react";
import { formatEther } from "ethers/lib/utils";

interface Props {
  jobs: any[];
  isLoading: boolean;
  selectedOrgId: number | null;
  organizations: any[];
  onCreateClick: () => void;
  onSelectJob: (job: any) => void;
  onBack: () => void;
}

interface Job {
  address: string;
  employer: string;
  worker: string;
  title: string;
  description: string;
  totalPayment: bigint;
  status: number;
  milestoneCount: bigint;
  currentMilestone: bigint;
}

const JobList: React.FC<Props> = ({
  jobs,
  selectedOrgId,
  organizations,
  onSelectJob,
  isLoading,
  onCreateClick,
  onBack,
}) => {
  const orgName = organizations.find((org) => org.id === selectedOrgId)?.name;
  return (
    <div>
      <header className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Navigation and Title Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              {/* Left Side - Back Button and Title */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {selectedOrgId && (
                  <button
                    onClick={onBack}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-2 sm:mb-0"
                  >
                    <ArrowLeft size={18} className="mr-1" />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {selectedOrgId
                      ? `Jobs for ${orgName || "Organization"}`
                      : "All Jobs"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                    {jobs?.length || 0}{" "}
                    {jobs?.length === 1 ? "job" : "jobs"} available
                  </p>
                </div>
              </div>

              {/* Right Side - Action Button */}
              {selectedOrgId && (
                <div className="w-full sm:w-auto">
                  <button
                    onClick={onCreateClick}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Job
                  </button>
                </div>
              )}
            </div>

            {/* Optional: Filter/Search Controls (can be expanded later) */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto order-2 sm:order-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search jobs..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto order-1 sm:order-2">
                <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>All Jobs</option>
                  <option>Active Jobs</option>
                  <option>Completed Jobs</option>
                  <option>Pending Jobs</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-4"></div>
            </div>
          ))
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No jobs available for this organization.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.address}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => onSelectJob(job)}
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.description}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm font-medium text-indigo-700">
                  {job.milestoneCount.toString()} milestones
                </p>
                <p className="text-sm font-medium">
                  {formatEther(job.totalPayment.toString())} ETH
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Status: {getStatusText(job.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
function getStatusText(status: number): string {
  switch (status) {
    case 0:
      return "Created";
    case 1:
      return "In Progress";
    case 2:
      return "Completed";
    case 3:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

export default JobList;
