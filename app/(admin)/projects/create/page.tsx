"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  X,
  Users,
  Calendar,
  User,
  Plus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "client";
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [clients, setClients] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    client: "",
    employees: [] as string[],
  });

  // Fetch users from database
  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        // First, ensure demo data exists
        const seedResponse = await fetch("/api/seed");
        const seedData = await seedResponse.json();

        if (seedData.success) {
          console.log("Demo data created successfully");

          // Use the user data from seed response
          if (seedData.users) {
            const clientUsers = seedData.users.filter(
              (user: any) => user.role === "client"
            );
            const employeeUsers = seedData.users.filter(
              (user: any) => user.role === "employee"
            );

            // Get actual user IDs from database
            const response = await fetch("/api/users");
            if (response.ok) {
              const usersData = await response.json();
              if (usersData.success) {
                const allUsers = usersData.users;
                const dbClientUsers = allUsers.filter(
                  (user: User) => user.role === "client"
                );
                const dbEmployeeUsers = allUsers.filter(
                  (user: User) => user.role === "employee"
                );

                setClients(dbClientUsers);
                setEmployees(dbEmployeeUsers);

                if (dbClientUsers.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    client: dbClientUsers[0]._id,
                  }));
                }
                if (dbEmployeeUsers.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    employees: [dbEmployeeUsers[0]._id],
                  }));
                }
              }
            } else {
              // Fallback to seed data user info
              toast.info("Using seed data for user selection");

              // Create mock user objects from seed data
              const mockClients = clientUsers.map((user: any) => ({
                _id:
                  user.email === "sarah@clientco.com"
                    ? "694d085b7f2a938c295843d7"
                    : "client-demo-id",
                name: user.role === "client" ? "Sarah Client" : "Demo Client",
                email: user.email,
                role: user.role,
              }));

              const mockEmployees = employeeUsers.map((user: any) => ({
                _id:
                  user.email === "john@projectpulse.com"
                    ? "694d085b7f2a938c295843d5"
                    : "employee-demo-id",
                name:
                  user.role === "employee" ? "John Developer" : "Demo Employee",
                email: user.email,
                role: user.role,
              }));

              setClients(mockClients);
              setEmployees(mockEmployees);

              if (mockClients.length > 0) {
                setFormData((prev) => ({
                  ...prev,
                  client: mockClients[0]._id,
                }));
              }
              if (mockEmployees.length > 0) {
                setFormData((prev) => ({
                  ...prev,
                  employees: [mockEmployees[0]._id],
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users. Using hardcoded demo data.");

        // Hardcoded fallback
        setClients([
          {
            _id: "694d085b7f2a938c295843d7",
            name: "Sarah Client",
            email: "sarah@clientco.com",
            role: "client",
          },
        ]);
        setEmployees([
          {
            _id: "694d085b7f2a938c295843d5",
            name: "John Developer",
            email: "john@projectpulse.com",
            role: "employee",
          },
        ]);

        setFormData((prev) => ({
          ...prev,
          client: "694d085b7f2a938c295843d7",
          employees: ["694d085b7f2a938c295843d5"],
        }));
      } finally {
        setLoadingUsers(false);
      }
    };

    // Set default dates
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    setFormData((prev) => ({
      ...prev,
      startDate: today.toISOString().split("T")[0],
      endDate: nextMonth.toISOString().split("T")[0],
    }));

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation as per requirements
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start date and end date are required");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (!formData.client) {
      toast.error("Please select a client");
      return;
    }

    if (formData.employees.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        client: formData.client,
        employees: formData.employees,
      };

      console.log("Creating project with:", payload);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Project created successfully!");
        router.push(`/projects/${data.project._id}`);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, client: e.target.value }));
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.includes(employeeId)
        ? prev.employees.filter((id) => id !== employeeId)
        : [...prev.employees, employeeId],
    }));
  };

  const selectAllEmployees = () => {
    setFormData((prev) => ({
      ...prev,
      employees: employees.map((emp) => emp._id),
    }));
  };

  const clearAllEmployees = () => {
    setFormData((prev) => ({
      ...prev,
      employees: [],
    }));
  };

  if (loadingUsers) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="outline" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Loading Users...</h2>
          <p className="text-gray-600 mt-2">
            Please wait while we load users from the database
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="outline" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">
          Create a new project and assign team members. All fields are required.
        </p>
      </div>

      {/* Alert if no users */}
      {clients.length === 0 || employees.length === 0 ? (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-800">Setup Required</h3>
                <p className="text-yellow-700 mt-1">
                  {clients.length === 0 && employees.length === 0
                    ? "No users found in the system. Please create users first."
                    : clients.length === 0
                    ? "No clients found. Please create at least one client user."
                    : "No employees found. Please create at least one employee user."}
                </p>
                <div className="mt-3">
                  <Link href="/api/seed">
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Demo Users
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Project Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill in project details and assign team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the project goals, objectives, and deliverables"
                    rows={4}
                    required
                    className="border-gray-300 resize-none"
                  />
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Project Timeline *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-gray-700">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-gray-700">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Assignment */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assign Client *
                  </h3>
                  <div className="border border-gray-300 rounded-lg p-4">
                    {clients.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No clients available. Please create client users first.
                      </div>
                    ) : (
                      <>
                        <select
                          value={formData.client}
                          onChange={handleClientChange}
                          className="w-full p-2 border border-gray-300 rounded-md bg-white"
                          required
                        >
                          <option value="">-- Select a Client --</option>
                          {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                              {client.name} ({client.email})
                            </option>
                          ))}
                        </select>

                        {formData.client && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm font-medium text-blue-800">
                              Selected Client:{" "}
                              {
                                clients.find((c) => c._id === formData.client)
                                  ?.name
                              }
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Team Assignment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Assign Team Members *
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllEmployees}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearAllEmployees}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4">
                    {employees.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No employees available. Please create employee users
                        first.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {employees.map((employee) => (
                            <div
                              key={employee._id}
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <Checkbox
                                id={`employee-${employee._id}`}
                                checked={formData.employees.includes(
                                  employee._id
                                )}
                                onCheckedChange={() =>
                                  handleEmployeeToggle(employee._id)
                                }
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={`employee-${employee._id}`}
                                  className="font-medium text-gray-900 cursor-pointer"
                                >
                                  {employee.name}
                                </label>
                                <p className="text-sm text-gray-500">
                                  {employee.email}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                Employee
                              </span>
                            </div>
                          ))}
                        </div>

                        {formData.employees.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              Selected: {formData.employees.length} team
                              member(s)
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              {employees
                                .filter((emp) =>
                                  formData.employees.includes(emp._id)
                                )
                                .map((emp) => emp.name)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link href="/projects" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={
                      loading || clients.length === 0 || employees.length === 0
                    }
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Information */}
        <div className="space-y-6">
          {/* Requirements Summary */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                📋 Project Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Required Fields</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                    <span>Project Name - Clear and descriptive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                    <span>Description - Project scope and objectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                    <span>Timeline - Start and end dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                    <span>Client - One client per project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                    <span>Team - At least one employee</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                🚀 What Happens After Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Initial Health Score: 100% (On Track)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Weekly check-ins will be scheduled</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Client feedback system activated</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Risk tracking enabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Activity timeline created</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                ⚙️ System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Available Clients
                  </span>
                  <span
                    className={`font-medium ${
                      clients.length > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {clients.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Available Employees
                  </span>
                  <span
                    className={`font-medium ${
                      employees.length > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {employees.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
              </div>

              {clients.length === 0 || employees.length === 0 ? (
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ❗ Create users before creating projects
                  </p>
                  <Link href="/api/seed" className="inline-block mt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-3 h-3" />
                      Create Demo Users
                    </Button>
                  </Link>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
