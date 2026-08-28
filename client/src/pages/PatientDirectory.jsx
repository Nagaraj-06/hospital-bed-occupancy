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
  UserPlus,
  Search,
  ListFilter,
  Eye,
  Pencil,
  LogOut,
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
  surface: "#F6FAFD",
  surfaceBright: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainerHigh: "#E5E9EB",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outlineVariant: "#BDC8CE",
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BedDouble, label: "Wards & Beds" },
  { icon: User, label: "Patients", active: true },
  { icon: LogIn, label: "Admissions" },
  { icon: ArrowLeftRight, label: "Transfers" },
  { icon: ListChecks, label: "Waiting List" },
  { icon: ClipboardList, label: "Ward Logs" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
];

const statusStyles = {
  Stable: { bg: "#D1FAE5", text: "#065F46" },
  Observation: { bg: "#FEF3C7", text: "#92400E" },
  Critical: { bg: "#FFE4E6", text: "#9F1239", pulse: "#F43F5E" },
  "Discharging Today": { bg: "#DBEAFE", text: "#1E40AF" },
};

const patients = [
  {
    id: "P-1001",
    name: "Eleanor Vance",
    age: "68 / F",
    ward: "Cardiology",
    bed: "Bed 12-A",
    admitted: "2023-10-24",
    status: "Stable",
    discharge: "2023-10-30",
    actions: ["view", "edit", "transfer"],
  },
  {
    id: "P-1042",
    name: "Marcus Thorne",
    age: "45 / M",
    ward: "Neurology",
    bed: "Bed 04-B",
    admitted: "2023-10-26",
    status: "Observation",
    discharge: "TBD",
    actions: ["view", "edit", "transfer"],
  },
  {
    id: "P-0988",
    name: "Sarah Jenkins",
    age: "32 / F",
    ward: "ICU",
    bed: "Bed 01",
    admitted: "2023-10-27",
    status: "Critical",
    discharge: "TBD",
    actions: ["view", "edit", "transfer"],
  },
  {
    id: "P-1055",
    name: "David Chen",
    age: "51 / M",
    ward: "Orthopedics",
    bed: "Bed 22-C",
    admitted: "2023-10-21",
    status: "Discharging Today",
    discharge: "2023-10-27",
    actions: ["view", "edit", "discharge"],
  },
];

function StatusPill({ status }) {
  const s = statusStyles[status] ?? { bg: "#E5E9EB", text: colors.onSurfaceVariant };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.pulse }} />}
      {status}
    </span>
  );
}

function RowActions({ actions }) {
  const map = {
    view: { icon: Eye, title: "View", color: colors.primary, hover: colors.primaryFixedDim },
    edit: { icon: Pencil, title: "Edit", color: colors.onSurfaceVariant, hover: colors.surfaceContainerHigh },
    transfer: { icon: ArrowLeftRight, title: "Transfer", color: colors.onSurfaceVariant, hover: colors.surfaceContainerHigh },
    discharge: { icon: LogOut, title: "Discharge", color: colors.onSurfaceVariant, hover: colors.surfaceContainerHigh },
  };
  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {actions.map((a) => {
        const cfg = map[a];
        return (
          <button
            key={a}
            title={cfg.title}
            className="p-1 rounded transition-colors"
            style={{ color: cfg.color }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = cfg.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <cfg.icon size={18} />
          </button>
        );
      })}
    </div>
  );
}

