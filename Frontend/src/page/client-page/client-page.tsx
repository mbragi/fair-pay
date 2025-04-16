/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrganizations } from "../../hooks/useOrganisation";
import { useJobs } from "../../hooks/useJobsEscrow";
import OrganizationList from "../../components/lists/organisationList";
import JobList from "../../components/lists/jobList";
import CreateOrganizationModal from "../../components/modals/organizationModal";
import CreateJobModal from "../../components/modals/createJobmodal";
import JobDetailsModal from "../../components/modals/jobdetailsModal";
import MilestoneModal from "../../components/modals/milestoneModal";
import Toast from "../../components/common/Toast";

const ClientPage: React.FC = () => {
  const { address, isConnected } = useAuth();

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);

  const [toast, setToast] = useState({ message: '', isError: false, visible: false });

  const {
    isPending: orgPending,
    loading: orgLoading,
    organizations,
    createOrganization,
    fetchOrganizationsByOwner
  } = useOrganizations();

  const {
    jobs,
    isPending: jobsPending,
    createJob,
    refetch: refetchJobs
  } = useJobs(selectedOrgId);


  const showToast = (message: string, isError = false) => {
    setToast({ message, isError, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  if (!isConnected || !address) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">No Smart Account Connected</h2>
          <p className="text-gray-600 mb-6">
            To use FairPay, you'll need a smart wallet account. Click Get Started.
          </p>
          {/* <button
            onClick={() => {
              // Trigger wallet connect / smart account creation
              // E.g. call loginWithSmartWallet() or redirect
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            Get Started
          </button> */}
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-8">Employer Dashboard</h1>

        {!selectedOrgId ? (
          <OrganizationList
            organizations={organizations}
            onCreateClick={() => setShowCreateOrgModal(true)}
            onSelect={id => setSelectedOrgId(id)}
            isLoading={orgLoading}
          />
        ) : (
          <JobList
            jobs={jobs}
            isLoading={jobsPending}
            selectedOrgId={selectedOrgId}
            organizations={organizations}
            onCreateClick={() => setShowCreateJobModal(true)}
            onSelectJob={(job) => {
              setSelectedJob(job);
              setShowJobDetailsModal(true);
            }}
            onBack={() => setSelectedOrgId(null)}
          />
        )}

        {/* Modals */}
        <CreateOrganizationModal
          isLoading={orgPending}
          isOpen={showCreateOrgModal}
          onClose={() => setShowCreateOrgModal(false)}
          onCreate={async (name, description) => {
            try {
              await createOrganization(name, description);
              setShowCreateOrgModal(false);
              showToast("Organization created successfully");
              if (address) await fetchOrganizationsByOwner(address);
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
              const job = await createJob(selectedOrgId ?? 0, jobData.title, jobData.description, jobData.payment, jobData.milestoneCount, jobData.tokenAddress);
              setSelectedJob(job);
              setShowCreateJobModal(false);
              setShowMilestonesModal(true);
              showToast("Job created successfully");
              await refetchJobs();
            } catch (e) {
              console.error(e);
              showToast("Failed to create job", true);
            }
          }}
        />

        <MilestoneModal
          isOpen={showMilestonesModal}
          job={selectedJob}
          onClose={() => setShowMilestonesModal(false)}
          onSave={() => showToast("Milestones saved successfully")}
        />

        <JobDetailsModal
          isOpen={showJobDetailsModal}
          job={selectedJob}
          onClose={() => setShowJobDetailsModal(false)}
        />

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
