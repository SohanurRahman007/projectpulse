// components/landing/HowItWorks.tsx
"use client";

import {
  AlertTriangle,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: <Users className="w-8 h-8" />,
    title: "Create Projects",
    description:
      "Admin creates projects and assigns team members with specific roles and permissions.",
    color: "text-primary",
    accent: false,
  },
  {
    step: "02",
    icon: <ClipboardCheck className="w-8 h-8" />,
    title: "Weekly Updates",
    description:
      "Team submits progress reports and clients provide structured feedback every week.",
    color: "text-blue-600 dark:text-blue-400",
    accent: false,
  },
  {
    step: "03",
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Health Analysis",
    description:
      "System automatically calculates health scores based on multiple performance metrics.",
    color: "text-purple-600 dark:text-purple-400",
    accent: false,
  },
  {
    step: "04",
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Risk Monitoring",
    description:
      "Identify potential risks early and take corrective actions before issues escalate.",
    color: "text-destructive",
    accent: true,
    highlight: "Key Feature",
  },
];

export default function HowItWorks() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-8 md:py-12 px-4 bg-background">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-destructive/5 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

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
            <TrendingUp className="w-4 h-4" />
            How It Works
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Simple Four-Step Process
          </h2>

          <p className="text-lg md:text-xl max-w-3xl mx-auto px-4 text-muted-foreground">
            Transform your project management with our streamlined workflow
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-destructive transform -translate-y-1/2"></div>

          {/* Mobile connecting line */}
          <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-destructive transform -translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step connector circle for desktop */}
                <div className="hidden lg:block absolute top-24 left-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

                {/* Step connector circle for mobile */}
                <div className="lg:hidden absolute top-0 left-1/2 w-3 h-3 rounded-full bg-background border-2 border-primary transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

                {/* Main Card */}
                <div
                  className={`pt-12 lg:pt-0 h-full ${
                    index === 0
                      ? "lg:mt-0"
                      : index === 1
                      ? "lg:mt-8"
                      : index === 2
                      ? "lg:mt-16"
                      : "lg:mt-24"
                  }`}
                >
                  <div
                    className={`h-full rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                      step.accent
                        ? theme === "dark"
                          ? "bg-card border-destructive/30 hover:border-destructive/50 hover:shadow-destructive/10"
                          : "bg-card border-destructive/20 hover:border-destructive/30 hover:shadow-destructive/10"
                        : theme === "dark"
                        ? "bg-card border-border hover:border-primary/30 hover:shadow-primary/10"
                        : "bg-card border-border hover:border-primary/30"
                    } ${step.accent ? "ring-1 ring-destructive/10" : ""}`}
                  >
                    {/* Step Number Badge */}
                    <div
                      className={`absolute -top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        step.accent
                          ? "bg-destructive text-destructive-foreground shadow-lg"
                          : "bg-primary text-primary-foreground shadow-lg"
                      }`}
                    >
                      {step.step}
                    </div>

                    {/* Icon Container */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                        step.accent
                          ? theme === "dark"
                            ? "bg-destructive/10"
                            : "bg-destructive/5"
                          : theme === "dark"
                          ? "bg-primary/10"
                          : "bg-primary/5"
                      }`}
                    >
                      <div className={step.color}>{step.icon}</div>
                    </div>

                    {/* Highlight Badge */}
                    {step.highlight && (
                      <div
                        className={`mb-3 px-3 py-1 rounded-full text-xs font-medium inline-block ${
                          theme === "dark"
                            ? "bg-destructive/20 text-destructive/80"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {step.highlight}
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        step.accent ? "text-foreground" : "text-foreground"
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Bottom Indicator */}
                    <div
                      className={`mt-6 pt-4 border-t ${
                        step.accent ? "border-destructive/20" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Step {step.step.slice(1)}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            step.accent ? "bg-destructive" : "bg-primary"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Insight Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 md:mt-24 p-6 md:p-8 rounded-2xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-card to-card/90 border border-destructive/10"
              : "bg-gradient-to-r from-card to-card/90 border border-destructive/10"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-destructive/10" : "bg-destructive/5"
              }`}
            >
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Why Risk Monitoring Matters
              </h3>
              <p className="text-muted-foreground">
                Studies show that{" "}
                <span className="font-semibold text-destructive">
                  early risk detection
                </span>{" "}
                can prevent up to{" "}
                <span className="font-semibold text-destructive">
                  85% of project failures
                </span>
                . Our system identifies potential issues before they impact your
                timeline and budget.
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                theme === "dark"
                  ? "bg-destructive/20 text-destructive/80 border border-destructive/30"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              Critical Success Factor
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "99%", label: "Accuracy", color: "text-primary" },
            {
              value: "45%",
              label: "Time Saved",
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              value: "85%",
              label: "Risk Prevention",
              color: "text-destructive",
            },
            {
              value: "4.8/5",
              label: "User Rating",
              color: "text-purple-600 dark:text-purple-400",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-center ${
                theme === "dark"
                  ? "bg-card border border-border/50"
                  : "bg-card border border-border"
              }`}
            >
              <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
