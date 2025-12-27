"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Save,
  Users,
  Calendar as CalendarIcon,
  User,
  Shield,
  Briefcase,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "client";
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [clients, setClients] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    client: "",
    employees: [] as string[],
  });

  useEffect(() => {
    setMounted(true);
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch("/api/users");
        if (response.ok) {
          const usersData = await response.json();
          if (usersData.success) {
            const allUsers = usersData.users;
            const dbClients = allUsers.filter((u: User) => u.role === "client");
            const dbEmployees = allUsers.filter(
              (u: User) => u.role === "employee"
            );
            setClients(dbClients);
            setEmployees(dbEmployees);

            if (dbClients.length > 0)
              setFormData((p) => ({ ...p, client: dbClients[0]._id }));
            if (dbEmployees.length > 0)
              setFormData((p) => ({ ...p, employees: [dbEmployees[0]._id] }));
          }
        }
      } catch (error) {
        toast.error("Failed to load system users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Required fields missing");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "on_track",
          healthScore: 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project Initiated");
        router.push(`/projects/${data.project._id}`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  if (loadingUsers) {
    return (
      <div
        className={cn(
          "min-h-screen flex flex-col items-center justify-center",
          isDark ? "bg-black" : "bg-white"
        )}
      >
        <Loader2 className="w-8 h-8 animate-spin text-destructive mb-4" />
        <p className="text-muted-foreground font-bold tracking-tighter uppercase text-[10px]">
          Syncing Database...
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-black text-white" : "bg-white text-black"
      )}
    >
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Header - Dashboard Pulse Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/projects">
              <Button
                variant="ghost"
                className="pl-0 hover:bg-transparent text-destructive font-bold gap-2 text-xs uppercase tracking-widest mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">
              Create{" "}
              <span className="text-destructive font-extrabold">Project</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Initialize a new operational project into the system pulse.
            </p>
          </motion.div>

          <div
            className={cn(
              "px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
              isDark
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "bg-destructive/5 text-destructive border-destructive/20"
            )}
          >
            <Shield className="w-3 h-3 inline mr-2 mb-0.5" /> Project Protocol
            v1.0
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              className={cn(
                "rounded-2xl border transition-all duration-200 shadow-none",
                isDark
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-zinc-50 border-zinc-200"
              )}
            >
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-destructive" />
                  General Information
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 pt-4 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Project Identity *
                    </Label>
                    <Input
                      placeholder="Operational Name"
                      className={cn(
                        "h-12 rounded-xl focus-visible:ring-destructive",
                        isDark
                          ? "bg-black border-zinc-800"
                          : "bg-white border-zinc-200"
                      )}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Mission Briefing *
                    </Label>
                    <Textarea
                      placeholder="Scope of work..."
                      className={cn(
                        "rounded-xl focus-visible:ring-destructive min-h-[120px]",
                        isDark
                          ? "bg-black border-zinc-800"
                          : "bg-white border-zinc-200"
                      )}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        Start Cycle
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 rounded-xl justify-start text-left font-semibold",
                              isDark
                                ? "bg-black border-zinc-800 hover:bg-zinc-900"
                                : "bg-white border-zinc-200 hover:bg-zinc-50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-destructive" />
                            {formData.startDate
                              ? format(formData.startDate, "PPP")
                              : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-800 bg-zinc-950">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(d) =>
                              d && setFormData({ ...formData, startDate: d })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        Target Completion
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 rounded-xl justify-start text-left font-semibold",
                              isDark
                                ? "bg-black border-zinc-800 hover:bg-zinc-900"
                                : "bg-white border-zinc-200 hover:bg-zinc-50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-destructive" />
                            {formData.endDate
                              ? format(formData.endDate, "PPP")
                              : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-zinc-800 bg-zinc-950">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(d) =>
                              d && setFormData({ ...formData, endDate: d })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Assign Client *
                    </Label>
                    <select
                      className={cn(
                        "w-full h-12 px-4 rounded-xl border font-bold text-sm focus:ring-1 focus:ring-destructive outline-none",
                        isDark
                          ? "bg-black border-zinc-800"
                          : "bg-white border-zinc-200"
                      )}
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                    >
                      {clients.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} — {c.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2">
                      <Users className="w-3 h-3" /> Squad Assignment
                    </Label>
                    <div
                      className={cn(
                        "border rounded-xl p-4 space-y-2 max-h-60 overflow-y-auto",
                        isDark
                          ? "bg-black/50 border-zinc-800"
                          : "bg-white border-zinc-200"
                      )}
                    >
                      {employees.map((emp) => (
                        <div
                          key={emp._id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/5 group transition-colors"
                        >
                          <Checkbox
                            id={emp._id}
                            checked={formData.employees.includes(emp._id)}
                            onCheckedChange={() => {
                              const exists = formData.employees.includes(
                                emp._id
                              );
                              setFormData({
                                ...formData,
                                employees: exists
                                  ? formData.employees.filter(
                                      (id) => id !== emp._id
                                    )
                                  : [...formData.employees, emp._id],
                              });
                            }}
                            className="border-zinc-700 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                          />
                          <label
                            htmlFor={emp._id}
                            className="flex-1 cursor-pointer"
                          >
                            <p className="font-bold text-sm group-hover:text-destructive transition-colors">
                              {emp.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase">
                              {emp.email}
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold uppercase tracking-widest transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Initialize Project
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              className={cn(
                "rounded-2xl border border-destructive/20 overflow-hidden",
                isDark ? "bg-destructive/10" : "bg-destructive/5"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold flex items-center gap-2 text-destructive uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" /> System Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                  Upon initiation, this project will be indexed into the
                  Dashboard Pulse. Real-time health metrics and risk analysis
                  will begin immediately.
                </p>
              </CardContent>
            </Card>

            <div
              className={cn(
                "p-6 rounded-2xl border",
                isDark
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-zinc-50 border-zinc-200"
              )}
            >
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Readiness
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Identity Verified", ok: formData.name.length > 2 },
                  {
                    label: "Squad Assigned",
                    ok: formData.employees.length > 0,
                  },
                  { label: "Client Linked", ok: !!formData.client },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        item.ok
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : "bg-zinc-700"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-tight",
                        item.ok ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
