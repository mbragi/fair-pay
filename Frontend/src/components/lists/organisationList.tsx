import React from "react";

interface Props {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 organizations: any[];
 onCreateClick: () => void;
 onSelect: (id: number) => void;
 isLoading?: boolean;
}

const OrganizationList: React.FC<Props> = ({
 organizations,
 onCreateClick,
 onSelect,
 isLoading = false,
}) => (
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

  {isLoading ? (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
     <div
      key={i}
      className="bg-white p-6 rounded-lg shadow animate-pulse"
     >
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
     </div>
    ))}
   </div>
  ) : (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {organizations.length > 0 ? (
     organizations.map((org) => (
      <div
       key={org.id}
       className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
       onClick={() => onSelect(org.id)}
      >
       <h3 className="text-xl font-semibold">{org.name}</h3>
       <p className="text-sm text-gray-600">{org.description}</p>
      </div>
     ))
    ) : (
     <div className="col-span-full text-center text-gray-500 py-12">
      No organizations found.
     </div>
    )}
   </div>
  )}
 </div>
);

export default OrganizationList;
