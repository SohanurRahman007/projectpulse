// components/landing/HeroSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden py-8 md:py-12 pb-16 md:pb-24 px-4">
      {/* Background matching Navbar */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-background via-muted/10 to-background"
            : "bg-gradient-to-br from-background/95 via-background to-background/95"
        }`}
      />

      {/* Red accent dots */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-destructive/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-destructive/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                theme === "dark"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-primary/10 text-primary"
              } text-sm font-medium mb-6`}
            >
              <Shield className="w-4 h-4" />
              <span>Trusted by 500+ Companies</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 ${
                theme === "dark" ? "text-foreground" : "text-foreground"
              }`}
            >
              Track Project
              <span
                className={`block ${
                  theme === "dark" ? "text-destructive" : "text-destructive"
                }`}
              >
                Health & Risks
              </span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 max-w-2xl ${
                theme === "dark"
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
              }`}
            >
              ProjectPulse helps teams monitor project health, collect client
              feedback, and identify{" "}
              <span className="font-semibold text-destructive/80">risks</span>{" "}
              before they become problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* One red button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-white"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Identify Risks Now
                </Button>
              </motion.div>

              <Button
                size="lg"
                variant={theme === "dark" ? "secondary" : "outline"}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats - One red stat */}
            <div className="grid grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  value: "99%",
                  label: "Client Satisfaction",
                  color: "text-primary",
                  icon: "👍",
                },
                {
                  value: "45%",
                  label: "Faster Delivery",
                  color: "text-blue-600 dark:text-blue-400",
                  icon: "⚡",
                },
                {
                  value: "80%",
                  label: "Risk Reduction",
                  color: "text-destructive",
                  icon: "🛡️",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Red highlight for risk reduction */}
                  {index === 2 && (
                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${
                        theme === "dark"
                          ? "bg-destructive/20"
                          : "bg-destructive/10"
                      } flex items-center justify-center`}
                    >
                      <span className="text-xs">🔥</span>
                    </div>
                  )}

                  <div
                    className={`text-2xl md:text-3xl font-bold ${stat.color} flex items-center gap-2`}
                  >
                    <span>{stat.icon}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Red warning badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-destructive/5 border border-destructive/10"
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-destructive/70" : "text-destructive"
                }`}
              />
              <span
                className={`text-sm ${
                  theme === "dark"
                    ? "text-destructive/80"
                    : "text-destructive/90"
                }`}
              >
                Early risk detection saves projects
              </span>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2 mb-12 lg:mb-0"
          >
            <div
              className={`rounded-3xl shadow-xl p-4 md:p-6 border ${
                theme === "dark"
                  ? "bg-card border-border"
                  : "bg-card border-border"
              }`}
            >
              {/* Dashboard header with red alert */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`h-4 rounded-full ${
                        theme === "dark" ? "bg-muted w-32" : "bg-muted w-32"
                      }`}
                    ></div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-destructive/20 text-destructive/80 border border-destructive/30"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      Live
                    </div>
                  </div>
                  <div
                    className={`h-3 rounded-full ${
                      theme === "dark" ? "bg-muted/50 w-24" : "bg-muted/50 w-24"
                    }`}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <div className={`w-8 h-8 rounded-full bg-primary/20`}></div>
                  <div className={`w-8 h-8 rounded-full bg-secondary/20`}></div>
                  <div className={`w-8 h-8 rounded-full bg-accent/20`}></div>
                </div>
              </div>

              {/* Stats Row with red alert */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  {
                    value: "On Track",
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                  {
                    value: "At Risk",
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-amber-100 dark:bg-amber-900/30",
                  },
                  {
                    value: "Critical",
                    color: "text-destructive",
                    bg: "bg-destructive/10",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 ${stat.bg} ${
                      index === 2 ? "ring-1 ring-destructive/20" : ""
                    }`}
                  >
                    <div
                      className={`h-3 rounded-full mb-2 ${
                        theme === "dark" ? "bg-muted w-16" : "bg-muted w-16"
                      }`}
                    ></div>
                    <div
                      className={`h-6 flex items-center justify-center rounded-full font-medium ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Area with red section */}
              <div
                className={`rounded-xl p-4 ${
                  theme === "dark" ? "bg-muted/30" : "bg-muted/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-4 rounded-full ${
                      theme === "dark" ? "bg-muted w-40" : "bg-muted w-40"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      theme === "dark"
                        ? "text-destructive/70"
                        : "text-destructive"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Critical Zone</span>
                  </div>
                </div>
                <div className="h-32 md:h-40 flex items-end gap-2">
                  {[40, 60, 80, 65, 30, 75, 95].map((h, i) => {
                    const isCritical = h < 50;
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`flex-1 rounded-t-lg relative ${
                          isCritical
                            ? "bg-gradient-to-t from-destructive to-destructive/70"
                            : "bg-gradient-to-t from-primary to-primary/70"
                        }`}
                      >
                        {isCritical && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating Elements - Red "On Track" Circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`absolute -top-4 -right-4 p-3 md:p-4 rounded-2xl shadow-lg border ${
                theme === "dark"
                  ? "bg-card border-destructive/30"
                  : "bg-card border-destructive/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-destructive-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    On Track
                  </div>
                  <div className="text-muted-foreground text-xs">
                    <span className="text-destructive font-medium">12</span>{" "}
                    Projects
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Red Team Badge */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`absolute -bottom-4 -left-4 p-3 md:p-4 rounded-2xl shadow-lg border ${
                theme === "dark"
                  ? "bg-destructive/10 border-destructive/20"
                  : "bg-destructive/5 border-destructive/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-destructive/20" : "bg-destructive/10"
                  }`}
                >
                  <Users
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      theme === "dark" ? "text-destructive" : "text-destructive"
                    }`}
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    Active Team
                  </div>
                  <div className="text-destructive font-medium text-xs">
                    45 Members
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Red warning indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className={`absolute top-1/2 -left-2 transform -translate-y-1/2 ${
                theme === "dark"
                  ? "bg-destructive/20 border-destructive/30"
                  : "bg-destructive/10 border-destructive/20"
              } border rounded-full p-2`}
            >
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
