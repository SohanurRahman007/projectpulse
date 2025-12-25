// components/landing/Footer.tsx
"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Shield,
  Zap,
  Users,
  ArrowRight,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features", badge: "New" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Risk Detection", href: "#risk", badge: "🔥" },
      { name: "API", href: "#api" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers", badge: "Hiring" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" },
      { name: "Partners", href: "/partners" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Risk Guides", href: "/guides", badge: "Critical" },
      { name: "Status", href: "/status" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security", href: "/security", badge: "🔒" },
      { name: "GDPR", href: "/gdpr" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: "#", label: "Twitter" },
    { icon: <Facebook className="w-4 h-4" />, href: "#", label: "Facebook" },
    { icon: <Linkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="w-4 h-4" />, href: "#", label: "GitHub" },
  ];

  return (
    <footer
      className={`relative ${
        isDark ? "bg-card" : "bg-card"
      } border-t border-border`}
    >
      {/* Red accent top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive/50 to-transparent"></div>

      {/* Red background accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-destructive/5 blur-3xl"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Brand & Newsletter */}
          <div className="space-y-8">
            {/* Brand with red accent */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center relative">
                <span className="text-primary-foreground font-bold text-xl">
                  PP
                </span>
                {/* Red dot indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  ProjectPulse
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="text-destructive font-medium">
                    Risk-Aware
                  </span>{" "}
                  Project Management
                </p>
              </div>
            </div>

            <p className={`text-lg text-muted-foreground max-w-md`}>
              Helping teams deliver successful projects with real-time health
              monitoring and{" "}
              <span className="font-semibold text-destructive/80">
                proactive risk prevention
              </span>
              .
            </p>

            {/* Newsletter with red accent */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">
                  Stay Updated on Risks
                </h4>
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email for risk alerts"
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    isDark
                      ? "bg-muted border-border text-foreground placeholder-muted-foreground"
                      : "bg-background border-border text-foreground placeholder-muted-foreground"
                  } focus:outline-none focus:ring-2 focus:ring-destructive/30`}
                />
                <Button className="gap-2 bg-destructive hover:bg-destructive/90">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Get weekly risk prevention tips.{" "}
                <span className="text-destructive/70">No spam.</span>
              </p>
            </div>

            {/* Contact Info with red elements */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? "bg-destructive/10" : "bg-destructive/5"
                  } group-hover:bg-destructive/20 transition-colors`}
                >
                  <Mail
                    className={`w-4 h-4 ${
                      isDark ? "text-destructive/70" : "text-destructive"
                    }`}
                  />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  support@projectpulse.com
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? "bg-primary/10" : "bg-primary/5"
                  } group-hover:bg-primary/20 transition-colors`}
                >
                  <Phone
                    className={`w-4 h-4 ${
                      isDark ? "text-primary/70" : "text-primary"
                    }`}
                  />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Emergency:{" "}
                  <span className="font-semibold text-destructive">
                    +1 (555) 911-PULSE
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? "bg-blue-900/20" : "bg-blue-100"
                  } group-hover:bg-blue-200/20 transition-colors`}
                >
                  <MapPin
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Links Grid with red badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {category}
                  {category === "Product" && (
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  )}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name} className="flex items-center gap-2">
                      <Link
                        href={link.href}
                        className={`text-sm transition-colors hover:text-foreground ${
                          isDark
                            ? "text-muted-foreground hover:text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        } ${
                          link.badge === "Critical"
                            ? "hover:text-destructive"
                            : ""
                        }`}
                      >
                        {link.name}
                      </Link>
                      {link.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            link.badge === "Critical" || link.badge === "🔥"
                              ? isDark
                                ? "bg-destructive/20 text-destructive/80"
                                : "bg-destructive/10 text-destructive"
                              : isDark
                              ? "bg-primary/20 text-primary/80"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with red gradient */}
        <div
          className={`my-12 h-px bg-gradient-to-r from-transparent ${
            isDark ? "via-destructive/20" : "via-destructive/10"
          } to-transparent`}
        ></div>

        {/* Bottom Bar with red elements */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Connect with us:
            </span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDark
                      ? "bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                      : "bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Trust Badges with red */}
          <div className="flex flex-wrap items-center gap-6">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-destructive/5 border border-destructive/10"
              }`}
            >
              <Shield className="w-3 h-3 text-destructive" />
              <span className="text-xs text-muted-foreground">
                SOC 2 Type II
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-primary/5 border border-primary/10"
              }`}
            >
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                99.9% Uptime
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-blue-900/20 border border-blue-800/30"
                  : "bg-blue-100 border border-blue-200"
              }`}
            >
              <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-muted-foreground">500+ Teams</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isDark
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-destructive/5 border border-destructive/10"
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-xs text-muted-foreground">
                Risk Protected
              </span>
            </div>
          </div>
        </div>

        {/* Copyright with red heart */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProjectPulse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-destructive fill-destructive/30" />{" "}
            for
            <span className="text-destructive font-medium ml-1">
              risk-aware
            </span>{" "}
            project teams
          </p>
        </div>
      </div>

      {/* Back to Top button with red */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isDark
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/30"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }`}
        aria-label="Back to top"
      >
        <ArrowRight className="w-5 h-5 rotate-270" />
      </button>

      {/* Red warning ribbon */}
      <div
        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-b-lg ${
          isDark
            ? "bg-destructive/20 border border-destructive/30"
            : "bg-destructive/10 border border-destructive/20"
        } backdrop-blur-sm`}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-destructive" />
          <span className="text-xs text-muted-foreground">
            Monitor risks • Deliver successfully
          </span>
        </div>
      </div>
    </footer>
  );
}
