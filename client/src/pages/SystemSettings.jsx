import React, { useState } from "react";
import UserProfileHover from "../components/UserProfileHover";
import {
  LayoutDashboard,
  BedDouble,
  User,
  LogIn,
  ArrowLeftRight,
  ListChecks,
  ClipboardList,
  BarChart3,
  FileText,
  BellRing,
  Settings,
  Search,
  Hospital,
  UserCog,
  Plus,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#FAFDFF",
  secondaryContainer: "#D5E0F8",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainerHigh: "#E5E9EB",
  surfaceVariant: "#DFE3E6",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outlineVariant: "#BDC8CE",
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BedDouble, label: "Wards & Beds" },
  { icon: User, label: "Patients" },
  { icon: LogIn, label: "Admissions" },
  { icon: ArrowLeftRight, label: "Transfers" },
  { icon: ListChecks, label: "Waiting List" },
  { icon: ClipboardList, label: "Ward Logs" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
  { icon: Settings, label: "Settings", active: true },
];

const roles = [
  { role: "Administrator", view: true, edit: true, beds: true, config: true },
  { role: "Head Doctor", view: true, edit: true, beds: false, config: false },
  { role: "Attending Nurse", view: true, edit: false, beds: true, config: false },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors border cursor-pointer"
      style={{
        backgroundColor: checked ? colors.primary : colors.surfaceVariant,
        borderColor: checked ? colors.primary : colors.outlineVariant,
      }}
    >
      <span
        className="absolute w-4 h-4 rounded-full bg-white transition-transform shadow"
        style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export default function SystemSettings() {
  const [notifications, setNotifications] = useState({
    critical: true,
    daily: true,
    system: false,
  });

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      {/* Side Nav */}
      <Sidebar />


      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4">
            <Search size={20} className="cursor-pointer transition-colors hover:opacity-80" style={{ color: colors.primary }} />
            <h1 className="text-lg font-bold ml-4" style={{ color: colors.primary }}>
              CityCare General Hospital
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <UserProfileHover />
          </div>
        </header>

        {/* Main canvas */}
        <main className="flex-1 p-6 max-w-[1440px] mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">System Settings</h2>
            <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Manage hospital configurations, user roles, and system preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hospital info */}
            <div
              className="md:col-span-8 rounded-xl p-6 flex flex-col gap-4 border"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: colors.outlineVariant }}>
                <Hospital size={20} style={{ color: colors.primary }} />
                <h3 className="text-xl font-semibold">Hospital Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    defaultValue="CityCare General"
                    className="border rounded px-3 h-8 text-sm outline-none transition-all"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                    License Number
                  </label>
                  <input
                    type="text"
                    defaultValue="LIC-994201-A"
                    className="border rounded px-3 h-8 font-mono text-sm outline-none transition-all"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                    Primary Address
                  </label>
                  <input
                    type="text"
                    defaultValue="100 Health Way, Metropolis, NY 10001"
                    className="border rounded px-3 h-8 text-sm outline-none transition-all"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@citycare.gov"
                    className="border rounded px-3 h-8 text-sm outline-none transition-all"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="555-0199"
                    className="border rounded px-3 h-8 font-mono text-sm outline-none transition-all"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                  />
                </div>
              </div>
              <div className="mt-auto pt-2 flex justify-end">
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
                  style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification preferences */}
            <div
              className="md:col-span-4 rounded-xl p-6 flex flex-col gap-4 border"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: colors.outlineVariant }}>
                <BellRing size={20} style={{ color: colors.primary }} />
                <h3 className="text-xl font-semibold">Notifications</h3>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Critical Alerts (SMS)</span>
                    <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                      Immediate dispatch
                    </span>
                  </div>
                  <Toggle checked={notifications.critical} onChange={(v) => setNotifications((s) => ({ ...s, critical: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Daily Summary (Email)</span>
                    <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                      08:00 AM dispatch
                    </span>
                  </div>
                  <Toggle checked={notifications.daily} onChange={(v) => setNotifications((s) => ({ ...s, daily: v }))} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">System Updates</span>
                    <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                      In-app notifications
                    </span>
                  </div>
                  <Toggle checked={notifications.system} onChange={(v) => setNotifications((s) => ({ ...s, system: v }))} />
                </div>
              </div>
            </div>

            {/* User roles & permissions */}
            <div
              className="md:col-span-12 rounded-xl p-6 flex flex-col gap-4 border overflow-hidden"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.outlineVariant }}>
                <div className="flex items-center gap-2">
                  <UserCog size={20} style={{ color: colors.primary }} />
                  <h3 className="text-xl font-semibold">User Roles &amp; Permissions Matrix</h3>
                </div>
                <button
                  className="rounded px-3 py-1 text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.primaryContainer, color: colors.onPrimaryContainer }}
                >
                  <Plus size={16} /> Add Role
                </button>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {["Role", "View Patient Data", "Edit Records", "Manage Beds", "System Config"].map((h, i) => (
                        <th
                          key={h}
                          className={`py-2 px-4 text-xs font-semibold border-b ${i === 0 ? "" : "text-center"}`}
                          style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}
                        >
                          {h}
                        </th>
                      ))}
                      <th
                        className="py-2 px-4 text-xs font-semibold border-b text-right"
                        style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r) => (
                      <tr
                        key={r.role}
                        className="border-b transition-colors group"
                        style={{ borderColor: colors.outlineVariant }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F9FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="py-2 px-4 text-sm font-medium">{r.role}</td>
                        {[r.view, r.edit, r.beds, r.config].map((v, i) => (
                          <td key={i} className="py-2 px-4 text-center">
                            {v ? (
                              <CheckCircle2 size={20} style={{ color: colors.primary }} className="inline" />
                            ) : (
                              <XCircle size={20} style={{ color: colors.outlineVariant }} className="inline" />
                            )}
                          </td>
                        ))}
                        <td className="py-2 px-4 text-right">
                          <Pencil size={18} className="inline cursor-pointer transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
