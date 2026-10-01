import React, { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  BedDouble,
  Stethoscope,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck,
  UserCheck,
  Loader2,
  Clipboard,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import {
  useGetDoctorAdmissionRequestsQuery,
  useUpdateAdmissionRequestStatusMutation,
} from "../store/api/hospitalApi";

// ---- Design tokens ----
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

const priorityStyles = {
  Urgent: { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
  Routine: { bg: "#DCFCE7", text: "#166534", dot: "#15803D" },
  Critical: { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C", pulse: true },
};

const statusBadges = {
  "PENDING": { bg: "#FEF3C7", text: "#92400E", icon: Clock },
  "APPROVED": { bg: "#DBEAFE", text: "#1E40AF", icon: FileCheck },
  "BED_ASSIGNED": { bg: "#DCFCE7", text: "#166534", icon: CheckCircle2 },
  "REJECTED": { bg: "#FEE2E2", text: "#991B1B", icon: XCircle },
  "CANCELLED": { bg: "#FEE2E2", text: "#991B1B", icon: XCircle },
};

function PriorityBadge({ priority }) {
  const s = priorityStyles[priority] || priorityStyles.Routine;
  return (
    <span
      className="px-2.5 py-1 rounded-full font-semibold text-[11px] flex items-center gap-1.5"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className={`w-2 h-2 rounded-full ${s.pulse ? "animate-pulse" : ""}`} style={{ backgroundColor: s.dot }} />
      {priority}
    </span>
  );
}

export default function DoctorAdmissionsApproval() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("Pending"); // "Pending" | "All"
  const [selectedId, setSelectedId] = useState(null);

  // Queries and Mutations
  const { data, isLoading } = useGetDoctorAdmissionRequestsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAdmissionRequestStatusMutation();

  const admissionsList = data?.admission_requests || [];

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const handleDoctorApprove = async (id) => {
    try {
      await updateStatus({ id, status: "APPROVED" }).unwrap();
    } catch (err) {
      alert(err?.data?.error || "Failed to approve request");
    }
  };

  const handleDoctorRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    try {
      await updateStatus({
        id: selectedId,
        status: "REJECTED",
        rejection_reason: rejectionReasonInput || "Insufficient clinical criteria / No admission required at this time."
      }).unwrap();
      setShowRejectModal(false);
      setRejectionReasonInput("");
    } catch (err) {
      alert(err?.data?.error || "Failed to reject request");
    }
  };

  const filteredAdmissions = admissionsList.filter((a) => {
    const matchesSearch =
      a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(a.id).includes(searchQuery.toLowerCase());
    
    if (filterTab === "Pending") {
      return matchesSearch && a.status === "PENDING";
    }
    return matchesSearch;
  });

  const pendingCount = admissionsList.filter(a => a.status === "PENDING").length;

  // Auto-select first if none selected
  const selectedIsVisible = filteredAdmissions.some((item) => item.id === selectedId);
  const activeSelectedId = selectedIsVisible
    ? selectedId
    : (filteredAdmissions[0]?.id ?? null);
  const selected = admissionsList.find((p) => p.id === activeSelectedId);

  // Helper to format date
  const formatWaiting = (dateStr) => {
    const requested = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - requested) / 60000);
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return requested.toLocaleDateString();
  };

  return (
    <div className="h-screen flex overflow-hidden font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64" style={{ backgroundColor: colors.surface }}>
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-3 h-16 border-b shadow-sm"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <UserCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.primary }}>
                Doctor Admissions Approval
              </h1>
              <p className="text-xs text-gray-500">Review patient admission requests sent by triage & reception</p>
            </div>
          </div>
          <UserProfileHover />
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left panel: Master List */}
          <div
            className="w-1/3 flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm flex-shrink-0"
            style={{ borderColor: colors.outlineVariant }}
          >
            <div className="p-4 border-b bg-slate-50 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setFilterTab("Pending")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    filterTab === "Pending" ? "bg-white shadow-sm text-teal-800" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setFilterTab("All")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    filterTab === "All" ? "bg-white shadow-sm text-teal-800" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  All ({admissionsList.length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">Loading requests...</span>
                </div>
              ) : filteredAdmissions.length === 0 ? (
                <div className="flex flex-col items-center text-center px-5 py-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                    <Clipboard size={26} strokeWidth={1.7} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {searchQuery ? "No matching requests" : `No ${filterTab.toLowerCase()} requests`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {searchQuery
                      ? "Try another patient name or request number."
                      : filterTab === "Pending"
                        ? "New patient requests will appear here when they are submitted."
                        : "Requests will appear here when they are submitted."}
                  </p>
                </div>
              ) : (
                filteredAdmissions.map((item) => {
                  const isSelected = item.id === activeSelectedId;
                  const StatusIcon = statusBadges[item.status]?.icon || Clock;
                  const initials = item.patient_name.split(" ").map(n => n[0]).join("").toUpperCase();
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? "bg-white ring-2 ring-teal-600 shadow-sm" : "bg-white hover:border-teal-400 shadow-sm"
                      }`}
                      style={{ borderColor: isSelected ? colors.primary : colors.outlineVariant }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-gray-900 leading-tight">{item.patient_name}</h3>
                            <span className="text-xs text-gray-500 font-mono">REQ-{item.id}</span>
                          </div>
                        </div>
                        <PriorityBadge priority={item.priority_name} />
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs border-t pt-2">
                        <span className="font-semibold" style={{ color: statusBadges[item.status]?.text || "#666" }}>
                          {item.status.replace("_", " ")}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {formatWaiting(item.requested_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right panel: Detail View */}
          <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden" style={{ borderColor: colors.outlineVariant }}>
            {selected ? (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-6 border-b bg-slate-50 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selected.patient_name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="font-medium bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                        Age: {selected.age}y
                      </span>
                      <span className="font-medium bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                        Sex: {selected.gender}
                      </span>
                      <span className="font-medium bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                        ID: P-{selected.patient_id}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: statusBadges[selected.status]?.bg || "#eee",
                        color: statusBadges[selected.status]?.text || "#333",
                        borderColor: statusBadges[selected.status]?.text || "#ccc"
                      }}
                    >
                      {React.createElement(statusBadges[selected.status]?.icon || Clock, { size: 14 })}
                      {selected.status.replace("_", " ")}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle size={16} /> Clinical Details
                      </h4>
                      <div className="p-4 rounded-xl border bg-slate-50 space-y-3">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 mb-1">Primary Diagnosis</div>
                          <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {selected.diagnosis}
                          </p>
                        </div>
                        <div className="pt-3 border-t grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">Priority</div>
                            <PriorityBadge priority={selected.priority_name} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">Expected Stay</div>
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400" /> {selected.expected_stay_duration} Days
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16} /> Requested Location
                      </h4>
                      <div className="p-4 rounded-xl border bg-slate-50 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg border shadow-sm">
                            <Stethoscope size={18} className="text-teal-700" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-0.5">Target Ward</div>
                            <div className="text-sm font-bold text-gray-900">{selected.ward_name}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg border shadow-sm">
                            <BedDouble size={18} className="text-teal-700" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-0.5">Required Equipment</div>
                            <div className="text-sm font-bold text-gray-900">{selected.bed_type_name}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selected.status === "PENDING" && (
                  <div className="p-6 border-t bg-slate-50 flex justify-between items-center sticky bottom-0">
                    <p className="text-xs text-gray-500 max-w-sm">
                      By approving this request, it will be sent to the Ward Manager for bed assignment.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={isUpdating}
                        className="px-6 py-2.5 rounded-lg border border-red-200 text-red-700 font-bold text-sm bg-white hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <XCircle size={18} /> Reject Admission
                      </button>
                      <button
                        onClick={() => handleDoctorApprove(selected.id)}
                        disabled={isUpdating}
                        className="px-6 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow transition-transform active:scale-95 flex items-center gap-2"
                      >
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        Approve &amp; Send to Ward Manager
                      </button>
                    </div>
                  </div>
                )}
                
                {selected.status === "REJECTED" && (
                  <div className="p-6 border-t bg-red-50 text-red-900 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">Admission Rejected</div>
                      <div className="text-xs mt-1">This request was rejected. It will not proceed to the ward manager.</div>
                    </div>
                  </div>
                )}
                
                {selected.status === "APPROVED" && (
                  <div className="p-6 border-t bg-blue-50 text-blue-900 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">Admission Approved</div>
                      <div className="text-xs mt-1">Pending bed assignment by Ward Manager.</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center bg-gradient-to-b from-white to-slate-50/70">
                <div className="relative w-56 h-48 mb-7" aria-hidden="true">
                  <div className="absolute w-36 h-36 rounded-full bg-teal-50 left-10 top-5" />
                  <div className="absolute w-8 h-8 rounded-full bg-sky-100 right-7 top-5" />
                  <div className="absolute w-4 h-4 rounded-full bg-amber-200 left-5 bottom-9" />
                  <div className="absolute left-[58px] top-7 w-32 h-40 rounded-2xl bg-white border border-slate-200 shadow-lg rotate-[-5deg]" />
                  <div className="absolute left-[69px] top-5 w-32 h-40 rounded-2xl bg-white border border-slate-200 shadow-xl rotate-[4deg] p-4">
                    <div className="w-9 h-2 rounded-full bg-teal-700 mx-auto mb-4" />
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                        <Stethoscope size={15} />
                      </div>
                      <div className="space-y-1">
                        <div className="w-12 h-1.5 rounded bg-slate-200" />
                        <div className="w-8 h-1 rounded bg-slate-100" />
                      </div>
                    </div>
                    <div className="space-y-2.5 mt-4">
                      <div className="h-1.5 w-full rounded bg-slate-100" />
                      <div className="h-1.5 w-4/5 rounded bg-slate-100" />
                      <div className="h-1.5 w-full rounded bg-slate-100" />
                    </div>
                    <div className="absolute -right-4 -bottom-3 w-11 h-11 rounded-2xl bg-teal-700 text-white border-4 border-white shadow-md flex items-center justify-center">
                      <FileCheck size={20} />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 mb-2">
                  Admissions review
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {filteredAdmissions.length === 0
                    ? "All caught up"
                    : "Your review workspace is ready"}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  {filteredAdmissions.length === 0
                    ? "There are no requests in this view right now. New submissions will show up in the list."
                    : "Choose a patient request from the list to see their clinical details and review the admission."}
                </p>
                <div className="mt-6 flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-4 py-2 text-xs font-medium text-teal-800">
                  <ShieldCheck size={15} />
                  Patient information is handled securely
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b flex items-center gap-3 bg-red-50 text-red-900">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">Reject Admission</h3>
            </div>
            <form onSubmit={handleDoctorRejectSubmit} className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g., Insufficient clinical criteria for inpatient admission. Recommend outpatient follow-up."
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                This note will be added to the patient's record and visible to triage staff.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
