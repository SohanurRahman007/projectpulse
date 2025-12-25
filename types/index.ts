// Common types for the whole application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
}

export interface Project {
  _id: string;  // MongoDB uses _id
  name: string;
  description: string;
  status: 'on_track' | 'at_risk' | 'critical' | 'completed';
  healthScore: number;
  startDate: string;  // API returns string, Date conversion in component
  endDate: string;    // API returns string, Date conversion in component
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
  client: string;  // client ID
  employees: string[];  // array of employee IDs
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

// For API responses - Generic type without 'any'
export interface ApiResponse<T = unknown> {
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

// For API route handlers
export interface ApiHandlerResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;  // Flexible for additional data
}