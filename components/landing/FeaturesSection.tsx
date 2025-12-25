// components/landing/FeaturesSection.tsx
"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Real-time Health Score",
    description: "Automated health calculation based on multiple factors",
    color: "text-primary",
    accent: false,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Role-based Dashboards",
    description: "Custom views for Admins, Employees, and Clients",
    color: "text-blue-600 dark:text-blue-400",
    accent: false,
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Weekly Check-ins",
    description: "Structured updates and feedback every week",
    color: "text-purple-600 dark:text-purple-400",
    accent: false,
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Risk Detection",
    description: "Identify risks before they become critical",
    color: "text-destructive",
    accent: true, // This one is red
    badge: "Critical",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Smart Analytics",
    description: "Predict success and identify bottlenecks early",
    color: "text-emerald-600 dark:text-emerald-400",
    accent: false,
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Alerts",
    description: "Get notified when projects need attention",
    color: "text-amber-600 dark:text-amber-400",
    accent: false,
  },
];

export default function FeaturesSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-8 md:py-12 px-4 bg-muted/20">
      {/* Red accent dots */}
      <div className="absolute top-20 left-5 w-16 h-16 bg-destructive/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-5 w-20 h-20 bg-destructive/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === "dark"
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-primary/10 text-primary"
            } text-sm font-medium mb-6`}
          >
            <Shield className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need
            <span className="block text-destructive text-2xl sm:text-3xl mt-2">
              Plus Risk Management
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto px-4 text-muted-foreground">
            Comprehensive tools to manage projects effectively across all teams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  feature.accent
                    ? theme === "dark"
                      ? "bg-card border-destructive/30 hover:border-destructive/50"
                      : "border-destructive/20 hover:border-destructive/30"
                    : theme === "dark"
                    ? "bg-card border-border hover:border-primary/30"
                    : "border-border hover:border-primary/30"
                } ${feature.accent ? "ring-1 ring-destructive/10" : ""}`}
              >
                <CardHeader className="pb-4 relative">
                  {/* Red badge for risk detection */}
                  {feature.accent && feature.badge && (
                    <div
                      className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-destructive/20 text-destructive/80 border border-destructive/30"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {feature.badge}
                    </div>
                  )}

                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      feature.accent
                        ? theme === "dark"
                          ? "bg-destructive/10"
                          : "bg-destructive/5"
                        : theme === "dark"
                        ? "bg-primary/10"
                        : "bg-primary/5"
                    }`}
                  >
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <CardTitle
                    className={`text-xl md:text-2xl ${
                      feature.accent ? "text-foreground" : "text-foreground"
                    }`}
                  >
                    {feature.title}
                  </CardTitle>
                  <CardDescription
                    className={`mt-2 ${
                      feature.accent
                        ? "text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`h-0.5 w-full ${
                      feature.accent
                        ? "bg-gradient-to-r from-transparent via-destructive/30 to-transparent"
                        : theme === "dark"
                        ? "bg-gradient-to-r from-transparent via-border to-transparent"
                        : "bg-gradient-to-r from-transparent via-border to-transparent"
                    }`}
                  ></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Red warning section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-12 md:mt-16 p-6 rounded-2xl ${
            theme === "dark"
              ? "bg-destructive/5 border border-destructive/10"
              : "bg-destructive/5 border border-destructive/10"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-destructive/10" : "bg-destructive/5"
              }`}
            >
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Early Risk Detection Saves Projects
              </h3>
              <p className="text-muted-foreground">
                Our{" "}
                <span className="font-semibold text-destructive">
                  Risk Detection
                </span>{" "}
                feature identifies potential issues before they escalate, giving
                you time to take corrective action.
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                theme === "dark"
                  ? "bg-destructive/20 text-destructive/80 border border-destructive/30"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              Most Important Feature
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
