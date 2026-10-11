import React from "react";
import {
  BedDouble,
  FileText,
  BellRing,
  Menu,
  Search,
  Activity,
  Shuffle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import { useGetWardsQuery, useGetAllHistoryQuery } from "../store/api/hospitalApi";

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

export default function AlertsReports() {
  const { data: wardsData, isLoading: wardsLoading, isError: wardsError } = useGetWardsQuery();
  const { data: historyData, isLoading: historyLoading, isError: historyError } = useGetAllHistoryQuery();
  const wards = wardsData?.wards || [];
  const history = historyData?.history || [];

  const alerts = wards.flatMap((ward) => {
    const total = Number(ward.total_beds) || 0;
    if (total <= 0) return [];
    const occupied = Number(ward.occupied_beds) || 0;
    const available = ward.available_beds == null
      ? Math.max(0, total - occupied)
      : Math.max(0, Number(ward.available_beds) || 0);
    const occupancy = Math.min(100, Math.round((occupied / total) * 100));
    if (available === 0) return [{
      level: "Critical",
      title: "No beds available",
      body: `${ward.name} has no available beds (${occupied}/${total} occupied).`,
      badgeBg: colors.errorContainer,
      badgeText: colors.onErrorContainer,
      stripe: colors.error,
    }];
    if (occupancy >= 85) return [{
      level: "Warning",
      title: "Ward nearing capacity",
      body: `${ward.name} is at ${occupancy}% capacity with ${available} ${available === 1 ? "bed" : "beds"} remaining.`,
      badgeBg: colors.tertiaryFixed,
      badgeText: colors.onTertiaryFixed,
      stripe: "#A86516",
    }];
    return [];
  });

  const recentEvents = history
    .filter((item) => ["ADMISSION_CREATED", "DOCTOR_APPROVED", "DOCTOR_REJECTED", "ADMITTED", "TRANSFERRED", "DISCHARGED"].includes(item.action))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((item) => {
      const actionNames = {
        ADMISSION_CREATED: "Admission request created",
        DOCTOR_APPROVED: "Admission request approved",
        DOCTOR_REJECTED: "Admission request rejected",
        ADMITTED: "Patient admitted",
        TRANSFERRED: "Patient transferred",
        DISCHARGED: "Patient discharged",
      };
      const date = new Date(item.created_at);
      return {
        level: item.action === "DOCTOR_REJECTED" ? "Attention" : "Activity",
        title: actionNames[item.action],
        body: `${item.patient_name || "Patient"} (${item.patient_id || "ID unavailable"})${item.performed_by_name ? ` — recorded by ${item.performed_by_name}` : ""}`,
        time: Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString(),
        badgeBg: item.action === "DOCTOR_REJECTED" ? colors.errorContainer : colors.secondaryFixed,
        badgeText: item.action === "DOCTOR_REJECTED" ? colors.onErrorContainer : colors.onSecondaryFixed,
        stripe: item.action === "DOCTOR_REJECTED" ? colors.error : colors.primary,
      };
    });

  const totalBeds = wards.reduce((sum, ward) => sum + (Number(ward.total_beds) || 0), 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + (Number(ward.occupied_beds) || 0), 0);
  const today = new Date().toDateString();
  const todaysEvents = history.filter((item) => new Date(item.created_at).toDateString() === today);
  const reports = [
    { icon: BedDouble, title: "Ward Capacity", cadence: "Current", desc: wardsError ? "Ward capacity could not be loaded." : wards.length ? `${occupiedBeds} of ${totalBeds} beds occupied across ${wards.length} wards (${totalBeds ? Math.round(occupiedBeds / totalBeds * 100) : 0}% occupancy).` : "No ward capacity data is available.", lastGen: wardsLoading ? "Loading ward data..." : "Live ward data" },
    { icon: Activity, title: "Patient Activity", cadence: "Today", desc: historyError ? "Patient activity could not be loaded." : `${todaysEvents.length} patient history events recorded today; ${history.length} total events available.`, lastGen: historyLoading ? "Loading history..." : "Live history data" },
    { icon: Shuffle, title: "Patient Flow", cadence: "All time", desc: historyError ? "Patient flow data could not be loaded." : `${history.filter((item) => item.action === "ADMITTED").length} admissions, ${history.filter((item) => item.action === "TRANSFERRED").length} transfers, and ${history.filter((item) => item.action === "DISCHARGED").length} discharges recorded.`, lastGen: historyLoading ? "Loading history..." : "Live history data" },
  ];

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
            </div>

            <div className="flex flex-col gap-2">
              {wardsError && historyError ? (
                <p className="rounded-lg border p-5 text-sm" style={{ borderColor: colors.errorContainer, backgroundColor: colors.surfaceContainerLowest, color: colors.error }}>Unable to load live alerts and activity. Please refresh the page and try again.</p>
              ) : wardsLoading || historyLoading ? (
                <p className="rounded-lg border p-5 text-sm" style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest, color: colors.onSurfaceVariant }}>Loading live ward and patient activity...</p>
              ) : alerts.length === 0 && recentEvents.length === 0 ? (
                <p className="rounded-lg border p-5 text-sm" style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest, color: colors.onSurfaceVariant }}>No capacity alerts or patient events are available yet.</p>
              ) : [...alerts, ...recentEvents].map((a, index) => (
                <div
                  key={`${a.title}-${index}`}
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
                      {a.time && <span className="font-mono text-xs" style={{ color: colors.onSurfaceVariant }}>{a.time}</span>}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{a.title}</h3>
                  <p className="text-sm mb-4" style={{ color: colors.onSurfaceVariant }}>
                    {a.body}
                  </p>
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
