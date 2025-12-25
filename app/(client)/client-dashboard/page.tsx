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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MessageSquare, Star, TrendingUp, AlertCircle } from "lucide-react";
import { Project, Feedback } from "@/types";

export default function ClientDashboard() {
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

  // Load client's projects
  useEffect(() => {
    fetchProjects();
    fetchMyFeedbacks();
  }, []);

  const fetchProjects = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        // Filter projects where user is the client
        const clientProjects = data.projects.filter(
          (project: Project) => project.client._id === user.id
        );
        setProjects(clientProjects);
      }
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyFeedbacks = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`/api/feedback?clientId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.feedback);
      }
    } catch (error) {
      console.error("Failed to fetch feedback");
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
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

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          clientId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Feedback submitted successfully!");

        // Reset form
        setFormData({
          satisfactionRating: 4,
          communicationRating: 4,
          comments: "",
          flagIssue: false,
        });

        // Refresh feedbacks
        fetchMyFeedbacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  const getSelectedProject = () => {
    return projects.find((p) => p._id === selectedProject);
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Very Poor";
      case 2:
        return "Poor";
      case 3:
        return "Average";
      case 4:
        return "Good";
      case 5:
        return "Excellent";
      default:
        return "Good";
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
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-gray-600">
            Provide feedback and track project progress
          </p>
        </div>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Weekly Feedback
            </CardTitle>
            <CardDescription>Share your experience this week</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project">Select Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your project" />
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

              {/* Satisfaction Rating */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Satisfaction Rating</Label>
                  <span className="text-sm font-medium">
                    {getRatingLabel(formData.satisfactionRating)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[formData.satisfactionRating]}
                    onValueChange={(value) =>
                      setFormData({ ...formData, satisfactionRating: value[0] })
                    }
                    min={1}
                    max={5}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Communication Rating */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Communication Rating</Label>
                  <span className="text-sm font-medium">
                    {getRatingLabel(formData.communicationRating)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[formData.communicationRating]}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        communicationRating: value[0],
                      })
                    }
                    min={1}
                    max={5}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  placeholder="Any additional feedback or suggestions?"
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Flag Issue */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flagIssue"
                  checked={formData.flagIssue}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, flagIssue: checked as boolean })
                  }
                />
                <Label htmlFor="flagIssue" className="text-sm">
                  Flag as critical issue (requires immediate attention)
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!selectedProject}
              >
                Submit Weekly Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Project Info & Recent Feedback */}
        <div className="space-y-6">
          {/* Selected Project Info */}
          {selectedProject && getSelectedProject() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Project Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getSelectedProject()?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {getSelectedProject()?.description}
                    </p>
                  </div>

                  {/* Health Score Gauge */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Health Score
                      </span>
                      <span
                        className={`font-bold ${
                          (getSelectedProject()?.healthScore || 0) >= 80
                            ? "text-green-600"
                            : (getSelectedProject()?.healthScore || 0) >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {getSelectedProject()?.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (getSelectedProject()?.healthScore || 0) >= 80
                            ? "bg-green-600"
                            : (getSelectedProject()?.healthScore || 0) >= 60
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${getSelectedProject()?.healthScore || 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Critical</span>
                      <span>At Risk</span>
                      <span>On Track</span>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Assigned Team</h4>
                    <div className="space-y-2">
                      {getSelectedProject()?.employees.map((employee) => (
                        <div
                          key={employee._id}
                          className="flex items-center gap-2"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">
                              {employee.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {employee.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Your Previous Feedback
              </CardTitle>
              <CardDescription>History of your submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No feedback submitted yet
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.slice(0, 3).map((feedback) => (
                    <div key={feedback._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            {new Date(
                              feedback.weekStartDate
                            ).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm">
                              Satisfaction: {feedback.satisfactionRating}/5
                            </span>
                            <span className="text-sm">
                              Communication: {feedback.communicationRating}/5
                            </span>
                          </div>
                        </div>
                        {feedback.flagIssue && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Flagged
                          </span>
                        )}
                      </div>
                      {feedback.comments && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {feedback.comments}
                        </p>
                      )}
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
