"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, AlertTriangle, CheckCircle, Users } from "lucide-react";
import Link from "next/link";
import { DashboardStats, Project } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    atRiskProjects: 0,
    avgHealthScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        const projects: Project[] = data.projects || [];

        // Calculate stats without using 'any'
        const active = projects.filter((p) => p.status !== "completed").length;

        const atRisk = projects.filter(
          (p) => p.status === "at_risk" || p.status === "critical"
        ).length;

        const avgScore =
          projects.length > 0
            ? Math.round(
                projects.reduce((acc, p) => acc + p.healthScore, 0) /
                  projects.length
              )
            : 0;

        setStats({
          totalProjects: projects.length,
          activeProjects: active,
          atRiskProjects: atRisk,
          avgHealthScore: avgScore,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor project health and manage teams
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects">
            <Button>View All Projects</Button>
          </Link>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProjects}</div>
            <p className="text-sm text-gray-500">Across all clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeProjects}</div>
            <p className="text-sm text-gray-500">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.atRiskProjects}</div>
            <p className="text-sm text-gray-500">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Avg Health Score
            </CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgHealthScore}%</div>
            <p className="text-sm text-gray-500">Overall project health</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="justify-start h-auto py-4 px-6 text-left">
              <div>
                <div className="font-medium">Create New Project</div>
                <div className="text-sm text-gray-500">Start a new project</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-6 text-left"
            >
              <div>
                <div className="font-medium">Assign Team Members</div>
                <div className="text-sm text-gray-500">
                  Manage project teams
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto py-4 px-6 text-left"
            >
              <div>
                <div className="font-medium">View Reports</div>
                <div className="text-sm text-gray-500">Generate analytics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
