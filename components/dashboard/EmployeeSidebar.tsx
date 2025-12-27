"use client";

import { LayoutDashboard, LogOut, BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const menuItems = [
  { title: "Dashboard", url: "/employee-dashboard", icon: LayoutDashboard },
];

export function EmployeeSidebar() {
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

  return (
    <div
      className={`flex flex-col h-full w-full border-r ${sidebarBg} ${borderClass}`}
    >
      {/* Brand Logo Section */}
      <div className="p-8 mb-2">
        <Link href="/employee/dashboard" className="flex items-center gap-3">
          <div className="bg-destructive p-1.5 rounded-lg">
            <BarChart className="h-6 w-6 text-white" />
          </div>
          <span className="font-black tracking-tighter text-2xl italic">
            PULSE
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1.5 px-3">
          {menuItems.map((item) => {
            // Ekhane active logic check korche
            const active = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-destructive text-white font-bold shadow-lg shadow-destructive/20"
                    : isDark
                    ? "text-zinc-500 hover:text-white hover:bg-zinc-900"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${
                    active ? "text-white" : "group-hover:text-destructive"
                  }`}
                />
                <span className="text-sm tracking-tight">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Section (Bottom) */}
      <div className={`p-6 border-t ${borderClass}`}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-500 hover:text-destructive hover:bg-destructive/10 transition-all font-bold uppercase text-[10px] tracking-[0.15em]"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          End Session
        </button>
      </div>
    </div>
  );
}
