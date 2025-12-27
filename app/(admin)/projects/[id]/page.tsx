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
  Loader2,
} from "lucide-react";
import { Project, Activity } from "@/types";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (projectId) {
      fetchProjectDetails();
      fetchProjectActivities();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProject(data.project);
          return;
        }
      }

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
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "health_updated":
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
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

  if (!mounted) return null;
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen flex flex-col items-center justify-center",
          isDark ? "bg-black" : "bg-white"
        )}
      >
        <Loader2 className="w-8 h-8 animate-spin text-destructive mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
          Scanning Pulse...
        </p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        {/* Navigation & Pulse Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/projects">
              <Button
                variant="ghost"
                className="pl-0 hover:bg-transparent text-destructive font-bold gap-2 text-xs uppercase tracking-widest mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> System Projects
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">
              {project.name.split(" ")[0]}{" "}
              <span className="text-destructive font-extrabold">
                {project.name.split(" ").slice(1).join(" ") || "Pulse"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              {project.description}
            </p>
          </motion.div>

          <div
            className={cn(
              "px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
              project.status === "critical" || project.status === "at_risk"
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
            )}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                project.status === "on_track"
                  ? "bg-emerald-500"
                  : "bg-destructive"
              )}
            />
            {project.status.replace("_", " ")}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Score Card */}
            <Card
              className={cn(
                "border-none shadow-none rounded-2xl p-1",
                isDark ? "bg-zinc-900/50" : "bg-zinc-50"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  Vital Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-6xl font-black tracking-tighter">
                      {project.healthScore}%
                    </span>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      Health Integrity
                    </p>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-xl border font-black text-xs tracking-widest",
                      project.healthScore >= 80
                        ? "text-emerald-500 border-emerald-500/20"
                        : "text-destructive border-destructive/20"
                    )}
                  >
                    {project.healthScore >= 80 ? "OPTIMIZED" : "ATTENTION REQ."}
                  </div>
                </div>
                <Progress
                  value={project.healthScore}
                  className="h-3 bg-zinc-800 rounded-full [&>div]:bg-destructive"
                />
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Live Feed
              </h2>
              <div
                className={cn(
                  "rounded-2xl border p-6 space-y-6",
                  isDark
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-white border-zinc-200"
                )}
              >
                {activities.length === 0 ? (
                  <p className="text-center py-10 text-muted-foreground text-sm">
                    No pulse data available.
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity._id} className="flex gap-4 group">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border shrink-0",
                          isDark
                            ? "bg-zinc-900 border-zinc-800"
                            : "bg-zinc-100 border-zinc-200"
                        )}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 border-b border-zinc-800/30 pb-6 last:border-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold group-hover:text-destructive transition-colors">
                            {activity.title}
                          </h4>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {formatTimeAgo(activity.createdAt.toString())}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-[9px] font-bold text-destructive uppercase tracking-widest mt-3">
                          {activity.user && typeof activity.user === "object"
                            ? `Auth: ${activity.user.name}`
                            : "System Gen"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card
              className={cn(
                "border-none shadow-none rounded-2xl",
                isDark ? "bg-zinc-900/50" : "bg-zinc-50"
              )}
            >
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest">
                  Protocol Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl h-11">
                  Update Health
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full font-bold rounded-xl h-11 border-zinc-800",
                    isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                  )}
                >
                  Report Risk
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full font-bold rounded-xl h-11 border-zinc-800",
                    isDark ? "hover:bg-white/5" : "hover:bg-black/5"
                  )}
                >
                  Export Intel
                </Button>
              </CardContent>
            </Card>

            {/* Client Intel */}
            <div
              className={cn(
                "p-6 rounded-2xl border",
                isDark
                  ? "bg-zinc-950 border-zinc-800"
                  : "bg-white border-zinc-200"
              )}
            >
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                Client Intel
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive font-black">
                  {project.client.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold leading-none">
                    {project.client.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.client.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Squad */}
            <div
              className={cn(
                "p-6 rounded-2xl border",
                isDark
                  ? "bg-zinc-950 border-zinc-800"
                  : "bg-white border-zinc-200"
              )}
            >
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                Assigned Squad ({project.employees.length})
              </h3>
              <div className="space-y-4">
                {project.employees.map((emp) => (
                  <div key={emp._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none">
                        {emp.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">
                        {emp.role || "Specialist"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Details */}
            <div
              className={cn(
                "p-6 rounded-2xl border border-dashed",
                isDark ? "border-zinc-800" : "border-zinc-200"
              )}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Launch
                  </span>
                  <span className="text-xs font-bold">
                    {formatDate(project.startDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Deadline
                  </span>
                  <span className="text-xs font-bold text-destructive">
                    {formatDate(project.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
