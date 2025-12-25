"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  User,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Project, Activity } from "@/types";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchProjectActivities();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects`);
      const data = await response.json();

      if (data.success) {
        const foundProject = data.projects.find(
          (p: Project) => p._id === projectId
        );
        setProject(foundProject || null);
      }
    } catch (error) {
      toast.error("Failed to load project details");
    }
  };

  const fetchProjectActivities = async () => {
    try {
      const response = await fetch(`/api/activity?projectId=${projectId}`);
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "checkin":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-gray-600">
          The project you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Badge
          className={
            project.status === "on_track"
              ? "bg-green-100 text-green-800"
              : project.status === "at_risk"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        >
          {project.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    Health Score: {project.healthScore}%
                  </span>
                  <div
                    className={`text-2xl font-bold ${
                      project.healthScore >= 80
                        ? "text-green-600"
                        : project.healthScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {project.healthScore >= 80
                      ? "ON TRACK"
                      : project.healthScore >= 60
                      ? "AT RISK"
                      : "CRITICAL"}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      project.healthScore >= 80
                        ? "bg-green-600"
                        : project.healthScore >= 60
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${project.healthScore}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No activity yet
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <User className="w-3 h-3" />
                          <span className="text-xs text-gray-500">
                            {typeof activity.user === "object"
                              ? activity.user.name
                              : "User"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Project Info */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{project.client.name}</span>
                </div>
                <p className="text-sm text-gray-600">{project.client.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.employees.map((employee) => (
                  <div key={employee._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Date</span>
                  <span className="font-medium">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Date</span>
                  <span className="font-medium">
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">
                    {Math.ceil(
                      (new Date(project.endDate).getTime() -
                        new Date(project.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full">Update Health Score</Button>
                <Button variant="outline" className="w-full">
                  Report Risk
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
