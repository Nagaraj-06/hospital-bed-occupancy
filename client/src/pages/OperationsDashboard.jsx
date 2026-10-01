import React from "react";
import {
  Search,
  Bell,
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
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import { useGetWardsQuery, useGetAllHistoryQuery } from "../store/api/hospitalApi";


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

// ---- Map history action → icon/color/label ----
function mapHistoryItem(item) {
  const actionMap = {
    ADMISSION_CREATED: { icon: LogIn, color: "#00647C", label: "Admission Requested" },
    DOCTOR_APPROVED:   { icon: CheckCircle2, color: "#166534", label: "Approved" },
    DOCTOR_REJECTED:   { icon: AlertTriangle, color: "#BA1A1A", label: "Rejected" },
    ADMITTED:          { icon: CheckCircle2, color: "#00647C", label: "Bed Assigned" },
    TRANSFERRED:       { icon: ArrowLeftRight, color: "#A86516", label: "Transferred" },
    DISCHARGED:        { icon: LogOut, color: "#BA1A1A", label: "Discharged" },
  };
  const meta = actionMap[item.action] || { icon: LogIn, color: "#6E797E", label: item.action };
  const fromLoc = item.from_ward_name ? `${item.from_ward_name}${item.from_bed_name ? ` (${item.from_bed_name})` : ""}` : "Start";
  const toLoc   = item.to_ward_name   ? `${item.to_ward_name}${item.to_bed_name ? ` (${item.to_bed_name})` : ""}`   : "--";
  const d = new Date(item.created_at);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString([], { month: "short", day: "numeric" });
  return {
    time: `${date} ${time}`,
    id: item.patient_id || "--",
    name: item.patient_name || "Patient",
    action: meta.label,
    icon: meta.icon,
    color: meta.color,
    route: `${fromLoc} → ${toLoc}`,
    performedBy: item.performed_by_name || "System",
    reason: item.reason || "--",
  };
}

export default function HospitalDashboard() {
  const [showAll, setShowAll] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshError, setRefreshError] = React.useState("");

  // ---- Live API data ----
  const { data: wardsData, isLoading: wardsLoading, refetch: refetchWards } = useGetWardsQuery();
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useGetAllHistoryQuery();

  const wards = wardsData?.wards || [];
  const rawHistory = historyData?.history || [];
  const activities = rawHistory.map(mapHistoryItem);

  // ---- KPI calculations from live ward data ----
  const totalBeds = wards.reduce((sum, w) => sum + (Number(w.total_beds) || 0), 0);
  const occupiedBeds = wards.reduce((sum, w) => sum + (Number(w.occupied_beds) || 0), 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : "0.0";

  // ---- Counters from history ----
  const todayStr = new Date().toDateString();
  const todayHistory = rawHistory.filter(h => new Date(h.created_at).toDateString() === todayStr);
  const admissionsToday = todayHistory.filter(h => h.action === "ADMITTED").length;
  const dischargesTotal = rawHistory.filter(h => h.action === "DISCHARGED").length;
  const transfersTotal  = rawHistory.filter(h => h.action === "TRANSFERRED").length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError("");
    try {
      await Promise.all([refetchWards().unwrap(), refetchHistory().unwrap()]);
    } catch {
      setRefreshError("Could not refresh dashboard data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

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
          <UserProfileHover />
        </div>
      </header>

      {/* Side Nav */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 p-6 max-w-[1440px] mx-auto flex flex-col gap-8">
        {!showAll && (
          <>
            {/* Filter bar */}
            <section
              className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2 rounded-md px-3 py-1.5 border text-sm" style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceBright }}>
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-3 py-1.5 border text-sm" style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceBright }}>
                  <Siren size={16} />
                  <span>All Wards ({wards.length})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-slate-100 transition-all disabled:opacity-60"
                style={{ color: colors.primary }}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </section>
            {refreshError && <p role="alert" className="-mt-4 text-sm text-red-700">{refreshError}</p>}

            {/* KPI grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="Total Beds" icon={BedDouble} value={wardsLoading ? "…" : String(totalBeds)} trendLabel={`${wards.length} Ward${wards.length !== 1 ? "s" : ""}`} />
              <KpiCard label="Occupied" icon={BedDouble} value={wardsLoading ? "…" : String(occupiedBeds)} trend="up" trendLabel="Active Patients" />
              <KpiCard label="Available" icon={CheckCircle2} value={wardsLoading ? "…" : String(availableBeds)} trend="down" trendLabel="Open Beds" highlight />
              <KpiCard label="Occupancy Rate" icon={PieChart} value={wardsLoading ? "…" : `${occupancyRate}%`} trendLabel="Target: < 85%" muted />
            </section>
          </>
        )}

        {/* Layout: Normal 2-column or Full Page Expanded when showAll is true */}
        <div className={showAll ? "w-full" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
          {/* Left column (hidden in Show All mode) */}
          {!showAll && (
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
                  {wardsLoading ? (
                    <p className="text-sm text-gray-400 text-center py-4">Loading wards…</p>
                  ) : wards.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No wards found.</p>
                  ) : (
                    wards.map((ward, i) => {
                      const wardColors = [colors.primary, "#6750a4", colors.error, "#A86516", "#166534"];
                      const color = wardColors[i % wardColors.length];
                      const total = Number(ward.total_beds) || 1;
                      const occupied = Number(ward.occupied_beds) || 0;
                      const pct = ((occupied / total) * 100).toFixed(0);
                      return (
                        <WardBar
                          key={ward.id}
                          label={ward.name}
                          pct={`${pct}% (${occupied}/${total})`}
                          count={`${pct}%`}
                          color={color}
                          pulse={Number(pct) >= 90}
                        />
                      );
                    })
                  )}
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
          )}

          {/* Right column / Full Page Container */}
          <div className={showAll ? "w-full flex flex-col gap-6" : "lg:col-span-2 flex flex-col gap-6"}>
            {/* Secondary KPI strip (hidden when showAll is true) */}
            {!showAll && (
              <div className="grid grid-cols-4 gap-4">
                <SecondaryKpi label="Total History" value={historyLoading ? "…" : String(rawHistory.length)} />
                <SecondaryKpi label="Admissions Today" value={historyLoading ? "…" : String(admissionsToday)} color={colors.primary} border={colors.primary} />
                <SecondaryKpi label="Discharges" value={historyLoading ? "…" : String(dischargesTotal)} />
                <SecondaryKpi label="Transfers" value={historyLoading ? "…" : String(transfersTotal)} color={colors.tertiaryContainer} border={colors.tertiaryContainer} />
              </div>
            )}

            {/* Recent activity table card */}
            <div className="rounded-xl border overflow-hidden flex-1 flex flex-col shadow-sm" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
              <div
                className="px-6 py-4 border-b flex justify-between items-center"
                style={{ backgroundColor: colors.surfaceBright, borderColor: colors.outlineVariant }}
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {showAll ? "Complete Patient Activity Audit Log" : "Recent Patient Activity"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {showAll
                      ? `Displaying all ${activities.length} activity records across the hospital.`
                      : historyLoading
                        ? "Loading activity records…"
                        : `Showing recent 5 of ${activities.length} total activity logs.`}
                  </p>
                </div>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95 bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
                >
                  {showAll ? "← Back to Dashboard Overview" : "Show All Activity Records"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className="text-xs font-semibold border-b"
                      style={{ backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}
                    >
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Patient ID</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">From / To Location</th>
                      <th className="py-3 px-4">Performed By</th>
                      <th className="py-3 px-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y" style={{ borderColor: colors.outlineVariant }}>
                    {historyLoading ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-sm text-gray-400">Loading activity records…</td>
                      </tr>
                    ) : displayedActivities.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-sm text-gray-400">No activity records found.</td>
                      </tr>
                    ) : displayedActivities.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors" style={{ borderColor: colors.outlineVariant }}>
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-600">{row.time}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{row.name}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-xs" style={{ color: colors.primary }}>{row.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: row.color }}>
                            <row.icon size={15} /> {row.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-gray-700">{row.route}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-gray-700">{row.performedBy}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-500 italic max-w-[200px] truncate" title={row.reason}>{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!showAll && (
                <div className="p-3 border-t text-xs text-center text-gray-500 bg-slate-50 border-slate-200">
                  Showing <strong>5</strong> of <strong>{activities.length}</strong> total activity logs. Click <strong>Show All Activity Records</strong> to expand entire view.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
