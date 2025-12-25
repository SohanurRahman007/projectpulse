// components/landing/FAQSection.tsx
"use client";

import {
  ChevronDown,
  HelpCircle,
  Shield,
  Users,
  BarChart,
  CreditCard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Get full access to all ProjectPulse features for 14 days. No credit card required. After the trial, choose a plan that fits your needs. You can cancel anytime during the trial.",
    category: "Pricing",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No, there are no setup fees. You get immediate access to all features upon signup. Our onboarding process is designed to get you started in minutes, not days.",
    category: "Pricing",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    question: "How does the health score calculation work?",
    answer:
      "Our algorithm analyzes client satisfaction ratings, team confidence scores, project timeline progress, and risk factors. The system updates scores in real-time and provides actionable insights.",
    category: "Features",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    question: "Can multiple team members use one account?",
    answer:
      "Yes! ProjectPulse supports role-based access for Admins, Employees, and Clients. Each role gets a customized dashboard with appropriate permissions and views.",
    category: "Team",
    icon: <Users className="w-5 h-5" />,
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption, regular security audits, and comply with GDPR and SOC 2 standards. Your data is stored securely and never shared with third parties.",
    category: "Security",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    question: "How does risk detection work?",
    answer:
      "Our system monitors project metrics, team feedback, and client satisfaction to identify potential risks early. You'll receive alerts when projects need attention, allowing for proactive solutions.",
    category: "Features",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees. If you cancel, you'll retain access until the end of your billing period.",
    category: "Pricing",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    question: "Do you offer customer support?",
    answer:
      "We provide 24/7 email support with a guaranteed 4-hour response time. Enterprise plans include priority phone support and a dedicated customer success manager.",
    category: "Support",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

const categories = [
  { id: "all", label: "All Questions", count: faqs.length },
  {
    id: "Pricing",
    label: "Pricing",
    count: faqs.filter((f) => f.category === "Pricing").length,
  },
  {
    id: "Features",
    label: "Features",
    count: faqs.filter((f) => f.category === "Features").length,
  },
  {
    id: "Team",
    label: "Team",
    count: faqs.filter((f) => f.category === "Team").length,
  },
  {
    id: "Security",
    label: "Security",
    count: faqs.filter((f) => f.category === "Security").length,
  },
  {
    id: "Support",
    label: "Support",
    count: faqs.filter((f) => f.category === "Support").length,
  },
];

export default function FAQSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!mounted) return null;

  return (
    <section className="relative py-8 md:py-12 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/10"></div>

      {/* Floating Accents */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-destructive/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Questions? We've Got
            <span className="block text-primary mt-2">Answers</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find quick answers to common questions about ProjectPulse
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? theme === "dark"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-primary text-primary-foreground shadow-lg"
                  : theme === "dark"
                  ? "bg-card border border-border hover:border-primary/30"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              {category.label}
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id
                    ? theme === "dark"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-card border-border hover:border-primary/30"
                  : "bg-card border-border hover:border-primary/30"
              } ${openIndex === index ? "shadow-lg" : ""}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      theme === "dark"
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/5 text-primary"
                    }`}
                  >
                    {faq.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          faq.category === "Pricing"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : faq.category === "Features"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            : faq.category === "Team"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : faq.category === "Security"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {faq.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    theme === "dark" ? "bg-muted" : "bg-muted"
                  } ${openIndex === index ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-6 pb-6 pt-2 border-t ${
                        theme === "dark" ? "border-border" : "border-border"
                      }`}
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 p-8 rounded-3xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20"
              : "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-primary/10" : "bg-primary/5"
                }`}
              >
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground">
                  Can not find the answer you are looking for? Our team is here
                  to help.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-card border border-border hover:border-primary/30"
                    : "bg-card border border-border hover:border-primary/30"
                }`}
              >
                Contact Support
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Schedule a Call
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              value: "24/7",
              label: "Support Available",
              color: "text-primary",
            },
            {
              value: "4-hr",
              label: "Response Time",
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              value: "99.9%",
              label: "Uptime SLA",
              color: "text-emerald-600 dark:text-emerald-400",
            },
            { value: "500+", label: "Teams Helped", color: "text-destructive" },
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
