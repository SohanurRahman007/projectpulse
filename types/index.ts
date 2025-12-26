// Common types for the whole application

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'on_track' | 'at_risk' | 'critical' | 'completed';
  healthScore: number;
  startDate: string;
  endDate: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  employees: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  atRiskProjects: number;
  avgHealthScore: number;
}

export interface Checkin {
  _id: string;
  project: string | Project;
  employee: string | User;
  weekStartDate: string;
  progressSummary: string;
  blockers: string;
  confidenceLevel: number;
  completionPercentage: number;
  submittedAt: string;
}

export interface Feedback {
  _id: string;
  project: string | Project;
  client: string | User;
  weekStartDate: string;
  satisfactionRating: number;
  communicationRating: number;
  comments: string;
  flagIssue: boolean;
  submittedAt: string;
}

export interface Risk {
  _id: string;
  project: string | Project;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigationPlan: string;
  status: 'open' | 'in_progress' | 'resolved';
  reportedBy: string | User;
  assignedTo?: string | User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  type: 'checkin' | 'feedback' | 'risk' | 'health_updated' | 'status_change';
  title: string;
  description?: string;
  project?: string | { _id: string; name: string };
  user?: string | { _id: string; name: string };
  createdAt: string | Date;
}

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  client: string;
  employees: string[];
}

export interface CheckinFormData {
  projectId: string;
  progressSummary: string;
  blockers: string;
  confidenceLevel: number;
  completionPercentage: number;
}

export interface FeedbackFormData {
  projectId: string;
  satisfactionRating: number;
  communicationRating: number;
  comments: string;
  flagIssue: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}