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
import { Input } from "@/components/ui/input";
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
import { Calendar, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
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

  // Load employee's projects
  useEffect(() => {
    fetchProjects();
    fetchMyCheckins();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
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

      if (data.success) {
        setCheckins(data.checkins);
      }
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
      if (!userData) {
        toast.error("Please login first");
        return;
      }

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
        toast.success("Weekly checkin submitted successfully!");

        // Reset form
        setFormData({
          progressSummary: "",
          blockers: "",
          confidenceLevel: 3,
          completionPercentage: 50,
        });

        // Refresh checkins
        fetchMyCheckins();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to submit checkin");
    }
  };

  const getSelectedProject = () => {
    return projects.find((p) => p._id === selectedProject);
  };

  const getConfidenceLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Very Low";
      case 2:
        return "Low";
      case 3:
        return "Medium";
      case 4:
        return "High";
      case 5:
        return "Very High";
      default:
        return "Medium";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600">
            Submit weekly updates and track progress
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Weekly Checkin Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Weekly Check-in
            </CardTitle>
            <CardDescription>
              Submit your weekly progress report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">Select Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress Summary */}
              <div className="space-y-2">
                <Label htmlFor="progressSummary">Progress Summary *</Label>
                <Textarea
                  id="progressSummary"
                  placeholder="What did you accomplish this week?"
                  value={formData.progressSummary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progressSummary: e.target.value,
                    })
                  }
                  required
                  rows={4}
                />
              </div>

              {/* Blockers */}
              <div className="space-y-2">
                <Label htmlFor="blockers">Blockers or Challenges</Label>
                <Textarea
                  id="blockers"
                  placeholder="Any issues or challenges you faced?"
                  value={formData.blockers}
                  onChange={(e) =>
                    setFormData({ ...formData, blockers: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Confidence Level */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Confidence Level</Label>
                  <span className="text-sm font-medium">
                    {getConfidenceLabel(formData.confidenceLevel)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[formData.confidenceLevel]}
                    onValueChange={(value) =>
                      setFormData({ ...formData, confidenceLevel: value[0] })
                    }
                    min={1}
                    max={5}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Low</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>

              {/* Completion Percentage */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Completion Percentage</Label>
                  <span className="text-sm font-medium">
                    {formData.completionPercentage}%
                  </span>
                </div>
                <Slider
                  value={[formData.completionPercentage]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, completionPercentage: value[0] })
                  }
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!selectedProject}
              >
                Submit Weekly Check-in
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Project Info & Recent Checkins */}
        <div className="space-y-6">
          {/* Selected Project Info */}
          {selectedProject && getSelectedProject() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getSelectedProject()?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {getSelectedProject()?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Health Score</p>
                      <div
                        className={`text-2xl font-bold ${
                          (getSelectedProject()?.healthScore || 0) >= 80
                            ? "text-green-600"
                            : (getSelectedProject()?.healthScore || 0) >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {getSelectedProject()?.healthScore}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getSelectedProject()?.status === "on_track"
                            ? "bg-green-100 text-green-800"
                            : getSelectedProject()?.status === "at_risk"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getSelectedProject()
                          ?.status?.replace("_", " ")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Checkins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Recent Check-ins
              </CardTitle>
              <CardDescription>
                Your previous weekly submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {checkins.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No checkins submitted yet
                </div>
              ) : (
                <div className="space-y-4">
                  {checkins.slice(0, 3).map((checkin) => (
                    <div key={checkin._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {new Date(
                              checkin.weekStartDate
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Confidence:{" "}
                            {getConfidenceLabel(checkin.confidenceLevel)}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {checkin.completionPercentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {checkin.progressSummary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
