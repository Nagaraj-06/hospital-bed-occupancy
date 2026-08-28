import React, { useState } from "react";
import {
  Hospital,
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
  Bell,
  Clock,
  ChevronDown,
  ListFilter,
  Clipboard,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixedDim: "#6CD3F7",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainer: "#EAEEF1",
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
  { icon: LogIn, label: "Admissions", active: true },
  { icon: ArrowLeftRight, label: "Transfers" },
  { icon: ListChecks, label: "Waiting List" },
  { icon: ClipboardList, label: "Ward Logs" },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
];

const priorityStyles = {
  Urgent: { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
  Routine: { bg: "#DCFCE7", text: "#166534", dot: "#15803D" },
  Critical: { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C", pulse: true },
};

const pendingAdmissions = [
  {
    id: "PT-84920",
    name: "Sarah Jenkins",
    initials: "SJ",
    dob: "04/12/1958 (65y)",
    sex: "F",
    priority: "Urgent",
    tags: ["Cardiology", "Telemetry Bed"],
    waiting: "45m",
    physician: "Dr. Miller",
  },
  {
    id: "PT-84921",
    name: "Robert Chen",
    initials: "RC",
    dob: "09/02/1971 (52y)",
    sex: "M",
    priority: "Routine",
    tags: ["Orthopedics", "Standard"],
    waiting: "12m",
    physician: "Dr. Lee",
  },
  {
    id: "PT-84922",
    name: "Elena Rodriguez",
    initials: "ER",
    dob: "17/07/1980 (43y)",
    sex: "F",
    priority: "Critical",
    tags: ["ICU", "Intensive"],
    waiting: "2m",
    physician: "Dr. Vance",
  },
];

function PriorityBadge({ priority }) {
  const s = priorityStyles[priority];
  return (
    <span
      className="px-2 py-1 rounded font-semibold text-[10px] flex items-center gap-1"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.pulse ? "animate-pulse" : ""}`} style={{ backgroundColor: s.dot }} />
      {priority}
    </span>
  );
}

export default function AdmissionsManagement() {
  const [selectedId, setSelectedId] = useState("PT-84920");
  const selected = pendingAdmissions.find((p) => p.id === selectedId);
  const noBedAvailable = true; // mirrors the original's edge-case overlay state

  return (
    <div className="h-screen flex overflow-hidden font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <nav
        className="w-64 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col gap-1 p-4 z-50 border-r"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <div className="flex items-center gap-2 mb-6 px-2">
          <Hospital size={30} style={{ color: colors.primary }} />
          <div>
            <h2 className="text-lg font-bold leading-tight" style={{ color: colors.primary }}>
              CityCare General
            </h2>
            <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
              Staff ID: 94021
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-150 text-sm"
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
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-150 text-sm"
            style={{ color: colors.onSurfaceVariant }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
          <div className="flex items-center gap-3 mt-2 px-2 py-2">
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold"
              style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
            >
              AV
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Dr. A. Vance</span>
              <span className="text-[11px]" style={{ color: colors.onSurfaceVariant }}>
                Admissions Coord.
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-64" style={{ backgroundColor: colors.surface }}>
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold" style={{ color: colors.primary }}>
              CityCare General Hospital
            </h1>
            <div className="relative w-64">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
              <input
                className="w-full h-8 pl-8 pr-3 rounded-full border text-sm outline-none transition-colors"
                style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }}
                placeholder="Search patients, ID, wards..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full relative transition-colors hover:bg-slate-100"
              style={{ color: colors.onSurfaceVariant }}
            >
              <Bell size={20} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 animate-pulse"
                style={{ backgroundColor: colors.error, borderColor: colors.surfaceContainerLowest }}
              />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              style={{ color: colors.onSurfaceVariant }}
            >
              <Clock size={20} />
            </button>
            <div className="h-6 w-px mx-1" style={{ backgroundColor: colors.outlineVariant }} />
            <button
              className="flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-slate-100"
              style={{ color: colors.onSurfaceVariant }}
            >
              <span className="text-xs font-semibold">North Wing</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden p-6 flex gap-6 max-w-[1440px] mx-auto w-full">
          {/* Left panel: pending admissions */}
          <section
            className="w-1/3 flex flex-col rounded-xl border shadow-sm overflow-hidden flex-shrink-0"
            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
          >
            <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}>
              <div>
                <h2 className="text-xl font-semibold">Pending Admissions</h2>
                <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                  12 Patients awaiting bed assignment
                </p>
              </div>
              <button
                className="p-2 rounded-full transition-colors flex items-center justify-center hover:opacity-80"
                style={{ color: colors.primary, backgroundColor: colors.secondaryContainer }}
              >
                <ListFilter size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 gap-2 flex flex-col" style={{ backgroundColor: colors.surfaceContainerLow }}>
              {pendingAdmissions.map((p) => {
                const isSelected = p.id === selectedId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="p-4 rounded-lg border cursor-pointer transition-transform hover:scale-[1.01]"
                    style={{
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                      borderLeft: isSelected ? `4px solid ${colors.primary}` : `1px solid ${colors.outlineVariant}`,
                      boxShadow: isSelected ? "0 2px 4px -1px rgba(0,0,0,0.03)" : undefined,
                      opacity: isSelected ? 1 : 0.8,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-semibold">{p.name}</h4>
                        <span className="font-mono text-sm" style={{ color: colors.onSurfaceVariant }}>
                          ID: {p.id}
                        </span>
                      </div>
                      <PriorityBadge priority={p.priority} />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 rounded border text-[11px]"
                          style={{ backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div
                      className="flex justify-between items-center mt-1 pt-1 border-t text-[11px]"
                      style={{ borderColor: colors.surfaceContainer, color: colors.onSurfaceVariant }}
                    >
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> Waiting: {p.waiting}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} /> {p.physician}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right panel: admission form & bed assignment */}
          <section className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Patient context banner */}
            <div
              className="rounded-xl border p-4 flex items-center justify-between shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: colors.secondaryContainer, color: colors.primary }}
                >
                  {selected.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{selected.name}</h2>
                  <div className="flex gap-4 font-mono text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                    <span>ID: {selected.id}</span>
                    <span>DOB: {selected.dob}</span>
                    <span>{selected.sex}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                  Admission Status
                </span>
                <span
                  className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
                >
                  Pending Assignment
                </span>
              </div>
            </div>

            {/* Bento grid: form */}
            <div className="grid grid-cols-2 gap-4">
              {/* Clinical requirements */}
              <div
                className="col-span-1 rounded-xl border p-6 shadow-sm flex flex-col gap-4"
                style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
              >
                <div className="border-b pb-2 mb-1" style={{ borderColor: colors.surfaceContainer }}>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Clipboard size={20} style={{ color: colors.primary }} /> Clinical Requirements
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                      Admission Type
                    </label>
                    <select
                      className="w-full h-8 px-2 rounded border text-sm focus:outline-none"
                      style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                    >
                      <option>Direct Admission</option>
                      <option>ED Transfer</option>
                      <option>Post-Op</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                      Attending Physician
                    </label>
                    <div className="relative">
                      <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
                      <input
                        type="text"
                        defaultValue={`Dr. J. ${selected.physician.split(" ")[1] ?? "Miller"}`}
                        className="w-full h-8 pl-8 pr-2 rounded border text-sm focus:outline-none"
                        style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                        Expected Stay
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          defaultValue={3}
                          className="w-full h-8 pl-2 pr-9 rounded border font-mono text-sm focus:outline-none"
                          style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.onSurfaceVariant }}>
                          Days
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                        Priority
                      </label>
                      <select
                        defaultValue={selected.priority}
                        className="w-full h-8 px-2 rounded border text-sm font-semibold focus:outline-none"
                        style={{ backgroundColor: "#FEF3C7", color: "#92400E", borderColor: "#FCD34D" }}
                      >
                        <option>Urgent</option>
                        <option>Routine</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2 pt-2 border-t" style={{ borderColor: colors.surfaceContainer }}>
                    <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                      Primary Diagnosis / Notes
                    </label>
                    <textarea
                      rows={2}
                      defaultValue="Acute exacerbation of CHF. Requires continuous telemetry monitoring."
                      className="w-full p-2 rounded border text-sm resize-none focus:outline-none"
                      style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                    />
                  </div>
                </div>
              </div>

              {/* Bed assignment */}
              <div
                className="col-span-1 rounded-xl border p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
              >
                <div className="border-b pb-2 mb-1 flex justify-between items-center" style={{ borderColor: colors.surfaceContainer }}>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <BedDouble size={20} style={{ color: colors.primary }} /> Unit Assignment
                  </h3>
                  <span className="font-mono text-[11px]" style={{ color: colors.onSurfaceVariant }}>
                    Cardiology Wing (CW)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                      Required Ward
                    </label>
                    <select
                      className="w-full h-8 px-2 rounded border text-sm focus:outline-none"
                      style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                    >
                      <option>Cardiology (CW-3)</option>
                      <option>Internal Med (IM-2)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                      Required Bed Type
                    </label>
                    <select
                      className="w-full h-8 px-2 rounded border text-sm focus:outline-none"
                      style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                    >
                      <option>Telemetry</option>
                      <option>Standard Medical</option>
                      <option>ICU</option>
                    </select>
                  </div>
                </div>

                {/* Hidden ward map, obscured by overlay when no bed available */}
                <div className="flex-1 rounded border relative opacity-30" style={{ backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant }}>
                  <div className="absolute inset-0 p-2 grid grid-cols-4 grid-rows-3 gap-1">
                    {["301-A", "301-B"].map((bed) => (
                      <div
                        key={bed}
                        className="rounded border p-1 flex flex-col items-center justify-center"
                        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                      >
                        <User size={16} style={{ color: colors.error }} />
                        <span className="font-mono text-[10px]" style={{ color: colors.onSurfaceVariant }}>
                          {bed}
                        </span>
                      </div>
                    ))}
                    <div className="col-span-2 row-span-3 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(223,227,230,0.2)" }}>
                      <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(62,72,77,0.5)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                        Corridor A
                      </span>
                    </div>
                    {["302-A", "302-B"].map((bed) => (
                      <div
                        key={bed}
                        className="rounded border p-1 flex flex-col items-center justify-center"
                        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                      >
                        <User size={16} style={{ color: colors.error }} />
                        <span className="font-mono text-[10px]" style={{ color: colors.onSurfaceVariant }}>
                          {bed}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edge case overlay: no suitable bed available */}
                {noBedAvailable && (
                  <div
                    className="absolute inset-0 top-32 z-10 p-4 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: "rgba(246,250,253,0.8)", backdropFilter: "blur(4px)" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse"
                      style={{ backgroundColor: colors.errorContainer }}
                    >
                      <AlertTriangle size={32} style={{ color: colors.error }} />
                    </div>
                    <h3 className="text-2xl font-semibold mb-1" style={{ color: colors.error }}>
                      No Suitable Beds Available
                    </h3>
                    <p className="text-sm mb-6 max-w-[250px]" style={{ color: colors.onSurfaceVariant }}>
                      Cardiology (CW-3) currently has 0 available Telemetry beds. Next projected discharge in 4 hours.
                    </p>
                    <div className="flex flex-col gap-2 w-full max-w-[200px]">
                      <button
                        className="w-full py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                        style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                      >
                        Add to Waiting List
                      </button>
                      <button
                        className="w-full py-2 rounded-lg text-sm font-semibold border transition-colors hover:opacity-80"
                        style={{ color: colors.primary, borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                      >
                        View Alternative Wards
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action bar */}
            <div
              className="mt-auto rounded-xl border p-4 flex justify-between items-center shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: colors.error }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.errorContainer)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Cancel Admission
              </button>
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 rounded-lg border text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ borderColor: colors.outlineVariant, color: colors.onSurface }}
                >
                  Save Draft
                </button>
                <button
                  disabled
                  className="px-6 py-2 rounded-lg text-sm font-semibold cursor-not-allowed opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: colors.surfaceVariant, color: colors.onSurfaceVariant }}
                >
                  Confirm Admission <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}