"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Menu, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { User } from "@/types";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";

export default function ClientLayout({
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
      if (parsedUser.role !== "client") {
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
        <div className="animate-pulse font-black tracking-widest uppercase text-destructive">
          Pulse...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${bgClass}`}
    >
      <aside
        className={`hidden lg:block w-72 h-screen sticky top-0 shrink-0 border-r ${borderClass}`}
      >
        <ClientSidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className={`h-20 border-b flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 backdrop-blur-md ${
            isDark
              ? "bg-black/80 border-zinc-800"
              : "bg-white/80 border-zinc-200"
          }`}
        >
          <div className="flex items-center gap-4">
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
                  <ClientSidebar setOpen={setSidebarOpen} />
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                Dashboard /{" "}
                <span className="text-destructive font-bold">
                  Client Portal
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right border-r pr-6 border-zinc-800/50">
              <p className="text-xs font-black uppercase tracking-tight mb-1">
                {user?.name}
              </p>
              <p className="text-[9px] text-destructive font-bold uppercase">
                Strategic Partner
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
