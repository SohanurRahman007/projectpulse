"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart,
  RefreshCw,
  Calendar,
  MessageSquare,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats, Activity } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    atRiskProjects: 0,
    avgHealthScore: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchActivities();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        const projects = data.projects || [];

        const active = projects.filter(
          (p: any) => p.status !== "completed"
        ).length;
        const atRisk = projects.filter(
          (p: any) => p.status === "at_risk" || p.status === "critical"
        ).length;
        const avgScore =
          projects.length > 0
            ? Math.round(
                projects.reduce(
                  (acc: number, p: any) => acc + p.healthScore,
                  0
                ) / projects.length
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
      const response = await fetch("/api/activity?limit=10");
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
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "health_updated":
        return <BarChart className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Overview
          </h1>
          <p className="text-gray-600 mt-2">
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
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats.totalProjects}
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Across all clients</p>
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats.activeProjects}
                </h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Currently in progress</p>
          </div>
        </motion.div>

        {/* At Risk Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">At Risk</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats.atRiskProjects}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Need immediate attention</p>
          </div>
        </motion.div>

        {/* Avg Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Avg Health Score</p>
                <h3
                  className={`text-3xl font-bold mt-2 ${
                    stats.avgHealthScore >= 80
                      ? "text-emerald-600"
                      : stats.avgHealthScore >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.avgHealthScore}%
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Overall project health</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Latest updates from your projects
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchActivities}
              disabled={activitiesLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${activitiesLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
        <div className="p-6">
          {activitiesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
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
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {activity.title}
                        </h4>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {activity.createdAt &&
                          formatTimeAgo(activity.createdAt.toString())}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                No Recent Activity
              </h3>
              <p className="text-sm text-gray-600">
                Activity will appear here when team members submit updates
              </p>
            </div>
          )}

          {activities.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
