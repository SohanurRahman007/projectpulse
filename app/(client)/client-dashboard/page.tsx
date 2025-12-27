"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Star, TrendingUp, AlertCircle, Users } from "lucide-react";
import { Project, Feedback } from "@/types";

export default function ClientPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    satisfactionRating: 4,
    communicationRating: 4,
    comments: "",
    flagIssue: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const user = JSON.parse(userData);
      try {
        const [projRes, feedRes] = await Promise.all([
          fetch("/api/projects"),
          fetch(`/api/feedback?clientId=${user.id}`),
        ]);
        const projData = await projRes.json();
        const feedData = await feedRes.json();
        if (projData.success) {
          setProjects(
            projData.projects.filter((p: Project) => p.client._id === user.id)
          );
        }
        if (feedData.success) setFeedbacks(feedData.feedback);
      } catch (e) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return toast.error("Select a project first");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          clientId: user.id,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Feedback submitted");
        setFormData({
          satisfactionRating: 4,
          communicationRating: 4,
          comments: "",
          flagIssue: false,
        });
      }
    } catch (e) {
      toast.error("Submission failed");
    }
  };

  const activeProject = projects.find((p) => p._id === selectedProject);

  if (loading)
    return <div className="p-10 text-sm animate-pulse">Loading system...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Weekly Project Pulse & Governance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-2 border-zinc-100 dark:border-zinc-900 shadow-none rounded-3xl overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b dark:border-zinc-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-destructive" /> Weekly Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Active Engagement
                  </Label>
                  <Select
                    value={selectedProject}
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Product Satisfaction
                    </Label>
                    <Slider
                      value={[formData.satisfactionRating]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(v) =>
                        setFormData({ ...formData, satisfactionRating: v[0] })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Communication Efficiency
                    </Label>
                    <Slider
                      value={[formData.communicationRating]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(v) =>
                        setFormData({ ...formData, communicationRating: v[0] })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Strategic Remarks
                  </Label>
                  <Textarea
                    className="rounded-xl min-h-[120px]"
                    placeholder="Type your feedback..."
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData({ ...formData, comments: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
                  <Checkbox
                    id="flag"
                    checked={formData.flagIssue}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, flagIssue: !!v })
                    }
                  />
                  <Label
                    htmlFor="flag"
                    className="text-xs font-bold text-destructive cursor-pointer"
                  >
                    Flag as Critical Infrastructure Risk
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-bold bg-destructive hover:bg-destructive/90 transition-all"
                >
                  Submit Protocol
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {activeProject && (
            <Card className="border-2 border-zinc-100 dark:border-zinc-900 shadow-none rounded-3xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-500">
                  <TrendingUp className="w-4 h-4" /> System Health:{" "}
                  {activeProject.healthScore}%
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${activeProject.healthScore}%` }}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Users className="w-3 h-3" /> Core Team
                  </Label>
                  <div className="flex -space-x-2">
                    {activeProject.employees.map((e, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-xs font-bold uppercase"
                      >
                        {e.name[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-zinc-100 dark:border-zinc-900 shadow-none rounded-3xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <AlertCircle className="w-4 h-4 text-orange-500" /> Log History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbacks.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-2xl dark:border-zinc-800 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">
                      {new Date(f.weekStartDate).toLocaleDateString()}
                    </span>
                    {f.flagIssue && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                        ALERT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{f.comments}"
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
