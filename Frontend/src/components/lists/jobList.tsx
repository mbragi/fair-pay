// components/JobList.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { formatEther } from "ethers/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMilestones, Milestone } from "../../hooks/useGetMilestones";
import { Job } from "../../types/generated";

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

function getStatusText(status: number): string {
  switch (status) {
    case 0: return "Created";
    case 1: return "In Progress";
    case 2: return "Completed";
    case 3: return "Cancelled";
    default: return "Unknown";
  }
}

const JobCard: React.FC<{
  job: Job;
  isExpanded: boolean;
  toggleExpand: (address: string) => void;
  onSelectJob: (job: Job) => void;
  onCreateMilestones: (job: Job) => void;
}> = ({ job, isExpanded, toggleExpand, onSelectJob, onCreateMilestones }) => {
  const count = Number(job.milestoneCount);
  const { milestones, isLoading: loading } = useGetMilestones(job.address, count);

  const valid = milestones.filter((m: Milestone) =>
    (m.title?.trim().length ?? 0) > 0 ||
    (m.description?.trim().length ?? 0) > 0 ||
    (m.amount > 0n) ||
    (m.status > 0)
  );
  const has = !loading && valid.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (has) toggleExpand(job.address);
    else onCreateMilestones(job);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="cursor-pointer" onClick={() => onSelectJob(job)}>
        <h3 className="text-xl font-semibold truncate">{job.title}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{job.description}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-indigo-700">
              {count} Milestone{count !== 1 && "s"}
            </span>
            <button
              onClick={handleToggle}
              className="text-sm text-indigo-600 hover:underline"
            >
              {has
                ? isExpanded ? "Hide Milestones" : "View Milestones"
                : "Create Milestones"}
            </button>
          </div>
          <p className="text-sm font-medium">
            {formatEther(job.totalPayment.toString())} ETH
          </p>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Status: {getStatusText(job.status)}
        </p>
      </div>

      {/* Animated Expansion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="overflow-hidden mt-4 border-t pt-4 space-y-4"
          >
            {loading ? (
              <p className="text-center text-gray-500">Loading…</p>
            ) : (
              valid.map((m: Milestone, i: number) => (
                <div key={i} className="pl-4 border-l-2 border-indigo-200">
                  <h4 className="font-semibold">Milestone {i + 1}</h4>
                  <p className="text-sm text-gray-700 truncate">{m.title}</p>
                  <p className="text-xs text-gray-500 mb-1 truncate">
                    {m.description}
                  </p>
                  <p className="text-sm font-medium">
                    Amount: {(Number(m.amount) / 1e18).toFixed(4)} ETH
                  </p>
                  <p className="text-sm text-gray-500">
                    Deadline:{" "}
                    {new Date(Number(m.deadline) * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {getStatusText(m.status)}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JobList: React.FC<Props> = ({
  jobs,
  isLoading,
  selectedOrgId,
  organizations,
  onSelectJob,
  onCreateMilestones,
  onCreateClick,
  onBack,
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const orgName = organizations.find((o) => o.id === selectedOrgId)?.name;

  const toggle = (addr: string) => {
    setExpanded((prev) => (prev === addr ? null : addr));
  };

  return (
    <div className="px-4">
      <header className="bg-white border-b border-gray-200 shadow-sm mb-8 px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          {selectedOrgId && (
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedOrgId
                ? `Jobs for ${orgName || "Organization"}`
                : "All Jobs"}
            </h1>
            <p className="hidden sm:block text-sm text-gray-500 mt-1">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
            </p>
          </div>
        </div>
        {selectedOrgId && (
          <button
            onClick={onCreateClick}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
          >
            Create Job
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-6 max-w-7xl mx-auto">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-4" />
            </div>
          ))
          : jobs.map((job) => (
            <JobCard
              key={job.address}
              job={job}
              isExpanded={expanded === job.address}
              toggleExpand={toggle}
              onSelectJob={onSelectJob}
              onCreateMilestones={onCreateMilestones}
            />
          ))}
      </div>
    </div>
  );
};

export default JobList;
