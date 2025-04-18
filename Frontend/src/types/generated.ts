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

export enum JobStatus {
  Created = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export enum MilestoneStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  Disputed = 3
}

export interface MilestoneInfo {
  title: string;
  description: string;
  amount: bigint;
  deadline: bigint;
  status: MilestoneStatus;
}

export interface JobInfo {
  jobAddress: string;
  employer: string;
  worker: string;
  title: string;
  description: string;
  totalPayment: bigint;
  status: JobStatus;
  milestoneCount: bigint;
  currentMilestone: bigint;
  milestones: MilestoneInfo[];
  tokenAddress?: string;
}

export interface PaymentInfo {
  totalPayment: bigint;
  paidAmount: bigint;
  remainingAmount: bigint;
  platformFeeAmount: bigint;
}


