"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  ShieldCheck,
  Activity,
  Users,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const features = [
  {
    title: "Project Health Scoring",
    description:
      "Automated logic-based health monitoring (0-100) using client satisfaction and employee confidence levels.",
    icon: Activity,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Secure environments for Admins, Employees, and Clients with JWT-protected authentication.",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "group-hover:border-green-500/50",
  },
  {
    title: "Weekly Check-in System",
    description:
      "Structured progress reporting for employees and satisfaction feedback for clients every week.",
    icon: Clock,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
  },
  {
    title: "Risk Management",
    description:
      "Proactive identification of blockers with severity levels (Low/Medium/High) and mitigation plans.",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
  },
  {
    title: "Decision Dashboards",
    description:
      "Real-time insights for admins to identify at-risk projects and intervene before they become critical.",
    icon: BarChart3,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "group-hover:border-destructive/50",
  },
  {
    title: "Activity Timeline",
    description:
      "A chronological audit trail of all project events, check-ins, and status changes in one view.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "group-hover:border-yellow-500/50",
  },
];

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <Navbar />
      <div
        className={`min-h-screen pt-16 pb-16 transition-colors duration-300 ${
          isDark ? "bg-zinc-950" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-20 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Engineered for <span className="text-destructive">Pulse</span>
            </h1>
            <p
              className={`max-w-2xl mx-auto font-medium text-sm md:text-base ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              ProjectPulse helps IT teams monitor project health, bridge the gap
              between clients and employees, and mitigate delivery risks with
              automated logic.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group transition-all duration-300 border-2 shadow-none rounded-2xl overflow-hidden ${
                  isDark
                    ? `bg-zinc-900/40 border-zinc-800 ${feature.border}`
                    : `bg-white border-zinc-100 ${feature.border}`
                }`}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>

                  <h3 className="text-xl font-black tracking-tighter uppercase mb-3">
                    {feature.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed font-medium ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div
            className={`mt-20 p-8 md:p-16 rounded-[2.5rem] text-center border-2 border-dashed ${
              isDark
                ? "bg-zinc-900/20 border-zinc-800"
                : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-destructive rounded-2xl flex items-center justify-center shadow-lg shadow-destructive/20 rotate-3">
                <Zap className="text-white w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                  Ready to optimize your{" "}
                  <span className="text-destructive">delivery?</span>
                </h2>
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${
                    isDark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Experience the transparency of ProjectPulse today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/login">
                  <Button className="bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-xs tracking-widest px-10 h-12 rounded-xl">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="font-black uppercase text-xs tracking-widest px-10 h-12 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              ProjectPulse v1.0 — Intern Assignment Task
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
