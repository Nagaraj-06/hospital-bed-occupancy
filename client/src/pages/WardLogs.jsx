import React, { useMemo, useState } from "react";
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
  FileSpreadsheet,
  ListFilter,
  Calendar,
  IdCard,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import { useGetWardLogsQuery } from "../store/api/hospitalApi";
import { downloadCsv, printTableAsPdf } from "../utils/export";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  surface: "#F6FAFD",
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
  { icon: User, label: "Patients" },
  { icon: LogIn, label: "Admissions" },
  { icon: ArrowLeftRight, label: "Transfers" },
  { icon: ListChecks, label: "Waiting List" },
  { icon: ClipboardList, label: "Ward Logs", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
];

const actionStyles = {
  ADMITTED:          { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" },
  TRANSFERRED:       { bg: "#DBEAFE", text: "#1E3A8A", border: "#BFDBFE" },
  BED_CLEANING:      { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A" },
  DISCHARGED:        { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  DISCHARGE:         { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  PROCEDURE:         { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" },
  CREATE_ADMISSION:  { bg: "#E0F2FE", text: "#0C4A6E", border: "#BAE6FD" },
  DOCTOR_APPROVED:   { bg: "#DCFCE7", text: "#14532D", border: "#86EFAC" },
  DOCTOR_REJECTED:   { bg: "#FEE2E2", text: "#7F1D1D", border: "#FCA5A5" },
  PENDING:           { bg: "#FEF9C3", text: "#713F12", border: "#FDE68A" },
  BED_ASSIGNED:      { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
};


function ActionBadge({ action }) {
  const s = actionStyles[action] || { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" };
  const label = action ? action.replace(/_/g, ' ') : 'UNKNOWN';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      {label}
    </span>
  );
}


export default function WardLogs() {
  const { data, isLoading, isError } = useGetWardLogsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("All Wards");
  const [selectedAction, setSelectedAction] = useState("All Actions");

  const logs = useMemo(() => (data?.ward_logs || []).map((entry) => {
    const fromLocation = [entry.from_ward_name, entry.from_bed_name].filter(Boolean).join(" - ");
    const toLocation = [entry.to_ward_name, entry.to_bed_name].filter(Boolean).join(" - ");
    const currentLocation = entry.action === "DISCHARGED" ? "Discharged" : (toLocation || fromLocation || "—");
    return {
      id: entry.id,
      timestamp: entry.created_at,
      patientName: entry.patient_name || "—",
      patientId: entry.patient_id == null ? "—" : `P-${entry.patient_id}`,
      ward: entry.to_ward_name || entry.from_ward_name || "—",
      bed: entry.to_bed_name || entry.from_bed_name || "—",
      action: entry.action,
      prevLoc: fromLocation || "—",
      newLoc: entry.action === "DISCHARGED" ? "Discharged" : (toLocation || "—"),
    };
  }), [data]);

  const filteredLogs = logs.filter((log) => {
    if (selectedAction !== "All Actions" && log.action !== selectedAction) {
      return false;
    }
    if (selectedWard !== "All Wards" && !log.ward.toLowerCase().includes(selectedWard.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (log.patientName && log.patientName.toLowerCase().includes(q)) ||
        log.patientId.toLowerCase().includes(q) ||
        log.ward.toLowerCase().includes(q) ||
        log.bed.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.prevLoc.toLowerCase().includes(q) ||
        log.newLoc.toLowerCase().includes(q)
      );
    }
    return true;
  });
  const wards = [...new Set(logs.map((log) => log.ward).filter((ward) => ward && ward !== "—"))];
  const exportHeaders = ["Timestamp", "Patient", "Patient ID", "Ward", "Bed", "Action", "Previous Location", "New Location"];
  const exportRows = filteredLogs.map((log) => [
    log.timestamp ? new Date(log.timestamp).toLocaleString() : "",
    log.patientName,
    log.patientId,
    log.ward,
    log.bed,
    log.action,
    log.prevLoc,
    log.newLoc,
  ]);
  const exportDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>

      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen max-w-full">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4">
            <button className="md:hidden p-1 transition-colors hover:opacity-80" style={{ color: colors.onSurfaceVariant }}>
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center relative">
              <Search size={18} className="absolute left-2" style={{ color: colors.onSurfaceVariant }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-64 h-8 rounded border text-sm outline-none transition-all"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }}
                placeholder="Search by Patient Name, ID, Ward..."
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <UserProfileHover />
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6 flex-1 max-w-[1440px] mx-auto w-full flex flex-col gap-6">
          {/* Header & actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Ward Activity Logs</h2>
              <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                Audit trail of patient admissions, ward transfers, and discharges.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => printTableAsPdf("Ward Activity Logs", exportHeaders, exportRows)}
                disabled={isLoading || isError}
                className="h-9 px-4 flex items-center gap-2 rounded border text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
              >
                <FileText size={18} />
                Export PDF
              </button>
              <button
                type="button"
                onClick={() => downloadCsv(`ward-activity-logs-${exportDate}.csv`, exportHeaders, exportRows)}
                disabled={isLoading || isError}
                className="h-9 px-4 flex items-center gap-2 rounded border text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
              >
                <FileSpreadsheet size={18} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div
            className="rounded-lg p-4 flex flex-col gap-4 border"
            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ListFilter size={20} style={{ color: colors.onSurfaceVariant }} />
              <h3 className="text-xl font-semibold">Filter Activity Logs</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                  Ward
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-3 h-8 rounded border text-sm outline-none cursor-pointer"
                  style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }}
                >
                  <option value="All Wards">All Wards</option>
                  {wards.map((ward) => <option key={ward} value={ward}>{ward}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                  Action Type
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-3 h-8 rounded border text-sm outline-none cursor-pointer"
                  style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surface }}
                >
                  <option value="All Actions">All Actions (Admitted, Transferred & Discharged)</option>
                  <option value="ADMITTED">ADMITTED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                  <option value="DISCHARGED">DISCHARGED</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 justify-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedWard("All Wards");
                    setSelectedAction("All Actions");
                  }}
                  className="h-8 px-4 rounded text-sm font-semibold border transition-colors hover:bg-slate-100"
                  style={{ borderColor: colors.outlineVariant, color: colors.primary }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Data table */}
          <div
            className="rounded-lg flex-1 flex flex-col overflow-hidden border shadow-sm"
            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}>
                    {["TIMESTAMP", "PATIENT NAME", "PATIENT ID", "WARD & BED", "ACTION", "PREVIOUS LOC.", "NEW LOC."].map((h) => (
                      <th key={h} className="py-3 px-4 text-xs font-semibold whitespace-nowrap" style={{ color: colors.onSurfaceVariant }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.outlineVariant }}>
                  {isLoading || isError || filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                        {isLoading ? "Loading ward logs…" : isError ? "Unable to load ward logs. Please try again." : "No activity logs found for the selected criteria."}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 font-mono text-xs whitespace-nowrap text-gray-600">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-gray-900">
                          {log.patientName}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-bold" style={{ color: colors.primary }}>
                          {log.patientId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-semibold text-gray-900">{log.ward}</div>
                          <div className="font-mono text-[11px] text-teal-700 font-medium">
                            {log.bed}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-gray-600">
                          {log.prevLoc}
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-gray-900">{log.newLoc}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Total count footer */}
            <div
              className="p-3 border-t flex items-center justify-between mt-auto px-4 text-xs"
              style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}
            >
              <div className="font-medium" style={{ color: colors.onSurfaceVariant }}>
                Showing <strong>{filteredLogs.length}</strong> activity logs
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
