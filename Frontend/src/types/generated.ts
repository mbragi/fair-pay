export interface Job {
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

export interface Milestone {
  title: string;
  description: string;
  amount: string;
  deadline: number;
  status: number;
  index: number;
}


