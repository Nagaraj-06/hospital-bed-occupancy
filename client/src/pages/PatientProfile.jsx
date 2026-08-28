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
  ArrowLeft,
  Search,
  Bell,
  Clock,
  ChevronDown,
  Cake,
  DoorOpen,
  IdCard,
  Phone,
  Smartphone,
  Calendar,
  Route,
  ListFilter,
  Siren,
  Stethoscope,
  Activity,
  CheckCircle2,
  LogOut,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  onSecondaryContainer: "#586377",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",
  surface: "#F6FAFD",
  surfaceBright: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainerHigh: "#E5E9EB",
  surfaceVariant: "#DFE3E6",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outline: "#6E797E",
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
  { icon: Settings, label: "Settings" },
];

const timeline = [
  {
    icon: Siren,
    title: "Emergency Department",
    subtitle: "Triage & Initial Assessment",
    date: "Oct 24",
    time: "08:30",
    note: "Patient presented with severe abdominal pain. Vitals stable. Scheduled for stat ultrasound.",
    by: "Dr. J. Smith",
  },
  {
    icon: Stethoscope,
    title: "Operating Room 3",
    subtitle: "Surgery",
    date: "Oct 24",
    time: "14:15",
    note: "Laparoscopic cholecystectomy performed. No complications. Transferring to PACU.",
    by: "Dr. A. Patel",
  },
  {
    icon: Activity,
    title: "PACU (Recovery)",
    subtitle: "Post-Anesthesia Care Unit",
    date: "Oct 24",
    time: "16:30",
    note: "Patient extubated, breathing independently. Pain managed well on PCA pump.",
    withCheck: true,
  },
];

