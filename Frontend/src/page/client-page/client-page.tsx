import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrganizations } from "../../hooks/useOrganisation";
import { useJobs } from "../../hooks/useJobs";
// import { useMyWork } from "../../hooks/useWork";
import OrganizationList from "../../components/lists/organisationList";
import JobList from "../../components/lists/jobList";
// import WorkList from "../../components/lists/workList";
import CreateOrganizationModal from "../../components/modals/organizationModal";
import CreateJobModal from "../../components/modals/createJobmodal";
import JobDetailsModal from "../../components/modals/jobdetailsModal";
import MilestoneModal from "../../components/modals/milestoneModal";
import Toast from "../../components/common/Toast";

const ClientPage: React.FC = () => {
  const { address, isConnected } = useAuth();

  const [activeTab, setActiveTab] = useState<'organizations' | 'jobs' | 'work'>('organizations');
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);

  const [toast, setToast] = useState({ message: '', isError: false, visible: false });
  const { isPending, loading, organizations, createOrganization, fetchOrganizationsByOwner } = useOrganizations();
  const { jobs } = useJobs(selectedOrgId);
  // const { myWork } = useMyWork();

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  if (!isConnected) {
    return (
      <div className="p-8 min-h-screen mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Wallet Connection Required</p>
          <p>Please connect your wallet to use the FairPay platform.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-6 py-3 text-lg font-medium ${activeTab === "organizations" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Organizations
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-6 py-3 text-lg font-medium ${activeTab === "jobs" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Jobs
          </button>
          {/* <button
            onClick={() => setActiveTab("work")}
            className={`px-6 py-3 text-lg font-medium ${activeTab === "work" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Work
          </button> */}
        </div>

        {activeTab === "organizations" && (
          <OrganizationList
            organizations={organizations}
            onCreateClick={() => setShowCreateOrgModal(true)}
            onSelect={id => {
              setSelectedOrgId(id);
              setActiveTab("jobs");
            }}
            isLoading={loading}
          />
        )}

        {activeTab === "jobs" && (
          <JobList
            jobs={jobs}
            selectedOrgId={selectedOrgId}
            organizations={organizations}
            onCreateClick={() => setShowCreateJobModal(true)}
            onSelectJob={job => {
              setSelectedJob(job);
              setShowJobDetailsModal(true);
            }}
          />
        )}

        {/* {activeTab === "work" && (
          <WorkList
            myWork={myWork}
            onSelectJob={job => {
              setSelectedJob(job);
              setShowJobDetailsModal(true);
            }}
          />
        )} */}
        <CreateOrganizationModal
          isLoading={isPending}
          isOpen={showCreateOrgModal}
          onClose={() => setShowCreateOrgModal(false)}
          onCreate={async (name, description) => {
            try {
              await createOrganization(name, description);
              setShowCreateOrgModal(false); // Close modal
              showToast("Organization created successfully");
              if (address) {
                await fetchOrganizationsByOwner(address); // Refresh list
              }
            } catch (e) {
              console.error(e)
              showToast("Failed to create organization", true);
            }
          }}

        />

        <CreateJobModal
          isOpen={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onCreate={() => {
            // setJobs(prev => [...prev, job]);
            // setSelectedJob(job);
            setShowMilestonesModal(true);
            showToast("Job created successfully");
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
        // onUpdate={(updatedJob) => {
        //   setJobs(jobs.map(j => j.address === updatedJob.address ? updatedJob : j));
        //   showToast("Job updated");
        // }
        />

        {toast.visible && <Toast message={toast.message} isError={toast.isError} visible={false} />}
      </div>
    </div>
  );
};

export default ClientPage;
