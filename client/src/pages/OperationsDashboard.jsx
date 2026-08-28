import React from "react";
import {
  Search,
  Bell,
  Clock,
  ChevronDown,
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
  Calendar,
  Siren,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  PieChart,
  AlertTriangle,
  AlertCircle,
  MoreVertical,
  LogOut,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  onSecondaryContainer: "#586377",
  tertiaryContainer: "#A86516",
  error: "#BA1A1A",
  onError: "#FFFFFF",
  surface: "#F6FAFD",
  surfaceBright: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainer: "#EAEEF1",
  surfaceContainerHigh: "#E5E9EB",
  surfaceVariant: "#DFE3E6",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outline: "#6E797E",
  outlineVariant: "#BDC8CE",
};

function NavLink({ icon: Icon, label, active, badge }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-xs tracking-wide transition-colors active:scale-95 duration-150 relative ${active
          ? ""
          : "text-slate-500 hover:bg-slate-100"
        }`}
      style={
        active
          ? { color: colors.primary, backgroundColor: colors.secondaryContainer }
          : undefined
      }
    >
      <Icon size={20} strokeWidth={2} />
      <span className="font-sans text-sm font-medium tracking-normal">{label}</span>
      {badge && (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: colors.error, color: colors.onError }}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

function KpiCard({ label, icon: Icon, value, trend, trendLabel, highlight, muted }) {
  const trendColor =
    trend === "up" ? colors.error : trend === "down" ? colors.error : colors.primary;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <div
      className={`p-5 flex flex-col gap-2 rounded-xl border ${muted ? "" : ""}`}
      style={{
        borderColor: colors.outlineVariant,
        backgroundColor: muted ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
        borderLeft: highlight ? `4px solid ${colors.primary}` : undefined,
      }}
    >
      <div className="flex justify-between items-center text-xs font-semibold tracking-wide" style={{ color: colors.onSurfaceVariant }}>
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <div className="flex items-end gap-3 mt-1">
        <span className="font-mono text-3xl font-bold" style={{ color: colors.onSurface }}>
          {value}
        </span>
        <span
          className="text-sm font-medium mb-1 flex items-center gap-1"
          style={{ color: trendColor }}
        >
          {TrendIcon && <TrendIcon size={14} />}
          {trendLabel}
        </span>
      </div>
    </div>
  );
}

function WardBar({ label, pct, count, color, pulse }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs font-semibold">
        <span className="flex items-center gap-2" style={{ color: colors.onSurface }}>
          <span
            className={`w-2 h-2 rounded-full ${pulse ? "animate-pulse" : ""}`}
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <span className="font-mono" style={{ color }}>
          {pct}
        </span>
      </div>
      <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: colors.surfaceVariant }}>
        <div className="h-2.5 rounded-full" style={{ width: count, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SecondaryKpi({ label, value, color, border }) {
  return (
    <div
      className="p-4 text-center flex flex-col items-center justify-center rounded-xl border"
      style={{
        borderColor: colors.outlineVariant,
        backgroundColor: colors.surfaceBright,
        borderBottom: border ? `2px solid ${border}` : undefined,
      }}
    >
      <span className="text-xs font-semibold tracking-wide mb-1" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </span>
      <span className="font-mono text-2xl font-bold" style={{ color: color || colors.onSurface }}>
        {value}
      </span>
    </div>
  );
}

function StatusPill({ children, color }) {
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      {children}
    </span>
  );
}

const activity = [
  {
    time: "10:42",
    id: "PT-8492",
    action: "Admission",
    icon: LogIn,
    color: colors.primary,
    route: "ER → General A",
    status: "Completed",
    statusColor: colors.primary,
  },
  {
    time: "10:28",
    id: "PT-7105",
    action: "Transfer",
    icon: ArrowLeftRight,
    color: colors.tertiaryContainer,
    route: "Surgery → ICU",
    status: "In Progress",
    statusColor: colors.tertiaryContainer,
  },
  {
    time: "09:55",
    id: "PT-9321",
    action: "Discharge",
    icon: LogOut,
    color: colors.onSurfaceVariant,
    route: "General B → Home",
    status: "Pending Docs",
    statusColor: colors.onSurface,
    statusBg: colors.surfaceContainerHigh,
  },
  {
    time: "09:15",
    id: "PT-8840",
    action: "Emergency",
    icon: Siren,
    color: colors.error,
    route: "Triage → ER Resus",
    status: "Critical",
    statusColor: colors.error,
  },
  {
    time: "08:45",
    id: "PT-6229",
    action: "Admission",
    icon: LogIn,
    color: colors.primary,
    route: "Direct → Maternity",
    status: "Completed",
    statusColor: colors.primary,
  },
];

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 ml-64 flex items-center justify-between px-6 py-2 h-16 border-b"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <span className="text-xl font-bold" style={{ color: colors.primary }}>
          CityCare General Hospital
        </span>
        <div className="flex items-center gap-6">
          <div
            className="hidden md:flex items-center rounded-full px-4 py-2 border"
            style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
          >
            <Search size={18} className="mr-2" />
            <input
              className="bg-transparent border-none outline-none w-64 text-sm"
              placeholder="Search patients, wards..."
              style={{ color: colors.onSurface }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <button className="relative hover:opacity-80 transition-opacity" style={{ color: colors.onSurfaceVariant }}>
              <Bell size={20} />
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.error }}
              />
            </button>
            <button className="hover:opacity-80 transition-opacity" style={{ color: colors.onSurfaceVariant }}>
              <Clock size={20} />
            </button>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: colors.outlineVariant }} />
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold"
              style={{ borderColor: colors.outlineVariant, backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer }}
            >
              A
            </div>
            <span className="hidden md:inline text-xs font-semibold">Admin</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* Side Nav */}
      <nav
        className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r flex flex-col gap-1 p-4 z-50"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <div className="mb-8 px-2 mt-4">
          <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
            CityCare General
          </h1>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
            Staff ID: 94021
          </p>
        </div>
        <NavLink icon={LayoutDashboard} label="Dashboard" active />
        <NavLink icon={BedDouble} label="Wards & Beds" />
        <NavLink icon={User} label="Patients" />
        <NavLink icon={LogIn} label="Admissions" />
        <NavLink icon={ArrowLeftRight} label="Transfers" />
        <NavLink icon={ListChecks} label="Waiting List" />
        <NavLink icon={ClipboardList} label="Ward Logs" />
        <NavLink icon={BarChart3} label="Analytics" />
        <NavLink icon={FileText} label="Reports" />
        <NavLink icon={BellRing} label="Alerts" badge="3" />
        <NavLink icon={Settings} label="Settings" />
      </nav>

      {/* Main content */}
      <main className="ml-64 p-6 max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Filter bar */}
        <section
          className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border shadow-sm"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex gap-4 items-center flex-wrap">
            {[
              { icon: Calendar, label: "Today, Oct 24" },
              { icon: Siren, label: "All Wards" },
              { icon: Clock, label: "Current Shift (08:00 - 16:00)" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 border cursor-pointer hover:border-current transition-colors text-sm"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceBright }}
              >
                <f.icon size={16} />
                <span>{f.label}</span>
                <ChevronDown size={14} />
              </div>
            ))}
          </div>
          <button
            className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-slate-100 transition-all"
            style={{ color: colors.primary }}
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </section>

        {/* KPI grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Total Beds" icon={BedDouble} value="250" trendLabel="Capacity" />
          <KpiCard label="Occupied" icon={BedDouble} value="198" trend="up" trendLabel="+4" />
          <KpiCard label="Available" icon={CheckCircle2} value="32" trend="down" trendLabel="-2" highlight />
          <KpiCard label="Occupancy Rate" icon={PieChart} value="79.2%" trendLabel="Target: < 85%" muted />
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
              <div
                className="px-5 py-4 border-b flex justify-between items-center"
                style={{ backgroundColor: colors.surfaceBright, borderColor: colors.outlineVariant }}
              >
                <h3 className="text-lg font-semibold">Ward Occupancy</h3>
                <MoreVertical size={18} style={{ color: colors.onSurfaceVariant }} className="cursor-pointer" />
              </div>
              <div className="p-5 flex flex-col gap-5">
                <WardBar label="Emergency" pct="96.7% (29/30)" count="96.7%" color={colors.error} pulse />
                <WardBar label="ICU" pct="90.0% (18/20)" count="90%" color={colors.tertiaryContainer} />
                <WardBar label="General Ward" pct="68.8% (110/160)" count="68.8%" color={colors.primary} />
              </div>
            </div>

            {/* Critical alerts */}
            <div
              className="rounded-xl overflow-hidden border-l-4"
              style={{ backgroundColor: "rgba(186,26,26,0.05)", borderLeftColor: colors.error }}
            >
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: "rgba(186,26,26,0.2)" }}>
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.error }}>
                  <AlertTriangle size={20} /> Critical Alerts
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div
                  className="p-3 rounded border flex gap-3 items-start"
                  style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: "rgba(186,26,26,0.3)" }}
                >
                  <AlertCircle size={20} className="mt-0.5" style={{ color: colors.error }} />
                  <div>
                    <p className="text-sm font-bold">Emergency Capacity Alert</p>
                    <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                      Only 1 bed available in Emergency. Divert protocol recommended.
                    </p>
                    <p className="text-[10px] mt-2 font-semibold" style={{ color: colors.error }}>
                      10 MINS AGO
                    </p>
                  </div>
                </div>
                <div
                  className="p-3 rounded border flex gap-3 items-start"
                  style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: "rgba(168,101,22,0.3)" }}
                >
                  <Bell size={20} className="mt-0.5" style={{ color: colors.tertiaryContainer }} />
                  <div>
                    <p className="text-sm font-bold">ICU Threshold Reached</p>
                    <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                      ICU occupancy has reached 90% (18/20 beds).
                    </p>
                    <p className="text-[10px] mt-2 font-semibold" style={{ color: colors.tertiaryContainer }}>
                      45 MINS AGO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Secondary KPI strip */}
            <div className="grid grid-cols-4 gap-4">
              <SecondaryKpi label="Waiting" value="14" />
              <SecondaryKpi label="Admissions" value="47" color={colors.primary} border={colors.primary} />
              <SecondaryKpi label="Discharges" value="39" />
              <SecondaryKpi label="Transfers" value="21" color={colors.tertiaryContainer} border={colors.tertiaryContainer} />
            </div>

            {/* Recent activity table */}
            <div className="rounded-xl border overflow-hidden flex-1 flex flex-col" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
              <div
                className="px-5 py-4 border-b flex justify-between items-center"
                style={{ backgroundColor: colors.surfaceBright, borderColor: colors.outlineVariant }}
              >
                <h3 className="text-lg font-semibold">Recent Patient Activity</h3>
                <button className="text-sm font-semibold hover:underline" style={{ color: colors.primary }}>
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className="text-xs font-semibold border-b"
                      style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}
                    >
                      <th className="py-2 px-4">Time</th>
                      <th className="py-2 px-4">Patient ID</th>
                      <th className="py-2 px-4">Action</th>
                      <th className="py-2 px-4">From / To Ward</th>
                      <th className="py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y" style={{ borderColor: colors.outlineVariant }}>
                    {activity.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors" style={{ borderColor: colors.outlineVariant }}>
                        <td className="py-3 px-4 font-mono" style={{ color: colors.onSurfaceVariant }}>
                          {row.time}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">{row.id}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1" style={{ color: row.color }}>
                            <row.icon size={14} /> {row.action}
                          </span>
                        </td>
                        <td className="py-3 px-4">{row.route}</td>
                        <td className="py-3 px-4">
                          <StatusPill color={row.statusColor}>{row.status}</StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}