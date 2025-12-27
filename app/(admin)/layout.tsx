"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import {
  Home,
  BarChart,
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Settings,
  Shield,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: BarChart,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Check-ins",
    url: "/checkins",
    icon: Calendar,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: FileText,
  },
  {
    title: "Risks",
    url: "/risks",
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

const adminItems = [
  {
    title: "Create Project",
    url: "/projects/create",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Security",
    url: "/admin/security",
    icon: Shield,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        window.location.href = "/login";
        return;
      }

      const parsedUser: User = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent
                    user={user}
                    handleLogout={handleLogout}
                    setSidebarOpen={setSidebarOpen}
                  />
                </SheetContent>
              </Sheet>
              <h1 className="ml-2 text-lg font-bold">ProjectPulse</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r h-screen fixed left-0 top-0">
          <SidebarContent user={user} handleLogout={handleLogout} />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Top Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {user?.name}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

// Reusable Sidebar Content Component
function SidebarContent({
  user,
  handleLogout,
  setSidebarOpen,
}: {
  user: User | null;
  handleLogout: () => void;
  setSidebarOpen?: (open: boolean) => void;
}) {
  const handleClick = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center">
          <BarChart className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-xl font-bold">ProjectPulse</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="font-semibold text-primary">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-primary font-medium mt-1">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              onClick={handleClick}
              className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Admin Tools
          </p>
          {adminItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              onClick={handleClick}
              className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-3 py-2.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