export default function PatientDetails() {
  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <nav
        className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r flex flex-col gap-1 p-4 z-50"
        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
            CityCare General
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold"
              style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
            >
              SM
            </div>
            <div>
              <p className="text-sm font-semibold">Staff Member</p>
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                Staff ID: 94021
              </p>
            </div>
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
      </nav>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 border-b flex justify-between items-center px-6 py-2 h-16"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4 flex-1">
            <a
              href="#"
              className="flex items-center justify-center p-2 rounded-full transition-colors hover:bg-slate-100"
              style={{ color: colors.onSurfaceVariant }}
            >
              <ArrowLeft size={20} />
            </a>
            <div className="relative w-64">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.outline }} />
              <input
                className="w-full pl-9 pr-3 h-8 rounded-full border text-sm outline-none transition-shadow"
                style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}
                placeholder="Search patients, wards..."
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-full transition-colors hover:bg-slate-100" style={{ color: colors.onSurfaceVariant }}>
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: colors.error }} />
              </button>
              <button className="p-2 rounded-full transition-colors hover:bg-slate-100" style={{ color: colors.onSurfaceVariant }}>
                <Clock size={20} />
              </button>
            </div>
            <div className="h-6 w-px" style={{ backgroundColor: colors.outlineVariant }} />
            <button className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <span className="text-xs font-semibold">Main Campus</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto">
            {/* Patient header */}
            <div
              className="rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start gap-4 shadow-sm border"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
                    style={{ borderColor: colors.surface, backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
                  >
                    RM
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                    style={{ backgroundColor: "#D1FAE5" }}
                    title="Stable"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#10B981" }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#10B981" }} />
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-1 flex-wrap">
                    <h1 className="text-3xl font-bold">Robert MacIntyre</h1>
                    <span
                      className="font-mono px-2 py-0.5 rounded border text-sm"
                      style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant }}
                    >
                      P-1001
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4 flex-wrap text-sm" style={{ color: colors.onSurfaceVariant }}>
                    <span className="flex items-center gap-1">
                      <Cake size={16} /> 72 yrs (DOB: 12/04/1951)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User size={16} /> Male
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-semibold"
                      style={{ backgroundColor: `${colors.secondaryContainer}80`, color: colors.onSecondaryContainer, borderColor: colors.secondaryContainer }}
                    >
                      <DoorOpen size={18} />
                      <span>Surgical Ward A</span>
                    </div>
                    <div
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-bold"
                      style={{ backgroundColor: `${colors.secondaryContainer}80`, color: colors.onSecondaryContainer, borderColor: colors.secondaryContainer }}
                    >
                      <BedDouble size={18} />
                      <span>Bed 14</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  className="px-6 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                >
                  <ArrowLeftRight size={16} />
                  Transfer Patient
                </button>
                <button
                  className="px-6 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm border transition-colors hover:opacity-80"
                  style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, color: colors.onSurface }}
                >
                  <LogOut size={16} />
                  Discharge
                </button>
              </div>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left column */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Patient information */}
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: colors.outlineVariant }}>
                    <IdCard size={20} style={{ color: colors.primary }} />
                    Patient Information
                  </h3>
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                        Primary Contact
                      </dt>
                      <dd className="flex items-center gap-1 text-sm">
                        <Phone size={14} style={{ color: colors.outline }} />
                        +1 (555) 234-5678
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                        Emergency Contact
                      </dt>
                      <dd className="text-sm">
                        Sarah MacIntyre (Daughter)
                        <div className="flex items-center gap-1 mt-1" style={{ color: colors.onSurfaceVariant }}>
                          <Smartphone size={14} />
                          +1 (555) 987-6543
                        </div>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                        Allergies
                      </dt>
                      <dd className="flex gap-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-sm font-medium border"
                          style={{ backgroundColor: colors.errorContainer, color: colors.onErrorContainer, borderColor: `${colors.error}33` }}
                        >
                          Penicillin
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-sm border"
                          style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant }}
                        >
                          Latex
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                        Primary Care Physician
                      </dt>
                      <dd className="text-sm">Dr. Emily Chen</dd>
                    </div>
                  </dl>
                </div>

                {/* Current stay */}
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: colors.outlineVariant }}>
                    <Calendar size={20} style={{ color: colors.primary }} />
                    Current Stay
                  </h3>
                  <div className="space-y-4">
                    <div
                      className="flex justify-between items-center p-2 rounded-lg border"
                      style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.surfaceVariant }}
                    >
                      <span className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                        Length of Stay (LOS)
                      </span>
                      <span className="font-mono font-bold text-lg" style={{ color: colors.primary }}>
                        4 Days
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                          Admitted
                        </p>
                        <p className="font-mono text-sm">Oct 24, 08:30</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                          Expected Discharge
                        </p>
                        <p className="font-mono text-sm">Oct 29, 14:00</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: colors.onSurfaceVariant }}>
                        Primary Diagnosis
                      </p>
                      <p className="text-sm">Post-operative observation following laparoscopic cholecystectomy.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: timeline */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <div className="rounded-xl p-6 shadow-sm border flex-1" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <div className="flex justify-between items-center border-b pb-4 mb-6" style={{ borderColor: colors.outlineVariant }}>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Route size={20} style={{ color: colors.primary }} />
                      Patient Flow Timeline
                    </h3>
                    <button
                      className="text-sm font-semibold px-2 py-1 rounded flex items-center gap-1 transition-colors hover:opacity-80"
                      style={{ color: colors.primary }}
                    >
                      <ListFilter size={16} />
                      Filter
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-4">
                    <div className="absolute left-[27px] top-4 bottom-4 w-px" style={{ backgroundColor: colors.outlineVariant }} />
                    <div className="space-y-8">
                      {timeline.map((item) => (
                        <div key={item.title} className="relative flex items-start gap-4 group">
                          <div
                            className="absolute -left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10"
                            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.outline }} />
                          </div>
                          <div
                            className="flex-1 rounded-lg p-4 border transition-colors shadow-sm"
                            style={{ backgroundColor: colors.surfaceBright, borderColor: colors.outlineVariant }}
                          >
                            <div className="flex justify-between items-start mb-2 gap-4">
                              <div>
                                <h4 className="text-sm font-semibold flex items-center gap-1">
                                  <item.icon size={14} style={{ color: colors.outline }} />
                                  {item.title}
                                </h4>
                                <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                  {item.subtitle}
                                </p>
                              </div>
                              <span className="font-mono text-sm text-right whitespace-nowrap" style={{ color: colors.onSurfaceVariant }}>
                                {item.date}
                                <br />
                                {item.time}
                              </span>
                            </div>
                            <div
                              className="p-2 rounded border flex items-start gap-2"
                              style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.surfaceVariant }}
                            >
                              {item.withCheck && <CheckCircle2 size={18} style={{ color: colors.primary }} className="mt-0.5 shrink-0" />}
                              <div>
                                <p className="text-sm">
                                  {!item.withCheck && <span className="font-medium">Note: </span>}
                                  {item.note}
                                </p>
                                {item.by && (
                                  <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                                    - {item.by}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Current ward (active) */}
                      <div className="relative flex items-start gap-4 group">
                        <div
                          className="absolute -left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10"
                          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.primary }}
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: colors.primary }} />
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colors.primary }} />
                          </span>
                        </div>
                        <div
                          className="flex-1 rounded-lg p-4 shadow-sm"
                          style={{ backgroundColor: `${colors.primaryFixed}30`, border: `2px solid ${colors.primary}4D` }}
                        >
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <div>
                              <h4 className="text-sm font-bold flex items-center gap-1" style={{ color: colors.primary }}>
                                <DoorOpen size={14} />
                                Surgical Ward A
                              </h4>
                              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                Current Location (Bed 14)
                              </p>
                            </div>
                            <span className="font-mono text-sm text-right font-bold whitespace-nowrap" style={{ color: colors.primary }}>
                              Oct 25
                              <br />
                              09:00
                            </span>
                          </div>
                          <div className="p-2 rounded border" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                            <p className="text-sm">
                              <span className="font-medium">Latest Update: </span>
                              Patient is ambulatory. Diet advanced to clear liquids. Drain output minimal.
                            </p>
                            <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                              - RN K. Lee (08:00 today)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pending discharge */}
                      <div className="relative flex items-start gap-4 group opacity-60">
                        <div
                          className="absolute -left-4 w-6 h-6 rounded-full border-2 border-dashed z-10"
                          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                        />
                        <div className="flex-1 rounded-lg p-4 border border-dashed" style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1" style={{ color: colors.onSurfaceVariant }}>
                                <LogOut size={14} />
                                Pending Discharge
                              </h4>
                              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                Awaiting clearance
                              </p>
                            </div>
                            <span className="font-mono text-sm text-right whitespace-nowrap" style={{ color: colors.onSurfaceVariant }}>
                              Expected:
                              <br />
                              Oct 29
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}