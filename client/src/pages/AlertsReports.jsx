import React from "react";
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
  Menu,
  Search,
  MoreVertical,
  Plus,
  Activity,
  Shuffle,
  FileSpreadsheet,
  Play,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  onPrimary: "#FFFFFF",
  onError: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  secondaryFixed: "#D8E3FB",
  onSecondaryFixed: "#111C2D",
  onSecondaryContainer: "#586377",
  tertiaryFixed: "#FFDCBF",
  onTertiaryFixed: "#2D1600",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainer: "#EAEEF1",
  surfaceContainerHigh: "#E5E9EB",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outline: "#6E797E",
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
  { icon: FileText, label: "Reports", active: true },
  { icon: BellRing, label: "Alerts" },
  { icon: Settings, label: "Settings" },
];

const alerts = [
  {
    level: "Critical",
    time: "10:42 AM",
    title: "ICU Capacity Reached",
    body: "Ward 4A (Intensive Care) has reached 100% bed occupancy. 2 incoming transfers pending.",
    badgeBg: colors.errorContainer,
    badgeText: colors.onErrorContainer,
    stripe: colors.error,
    pulse: true,
    action: { label: "View Ward", bg: colors.error, text: colors.onError },
  },
  {
    level: "Warning",
    time: "09:15 AM",
    title: "Staff Shortage: Night Shift",
    body: "Maternity Ward 2B is currently understaffed by 2 RNs for the upcoming night shift.",
    badgeBg: colors.tertiaryFixed,
    badgeText: colors.onTertiaryFixed,
    stripe: "#A86516",
    action: { label: "Manage Roster", outline: true },
  },
  {
    level: "Info",
    time: "Yesterday, 14:30",
    title: "Scheduled Maintenance Completed",
    body: "Routine HVAC maintenance in the South Wing operating theaters has concluded successfully.",
    badgeBg: colors.secondaryFixed,
    badgeText: colors.onSecondaryFixed,
    stripe: colors.primary,
    action: { label: "Dismiss", ghost: true },
  },
];

const reports = [
  {
    icon: BedDouble,
    title: "Bed Occupancy",
    cadence: "Daily",
    desc: "Comprehensive overview of current bed utilization across all hospital wings.",
    lastGen: "Last gen: Today, 06:00",
    exports: ["pdf", "csv"],
  },
  {
    icon: Activity,
    title: "Ward Performance",
    cadence: "Weekly",
    desc: "Key metrics on discharge times, admission rates, and staffing efficiency per ward.",
    lastGen: "Last gen: Oct 24",
    exports: ["pdf"],
  },
  {
    icon: Shuffle,
    title: "Patient Flow",
    cadence: "Monthly",
    desc: "Analysis of patient movement from admission through triage to final ward placement.",
    lastGen: "Last gen: Oct 01",
    exports: ["pdf"],
  },
];

export default function AlertsReports() {
  return (
    <div className="flex min-h-screen font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>

      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 min-h-screen" style={{ backgroundColor: colors.surface }}>
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4">
            <Menu size={22} className="md:hidden cursor-pointer active:opacity-70" style={{ color: colors.onSurfaceVariant }} />
            <h2 className="text-lg font-bold hidden md:block" style={{ color: colors.primary }}>
              CityCare General Hospital
            </h2>
          </div>
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.outline }} />
              <input
                className="w-full h-8 pl-10 pr-3 rounded border text-sm outline-none"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }}
                placeholder="Search patients, wards..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserProfileHover />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Alerts */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.outlineVariant }}>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BellRing size={22} style={{ color: colors.primary }} />
                Alerts Center
              </h2>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded border text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }}
                >
                  Filter
                </button>
                <button
                  className="px-3 py-1 rounded text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: colors.primary }}
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {alerts.map((a) => (
                <div
                  key={a.title}
                  className="rounded-lg p-4 shadow-sm relative overflow-hidden border"
                  style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: a.level === "Critical" ? colors.errorContainer : colors.outlineVariant }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: a.stripe }} />
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"
                        style={{ backgroundColor: a.badgeBg, color: a.badgeText }}
                      >
                        {a.pulse && <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.error }} />}
                        {a.level}
                      </span>
                      <span className="font-mono text-sm" style={{ color: colors.onSurfaceVariant }}>
                        {a.time}
                      </span>
                    </div>
                    <MoreVertical size={18} className="cursor-pointer transition-colors hover:opacity-80" style={{ color: colors.outline }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{a.title}</h3>
                  <p className="text-sm mb-4" style={{ color: colors.onSurfaceVariant }}>
                    {a.body}
                  </p>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors hover:opacity-80"
                      style={
                        a.action.bg
                          ? { backgroundColor: a.action.bg, color: a.action.text }
                          : a.action.outline
                            ? { border: `1px solid ${colors.outlineVariant}` }
                            : { color: colors.primary }
                      }
                    >
                      {a.action.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reports */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.outlineVariant }}>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileText size={22} style={{ color: colors.primary }} />
                Reports
              </h2>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors"
                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                <Plus size={16} /> New
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reports.map((r) => (
                <div
                  key={r.title}
                  className="rounded-lg p-4 shadow-sm flex flex-col h-full transition-colors group cursor-pointer border"
                  style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center"
                      style={{ backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer }}
                    >
                      <r.icon size={20} />
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{ backgroundColor: colors.surfaceContainer, color: colors.onSurfaceVariant }}
                    >
                      {r.cadence}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1 transition-colors" style={{ color: colors.onSurface }}>
                    {r.title}
                  </h3>
                  <p className="text-sm flex-1 mb-4" style={{ color: colors.onSurfaceVariant }}>
                    {r.desc}
                  </p>
                  <div className="flex justify-between items-center border-t pt-2 mt-auto" style={{ borderColor: colors.outlineVariant }}>
                    <span className="font-mono text-[11px]" style={{ color: colors.onSurfaceVariant }}>
                      {r.lastGen}
                    </span>
                    <div className="flex gap-1">
                      {r.exports.includes("pdf") && (
                        <button
                          className="w-8 h-8 rounded flex items-center justify-center border transition-colors hover:opacity-80"
                          style={{ borderColor: colors.outlineVariant }}
                          title="Export PDF"
                        >
                          <FileText size={18} />
                        </button>
                      )}
                      {r.exports.includes("csv") && (
                        <button
                          className="w-8 h-8 rounded flex items-center justify-center border transition-colors hover:opacity-80"
                          style={{ borderColor: colors.outlineVariant }}
                          title="Export CSV"
                        >
                          <FileSpreadsheet size={18} />
                        </button>
                      )}
                      <button
                        className="w-8 h-8 rounded flex items-center justify-center shadow-sm transition-colors"
                        style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                        title="Generate Now"
                      >
                        <Play size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
