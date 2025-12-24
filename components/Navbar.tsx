"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { ThemeToggle } from "@/components/theme-toggle";
import { User } from "@/types"; // Import User type
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // Use User type instead of any
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // setTimeout ব্যবহার করবো error avoid করার জন্য
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

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully", {
      description: "You have been logged out.",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg animate-pulse"></div>
              <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                PP
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground hidden md:block">
              ProjectPulse
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Demo
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <>
                <span className="text-muted-foreground">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
                <Button
                  onClick={() => {
                    if (user.role === "admin") {
                      window.location.href = "/admin/dashboard";
                    } else if (user.role === "employee") {
                      window.location.href = "/employee/dashboard";
                    } else {
                      window.location.href = "/client/dashboard";
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login / Demo</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
