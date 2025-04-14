/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
 jobs: any[];
 selectedOrgId: number | null;
 organizations: any[];
 onCreateClick: () => void;
 onSelectJob: (job: any) => void;
}

const JobList: React.FC<Props> = ({ jobs, selectedOrgId, organizations, onCreateClick, onSelectJob }) => {
 const orgName = organizations.find((org) => org.id === selectedOrgId)?.name;

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
     Jobs for {orgName || "Selected Organization"}
    </h2>
    <button
     onClick={onCreateClick}
     className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
     disabled={!selectedOrgId}
    >
     Create Job
    </button>
   </div>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {jobs.map((job) => (
     <div
      key={job.address}
      className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
      onClick={() => onSelectJob(job)}
     >
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.description}</p>
      <p className="text-sm mt-2 font-medium text-indigo-700">
       {job.totalPayment} ETH • {job.milestoneCount} milestones
      </p>
     </div>
    ))}
   </div>
  </div>
 );
};

export default JobList;
