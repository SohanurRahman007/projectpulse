"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, LayoutDashboard, LogOut, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "DASHBOARD", icon: LayoutDashboard, href: "/client-dashboard" },
];

export function ClientSidebar({
  setOpen,
}: {
  setOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="p-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-destructive p-1.5 rounded-lg">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <span className="font-black tracking-tighter text-2xl italic">
              PULSE
            </span>
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen?.(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all",
                isActive
                  ? "bg-destructive text-white"
                  : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t dark:border-zinc-900">
        <Button
          variant="ghost"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full justify-start gap-3 font-black text-[10px] tracking-widest text-destructive"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </Button>
      </div>
    </div>
  );
}
