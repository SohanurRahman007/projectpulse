// Common types for the whole application
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'client';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'on_track' | 'at_risk' | 'critical' | 'completed';
  healthScore: number;
  startDate: Date;
  endDate: Date;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}