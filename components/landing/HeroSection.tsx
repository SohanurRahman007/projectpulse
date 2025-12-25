// components/landing/HeroSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
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
    <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 px-4">
      {/* Background using shadcn colors */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-background via-muted/20 to-background"
            : "bg-gradient-to-br from-primary/5 via-background to-primary/5"
        }`}
      />

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
                  ? "bg-primary/20 text-primary-foreground border border-primary/30"
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
              Track Project Health
              <span className="block text-primary">in Real-Time</span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 max-w-2xl ${
                theme === "dark"
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
              }`}
            >
              ProjectPulse helps teams monitor project health, collect client
              feedback, and identify risks before they become problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant={theme === "dark" ? "secondary" : "outline"}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 md:gap-8">
              {[
                { value: "99%", label: "Client Satisfaction" },
                { value: "45%", label: "Faster Delivery" },
                { value: "80%", label: "Risk Reduction" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div
                    className={`text-2xl md:text-3xl font-bold ${
                      theme === "dark" ? "text-primary" : "text-primary"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2 mb-12 lg:mb-0"
          >
            <div
              className={`rounded-3xl shadow-2xl p-4 md:p-6 border ${
                theme === "dark"
                  ? "bg-card border-border/50"
                  : "bg-card border-border"
              }`}
            >
              {/* Mock Dashboard */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div
                    className={`h-4 rounded-full mb-2 ${
                      theme === "dark" ? "bg-muted w-32" : "bg-muted w-32"
                    }`}
                  ></div>
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

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 ${
                      theme === "dark" ? "bg-muted/30" : "bg-muted/20"
                    }`}
                  >
                    <div
                      className={`h-3 rounded-full mb-2 ${
                        theme === "dark" ? "bg-muted w-16" : "bg-muted w-16"
                      }`}
                    ></div>
                    <div
                      className={`h-6 rounded-full ${
                        theme === "dark" ? "bg-muted/60 w-12" : "bg-muted w-12"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div
                className={`rounded-xl p-4 ${
                  theme === "dark" ? "bg-muted/30" : "bg-muted/20"
                }`}
              >
                <div
                  className={`h-4 rounded-full mb-4 ${
                    theme === "dark" ? "bg-muted w-40" : "bg-muted w-40"
                  }`}
                ></div>
                <div className="h-32 md:h-40 flex items-end gap-2">
                  {[40, 60, 80, 65, 90, 75, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`flex-1 rounded-t-lg bg-gradient-to-t from-primary to-primary/70`}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`absolute -top-4 -right-4 p-3 md:p-4 rounded-2xl shadow-lg border ${
                theme === "dark"
                  ? "bg-card border-border"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    On Track
                  </div>
                  <div className="text-muted-foreground text-xs">
                    12 Projects
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`absolute -bottom-4 -left-4 p-3 md:p-4 rounded-2xl shadow-lg border ${
                theme === "dark"
                  ? "bg-card border-border"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-destructive flex items-center justify-center">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-destructive-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    Team
                  </div>
                  <div className="text-muted-foreground text-xs">
                    45 Members
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
