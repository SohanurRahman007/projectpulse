"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Total Projects</h3>
          <p className="text-3xl text-blue-600">0</p>
          <p className="text-gray-500 text-sm">No projects created yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Active Projects</h3>
          <p className="text-3xl text-green-600">0</p>
          <p className="text-gray-500 text-sm">All projects inactive</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">At Risk</h3>
          <p className="text-3xl text-red-600">0</p>
          <p className="text-gray-500 text-sm">No risks identified</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">
          Welcome, {user?.name || "Admin"}!
        </h2>
        <p className="text-gray-600">
          You are logged in as{" "}
          <span className="font-bold text-blue-600">Administrator</span>. You
          have full access to manage projects, users, and monitor project
          health.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-bold mb-2">Quick Actions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Create new projects</li>
            <li>Assign employees to projects</li>
            <li>Monitor project health scores</li>
            <li>View risk reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
