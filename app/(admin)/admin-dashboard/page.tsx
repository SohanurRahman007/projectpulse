"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Users,
  RefreshCw,
  Clock,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats, Activity } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTheme } from "next-themes";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
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
      if (data.success) setActivities(data.activities || []);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setActivitiesLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    // Background logic: Pure Black for Dark, Pure White for Light
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border ${
                theme === "dark"
                  ? "bg-destructive/10 text-destructive border-destructive/30"
                  : "bg-destructive/5 text-destructive border-destructive/20"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard{" "}
              <span className="text-destructive font-extrabold">Pulse</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Monitor project health and system-wide risks in real-time.
            </p>
          </motion.div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                fetchDashboardData();
                fetchActivities();
                toast.success("Refreshed");
              }}
              className={`gap-2 ${
                theme === "dark"
                  ? "border-white/10 hover:bg-white/5"
                  : "border-black/10 hover:bg-black/5"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Sync
            </Button>
            <Link href="/projects">
              <Button className="bg-destructive hover:bg-destructive/90 text-white gap-2">
                <AlertTriangle className="w-4 h-4" />
                Manage Risks
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Projects",
              value: stats.totalProjects,
              icon: Users,
              color: "text-primary",
              bg: theme === "dark" ? "bg-white/5" : "bg-black/5",
            },
            {
              label: "Active Status",
              value: stats.activeProjects,
              icon: CheckCircle,
              color: "text-blue-500",
              bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-500/5",
            },
            {
              label: "At Risk",
              value: stats.atRiskProjects,
              icon: AlertTriangle,
              color: "text-destructive",
              bg: "bg-destructive/10",
              alert: true,
            },
            {
              label: "Avg Health",
              value: `${stats.avgHealthScore}%`,
              icon: TrendingUp,
              color: "text-emerald-500",
              bg: theme === "dark" ? "bg-emerald-500/10" : "bg-emerald-500/5",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-zinc-900/50 border-zinc-800 hover:border-destructive/50"
                  : "bg-zinc-50 border-zinc-200 hover:border-destructive/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                    {item.label}
                  </p>
                  <h3
                    className={`text-3xl font-bold mt-2 ${
                      item.alert ? "text-destructive" : ""
                    }`}
                  >
                    {item.value}
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bg}`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border ${
            theme === "dark"
              ? "bg-zinc-950 border-zinc-800"
              : "bg-white border-zinc-200"
          }`}
        >
          <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
              Recent Activity
            </h2>
            <div className="text-[10px] font-bold text-muted-foreground uppercase">
              Live Update
            </div>
          </div>

          <div className="p-6 space-y-6">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
                      activity.type === "risk"
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-zinc-800/20 border-zinc-800"
                    }`}
                  >
                    {activity.type === "risk" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 border-b border-zinc-800/30 pb-4 last:border-0">
                    <p
                      className={`font-semibold group-hover:text-destructive transition-colors`}
                    >
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase">
                      {activity.createdAt &&
                        format(new Date(activity.createdAt), "HH:mm · MMM dd")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No recent pulse activity.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
