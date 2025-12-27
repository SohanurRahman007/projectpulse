"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Calendar,
  TrendingUp,
  BarChart,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { Project } from "@/types";
import { useTheme } from "next-themes";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
      } else {
        toast.error("Failed to load projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "at_risk":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div
              className={`h-8 w-48 rounded animate-pulse ${
                isDark ? "bg-zinc-800" : "bg-zinc-200"
              }`}
            ></div>
            <div
              className={`h-4 w-64 rounded animate-pulse ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              }`}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-32 rounded-xl animate-pulse ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Projects
          </h1>
          <p
            className={`${
              isDark ? "text-zinc-500" : "text-zinc-400"
            } text-sm font-medium`}
          >
            Manage and monitor all active initiatives
          </p>
        </div>
        <Link href="/projects/create">
          <Button className="bg-destructive hover:bg-destructive/90 text-white font-bold uppercase text-xs tracking-widest px-6">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Projects",
            value: projects.length,
            icon: LayoutGrid,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "On Track",
            value: projects.filter((p) => p.status === "on_track").length,
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            label: "At Risk",
            value: projects.filter(
              (p) => p.status === "at_risk" || p.status === "critical"
            ).length,
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
          {
            label: "Avg Health",
            value: `${
              projects.length > 0
                ? Math.round(
                    projects.reduce((acc, p) => acc + p.healthScore, 0) /
                      projects.length
                  )
                : 0
            }%`,
            icon: BarChart,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className={`${
              isDark
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-white border-zinc-200"
            } border-2 shadow-none`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card
            className={`${
              isDark
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-zinc-50 border-zinc-200"
            } border-dashed border-2`}
          >
            <CardContent className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <LayoutGrid className="w-12 h-12 text-zinc-700" />
                <h3 className="text-lg font-bold uppercase tracking-tighter">
                  No projects found
                </h3>
                <p className="text-zinc-500 text-sm mb-4">
                  Start by creating your first project
                </p>
                <Link href="/projects/create">
                  <Button
                    variant="outline"
                    className="font-bold uppercase text-xs"
                  >
                    Create Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card
              key={project._id}
              className={`${
                isDark
                  ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-zinc-200 hover:border-zinc-300"
              } transition-all duration-300 border-2 shadow-none group`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left Info Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-black tracking-tighter uppercase group-hover:text-destructive transition-colors">
                        {project.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </div>

                    <p
                      className={`text-sm mb-6 line-clamp-2 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          Client:{" "}
                          <span
                            className={
                              isDark ? "text-zinc-200" : "text-zinc-900"
                            }
                          >
                            {project.client.name}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span>{project.employees.length} Members</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Score Section */}
                  <div
                    className={`md:w-48 p-6 flex flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l ${
                      isDark
                        ? "border-zinc-800 bg-zinc-900/20"
                        : "border-zinc-100 bg-zinc-50/50"
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${getHealthBgColor(
                        project.healthScore
                      )} ${
                        isDark ? "border-zinc-800" : "border-white shadow-sm"
                      }`}
                    >
                      <span
                        className={`text-2xl font-black tracking-tighter ${getHealthColor(
                          project.healthScore
                        )}`}
                      >
                        {project.healthScore}
                      </span>
                      <span className="text-[8px] font-black uppercase text-zinc-500 leading-none">
                        Health
                      </span>
                    </div>
                    <Link href={`/projects/${project._id}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full font-bold uppercase text-[10px] tracking-widest h-9 border-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
