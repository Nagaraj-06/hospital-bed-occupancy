import React, { useState } from "react";
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
  Bell,
  Clock,
  ChevronDown,
  Search,
  ListFilter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixedDim: "#6CD3F7",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  tertiaryFixed: "#FFDCBF",
  onTertiaryFixed: "#2D1600",
  tertiaryContainer: "#A86516",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainerHigh: "#E5E9EB",
  surfaceContainerHighest: "#DFE3E6",
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
  { icon: ListChecks, label: "Waiting List", active: true },
  { icon: ClipboardList, label: "Ward Logs" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
];

const priorityStyles = {
  CRITICAL: { bg: colors.errorContainer, text: colors.onErrorContainer, ping: true },
  HIGH: { bg: colors.tertiaryFixed, text: colors.onTertiaryFixed },
  MED: { bg: colors.surfaceVariant, text: colors.onSurfaceVariant },
  LOW: { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant },
};

const waitTimeColor = {
  CRITICAL: colors.error,
  HIGH: colors.tertiaryContainer,
  MED: colors.onSurfaceVariant,
  LOW: colors.onSurfaceVariant,
};

const queue = [
  { priority: "CRITICAL", id: "PT-8942-X", ward: "Intensive Care Unit (ICU)", since: "08:15 AM", wait: "03h 45m" },
  { priority: "HIGH", id: "PT-7109-A", ward: "Cardiac Step-Down", since: "09:30 AM", wait: "02h 30m" },
  { priority: "MED", id: "PT-3321-B", ward: "General Medical Ward 4", since: "10:45 AM", wait: "01h 15m" },
  { priority: "LOW", id: "PT-1102-L", ward: "Observation Unit", since: "11:50 AM", wait: "00h 10m" },
];

function PriorityBadge({ priority }) {
  const s = priorityStyles[priority];
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.ping && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: colors.error }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colors.error }} />
        </span>
      )}
      {priority}
    </div>
  );
}

export default function WaitingList() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <nav
        className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r flex flex-col gap-1 p-4 z-50"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: colors.primary }}>
            CityCare General
          </h2>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
            Staff ID: 94021
          </p>
        </div>
        <ul className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 rounded transition-colors active:scale-95 duration-150 text-sm"
                style={
                  item.active
                    ? { color: colors.primary, backgroundColor: colors.secondaryContainer, fontWeight: 600 }
                    : { color: colors.onSurfaceVariant }
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t pt-4" style={{ borderColor: colors.outlineVariant }}>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2.5 rounded transition-colors active:scale-95 duration-150 text-sm"
            style={{ color: colors.onSurfaceVariant }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow ml-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div />
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <Clock size={20} />
            </button>
            <div className="h-6 w-px mx-2" style={{ backgroundColor: colors.outlineVariant }} />
            <button className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <span>Hospital/Branch Selector</span>
              <ChevronDown size={16} />
            </button>
            <div
              className="w-8 h-8 rounded-full border ml-2 flex items-center justify-center text-xs font-semibold"
              style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
            >
              A
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-grow p-6">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold">Patient Waiting List</h1>
                <p className="text-base mt-1" style={{ color: colors.onSurfaceVariant }}>
                  Real-time queue for bed assignment and ward transfers.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Patient ID..."
                    className="pl-10 pr-4 h-8 rounded border text-sm w-64 outline-none transition-shadow"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 1px ${colors.primaryFixedDim}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.outlineVariant;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  className="flex items-center gap-2 px-4 h-8 rounded border text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest, color: colors.onSurface }}
                >
                  <ListFilter size={18} /> Filter
                </button>
              </div>
            </div>

            {/* Table card */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: colors.outlineVariant,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }}>
                      {["Priority", "Patient ID", "Required Ward", "Waiting Since", "Wait Time"].map((h) => (
                        <th key={h} className="py-2 px-4 text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                          {h}
                        </th>
                      ))}
                      <th className="py-2 px-4 text-xs font-semibold text-right" style={{ color: colors.onSurfaceVariant }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {queue.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`group transition-colors ${i !== queue.length - 1 ? "border-b" : ""}`}
                        style={{ borderColor: colors.outlineVariant }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F9FF")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="py-2 px-4">
                          <PriorityBadge priority={row.priority} />
                        </td>
                        <td className="py-2 px-4 font-mono">{row.id}</td>
                        <td className="py-2 px-4 text-sm" style={{ color: colors.onSurfaceVariant }}>
                          {row.ward}
                        </td>
                        <td className="py-2 px-4 font-mono" style={{ color: colors.onSurfaceVariant }}>
                          {row.since}
                        </td>
                        <td className="py-2 px-4 font-mono font-semibold" style={{ color: waitTimeColor[row.priority] }}>
                          {row.wait}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="px-3 py-1 rounded border text-sm font-semibold transition-colors hover:opacity-80"
                              style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
                            >
                              Alternatives
                            </button>
                            <button
                              className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors"
                              style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                            >
                              Assign Bed
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="border-t px-4 py-2 flex justify-between items-center text-sm"
                style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
              >
                <span>Showing 4 of 24 pending patients</span>
                <div className="flex gap-2">
                  <button className="p-1 rounded transition-colors hover:opacity-80 disabled:opacity-50" disabled>
                    <ChevronLeft size={18} />
                  </button>
                  <button className="p-1 rounded transition-colors hover:opacity-80">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}