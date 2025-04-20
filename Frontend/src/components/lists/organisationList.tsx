import React, { useState } from "react";
import { 
  Building, 
  PlusCircle, 
  Search, 
  Filter,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { motion } from "framer-motion";

interface Organization {
  id: number;
  name: string;
  description: string;
  memberCount?: number;
  createdAt?: string;
  status?: string;
  logoUrl?: string;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organizations: any[];
  onCreateClick: () => void;
  onSelect: (id: number) => void;
  isLoading?: boolean;
}

const OrganizationCard: React.FC<{
  organization: Organization;
  onSelect: (id: number) => void;
}> = ({ organization, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default values for optional fields
  const memberCount = organization.memberCount || 0;
  const createdAt = organization.createdAt || new Date().toISOString();
  const status = organization.status || "Active";
  
  return (
    <motion.div
      className={`relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${isHovered ? 'transform scale-[1.01]' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(organization.id)}
    >
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${status === "Active" ? "bg-green-500" : "bg-amber-500"}`}></div>
      
      <div className="p-6">
        {/* Header with icons */}
        <div className="flex justify-between items-start mb-4">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Building className="text-indigo-600" size={24} />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            status === "Active" ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {status === "Active" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{organization.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{organization.description}</p>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
            <div className="bg-blue-100 p-1 rounded">
              <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Members</p>
              <p className="text-sm font-semibold">{memberCount}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
            <div className="bg-purple-100 p-1 rounded">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="text-sm font-semibold">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* View details button */}
        <div className="mt-4 flex justify-center">
          <button 
            className="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
          >
            <ExternalLink size={16} />
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const OrganizationList: React.FC<Props> = ({
  organizations,
  onCreateClick,
  onSelect,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Filter organizations by search term and status
  const filteredOrganizations = organizations?.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === null || org.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header with Title and Action Button */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Side - Title and Count */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Organizations</h2>
            <p className="text-gray-600">
              {organizations?.length || 0}{" "}
              {organizations?.length === 1 ? "organization" : "organizations"}{" "}
              available
            </p>
          </div>
          
          {/* Right Side - Action Button */}
          <button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle size={18} />
            Create Organization
          </button>
        </div>
        
        {/* Filter bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search organizations by name or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                value={filterStatus !== null ? filterStatus : ""}
                onChange={(e) => setFilterStatus(e.target.value === "" ? null : e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results summary */}
      {!isLoading && (
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredOrganizations.length} {filteredOrganizations.length === 1 ? "organization" : "organizations"}
          {searchTerm && <span> matching "{searchTerm}"</span>}
          {filterStatus && <span> with status: {filterStatus}</span>}
        </div>
      )}

      {/* Organization grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 3 }).map((_, i) => (
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
              
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))
        ) : (
          filteredOrganizations.length > 0 ? (
            // Organization cards
            filteredOrganizations.map((org) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                onSelect={onSelect}
              />
            ))
          ) : (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Building size={40} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No organizations found</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchTerm || filterStatus
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You haven't created any organizations yet."}
              </p>
              <button
                onClick={onCreateClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                <PlusCircle size={18} />
                Create Your First Organization
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrganizationList;