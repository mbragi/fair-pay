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
    <div className="bg-white border-b border-gray-200 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Header with Title and Action Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Left Side - Title and Count */}
            <div className="w-full sm:w-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                My Organizations
              </h2>
              <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                {organizations?.length || 0}{" "}
                {organizations?.length === 1 ? "organization" : "organizations"}{" "}
                available
              </p>
            </div>

            {/* Right Side - Action Button */}
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
                Create Organization
              </button>
            </div>
          </div>

          {/* Optional: Search/Filter Controls (uncomment if needed) */}
          {/* <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              placeholder="Search organizations..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto order-1 sm:order-2">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>All Organizations</option>
            <option>Active</option>
            <option>Archived</option>
          </select>
        </div>
      </div> */}
        </div>
      </div>
    </div>

    {isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.length > 0 ? (
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
