"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        window.location.href = "/login";
        return;
      }

      const parsedUser: User = JSON.parse(userData);
      if (parsedUser.role !== "employee") {
        window.location.href = "/login";
        return;
      }

      setUser(parsedUser);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">ProjectPulse Employee</h1>
              <div className="ml-10">
                <Link
                  href="/employee/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
