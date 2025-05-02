import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetchOrganizationsByOwner } from "../../hooks/useFetchOrganisationsByOwner";
import { useCreateOrganization } from "../../hooks/useCreateOrganisation";
import { useCreateJob } from "../../hooks/useCreateJob";
import { useFetchOrganizationJobs } from "../../hooks/useFetchOrganisationsJobs";
import OrganizationList from "../../components/lists/organisationList";
import JobList from "../../components/lists/jobList";
import CreateOrganizationModal from "../../components/modals/organizationModal";
import CreateJobModal from "../../components/modals/createJobmodal";
import Toast from "../../components/common/Toast";
import { Job } from "../../types/generated";
import MilestoneModal from "../../components/modals/milestoneModal";
import JobManagementModal from "../../components/modals/JobManagementModal";
// Import icons
import { Building, Briefcase, ChevronLeft, ExternalLink, AlertCircle } from "lucide-react";

const ClientPage: React.FC = () => {
  const { address, isConnected } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [animateTransition, setAnimateTransition] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    console.debug(modalOpen);
    if (address) setModalOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const [toast, setToast] = useState({
    message: "",
    isError: false,
    visible: false,
  });

  const {
    data: organizations,
    isLoading: orgLoading,
    refetch: refetchOrganizations,
  } = useFetchOrganizationsByOwner(address ?? "");

  const {
    createOrganization,
    isPending: orgPending,
  } = useCreateOrganization();

  const {
    data: jobs,
    refetch: refetchJobs,
    refetchDetails,
    isLoading: jobsPending,
  } = useFetchOrganizationJobs(selectedOrgId ?? 0);

  const { createJob } = useCreateJob();

  // Handle smooth transitions between screens
  const handleOrgSelect = (id: number) => {
    setAnimateTransition(true);
    setTimeout(() => {
      setSelectedOrgId(id);
      setAnimateTransition(false);
    }, 300);
  };

  const handleBack = () => {
    setAnimateTransition(true);
    setTimeout(() => {
      setSelectedOrgId(null);
      setAnimateTransition(false);
    }, 300);
  };

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  // Calculate stats
  const totalOrgs = organizations?.length || 0;
  const totalJobs = jobs.filter(i=>i.employer === address)?.length || 0;
  const activeJobs = jobs?.filter(job => String(job.status) === 'active')?.length || 0;

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-50 to-blue-50 px-4">
        <div className="bg-gray-300 shadow-xl rounded-xl p-10 max-w-md text-center transform transition-all hover:scale-105">
          <div className="mb-6">
            <AlertCircle className="mx-auto h-16 w-16 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            To access FairPay's powerful employer tools, please login your smart wallet account.
          </p>
        </div>
        
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-md">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Employer Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your organizations and job listings</p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
              <Building className="text-indigo-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Organizations</p>
                <p className="font-bold text-indigo-700">{totalOrgs}</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
              <Briefcase className="text-purple-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Total Jobs</p>
                <p className="font-bold text-purple-700">{totalJobs}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
              <ExternalLink className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Active Jobs</p>
                <p className="font-bold text-blue-700">{activeJobs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Transition Animation */}
        <div className={`transition-all duration-300 ${animateTransition ? 'opacity-0 transform translate-x-6' : 'opacity-100 transform translate-x-0'}`}>
          {!selectedOrgId ? (
            <div>
              
              <OrganizationList
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                organizations={organizations as unknown as any[]}
                onCreateClick={() => setShowCreateOrgModal(true)}
                onSelect={handleOrgSelect}
                isLoading={orgLoading}
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className=" hover:bg-gray-100 text-gray-700 p-2 rounded-lg flex items-center justify-center shadow-sm transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase size={24} className="text-indigo-600" />
                    Jobs For {organizations?.find(org => org.id === selectedOrgId)?.name || "Organization"}
                  </h2>
                </div>
              </div>
              
              <JobList
                jobs={jobs as Job[]}
                isLoading={jobsPending}
                selectedOrgId={selectedOrgId}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                organizations={organizations as unknown as any[]}
                onCreateClick={() => setShowCreateJobModal(true)}
                onSelectJob={(job) => {
                  setSelectedJob(job);
                  setShowJobDetailsModal(true);
                }}
                onCreateMilestones={(job: Job) => {
                  setSelectedJob(job);
                  setShowMilestonesModal(true);
                }}
                onBack={handleBack}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateOrganizationModal
          isLoading={orgPending}
          isOpen={showCreateOrgModal}
          onClose={() => setShowCreateOrgModal(false)}
          onCreate={async (name, description) => {
            try {
              await createOrganization(name, description);
              showToast("Organization created successfully");
              await refetchOrganizations();
              setShowCreateOrgModal(false);
            } catch (e) {
              console.error(e);
              showToast("Failed to create organization", true);
            }
          }}
        />

        <CreateJobModal
          isOpen={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onCreate={async (jobData) => {
            try {
              if (jobData.orgId === null) {
                throw new Error("Organization ID cannot be null");
              }
              await createJob(jobData.orgId, jobData.title, jobData.description, jobData.payment, jobData.milestoneCount, jobData.tokenAddress);
              setShowCreateJobModal(false);
              showToast("Job created successfully");
              await refetchJobs();
              refetchDetails();
            } catch (e) {
              console.error(e);
              showToast("Failed to create job", true);
            }
          }}
          selectedOrgId={selectedOrgId}
        />

        {selectedJob && (
          <MilestoneModal
            isOpen={showMilestonesModal}
            job={selectedJob}
            onClose={() => {
              refetchDetails()
              setShowMilestonesModal(false)
            }}
          />
        )}

        <JobManagementModal
          isOpen={showJobDetailsModal}
          onClose={() => setShowJobDetailsModal(false)}
          job={selectedJob as Job}
          onSuccess={async () => {
            await refetchJobs();
            showToast("Job updated successfully");
            refetchDetails()
          }}
        />

        {/* Enhanced Toast Notification */}
        {toast.visible && (
          <Toast
            message={toast.message}
            isError={toast.isError}
            visible={true}
          />
        )}
      </div>
    </div>
  );
};

export default ClientPage;