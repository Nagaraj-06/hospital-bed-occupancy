import React, { useState } from "react";
import {
  Search,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import {
  useGetApprovedAdmissionRequestsQuery,
  useAssignBedMutation,
} from "../store/api/hospitalApi";

// ---- Design tokens ----
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

// Map backend priority names -> display key
const normalizePriority = (name = "") => {
  const n = name.toUpperCase();
  if (n.includes("CRITICAL")) return "CRITICAL";
  if (n.includes("URGENT") || n.includes("HIGH")) return "HIGH";
  if (n.includes("ROUTINE") || n.includes("MED")) return "MED";
  return "LOW";
};

const priorityStyles = {
  CRITICAL: { bg: colors.errorContainer, text: colors.onErrorContainer, ping: true },
  HIGH:     { bg: colors.tertiaryFixed, text: colors.onTertiaryFixed },
  MED:      { bg: colors.surfaceVariant, text: colors.onSurfaceVariant },
  LOW:      { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant },
};

const waitTimeColor = {
  CRITICAL: colors.error,
  HIGH:     colors.tertiaryContainer,
  MED:      colors.onSurfaceVariant,
  LOW:      colors.onSurfaceVariant,
};

function PriorityBadge({ priority }) {
  const key = normalizePriority(priority);
  const s = priorityStyles[key] || priorityStyles.LOW;
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

function formatWaitTime(dateStr) {
  if (!dateStr) return "—";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

function formatSince(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Assign Bed Modal
function AssignBedModal({ request, onClose, onSuccess }) {
  const [selectedBedId, setSelectedBedId] = useState("");
  const [assignBed, { isLoading }] = useAssignBedMutation();

  const handleAssign = async () => {
    if (!selectedBedId) return;
    try {
      await assignBed({
        admissionRequestId: request.id,
        bedId: Number(selectedBedId),
        patientId: request.patient_id,
        wardId: request.ward_id,
        attendingDoctorId: request.doctor_id,
        priorityId: request.priority_id,
        expectedStayDuration: request.expected_stay_duration,
        diagnosis: request.diagnosis,
      }).unwrap();
      onSuccess();
      onClose();
    } catch (err) {
      alert(err?.data?.error || "Failed to assign bed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b bg-slate-50 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
              <BedDouble size={20} /> Assign Bed — {request.patient_name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Ward: <strong>{request.ward_name}</strong> · Required: <strong>{request.bed_type_name}</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">✕</button>
        </div>

        <div className="p-5">
          {request.available_beds && request.available_beds.length > 0 ? (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Select an Available Bed
              </p>
              <div className="grid grid-cols-3 gap-3">
                {request.available_beds.map((bed) => {
                  const isChosen = String(bed.id) === String(selectedBedId);
                  return (
                    <div
                      key={bed.id}
                      onClick={() => setSelectedBedId(String(bed.id))}
                      className={`p-3 rounded-xl border cursor-pointer text-center transition-all shadow-sm ${
                        isChosen ? "ring-2 ring-teal-600 bg-teal-50" : "bg-white hover:border-teal-400"
                      }`}
                      style={{ borderColor: isChosen ? colors.primary : colors.outlineVariant }}
                    >
                      <BedDouble size={20} className={`mx-auto mb-1 ${isChosen ? "text-teal-700" : "text-gray-400"}`} />
                      <div className="font-mono font-bold text-xs text-gray-900">{bed.name}</div>
                      <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">Available</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 font-semibold text-center">
              ⚠ No available beds match {request.bed_type_name} in {request.ward_name}.
            </div>
          )}
        </div>

        <div className="p-5 border-t flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedBedId || isLoading}
            className="px-5 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 disabled:opacity-40"
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            Confirm &amp; Admit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WaitingList() {
  const [search, setSearch] = useState("");
  const [assigningRequest, setAssigningRequest] = useState(null);
  const [successToast, setSuccessToast] = useState(false);

  const { data, isLoading } = useGetApprovedAdmissionRequestsQuery();
  const requests = data?.admission_requests || [];

  const filtered = requests.filter((r) =>
    r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    String(r.id).includes(search)
  );

  const handleSuccess = () => {
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      <Sidebar />

      <div className="flex-grow ml-64 flex flex-col min-h-screen">
        {successToast && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 size={18} />
            <span className="font-bold text-sm">Bed assigned — patient is now admitted!</span>
          </div>
        )}

        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-2 h-16 border-b"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div />
          <div className="flex items-center gap-4">
            <UserProfileHover />
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
                    placeholder="Search Patient / REQ ID..."
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
                      {["Priority", "Patient", "REQ ID", "Required Ward", "Bed Type", "Waiting Since", "Wait Time"].map((h) => (
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          <Loader2 className="animate-spin mx-auto mb-2" size={22} />
                          Loading waiting list...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          No approved patients waiting for bed assignment.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, i) => {
                        const priorityKey = normalizePriority(row.priority_name);
                        return (
                          <tr
                            key={row.id}
                            className={`group transition-colors ${i !== filtered.length - 1 ? "border-b" : ""}`}
                            style={{ borderColor: colors.outlineVariant }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F9FF")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <td className="py-2 px-4">
                              <PriorityBadge priority={row.priority_name} />
                            </td>
                            <td className="py-2 px-4 font-bold text-gray-900">{row.patient_name}</td>
                            <td className="py-2 px-4 font-mono text-xs" style={{ color: colors.primary }}>REQ-{row.id}</td>
                            <td className="py-2 px-4 text-sm" style={{ color: colors.onSurfaceVariant }}>{row.ward_name}</td>
                            <td className="py-2 px-4 text-sm" style={{ color: colors.onSurfaceVariant }}>{row.bed_type_name}</td>
                            <td className="py-2 px-4 font-mono text-xs" style={{ color: colors.onSurfaceVariant }}>
                              {formatSince(row.responded_at)}
                            </td>
                            <td className="py-2 px-4 font-mono font-semibold text-xs" style={{ color: waitTimeColor[priorityKey] }}>
                              {formatWaitTime(row.responded_at)}
                            </td>
                            <td className="py-2 px-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setAssigningRequest(row)}
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className="border-t px-4 py-2 flex justify-between items-center text-sm"
                style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
              >
                <span>Showing {filtered.length} approved patients awaiting bed assignment</span>
                <div className="flex gap-2">
                  <button className="p-1 rounded transition-colors hover:opacity-80 disabled:opacity-50" disabled>
                    <ChevronLeft size={18} />
                  </button>
                  <button className="p-1 rounded transition-colors hover:opacity-80" disabled>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Assign Bed Modal */}
      {assigningRequest && (
        <AssignBedModal
          request={assigningRequest}
          onClose={() => setAssigningRequest(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
