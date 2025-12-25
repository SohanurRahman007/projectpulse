// Common types for the whole application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
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

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  client: string;
  employees: string[];
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  atRiskProjects: number;
  avgHealthScore: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// Generic API response
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// For forms
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