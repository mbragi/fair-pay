// components/JobList.tsx
import React, { useState } from "react";
import {
  Briefcase,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Award,
  Layers,
  Search,
  Filter,
  Tag,
} from "lucide-react";
import { formatEther } from "ethers/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMilestones, Milestone } from "../../hooks/useGetMilestones";
import { Job } from "../../types/generated";
import { getStatusColor, getStatusIcon, getStatusText } from "../../utils/contractUtils";
import { useApproveMilestone } from "../../hooks/useApproveMilestone";
import { useGetJobPaymentInfo } from "../../hooks/useGetJobPaymentInfo";

interface Props {
  jobs: Job[];
  isLoading: boolean;
  selectedOrgId: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organizations: any[];
  onCreateClick: () => void;
  onSelectJob: (job: Job) => void;
  onCreateMilestones: (job: Job) => void;
  onBack: () => void;
}



const MilestoneProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="relative pt-1 w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-indigo-700">Progress</div>
        <div className="text-xs font-semibold text-indigo-700">{current}/{total}</div>
      </div>
      <div className="flex h-2 overflow-hidden rounded bg-indigo-100">
        <div
          style={{ width: `${percentage}%` }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-in-out"
        ></div>
      </div>
    </div>
  );
};

const JobCard: React.FC<{
  job: Job;
  isExpanded: boolean;
  toggleExpand: (address: string) => void;
  onSelectJob: (job: Job) => void;
  onCreateMilestones: (job: Job) => void;
}> = ({ job, isExpanded, toggleExpand, onSelectJob, onCreateMilestones }) => {
  const count = Number(job.milestoneCount);
  const { milestones, isLoading: loading, refetch } = useGetMilestones(job.address, count);
  const { approveMilestone, isApproving } = useApproveMilestone(job?.address as '0x0');
  const [isHovered, setIsHovered] = useState(false);
  const { tokenSymbol, isLoading, paymentInfo } = useGetJobPaymentInfo(job.address)

  const valid = milestones.filter((m: Milestone) =>
    (m.title?.trim().length ?? 0) > 0 ||
    (m.description?.trim().length ?? 0) > 0 ||
    (m.amount > 0n) ||
    (m.status > 0)
  );
  const has = !loading && valid.length > 0;

  // Calculate completed milestones
  const completedMilestones = valid.filter((m: Milestone) => m.status === 2).length;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (has) toggleExpand(job.address);
    else onCreateMilestones(job);
  };

  const statusColor = getStatusColor(job.status);
  const statusIcon = getStatusIcon(job.status);

  return (
    <motion.div
      className={`relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${isHovered ? 'transform scale-[1.01]' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}></div>

      {/* Card Content */}
      <div className="p-6">
        <div className="cursor-pointer" onClick={() => onSelectJob(job)}>
          {/* Header with icons */}
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Briefcase className="text-indigo-600" size={24} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${job.status === 0 ? 'bg-blue-100 text-blue-800' :
              job.status === 1 ? 'bg-amber-100 text-amber-800' :
                job.status === 2 ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
              }`}>
              {statusIcon}
              {getStatusText(job.status)}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded">
                <DollarSign size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment</p>
                <p className="text-sm font-semibold">{!isLoading && paymentInfo?.totalPayment ? formatEther(paymentInfo?.totalPayment) : 0} {tokenSymbol}</p>
                {isLoading && <p className="text-xs text-gray-500">...</p>}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
              <div className="bg-blue-100 p-1 rounded">
                <Layers size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Milestones</p>
                <p className="text-sm font-semibold">{count}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {has && <MilestoneProgressBar current={completedMilestones} total={count} />}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectJob(job);
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <Search size={16} /> Job Details
          </button>

          <button
            onClick={handleToggle}
            className="flex items-center gap-1 py-1 px-2 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition-all"
          >
            {has ? (
              <>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {isExpanded ? "Hide" : "View"} Milestones
              </>
            ) : (
              <>
                <PlusCircle size={16} /> Create Milestones
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animated Expansion for Milestones */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden bg-indigo-50 border-t border-indigo-100 items-start"
          >
            <div className="p-6 space-y-4">
              <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                <Award size={18} /> Milestones
              </h4>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
              ) : (
                valid.map((m: Milestone, i: number) => (
                  <div
                    key={i}
                    className={`relative p-4 rounded-lg bg-white shadow-sm border-l-4 ${m.status === 0 ? 'border-blue-400' :
                      m.status === 1 ? 'border-amber-400' :
                        m.status === 2 ? 'border-green-400' :
                          'border-red-400'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${m.status === 0 ? 'bg-blue-100 text-blue-600' :
                          m.status === 1 ? 'bg-amber-100 text-amber-600' :
                            m.status === 2 ? 'bg-green-100 text-green-600' :
                              'bg-red-100 text-red-600'
                          }`}>
                          {getStatusIcon(m.status)}
                        </div>
                        <h5 className="font-semibold text-gray-900">Milestone {i + 1}</h5>
                      </div>
                      <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {(Number(m.amount) / 1e18).toFixed(3)} ETH
                      </span>
                    </div>

                    <p className="text-gray-700 mt-2 font-medium">{m.title || "Untitled"}</p>
                    <p className="text-gray-600 text-sm mt-1">{m.description || "No description provided"}</p>

                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={14} />
                        Deadline: {new Date(Number(m.deadline) * 1000).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Tag size={14} />
                        Status: {getStatusText(m.status)}
                      </div>
                    </div>
                    {/* 🌟 APPROVE BUTTON 🌟 */}
                    {m.status === 2 && (
                      <button
                        onClick={() => {
                          approveMilestone(i)
                            .then(() => {
                              refetch();
                            })
                            .catch((error) => {
                              console.error("Error approving milestone:", error);
                            });
                        }}
                        disabled={isApproving}
                        className={`mt-4 w-full py-2 rounded-md font-medium transition ${isApproving
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                      >
                        {isApproving ? 'Approving...' : 'Approve Milestone'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};








const JobList: React.FC<Props> = ({
  jobs,
  isLoading,
  onSelectJob,
  onCreateMilestones,
  onCreateClick,
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | null>(null);

  const toggle = (addr: string) => {
    setExpanded((prev) => (prev === addr ? null : addr));
  };

  // Filter jobs by search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === null || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                value={filterStatus !== null ? filterStatus : ""}
                onChange={(e) => setFilterStatus(e.target.value === "" ? null : Number(e.target.value))}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="0">Created</option>
                <option value="1">In Progress</option>
                <option value="2">Completed</option>
                <option value="3">Cancelled</option>
              </select>
            </div>

            <button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle size={18} />
              New Job
            </button>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {filterStatus !== null && <span> with status: {getStatusText(filterStatus)}</span>}
        </div>

        {expanded && (
          <button
            onClick={() => setExpanded(null)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Collapse All
          </button>
        )}
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start ">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-16 bg-gray-100 rounded-lg"></div>
                <div className="h-16 bg-gray-100 rounded-lg"></div>
              </div>

              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>

              <div className="flex justify-between items-center mt-4">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : filteredJobs.length > 0 ? (
          // Job cards
          filteredJobs.map((job) => (
            <JobCard
              key={job.address}
              job={job}
              isExpanded={expanded === job.address}
              toggleExpand={toggle}
              onSelectJob={onSelectJob}
              onCreateMilestones={onCreateMilestones}
            />
          ))
        ) : (
          // Empty state
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Search size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {searchTerm || filterStatus !== null
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't created any jobs for this organization yet."}
            </p>
            <button
              onClick={onCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all"
            >
              <PlusCircle size={18} />
              Create Your First Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;