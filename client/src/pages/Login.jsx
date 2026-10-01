import React, { useState } from "react";
import { Hospital, ShieldCheck, IdCard, Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  primaryFixedDim: "#6CD3F7",
  onPrimary: "#FFFFFF",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outline: "#6E797E",
  outlineVariant: "#BDC8CE",
};

export default function HospitalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password, role }).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setError(err.data?.error || err.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans p-4"
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
    >
      <main
        className="w-full max-w-5xl rounded-xl shadow-sm border flex flex-col md:flex-row overflow-hidden min-h-[600px]"
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          borderColor: colors.outlineVariant,
        }}
      >
        {/* Left: Brand area */}
        <section
          className="w-full md:w-5/12 p-8 flex flex-col justify-between relative overflow-hidden"
          style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polygon fill="currentColor" points="0,100 100,0 100,100" />
            </svg>
          </div>

          <div className="z-10 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Hospital size={36} strokeWidth={1.75} />
              <h1 className="text-2xl font-semibold">CityCare General</h1>
            </div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: colors.primaryFixed }}
            >
              Hospital Bed Occupancy &amp; Patient Flow Optimization
            </h2>
            <p
              className="text-base mt-4 max-w-sm leading-relaxed"
              style={{ color: colors.primaryFixedDim }}
            >
              Smart hospital capacity and patient flow management. Secure access
              for authorized clinical staff only.
            </p>
          </div>

          <div
            className="z-10 mb-8 flex items-center gap-2 text-xs font-semibold tracking-wide"
            style={{ color: colors.primaryFixedDim }}
          >
            <ShieldCheck size={20} />
            <span>SECURE SYSTEM ACCESS</span>
          </div>
        </section>

        {/* Right: Login form */}
        <section
          className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative"
          style={{ backgroundColor: colors.surfaceContainerLowest }}
        >
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-1">System Access</h2>
              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                Choose your role, then sign in with your staff email and
                password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {/* Role Selection (Top) */}
              <div
                className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner"
                role="group"
                aria-label="Choose your role"
              >
                {["Staff", "Doctor", "Ward Manager"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 ${
                      role === r
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={role === r ? { color: colors.primary } : {}}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold tracking-wide mb-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Email
                </label>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: colors.outline }}
                  >
                    <IdCard size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    autoComplete="off"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.outlineVariant,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.outlineVariant;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-wide mb-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Password
                </label>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: colors.outline }}
                  >
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.outlineVariant,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primary}33`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.outlineVariant;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold transition-colors duration-150"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.onPrimary,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.primaryContainer)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  Login to System
                </button>
              </div>
            </form>

            {/* Footer */}
            <div
              className="mt-8 pt-6 border-t text-center"
              style={{ borderColor: colors.outlineVariant }}
            >
              <p className="text-sm" style={{ color: colors.outline }}>
                Unauthorized access is strictly prohibited. Activity is logged.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
