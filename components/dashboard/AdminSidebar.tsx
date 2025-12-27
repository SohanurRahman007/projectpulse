"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart,
  Home,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  Calendar,
  Shield,
  PlusCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const menuItems = [
  { title: "Overview", url: "/admin-dashboard", icon: Home },
  { title: "Projects", url: "/projects", icon: BarChart },
  { title: "Teams", url: "/teams", icon: Users },
  { title: "Check-ins", url: "/checkins", icon: Calendar },
  { title: "Feedback", url: "/feedback", icon: FileText },
  { title: "Risks", url: "/risks", icon: AlertTriangle },
  { title: "Reports", url: "/reports", icon: FileText },
];

const adminItems = [
  { title: "Create Project", url: "/projects/create", icon: PlusCircle },
  { title: "System Settings", url: "/admin/settings", icon: Settings },
  { title: "Security", url: "/admin/security", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const sidebarBg = isDark ? "bg-black" : "bg-white";
  const borderClass = isDark ? "border-zinc-800" : "border-zinc-200";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // একটি কমন মেনু রেন্ডারার ফাংশন যা মোবাইল ও ডেস্কটপ দুই জায়গাতেই টেক্সট দেখাবে
  const renderMenuItems = (items: typeof menuItems) => (
    <div className="space-y-1 px-2">
      {items.map((item) => {
        const active = pathname === item.url;
        return (
          <Link
            key={item.url}
            href={item.url}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              active
                ? "bg-destructive/10 text-destructive font-bold"
                : isDark
                ? "text-zinc-400 hover:bg-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="text-sm">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div
      className={`flex flex-col h-full w-full border-r ${sidebarBg} ${borderClass}`}
    >
      {/* Logo */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-destructive p-1.5 rounded">
            <BarChart className="h-5 w-5 text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl">PULSE</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <p
            className={`text-[10px] font-bold uppercase px-6 mb-2 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Main Navigation
          </p>
          {renderMenuItems(menuItems)}
        </div>

        <div>
          <p
            className={`text-[10px] font-bold uppercase px-6 mb-2 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Administration
          </p>
          {renderMenuItems(adminItems)}
        </div>
      </div>

      {/* Logout Footer */}
      <div className={`p-4 border-t ${borderClass}`}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-zinc-500 hover:text-destructive hover:bg-destructive/10 transition-all font-bold uppercase text-xs tracking-wider"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
