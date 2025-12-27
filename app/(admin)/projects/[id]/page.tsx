"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Calendar,
  User,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  FileText,
  Shield,
} from "lucide-react";
import { Project, Activity } from "@/types";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
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
      // Try specific project endpoint first
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProject(data.project);
          return;
        }
      }

      // Fallback to all projects endpoint
      const allResponse = await fetch(`/api/projects`);
      const allData = await allResponse.json();

      if (allData.success) {
        const foundProject = allData.projects?.find(
          (p: Project) => p._id === projectId
        );
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast.error("Project not found");
          router.push("/projects");
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    }
  };

  const fetchProjectActivities = async () => {
    try {
      const response = await fetch(`/api/activity?projectId=${projectId}`);
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
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
      case "health_updated":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "checkin":
        return "bg-blue-50 border-blue-200";
      case "feedback":
        return "bg-green-50 border-green-200";
      case "risk":
        return "bg-red-50 border-red-200";
      case "health_updated":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Project not found
          </h1>
          <p className="text-gray-600">
            The project you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <Badge
          className={`px-4 py-1.5 text-sm font-medium ${
            project.status === "on_track"
              ? "bg-green-100 text-green-800 border-green-200"
              : project.status === "at_risk"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : project.status === "critical"
              ? "bg-red-100 text-red-800 border-red-200"
              : "bg-blue-100 text-blue-800 border-blue-200"
          }`}
        >
          {project.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Score Card */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Project Health
              </CardTitle>
              <CardDescription className="text-gray-600">
                Current project health status and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {project.healthScore}%
                  </div>
                  <p className="text-gray-500">Overall Health Score</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    project.healthScore >= 80
                      ? "bg-green-50 text-green-700"
                      : project.healthScore >= 60
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <div className="text-xl font-bold">
                    {project.healthScore >= 80
                      ? "ON TRACK"
                      : project.healthScore >= 60
                      ? "AT RISK"
                      : "CRITICAL"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Health Progress</span>
                  <span className="font-medium">{project.healthScore}%</span>
                </div>
                <Progress
                  value={project.healthScore}
                  className={`h-2 ${
                    project.healthScore >= 80
                      ? "[&>div]:bg-green-500"
                      : project.healthScore >= 60
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-red-500"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Activity Timeline
              </CardTitle>
              <CardDescription className="text-gray-600">
                Recent updates and activities for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    No activity yet
                  </h3>
                  <p className="text-gray-500">
                    Activity will appear here when updates are made
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "checkin"
                            ? "bg-blue-100"
                            : activity.type === "feedback"
                            ? "bg-green-100"
                            : activity.type === "risk"
                            ? "bg-red-100"
                            : "bg-purple-100"
                        }`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {activity.title}
                            </h4>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(activity.createdAt.toString())}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(activity.createdAt.toString())}
                          </div>
                          {activity.user &&
                            typeof activity.user === "object" &&
                            activity.user.name && (
                              <div className="text-xs text-gray-500">
                                By: {activity.user.name}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activities.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Project Info */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {project.client.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.client.email}
                    </p>
                    <Badge className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                      Client
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Team Members
              </CardTitle>
              <CardDescription className="text-gray-600">
                {project.employees.length} team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.employees.map((employee) => (
                  <div
                    key={employee._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.role || "Team Member"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Start Date</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatDate(project.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">End Date</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatDate(project.endDate)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {Math.ceil(
                        (new Date(project.endDate).getTime() -
                          new Date(project.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <TrendingUp className="w-4 h-4" />
                Update Health Score
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Risk
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Shield className="w-4 h-4" />
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
