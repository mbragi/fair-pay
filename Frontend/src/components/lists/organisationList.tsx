import React from "react";

interface Props {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 organizations: any[];
 onCreateClick: () => void;
 onSelect: (id: number) => void;
}

const OrganizationList: React.FC<Props> = ({ organizations, onCreateClick, onSelect }) => (
 <div>
  <div className="flex justify-between items-center mb-6">
   <h2 className="text-2xl font-bold text-gray-800">My Organizations</h2>
   <button
    onClick={onCreateClick}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
   >
    Create Organization
   </button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {organizations.map((org) => (
    <div
     key={org.id}
     className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
     onClick={() => onSelect(org.id)}
    >
     <h3 className="text-xl font-semibold">{org.name}</h3>
     <p className="text-sm text-gray-600">{org.description}</p>
    </div>
   ))}
  </div>
 </div>
);

export default OrganizationList;
