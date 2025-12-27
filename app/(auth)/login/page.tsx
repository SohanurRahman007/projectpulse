"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ShieldCheck, User, Briefcase, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createDemoUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seed");
      const data = await response.json();

      if (data.success) {
        toast.success("Demo users created!", {
          description: "Credentials have been automatically filled for you.",
        });
        setEmail("admin@projectpulse.com");
        setPassword("admin123");
      } else {
        toast.error("Failed to create demo users");
      }
    } catch (error) {
      toast.error("Error creating demo users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success(`Welcome back, ${data.user.name}!`);

        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin-dashboard";
          } else if (data.user.role === "employee") {
            window.location.href = "/employee-dashboard";
          } else if (data.user.role === "client") {
            window.location.href = "/client-dashboard";
          } else {
            window.location.href = "/";
          }
        }, 1500);
      } else {
        toast.error("Login failed", {
          description: data.error || "Invalid email or password",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-2 border-zinc-100 dark:border-zinc-900 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="w-14 h-14 bg-destructive rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-destructive/20 text-white">
            <Lock className="w-7 h-7" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            ProjectPulse
          </CardTitle>
          <CardDescription className="text-sm font-medium mt-1">
            Secure access to your project ecosystem
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          {/* Setup Notice */}
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900 rounded-2xl space-y-3">
            <p className="text-xs font-semibold text-orange-800 dark:text-orange-400">
              New Installation? Start by generating demo data.
            </p>
            <Button
              variant="outline"
              className="w-full h-10 text-xs font-bold border-orange-200 bg-white hover:bg-orange-50 dark:bg-zinc-900 dark:border-orange-900 rounded-xl transition-all"
              onClick={createDemoUsers}
              disabled={loading}
            >
              {loading ? "Generating Data..." : "Generate Demo Accounts"}
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-sm bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to System"}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200"></span>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span className="bg-white dark:bg-zinc-950 px-2 italic">
                Quick Access
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-2xl border-zinc-100 hover:border-destructive hover:bg-destructive/5 group transition-all"
              onClick={() => {
                setEmail("admin@projectpulse.com");
                setPassword("admin123");
              }}
            >
              <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-destructive" />
              <span className="text-[10px] font-bold">ADMIN</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-2xl border-zinc-100 hover:border-destructive hover:bg-destructive/5 group transition-all"
              onClick={() => {
                setEmail("john@projectpulse.com");
                setPassword("employee123");
              }}
            >
              <User className="w-5 h-5 text-zinc-400 group-hover:text-destructive" />
              <span className="text-[10px] font-bold">STAFF</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 rounded-2xl border-zinc-100 hover:border-destructive hover:bg-destructive/5 group transition-all"
              onClick={() => {
                setEmail("sarah@clientco.com");
                setPassword("client123");
              }}
            >
              <Briefcase className="w-5 h-5 text-zinc-400 group-hover:text-destructive" />
              <span className="text-[10px] font-bold">CLIENT</span>
            </Button>
          </div>

          <div className="text-center">
            <Link href="/">
              <span className="text-xs font-bold text-zinc-400 hover:text-destructive cursor-pointer transition-colors">
                ← Return to Homepage
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
