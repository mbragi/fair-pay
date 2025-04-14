import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';

// Types
interface Organization {
  id: number;
  name: string;
  description: string;
  owner: string;
  isActive: boolean;
  createdAt: number;
  isOwner: boolean;
}

interface Job {
  address: string;
  title: string;
  description: string;
  totalPayment: string;
  status: number;
  employer: string;
  worker: string | null;
  milestoneCount: number;
  currentMilestone: number;
  organizationId: number;
}

interface Milestone {
  title: string;
  description: string;
  amount: string;
  deadline: number;
  status: number;
  index: number;
}

// Main component
const ClientPage: React.FC = () => {
  // Auth state
  const { address, isConnected } = useAccount();


  // App state
  const [activeTab, setActiveTab] = useState<'organizations' | 'jobs' | 'work'>('organizations');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myWork, setMyWork] = useState<Job[]>([]);
  
  // Modal state
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  
  // Form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobPayment, setNewJobPayment] = useState('');
  const [newJobMilestoneCount, setNewJobMilestoneCount] = useState(1);
  const [newJobToken, setNewJobToken] = useState('');
  
  // Selected job data
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobMilestones, setJobMilestones] = useState<Milestone[]>([]);
  const [workerAddress, setWorkerAddress] = useState('');

  // Toast notification
  const [toast, setToast] = useState({ message: '', isError: false, visible: false });

  // Mock data for demo purposes
  useEffect(() => {
    if (isConnected) {
      // Simulated data fetch
      setOrganizations([
        {
          id: 1,
          name: 'Design Studio',
          description: 'UI/UX Design Agency',
          owner: address || '',
          isActive: true,
          createdAt: Date.now() / 1000 - 2592000, // 30 days ago
          isOwner: true
        },
        {
          id: 2,
          name: 'Web3 Developers',
          description: 'Blockchain Development Team',
          owner: '0x1234567890123456789012345678901234567890',
          isActive: true,
          createdAt: Date.now() / 1000 - 5184000, // 60 days ago
          isOwner: false
        }
      ]);
    }
  }, [isConnected, address]);

  // Load jobs when org is selected
  useEffect(() => {
    if (selectedOrgId) {
      // Simulated job data
      setJobs([
        {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          title: 'Landing Page Design',
          description: 'Design a marketing landing page for our DeFi product',
          totalPayment: '0.5',
          status: 0, // Created
          employer: address || '',
          worker: null,
          milestoneCount: 3,
          currentMilestone: 0,
          organizationId: selectedOrgId
        },
        {
          address: '0x0987654321fedcba0987654321fedcba09876543',
          title: 'Smart Contract Audit',
          description: 'Security audit for our token contract',
          totalPayment: '2.0',
          status: 1, // In Progress
          employer: address || '',
          worker: '0x2468135790246813579024681357902468135790',
          milestoneCount: 2,
          currentMilestone: 0,
          organizationId: selectedOrgId
        }
      ]);
    }
  }, [selectedOrgId, address]);

  // Load work assignments
  useEffect(() => {
    if (isConnected) {
      // Simulated work data
      setMyWork([
        {
          address: '0x13579024681357902468135790246813579abcde',
          title: 'NFT Collection Website',
          description: 'Develop a website for an upcoming NFT collection',
          totalPayment: '1.2',
          status: 1, // In Progress
          employer: '0x9876543210abcdef9876543210abcdef98765432',
          worker: address || '',
          milestoneCount: 4,
          currentMilestone: 1,
          organizationId: 1
        }
      ]);
    }
  }, [isConnected, address]);

  // Load job details when a job is selected
  useEffect(() => {
    if (selectedJob) {
      // Simulated milestone data
      const milestones: Milestone[] = [];
      
      for (let i = 0; i < selectedJob.milestoneCount; i++) {
        milestones.push({
          title: `Milestone ${i + 1}`,
          description: `Description for milestone ${i + 1}`,
          amount: (parseFloat(selectedJob.totalPayment) / selectedJob.milestoneCount).toFixed(3),
          deadline: 0,
          status: i === selectedJob.currentMilestone ? 1 : (i < selectedJob.currentMilestone ? 2 : 0),
          index: i
        });
      }
      
      setJobMilestones(milestones);
    }
  }, [selectedJob]);

  // UI Handlers


  const handleTabChange = (tab: 'organizations' | 'jobs' | 'work') => {
    setActiveTab(tab);
  };

  const handleOrganizationSelect = (orgId: number) => {
    setSelectedOrgId(orgId);
    setActiveTab('jobs');
  };

  const handleCreateOrg = () => {
    // Mock implementation
    const newOrg: Organization = {
      id: organizations.length + 1,
      name: newOrgName,
      description: newOrgDescription,
      owner: address || '',
      isActive: true,
      createdAt: Math.floor(Date.now() / 1000),
      isOwner: true
    };
    
    setOrganizations([...organizations, newOrg]);
    setNewOrgName('');
    setNewOrgDescription('');
    setShowCreateOrgModal(false);
    showToast('Organization created successfully');
  };

  const handleCreateJob = () => {
    // Mock implementation
    if (!selectedOrgId) return;
    
    const newJob: Job = {
      address: `0x${Math.random().toString(16).substring(2, 30)}`,
      title: newJobTitle,
      description: newJobDescription,
      totalPayment: newJobPayment,
      status: 0, // Created
      employer: address || '',
      worker: null,
      milestoneCount: newJobMilestoneCount,
      currentMilestone: 0,
      organizationId: selectedOrgId
    };
    
    setJobs([...jobs, newJob]);
    setSelectedJob(newJob);
    setNewJobTitle('');
    setNewJobDescription('');
    setNewJobPayment('');
    setNewJobMilestoneCount(1);
    setNewJobToken('');
    setShowCreateJobModal(false);
    setShowMilestonesModal(true);
    showToast('Job created successfully');
  };

  const handleSetMilestones = () => {
    // Mock implementation
    setShowMilestonesModal(false);
    showToast('Milestones set successfully');
  };

  const handleOpenJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetailsModal(true);
  };

  const handleAssignWorker = () => {
    if (!selectedJob || !workerAddress) return;
    
    const updatedJobs = jobs.map(job => 
      job.address === selectedJob.address 
        ? { ...job, worker: workerAddress } 
        : job
    );
    
    setJobs(updatedJobs);
    setSelectedJob({ ...selectedJob, worker: workerAddress });
    setWorkerAddress('');
    showToast('Worker assigned successfully');
  };

  const handleDepositFunds = () => {
    if (!selectedJob) return;
    
    const updatedJobs = jobs.map(job => 
      job.address === selectedJob.address 
        ? { ...job, status: 1 } 
        : job
    );
    
    setJobs(updatedJobs);
    setSelectedJob({ ...selectedJob, status: 1 });
    showToast('Funds deposited successfully');
  };

  const handleConfirmJob = () => {
    if (!selectedJob) return;
    
    const updatedMyWork = [...myWork, selectedJob];
    setMyWork(updatedMyWork);
    showToast('Job confirmed successfully');
  };

  const handleSubmitMilestone = (index: number) => {
    const updatedMilestones = jobMilestones.map(milestone => 
      milestone.index === index 
        ? { ...milestone, status: 2 } // Completed
        : milestone
    );
    
    setJobMilestones(updatedMilestones);
    showToast('Milestone submitted successfully');
  };

  const handleApproveMilestone = (index: number) => {
    if (!selectedJob) return;
    
    const updatedMilestones = jobMilestones.map(milestone => 
      milestone.index === index 
        ? { ...milestone, status: 2 } // Completed
        : milestone
    );
    
    const nextMilestoneIndex = index + 1;
    
    if (nextMilestoneIndex < selectedJob.milestoneCount) {
      // Move to next milestone
      const nextMilestones = updatedMilestones.map(milestone => 
        milestone.index === nextMilestoneIndex 
          ? { ...milestone, status: 1 } // In Progress
          : milestone
      );
      
      setJobMilestones(nextMilestones);
      setSelectedJob({ ...selectedJob, currentMilestone: nextMilestoneIndex });
    } else {
      // Complete job
      setSelectedJob({ ...selectedJob, status: 2, currentMilestone: nextMilestoneIndex });
    }
    
    showToast('Milestone approved and payment released');
  };

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // Status helpers
  const getJobStatusLabel = (status: number) => {
    const statusMap = ["Created", "In Progress", "Completed", "Cancelled"];
    return statusMap[status] || "Unknown";
  };

  const getMilestoneStatusLabel = (status: number) => {
    const statusMap = ["Not Started", "In Progress", "Completed", "Disputed"];
    return statusMap[status] || "Unknown";
  };

  const getMilestoneStatusColor = (status: number) => {
    const colorMap = [
      "bg-gray-100 text-gray-800", // Not Started
      "bg-blue-100 text-blue-800", // In Progress
      "bg-green-100 text-green-800", // Completed
      "bg-red-100 text-red-800" // Disputed
    ];
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
    

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">Wallet Connection Required</p>
            <p>Please connect your wallet to use the FairPay platform.</p>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <div className="flex border-b mb-6">
              <button 
                onClick={() => handleTabChange('organizations')}
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'organizations' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                My Organizations
              </button>
              <button 
                onClick={() => handleTabChange('jobs')}
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'jobs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Jobs
              </button>
              <button 
                onClick={() => handleTabChange('work')}
                className={`px-6 py-3 text-lg font-medium ${activeTab === 'work' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                My Work
              </button>
            </div>

            {/* Organizations Tab Content */}
            {activeTab === 'organizations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Organizations</h2>
                  <button 
                    onClick={() => setShowCreateOrgModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Organization
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizations.length > 0 ? (
                    organizations.map(org => (
                      <div key={org.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {org.isOwner ? 'Owner' : 'Member'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{org.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Created {new Date(org.createdAt * 1000).toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => handleOrganizationSelect(org.id)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              View Jobs
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <p className="text-gray-500 mb-4">You don't have any organizations yet</p>
                      <button 
                        onClick={() => setShowCreateOrgModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                      >
                        Create Your First Organization
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Jobs Tab Content */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Organization Jobs</h2>
                  <div>
                    <select 
                      value={selectedOrgId || ''}
                      onChange={e => setSelectedOrgId(e.target.value ? parseInt(e.target.value) : null)}
                      className="mr-4 p-2 border rounded"
                    >
                      <option value="">Select Organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => setShowCreateJobModal(true)}
                      disabled={!selectedOrgId}
                      className={`${!selectedOrgId ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded transition flex items-center`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create Job
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedOrgId && jobs.length > 0 ? (
                    jobs.map(job => (
                      <div 
                        key={job.address} 
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                        onClick={() => handleOpenJobDetails(job)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 1 ? 'bg-blue-100 text-blue-800' :
                            job.status === 2 ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getJobStatusLabel(job.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Payment: <span className="font-medium">{job.totalPayment} ETH</span>
                          </span>
                          <span className="text-gray-500">
                            Milestones: <span className="font-medium">{job.milestoneCount}</span>
                          </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Worker: {job.worker ? 
                                `${job.worker.substring(0, 6)}...${job.worker.substring(job.worker.length - 4)}` : 
                                'Not assigned'
                              }
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-gray-500">
                      {selectedOrgId ? 'No jobs found for this organization' : 'Select an organization to view its jobs'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Tab Content */}
            {/* {activeTab === 'work' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Work</h2>
                  <p className="text-gray-600">Jobs assigned to you as a worker</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myWork.length > 0 ? (
                    myWork.map(job => (
                      <div 
                        key={job.address} 
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                        onClick={() => handleOpenJobDetails(job)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                            job.status === 1 ? 'bg-blue-100 text-blue-800' :
                            job.status === 2 ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getJobStatusLabel(job.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Payment: <span className="font-medium">{job.totalPayment} ETH</span>
                          </span>
                          <span className="text-gray-500">
                            Progress: <span className="font-medium">{job.currentMilestone}/{job.milestoneCount} milestones</span>
                          </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Employer: {`${job.employer.substring(0, 6)}...${job.employer.substring(job.employer.length - 4)}`}
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-gray-500">
                      You don't have any work assignments yet
                    </div>
                  )}
                </div>
              </div>
            )} */}
          </>
        )}
      </div>

      {/* Create Organization Modal */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Organization</h3>
              <button 
                onClick={() => setShowCreateOrgModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleCreateOrg(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="org-name">Organization Name</label>
                <input 
                  type="text" 
                  id="org-name" 
                  className="w-full p-2 border rounded"
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="org-description">Description</label>
                <textarea 
                  id="org-description" 
                  className="w-full p-2 border rounded" 
                  rows={4}
                  value={newOrgDescription}
                  onChange={e => setNewOrgDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowCreateOrgModal(false)}
                  className="mr-4 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
   {/* Create Job Modal */}
   {showCreateJobModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Job</h3>
              <button 
                onClick={() => setShowCreateJobModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleCreateJob(); }}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="job-title">Job Title</label>
                <input 
                  type="text" 
                  id="job-title" 
                  className="w-full p-2 border rounded"
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="job-description">Description</label>
                <textarea 
                  id="job-description" 
                  className="w-full p-2 border rounded" 
                  rows={4}
                  value={newJobDescription}
                  onChange={e => setNewJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="job-payment">Total Payment (ETH)</label>
                <input 
                  type="number" 
                  id="job-payment" 
                  className="w-full p-2 border rounded"
                  value={newJobPayment}
                  onChange={e => setNewJobPayment(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="job-milestones">Number of Milestones</label>
                <input 
                  type="number" 
                  id="job-milestones" 
                  className="w-full p-2 border rounded"
                  value={newJobMilestoneCount}
                  onChange={e => setNewJobMilestoneCount(parseInt(e.target.value))}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowCreateJobModal(false)}
                  className="mr-4 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Milestones Modal */}
      {showMilestonesModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Set Milestones for {selectedJob?.title}</h3>
              <button 
                onClick={() => setShowMilestonesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              {jobMilestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-2">Milestone {index + 1}</h4>
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                      value={milestone.title}
                      onChange={e => {
                        const updated = [...jobMilestones];
                        updated[index].title = e.target.value;
                        setJobMilestones(updated);
                      }}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border rounded" 
                      rows={3}
                      value={milestone.description}
                      onChange={e => {
                        const updated = [...jobMilestones];
                        updated[index].description = e.target.value;
                        setJobMilestones(updated);
                      }}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">Amount (ETH)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={milestone.amount}
                      onChange={e => {
                        const updated = [...jobMilestones];
                        updated[index].amount = e.target.value;
                        setJobMilestones(updated);
                      }}
                      min="0.001"
                      step="0.001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Deadline (days)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      value={milestone.deadline}
                      onChange={e => {
                        const updated = [...jobMilestones];
                        updated[index].deadline = parseInt(e.target.value);
                        setJobMilestones(updated);
                      }}
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowMilestonesModal(false)}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSetMilestones}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Save Milestones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedJob.title}</h3>
              <button 
                onClick={() => setShowJobDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{selectedJob.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedJob.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                      selectedJob.status === 1 ? 'bg-blue-100 text-blue-800' :
                      selectedJob.status === 2 ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getJobStatusLabel(selectedJob.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Payment</p>
                  <p className="font-medium">{selectedJob.totalPayment} ETH</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Milestones</p>
                  <p className="font-medium">{selectedJob.currentMilestone}/{selectedJob.milestoneCount} completed</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Employer</p>
                  <p className="font-medium">
                    {selectedJob.employer.substring(0, 6)}...{selectedJob.employer.substring(selectedJob.employer.length - 4)}
                  </p>
                </div>
                {selectedJob.worker && (
                  <div>
                    <p className="text-gray-500 text-sm">Worker</p>
                    <p className="font-medium">
                      {selectedJob.worker.substring(0, 6)}...{selectedJob.worker.substring(selectedJob.worker.length - 4)}
                    </p>
                  </div>
                )}
              </div>
              
              <h4 className="font-bold text-lg mb-3">Milestones</h4>
              <div className="space-y-3">
                {jobMilestones.map((milestone, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getMilestoneStatusColor(milestone.status)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">{milestone.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs ${getMilestoneStatusColor(milestone.status)}`}>
                        {getMilestoneStatusLabel(milestone.status)}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{milestone.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Amount: {milestone.amount} ETH</span>
                      {milestone.deadline > 0 && (
                        <span>Deadline: {milestone.deadline} days</span>
                      )}
                    </div>
                    
                    {/* Action buttons based on role and status */}
                    {activeTab === 'work' && milestone.status === 1 && (
                      <div className="mt-3">
                        <button 
                          onClick={() => handleSubmitMilestone(index)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                        >
                          Submit Work
                        </button>
                      </div>
                    )}
                    
                    {activeTab === 'jobs' && selectedJob.employer === address && milestone.status === 1 && (
                      <div className="mt-3">
                        <button 
                          onClick={() => handleApproveMilestone(index)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Approve & Pay
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Job action buttons based on status and role */}
            {activeTab === 'jobs' && selectedJob.employer === address && (
              <div className="pt-4 border-t border-gray-200">
                {selectedJob.status === 0 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 mb-1">Assign Worker Address</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          className="flex-1 p-2 border rounded-l"
                          placeholder="0x..."
                          value={workerAddress}
                          onChange={e => setWorkerAddress(e.target.value)}
                        />
                        <button 
                          type="button"
                          onClick={handleAssignWorker}
                          disabled={!workerAddress}
                          className={`${!workerAddress ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-r`}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                    {selectedJob.worker && (
                      <button 
                        onClick={handleDepositFunds}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                      >
                        Deposit Funds and Start Job
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'work' && selectedJob.worker === address && selectedJob.status === 0 && (
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={handleConfirmJob}
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Confirm Job Assignment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
          toast.isError ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
export default ClientPage;