/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface Props {
 myWork: any[];
 onSelectJob: (job: any) => void;
}

const WorkList: React.FC<Props> = ({ myWork, onSelectJob }) => (
 <div>
  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Work</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   {myWork.map((job) => (
    <div
     key={job.address}
     className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
     onClick={() => onSelectJob(job)}
    >
     <h3 className="text-xl font-semibold">{job.title}</h3>
     <p className="text-sm text-gray-600">{job.description}</p>
    </div>
   ))}
  </div>
 </div>
);

export default WorkList;
