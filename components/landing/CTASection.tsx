// components/landing/CTASection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CTASection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-16 md:py-24 px-4">
      {/* Red accent blobs */}
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-destructive/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`rounded-3xl p-8 md:p-12 lg:p-16 ${
            theme === "dark"
              ? "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/20"
              : "bg-gradient-to-br from-primary to-primary/90"
          } text-primary-foreground shadow-xl overflow-hidden`}
        >
          {/* Red accent stripes */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive/50 to-transparent"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                theme === "dark"
                  ? "bg-primary/30 text-primary-foreground border border-primary/40"
                  : "bg-white/20 text-white"
              } text-sm font-medium mb-6`}
            >
              <Shield className="w-4 h-4" />
              <span>Trusted by Teams Worldwide</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Start Monitoring Your Projects
              <span className="block text-destructive text-2xl sm:text-3xl md:text-4xl mt-2">
                And Prevent Risks Today
              </span>
            </h2>
            <p
              className={`text-lg md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto px-4 ${
                theme === "dark"
                  ? "text-primary-foreground/90"
                  : "text-primary-foreground/90"
              }`}
            >
              Join hundreds of teams that use ProjectPulse to deliver projects
              successfully and{" "}
              <span className="font-semibold text-destructive/80">
                prevent risks
              </span>{" "}
              before they escalate.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12">
              {/* Red button - main CTA */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 py-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={() => (window.location.href = "/login")}
                >
                  <AlertTriangle className="w-5 h-5" />
                  Start Risk-Free Trial
                </Button>
              </motion.div>

              {/* Secondary button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant={theme === "dark" ? "outline" : "secondary"}
                  className={`gap-2 text-base px-8 py-6 ${
                    theme === "dark"
                      ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                  See Live Demo
                </Button>
              </motion.div>
            </div>

            {/* Features List with one red feature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12"
            >
              {[
                {
                  value: "14-day",
                  label: "Free Trial",
                  desc: "Full access to all features",
                  icon: "🆓",
                  accent: false,
                },
                {
                  value: "Risk-Free",
                  label: "Guarantee",
                  desc: "Cancel anytime, no questions",
                  icon: "🛡️",
                  accent: true, // This one is red
                },
                {
                  value: "24/7",
                  label: "Support",
                  desc: "Always here to help",
                  icon: "📞",
                  accent: false,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl relative ${
                    item.accent
                      ? theme === "dark"
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-destructive/5 border border-destructive/10"
                      : theme === "dark"
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-white/10"
                  } backdrop-blur-sm`}
                >
                  {/* Red badge for risk-free */}
                  {item.accent && (
                    <div
                      className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-destructive/20 text-destructive/80"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      Best
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold">
                        {item.value}
                      </div>
                      <div
                        className={`font-semibold ${
                          item.accent ? "text-destructive" : ""
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-primary-foreground/70"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Red warning footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`mt-12 p-4 rounded-xl ${
                theme === "dark"
                  ? "bg-destructive/5 border border-destructive/10"
                  : "bg-destructive/5 border border-destructive/10"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="text-sm">
                  <span className="font-semibold text-destructive">
                    Don't wait for risks to escalate.
                  </span>{" "}
                  Start your free trial today.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
