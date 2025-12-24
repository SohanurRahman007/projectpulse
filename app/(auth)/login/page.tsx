"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Token local storage এ সেভ করবো
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Role অনুযায়ী redirect করবো
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "employee") {
          router.push("/employee/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seed");
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      alert("Seed failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          ProjectPulse Login
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Users Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-bold mb-2">Demo Credentials:</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Admin:</strong> admin@projectpulse.com / admin123
            </p>
            <p>
              <strong>Employee:</strong> john@projectpulse.com / employee123
            </p>
            <p>
              <strong>Client:</strong> sarah@clientco.com / client123
            </p>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Demo Users (First Time)"}
          </button>
        </div>
      </div>
    </div>
  );
}
