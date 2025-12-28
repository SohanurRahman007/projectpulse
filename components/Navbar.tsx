"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X, LayoutDashboard, LogOut, Home, Zap } from "lucide-react"; // আইকন যোগ করা হয়েছে

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // মোবাইল মেনু বন্ধ করার জন্য
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const isActive = (path: string) => pathname === path;

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2 ${
          isActive("/")
            ? "text-destructive"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Home className="w-4 h-4 md:hidden" /> Home
      </Link>
      <Link
        href="/features"
        className={`text-sm font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2 ${
          isActive("/features")
            ? "text-destructive"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Zap className="w-4 h-4 md:hidden" /> Features
      </Link>
    </>
  );

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
          <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-destructive transition-colors">
              <span className="text-primary-foreground font-bold text-xl">
                PP
              </span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground hidden sm:block uppercase italic">
              Project<span className="text-destructive">Pulse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="font-black uppercase text-[10px] tracking-widest"
                    onClick={() => {
                      const routes: any = {
                        admin: "/admin-dashboard",
                        employee: "/employee-dashboard",
                        client: "/client-dashboard",
                      };
                      window.location.href = routes[user.role] || "/";
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-[10px] tracking-widest h-9 px-4"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="font-black uppercase text-[10px] tracking-widest h-9 px-6">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden border-2 border-zinc-100 dark:border-zinc-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-background border-b shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 space-y-6">
            <div className="flex flex-col space-y-4 border-b pb-6">
              <NavLinks />
            </div>

            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <div className="px-2 py-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      Logged in as
                    </p>
                    <p className="font-bold text-destructive">{user.name}</p>
                  </div>
                  <Button
                    className="w-full justify-start font-black uppercase text-xs tracking-widest h-12"
                    onClick={() => {
                      const routes: any = {
                        admin: "/admin-dashboard",
                        employee: "/employee-dashboard",
                        client: "/client-dashboard",
                      };
                      window.location.href = routes[user.role] || "/";
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start font-black uppercase text-xs tracking-widest h-12 border-2 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" className="w-full">
                  <Button className="w-full font-black uppercase text-xs tracking-widest h-12">
                    Login / Demo Access
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
