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
  Search,
  Download,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import { useGetAllHistoryQuery, useGetWardsQuery } from "../store/api/hospitalApi";
import { downloadCsv } from "../utils/export";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
  primary: "#00647C",
  primaryFixed: "#B7EAFF",
  primaryFixedDim: "#6CD3F7",
  onPrimary: "#FFFFFF",
  onPrimaryFixed: "#001F28",
  onPrimaryFixedVariant: "#004E61",
  secondaryContainer: "#D5E0F8",
  tertiary: "#894E00",
  surfaceTint: "#006780",
  error: "#BA1A1A",
  outline: "#6E797E",
  surface: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerHigh: "#E5E9EB",
  surfaceContainerHighest: "#DFE3E6",
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
  { icon: BarChart3, label: "Analytics", active: true },
  { icon: FileText, label: "Reports" },
  { icon: BellRing, label: "Alerts" },
];

const periodOptions = {
  "7d": { label: "Last 7 Days", days: 7 },
  "30d": { label: "Last 30 Days", days: 30 },
  quarter: { label: "This Quarter" },
  ytd: { label: "Year to Date" },
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function getPeriodStart(period, today) {
  if (period === "quarter") {
    return new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
  }
  if (period === "ytd") return new Date(today.getFullYear(), 0, 1);
  const days = periodOptions[period]?.days || 30;
  const start = new Date(today);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getOccupancyTrend(wards, history, startDate, today) {
  const occupancyByWard = new Map(
    wards.map((ward) => [String(ward.id), Number(ward.occupied_beds) || 0])
  );
  const eventsByDate = new Map();

  history.forEach((entry) => {
    if (!["ADMITTED", "TRANSFERRED", "DISCHARGED"].includes(entry.action)) return;
    const eventDate = new Date(entry.created_at);
    if (Number.isNaN(eventDate.getTime()) || eventDate < startDate || eventDate > today) return;
    const key = dateKey(eventDate);
    if (!eventsByDate.has(key)) eventsByDate.set(key, []);
    eventsByDate.get(key).push(entry);
  });

  const totalBeds = wards.reduce((total, ward) => total + (Number(ward.total_beds) || 0), 0);
  const trend = [];
  const day = new Date(today);

  while (day >= startDate) {
    const date = new Date(day);
    const occupiedBeds = [...occupancyByWard.values()].reduce((total, count) => total + count, 0);
    trend.push({
      date,
      occupancy: totalBeds ? Math.max(0, Math.min(100, (occupiedBeds / totalBeds) * 100)) : 0,
    });

    // Walk backward from the current bed counts to reconstruct each prior day.
    (eventsByDate.get(dateKey(day)) || []).forEach((entry) => {
      const fromWardId = entry.from_ward_id == null ? null : String(entry.from_ward_id);
      const toWardId = entry.to_ward_id == null ? null : String(entry.to_ward_id);
      if (entry.action === "ADMITTED" && toWardId) {
        occupancyByWard.set(toWardId, (occupancyByWard.get(toWardId) || 0) - 1);
      } else if (entry.action === "DISCHARGED" && fromWardId) {
        occupancyByWard.set(fromWardId, (occupancyByWard.get(fromWardId) || 0) + 1);
      } else if (entry.action === "TRANSFERRED") {
        if (toWardId) occupancyByWard.set(toWardId, (occupancyByWard.get(toWardId) || 0) - 1);
        if (fromWardId) occupancyByWard.set(fromWardId, (occupancyByWard.get(fromWardId) || 0) + 1);
      }
    });
    day.setDate(day.getDate() - 1);
  }

  return trend.reverse();
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const { data: wardsData, isLoading: wardsLoading, isError: wardsError } = useGetWardsQuery();
  const { data: historyData, isLoading: historyLoading, isError: historyError } = useGetAllHistoryQuery();
  const wards = wardsData?.wards || [];
  const history = historyData?.history || [];
  const today = new Date();
  const periodStart = getPeriodStart(selectedPeriod, today);
  const occupancyTrend = useMemo(
    () => getOccupancyTrend(wards, history, periodStart, today),
    [wards, history, selectedPeriod]
  );
  const periodHistory = history.filter((entry) => {
    const createdAt = new Date(entry.created_at);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= periodStart && createdAt <= today;
  });
  const periodAdmissions = periodHistory.filter((entry) => entry.action === "ADMITTED").length;
  const periodDischarges = periodHistory.filter((entry) => entry.action === "DISCHARGED").length;
  const periodTransfers = periodHistory.filter((entry) => entry.action === "TRANSFERRED").length;
  const totalBeds = wards.reduce((total, ward) => total + (Number(ward.total_beds) || 0), 0);
  const occupiedBeds = wards.reduce((total, ward) => total + (Number(ward.occupied_beds) || 0), 0);
  const currentOccupancy = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const trendPoints = occupancyTrend.map((point, index) => {
    const x = occupancyTrend.length > 1 ? (index / (occupancyTrend.length - 1)) * 100 : 50;
    const y = 100 - point.occupancy;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = occupancyTrend.length ? `0,100 ${trendPoints} 100,100` : "";
  const insights = [
    {
      icon: currentOccupancy >= 85 ? TrendingUp : Info,
      iconColor: currentOccupancy >= 85 ? colors.error : colors.surfaceTint,
      text: <><strong>{currentOccupancy}% overall bed occupancy</strong> ({occupiedBeds} of {totalBeds} beds currently occupied).</>,
    },
    {
      icon: TrendingUp,
      iconColor: colors.primary,
      text: <><strong>{periodAdmissions} admissions</strong> recorded {periodOptions[selectedPeriod].label.toLowerCase()}.</>,
    },
    {
      icon: TrendingDown,
      iconColor: colors.outline,
      text: <><strong>{periodDischarges} discharges and {periodTransfers} transfers</strong> recorded {periodOptions[selectedPeriod].label.toLowerCase()}.</>,
    },
  ];
  const handleExportReport = () => {
    const reportRows = [
      ["Report", "Period", periodOptions[selectedPeriod].label, "Generated", new Date().toLocaleString()],
      ["Summary", "Total beds", totalBeds],
      ["Summary", "Occupied beds", occupiedBeds],
      ["Summary", "Current occupancy (%)", currentOccupancy],
      ["Patient flow", "Admissions", periodAdmissions],
      ["Patient flow", "Discharges", periodDischarges],
      ["Patient flow", "Transfers", periodTransfers],
      ...wards.map((ward) => [
        "Ward occupancy",
        ward.name,
        `${Number(ward.occupied_beds) || 0} occupied of ${Number(ward.total_beds) || 0} beds`,
        `${Number(ward.available_beds) || 0} available`,
      ]),
      ...occupancyTrend.map((point) => [
        "Daily occupancy trend",
        dateKey(point.date),
        `${point.occupancy.toFixed(1)}%`,
      ]),
    ];
    downloadCsv(
      `hospital-analytics-${selectedPeriod}-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Section", "Metric", "Value", "Details", "Generated at"],
      reportRows
    );
  };

  return (
    <div className="h-screen flex overflow-hidden antialiased font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-2 h-16 border-b w-full"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <h1 className="text-lg font-bold" style={{ color: colors.primary }}>
            CityCare General Hospital
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-64">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.outline }} />
              <input
                className="w-full pl-9 pr-3 h-8 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                placeholder="Search analytics..."
              />
            </div>
            <div className="flex items-center gap-2">
              <UserProfileHover />
            </div>
          </div>
        </header>

        {/* Dashboard canvas */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: colors.surface }}>
          {/* Page header */}
          <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">Hospital Analytics</h2>
              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                Comprehensive overview of operational metrics and patient flow.
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
                className="px-4 h-8 rounded-lg border text-sm outline-none"
                style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
              >
                {Object.entries(periodOptions).map(([value, option]) => (
                  <option key={value} value={value}>{option.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleExportReport}
                disabled={wardsLoading || historyLoading || wardsError || historyError}
                className="px-4 h-8 rounded-lg text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-90"
                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            {/* Key insights */}
            <div
              className="md:col-span-12 rounded-xl p-6 border transition-all"
              style={{ backgroundColor: colors.primaryFixed, borderColor: colors.primaryFixedDim, boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: colors.primary, color: colors.onPrimary }}>
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.onPrimaryFixedVariant }}>
                    Key Insights
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ color: colors.onPrimaryFixed }}>
                    {(wardsLoading || historyLoading ? [] : insights).map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <item.icon size={20} style={{ color: item.iconColor }} className="shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                    {(wardsError || historyError) && <li className="md:col-span-3">Unable to load analytics data. Please try again.</li>}
                    {!wardsLoading && !historyLoading && !wardsError && !historyError && wards.length === 0 && (
                      <li className="md:col-span-3">No ward data is available yet.</li>
                    )}
                    {(wardsLoading || historyLoading) && <li className="md:col-span-3">Loading analytics data…</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bed occupancy trend */}
            <div
              className="md:col-span-8 rounded-xl flex flex-col min-h-[360px] border transition-all"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
            >
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.outlineVariant }}>
                <h3 className="text-xl font-semibold">Bed Occupancy Trend</h3>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
                >
                  {periodOptions[selectedPeriod].label}
                </span>
              </div>
              <div
                className="p-4 flex-1 relative"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              >
                <div className="absolute inset-x-6 top-6 bottom-6">
                  {wardsLoading || historyLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">Loading occupancy history…</div>
                  ) : wardsError || historyError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-red-700">Unable to load occupancy history.</div>
                  ) : totalBeds === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">No bed capacity data is available.</div>
                  ) : (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="100" y1="25" y2="25" />
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="100" y1="75" y2="75" />
                    <polyline
                      points={trendPoints}
                      fill="none"
                      stroke="#00647c"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d={`M${areaPoints} Z`}
                      fill="url(#gradient-primary)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient id="gradient-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#00647c" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    {occupancyTrend.map((point, index) => {
                      const x = occupancyTrend.length > 1 ? (index / (occupancyTrend.length - 1)) * 100 : 50;
                      return <circle key={dateKey(point.date)} cx={x} cy={100 - point.occupancy} fill="#00647c" r="0.8" />;
                    })}
                  </svg>
                  )}
                </div>
                <div
                  className="absolute left-2 top-6 bottom-6 flex flex-col justify-between font-mono text-[10px]"
                  style={{ color: colors.outlineVariant }}
                >
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
              </div>
            </div>

            {/* Ward-wise occupancy */}
            <div
              className="md:col-span-4 rounded-xl flex flex-col min-h-[360px] border transition-all"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
            >
              <div className="p-4 border-b" style={{ borderColor: colors.outlineVariant }}>
                <h3 className="text-xl font-semibold">Ward-wise Occupancy</h3>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-end gap-2">
                {wardsLoading ? (
                  <p className="text-sm text-slate-500">Loading ward occupancy…</p>
                ) : wardsError ? (
                  <p className="text-sm text-red-700">Unable to load ward occupancy.</p>
                ) : wards.map((ward) => {
                  const total = Number(ward.total_beds) || 0;
                  const occupied = Number(ward.occupied_beds) || 0;
                  const pct = total ? Math.round((occupied / total) * 100) : 0;
                  const color = pct >= 85 ? colors.error : pct >= 60 ? colors.primary : colors.surfaceTint;
                  return (
                  <div key={ward.id} className="flex items-center gap-2">
                    <span className="text-sm font-semibold w-16 truncate" title={ward.name}>{ward.name}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceContainerHigh }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <span className="font-mono text-sm w-10 text-right" style={{ color: colors.onSurfaceVariant }}>
                      {pct}%
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
