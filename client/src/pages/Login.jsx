import React, { useState } from "react";
import { Hospital, ShieldCheck, IdCard, Lock } from "lucide-react";

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
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up to your auth flow here.
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans p-4"
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
    >
      <main
        className="w-full max-w-5xl rounded-xl shadow-sm border flex flex-col md:flex-row overflow-hidden min-h-[600px]"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        {/* Left: Brand area */}
        <section
          className="w-full md:w-5/12 p-8 flex flex-col justify-between relative overflow-hidden"
          style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
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
              Smart hospital capacity and patient flow management. Secure access for authorized clinical staff only.
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
              <h2 className="text-2xl font-semibold mb-1">Staff Login</h2>
              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                Please authenticate with your Staff ID or Email to access clinical systems.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Staff ID */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold tracking-wide mb-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Email / Staff ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: colors.outline }}>
                    <IdCard size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your credentials"
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: colors.outline }}>
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              {/* Remember me / Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: colors.primary, borderColor: colors.outlineVariant }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: colors.primary }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold transition-colors duration-150"
                  style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                >
                  Login to System
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: colors.outlineVariant }}>
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