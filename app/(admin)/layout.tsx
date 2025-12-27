"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { BarChart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        window.location.href = "/login";
        return;
      }
      setUser(parsedUser);
    } catch (e) {
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-black text-white" : "bg-white text-black";
  const borderClass = isDark ? "border-zinc-800" : "border-zinc-200";

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgClass}`}
      >
        <div className="animate-pulse font-bold tracking-widest uppercase">
          Pulse...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${bgClass}`}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0">
        <AdminSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          className={`h-16 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 ${bgClass} ${borderClass}`}
        >
          <div className="flex items-center gap-4">
            {/* Mobile Sheet Trigger */}
            <div className="lg:hidden">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className={`p-0 w-72 ${bgClass} ${borderClass}`}
                >
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <AdminSidebar />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-destructive p-1 rounded">
                <BarChart className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tighter text-lg uppercase">
                Pulse
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black uppercase tracking-tighter leading-none">
                {user?.name}
              </p>
              <p className="text-[9px] text-destructive font-bold uppercase mt-0.5">
                Admin
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
