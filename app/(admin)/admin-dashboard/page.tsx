// app/(admin)/admin-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart,
  Plus,
  FileText,
  Settings,
  Calendar,
  MessageSquare,
  Shield,
  Clock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats, Project, Activity } from "@/types";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    atRiskProjects: 0,
    avgHealthScore: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
    fetchActivities();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        const projects: Project[] = data.projects || [];

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
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await await fetch("/api/activities?limit=10");
      const data = await response.json();

      if (data.success) {
        setActivities(data.activities || []);
      } else {
        toast.error("Failed to load activities");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const refreshAll = () => {
    setLoading(true);
    setActivitiesLoading(true);
    fetchDashboardData();
    fetchActivities();
    toast.success("Dashboard refreshed");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "checkin":
        return (
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
      case "feedback":
        return (
          <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        );
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "health_updated":
        return (
          <BarChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        );
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "checkin":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "feedback":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "risk":
        return "bg-destructive/10";
      case "health_updated":
        return "bg-emerald-100 dark:bg-emerald-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusBadge = (type: string, description?: string) => {
    if (type === "risk") {
      const severity = description?.toLowerCase().includes("high")
        ? "High"
        : description?.toLowerCase().includes("medium")
        ? "Medium"
        : "Low";
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs ${
            severity === "High"
              ? "bg-destructive/10 text-destructive"
              : severity === "Medium"
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          }`}
        >
          {severity} Risk
        </div>
      );
    }

    if (description?.includes("Confidence: 5")) {
      return (
        <div className="px-2 py-1 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          Excellent
        </div>
      );
    }

    if (description?.includes("Satisfaction: 5")) {
      return (
        <div className="px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
          Happy Client
        </div>
      );
    }

    return null;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return format(date, "MMM dd");
    }
  };

  if (!mounted || loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3"
          >
            <Settings className="w-4 h-4" />
            Admin Overview
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Dashboard
            <span className="block text-primary text-xl md:text-2xl mt-1">
              Project Health & Risk Monitoring
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor project health and manage teams effectively
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={refreshAll}
            disabled={loading || activitiesLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading || activitiesLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Link href="/projects">
            <Button className="gap-2">
              <BarChart className="w-4 h-4" />
              View All Projects
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-border hover:border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.totalProjects}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Across all clients
              </p>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>All projects tracked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-border hover:border-emerald-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.activeProjects}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Currently in progress
              </p>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>Ongoing development</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* At Risk Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-border hover:border-destructive/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                At Risk
              </CardTitle>
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.atRiskProjects}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Need immediate attention
              </p>
              <div className="mt-4 pt-3 border-t border-destructive/20">
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span>Critical attention needed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avg Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-border hover:border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Health Score
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${
                  stats.avgHealthScore >= 80
                    ? "text-emerald-600 dark:text-emerald-400"
                    : stats.avgHealthScore >= 60
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-destructive"
                }`}
              >
                {stats.avgHealthScore}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Overall project health
              </p>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      stats.avgHealthScore >= 80
                        ? "bg-emerald-500"
                        : stats.avgHealthScore >= 60
                        ? "bg-amber-500"
                        : "bg-destructive"
                    }`}
                  ></div>
                  <span>
                    {stats.avgHealthScore >= 80
                      ? "Excellent"
                      : stats.avgHealthScore >= 60
                      ? "Moderate"
                      : "Needs Improvement"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions - 1 column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="h-full border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your projects efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start h-auto py-4 px-6 text-left hover:shadow-md transition-all"
                variant="default"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      Create New Project
                    </div>
                    <div className="text-sm text-primary-foreground/70 mt-1">
                      Start a new project with team
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 text-left hover:shadow-md transition-all border-border hover:border-primary/30"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      Manage Teams
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Assign and manage project teams
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 text-left hover:shadow-md transition-all border-border hover:border-destructive/30"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      Risk Reports
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Generate risk analytics
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-6 text-left hover:shadow-md transition-all border-border hover:border-emerald-500/30"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      Health Analytics
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      View detailed health metrics
                    </div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity - 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Latest updates from your projects
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchActivities}
                disabled={activitiesLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    activitiesLoading ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {activity.title}
                            </h4>
                            {activity.project?.name && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Project:{" "}
                                <span className="font-medium">
                                  {activity.project.name}
                                </span>
                              </p>
                            )}
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(activity.type, activity.description)}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {activity.createdAt &&
                              formatTimeAgo(activity.createdAt.toString())}
                          </div>
                          {activity.user?.name && (
                            <div className="text-xs text-muted-foreground">
                              By: {activity.user.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">
                    No Recent Activity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Activity will appear here when team members submit updates
                  </p>
                </div>
              )}

              {activities.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Health Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              System Health
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Overall system status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      API Status
                    </div>
                    <div className="text-sm text-muted-foreground">
                      All systems operational
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      Response Time
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average: 120ms
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4"></div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      Security Status
                    </div>
                    <div className="text-sm text-muted-foreground">
                      All checks passed
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-destructive/10 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
