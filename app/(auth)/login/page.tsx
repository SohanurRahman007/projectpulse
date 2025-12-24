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
import { toast } from "sonner"; // Import from sonner
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

        // Sonner toast
        toast.success("Login successful!", {
          description: `Welcome back, ${data.user.name}!`,
        });

        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (data.user.role === "employee") {
            window.location.href = "/employee/dashboard";
          } else {
            window.location.href = "/client/dashboard";
          }
        }, 1500);
      } else {
        toast.error("Login failed", {
          description: data.error || "Invalid credentials",
        });
      }
    } catch (err) {
      toast.error("Error", {
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground text-2xl font-bold">
              PP
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome to ProjectPulse</CardTitle>
          <CardDescription>
            Sign in to your account or try demo login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Try demo accounts:
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmail("admin@projectpulse.com");
                  setPassword("admin123");
                  toast.info("Demo Admin loaded", {
                    description: "Click Sign In button to login",
                  });
                }}
              >
                Admin Demo
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmail("john@projectpulse.com");
                  setPassword("employee123");
                  toast.info("Demo Employee loaded", {
                    description: "Click Sign In button to login",
                  });
                }}
              >
                Employee Demo
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmail("sarah@clientco.com");
                  setPassword("client123");
                  toast.info("Demo Client loaded", {
                    description: "Click Sign In button to login",
                  });
                }}
              >
                Client Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-primary">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