export default function PatientsManagement() {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <nav
        className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 overflow-y-auto gap-1 p-4 z-50 border-r shadow-sm"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors active:scale-95 duration-150"
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
          <li className="mt-auto">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors active:scale-95 duration-150"
              style={{ color: colors.onSurfaceVariant }}
            >
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-bold md:hidden" style={{ color: colors.primary }}>
              CityCare
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <Bell size={22} />
            </button>
            <button className="p-2 rounded-full transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <Clock size={22} />
            </button>
            <div className="h-8 w-px mx-2" style={{ backgroundColor: colors.outlineVariant }} />
            <button
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: colors.onSurfaceVariant }}
            >
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-[1440px] mx-auto space-y-6">
            {/* Page header */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div>
                <h1 className="text-3xl font-bold">Patients</h1>
                <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                  Manage and monitor patient records, admissions, and discharges.
                </p>
              </div>
              <button
                className="px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-sm transition-colors active:scale-95 duration-150"
                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                <UserPlus size={18} />
                Add Patient
              </button>
            </div>

            {/* Filters & search */}
            <div
              className="p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div className="relative w-full md:w-96">
                <Search size={20} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, Name, or NHS Number..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border h-10 text-sm outline-none transition-shadow"
                  style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryFixedDim}4D`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.outlineVariant;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <select
                    defaultValue=""
                    className="w-full pl-3 pr-8 py-2 rounded-lg border h-10 text-sm outline-none appearance-none cursor-pointer"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface, color: colors.onSurfaceVariant }}
                  >
                    <option disabled value="">
                      Filter by Ward
                    </option>
                    <option value="icu">Intensive Care (ICU)</option>
                    <option value="cardio">Cardiology</option>
                    <option value="neuro">Neurology</option>
                    <option value="ortho">Orthopedics</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: colors.onSurfaceVariant }}
                  />
                </div>

                <div className="relative flex-1 md:w-48">
                  <select
                    defaultValue=""
                    className="w-full pl-3 pr-8 py-2 rounded-lg border h-10 text-sm outline-none appearance-none cursor-pointer"
                    style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface, color: colors.onSurfaceVariant }}
                  >
                    <option disabled value="">
                      Filter by Status
                    </option>
                    <option value="admitted">Admitted</option>
                    <option value="discharged">Discharged</option>
                    <option value="critical">Critical</option>
                    <option value="stable">Stable</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: colors.onSurfaceVariant }}
                  />
                </div>

                <button
                  className="px-4 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-semibold border h-10 whitespace-nowrap transition-colors hover:opacity-80"
                  style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant, backgroundColor: colors.surface }}
                >
                  <ListFilter size={18} />
                  More
                </button>
              </div>
            </div>

            {/* Patient table */}
            <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-semibold border-b" style={{ backgroundColor: colors.surface, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}>
                      <th className="py-2 px-4 whitespace-nowrap">Patient ID</th>
                      <th className="py-2 px-4 whitespace-nowrap">Name</th>
                      <th className="py-2 px-4 whitespace-nowrap">Age/Gen</th>
                      <th className="py-2 px-4 whitespace-nowrap">Ward &amp; Bed</th>
                      <th className="py-2 px-4 whitespace-nowrap">Admission Date</th>
                      <th className="py-2 px-4 whitespace-nowrap">Status</th>
                      <th className="py-2 px-4 whitespace-nowrap">Exp. Discharge</th>
                      <th className="py-2 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y" style={{ borderColor: colors.outlineVariant }}>
                    {patients.map((p) => (
                      <tr key={p.id} className="group transition-colors hover:bg-slate-50" style={{ borderColor: colors.outlineVariant }}>
                        <td className="py-2 px-4 font-mono" style={{ color: colors.onSurfaceVariant }}>
                          {p.id}
                        </td>
                        <td className="py-2 px-4 font-medium">{p.name}</td>
                        <td className="py-2 px-4" style={{ color: colors.onSurfaceVariant }}>
                          {p.age}
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex flex-col">
                            <span>{p.ward}</span>
                            <span className="font-mono text-xs" style={{ color: colors.onSurfaceVariant }}>
                              {p.bed}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-4" style={{ color: colors.onSurfaceVariant }}>
                          {p.admitted}
                        </td>
                        <td className="py-2 px-4">
                          <StatusPill status={p.status} />
                        </td>
                        <td className="py-2 px-4" style={{ color: colors.onSurfaceVariant }}>
                          {p.discharge}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <RowActions actions={p.actions} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                className="px-6 py-2 border-t flex items-center justify-between text-sm"
                style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
              >
                <span>Showing 1-4 of 128 Patients</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded transition-colors hover:opacity-80 disabled:opacity-50" disabled>
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-mono">Page 1 of 32</span>
                  <button className="p-1 rounded transition-colors hover:opacity-80">
                    <ChevronRight size={20} />
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