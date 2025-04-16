/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
 jobs: any[];
 isLoading: boolean;
 selectedOrgId: number | null;
 organizations: any[];
 onCreateClick: () => void;
 onSelectJob: (job: any) => void;
 onBack: () => void;
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
   <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-3">
     {selectedOrgId && (
      <button
       onClick={onBack}
       className="text-indigo-600 hover:underline flex items-center gap-1"
      >
       <ArrowLeft size={18} />
       Back
      </button>
     )}
     <h2 className="text-2xl font-bold text-gray-800">
      Jobs for {orgName || "Organization"}
     </h2>
    </div>

    {selectedOrgId && (
     <button
      onClick={onCreateClick}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
     >
      Create Job
     </button>
    )}
   </div>

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
       <p className="text-sm mt-3 font-medium text-indigo-700">
        {job.totalPayment} ETH • {job.milestoneCount} milestones
       </p>
      </div>
     ))
    )}
   </div>
  </div>
 );
};

export default JobList;
