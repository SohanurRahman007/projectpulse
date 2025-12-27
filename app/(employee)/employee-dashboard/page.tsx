"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Calendar,
  Rocket,
  ShieldAlert,
  ChevronRight,
  Activity,
  History,
} from "lucide-react";
import { Project, Checkin } from "@/types";

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    progressSummary: "",
    blockers: "",
    confidenceLevel: 3,
    completionPercentage: 50,
  });

  useEffect(() => {
    fetchProjects();
    fetchMyCheckins();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) setProjects(data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCheckins = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      const response = await fetch(`/api/checkins?employeeId=${user.id}`);
      const data = await response.json();
      if (data.success) setCheckins(data.checkins);
    } catch (error) {
      console.error("Failed to fetch checkins");
    }
  };

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);

      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          employeeId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("SUCCESS: Progress logged successfully.");
        setFormData({
          progressSummary: "",
          blockers: "",
          confidenceLevel: 3,
          completionPercentage: 50,
        });
        fetchMyCheckins();
      }
    } catch (error) {
      toast.error("Network error. Could not sync update.");
    }
  };

  const getSelectedProject = () =>
    projects.find((p) => p._id === selectedProject);

  const getConfidenceLabel = (level: number) => {
    const labels = ["Critical", "Low", "Stable", "High", "Bulletproof"];
    return labels[level - 1] || "Stable";
  };

  if (loading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-12 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[500px] bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
          <div className="h-[500px] bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Unit <span className="text-destructive">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-bold mt-1 tracking-tight uppercase text-sm">
            Update your operational status and mission intel
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl px-6 font-black border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
        >
          <Calendar className="w-4 h-4 mr-2 text-destructive" />
          CALENDAR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <Card className="lg:col-span-7 border-0 bg-white dark:bg-zinc-950 shadow-xl rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-900">
          <CardHeader className="bg-zinc-900 text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive rounded-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                Weekly Sync
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              Operational progress report
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmitCheckin} className="space-y-8">
              <div className="space-y-3">
                <Label className="uppercase font-black text-xs tracking-widest text-muted-foreground">
                  Active Mission
                </Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-destructive bg-background font-bold text-base">
                    <SelectValue placeholder="CHOOSE PROJECT" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2">
                    {projects.map((project) => (
                      <SelectItem
                        key={project._id}
                        value={project._id}
                        className="font-bold py-3 uppercase"
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="uppercase font-black text-xs tracking-widest text-muted-foreground">
                  Progress Summary
                </Label>
                <Textarea
                  placeholder="Summarize your achievements..."
                  className="min-h-[120px] rounded-2xl border-2 focus-visible:ring-destructive p-4 font-bold text-base"
                  value={formData.progressSummary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progressSummary: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="uppercase font-black text-xs tracking-widest text-muted-foreground">
                  Blockers & Challenges
                </Label>
                <div className="relative">
                  <ShieldAlert className="absolute left-4 top-4 w-5 h-5 text-destructive opacity-50" />
                  <Textarea
                    placeholder="List any obstacles..."
                    className="min-h-[100px] rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-destructive pl-12 font-bold text-base"
                    value={formData.blockers}
                    onChange={(e) =>
                      setFormData({ ...formData, blockers: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="uppercase font-black text-xs tracking-widest">
                      Confidence
                    </Label>
                    <span className="bg-zinc-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {getConfidenceLabel(formData.confidenceLevel)}
                    </span>
                  </div>
                  <Slider
                    value={[formData.confidenceLevel]}
                    onValueChange={(v) =>
                      setFormData({ ...formData, confidenceLevel: v[0] })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="uppercase font-black text-xs tracking-widest">
                      Completion
                    </Label>
                    <span className="text-destructive font-black text-xl">
                      {formData.completionPercentage}%
                    </span>
                  </div>
                  <Slider
                    value={[formData.completionPercentage]}
                    onValueChange={(v) =>
                      setFormData({ ...formData, completionPercentage: v[0] })
                    }
                    min={0}
                    max={100}
                    step={5}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!selectedProject}
                className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-destructive/20"
              >
                Submit Sync Update
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Intel & History */}
        <div className="lg:col-span-5 space-y-8">
          {selectedProject && getSelectedProject() && (
            <Card className="border-2 border-destructive bg-destructive/5 rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive">
                  Mission Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                  {getSelectedProject()?.name}
                </h3>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase">
                  {getSelectedProject()?.description}
                </p>
                <div className="pt-4 flex gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">
                      Health Score
                    </p>
                    <p className="text-4xl font-black tracking-tighter text-destructive">
                      {getSelectedProject()?.healthScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <p className="text-lg font-black uppercase">
                        {getSelectedProject()?.status?.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <History className="w-5 h-5 text-destructive" />
                Recent Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkins.length === 0 ? (
                <div className="text-center py-10 opacity-30 font-black uppercase text-xs tracking-widest">
                  No logs found
                </div>
              ) : (
                checkins.slice(0, 3).map((checkin) => (
                  <div
                    key={checkin._id}
                    className="group p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-destructive transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                        {new Date(checkin.weekStartDate).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                      <span className="text-sm font-black text-destructive">
                        {checkin.completionPercentage}%
                      </span>
                    </div>
                    <p className="text-sm font-bold line-clamp-2 leading-relaxed mb-4 uppercase">
                      {checkin.progressSummary}
                    </p>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        CONFIDENCE:{" "}
                        {getConfidenceLabel(checkin.confidenceLevel)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-destructive" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
