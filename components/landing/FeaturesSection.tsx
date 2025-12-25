// components/landing/FeaturesSection.tsx
"use client";

import { BarChart3, Bell, CheckCircle, Shield, Users, Zap } from "lucide-react";
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
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Role-based Dashboards",
    description: "Custom views for Admins, Employees, and Clients",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Weekly Check-ins",
    description: "Structured updates and feedback every week",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Risk Management",
    description: "Track risks with severity and mitigation plans",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Smart Analytics",
    description: "Predict success and identify bottlenecks early",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Alerts",
    description: "Get notified when projects need attention",
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
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6`}
          >
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need
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
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-foreground">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
