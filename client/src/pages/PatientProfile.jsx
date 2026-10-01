import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  User,
  DoorOpen,
  BedDouble,
  IdCard,
  Phone,
  Smartphone,
  Calendar,
  Route,
  Stethoscope,
  CheckCircle2,
  ArrowLeftRight,
  LogOut,
  FileText,
  Clock3,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import { useDischargePatientMutation, useGetAllHistoryQuery } from "../store/api/hospitalApi";

// ---- Design tokens ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  onSecondaryContainer: "#1E293B",
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

function mapHistoryTimelineEvent(entry, requestedBedType) {
  const locationText = (wardName, bedName) => [wardName, bedName].filter(Boolean).join(" - ") || "Location not recorded";
  const requestedWard = entry.requested_ward_name || entry.to_ward_name || "Ward not specified";
  const detailsByAction = {
    ADMISSION_CREATED: {
      icon: FileText,
      title: "Staff Nurse Admission Request Created",
      subtitle: `Requested Ward: ${requestedWard} (${entry.requested_bed_type_name || requestedBedType || "Bed Requested"})`,
      note: entry.request_diagnosis || entry.reason || "Admission request submitted for doctor review.",
    },
    DOCTOR_APPROVED: {
      icon: Stethoscope,
      title: "Doctor Approved Admission",
      subtitle: `Requested Ward: ${requestedWard}`,
      note: entry.reason || "Admission request approved.",
    },
    DOCTOR_REJECTED: {
      icon: Clock3,
      title: "Doctor Rejected Admission",
      subtitle: `Requested Ward: ${requestedWard}`,
      note: entry.reason || "Admission request rejected.",
    },
    ADMITTED: {
      icon: CheckCircle2,
      title: "Bed Assigned & Patient Admitted",
      subtitle: `Location: ${locationText(entry.to_ward_name, entry.to_bed_name)}`,
      note: "Patient admission and bed assignment recorded.",
    },
    TRANSFERRED: {
      icon: ArrowLeftRight,
      title: "Patient Transferred",
      subtitle: `${locationText(entry.from_ward_name, entry.from_bed_name)} -> ${locationText(entry.to_ward_name, entry.to_bed_name)}`,
      note: entry.reason || "Patient transferred to another ward or bed.",
    },
    DISCHARGED: {
      icon: LogOut,
      title: "Patient Discharged",
      subtitle: `From: ${locationText(entry.from_ward_name, entry.from_bed_name)}`,
      note: entry.reason || "Discharge recorded and bed released.",
    },
  };
  const details = detailsByAction[entry.action] || {
    icon: FileText,
    title: entry.action.replace(/_/g, " "),
    subtitle: locationText(entry.to_ward_name, entry.to_bed_name),
    note: entry.reason || "Patient history event recorded.",
  };
  const timestamp = new Date(entry.created_at);

  return {
    ...details,
    id: entry.id,
    date: Number.isNaN(timestamp.getTime()) ? "" : timestamp.toLocaleDateString(),
    time: Number.isNaN(timestamp.getTime())
      ? "Time unavailable"
      : timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    by: [entry.performed_by_name, entry.performed_by_role].filter(Boolean).join(" | "),
  };
}

export default function PatientProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedPatient = location.state?.patient;
  const requestStatus = selectedPatient?.request_status;
  const admissionStatus = selectedPatient?.assigned_ward_bed?.admission_status;
  const apiPatientStatus = admissionStatus === "DISCHARGED"
    ? "Discharged"
    : admissionStatus === "ACTIVE"
      ? "Bed Assigned"
      : requestStatus === "PENDING"
        ? "Pending Doctor Approval"
        : requestStatus === "APPROVED"
          ? "Approved - Bed Needed"
          : requestStatus === "BED_ASSIGNED"
            ? "Bed Assigned"
            : "Admission Requested";

  // Normalize the directory API patient shape for this page.
  const initialPatient = selectedPatient ? {
    ...selectedPatient,
    patientId: selectedPatient.patientId || `P-${selectedPatient.id}`,
    dob: selectedPatient.dob || `${selectedPatient.age ?? "—"}y`,
    sex: selectedPatient.sex || selectedPatient.gender || "—",
    phone: selectedPatient.phone || selectedPatient.patient_contact_no,
    emergencyContact: selectedPatient.emergencyContact || selectedPatient.emergency_contact_no,
    physician: selectedPatient.physician || selectedPatient.doctor_name,
    targetWard: selectedPatient.assigned_ward_bed?.ward_name || selectedPatient.requested_ward_name || "Ward not specified",
    assignedBed: selectedPatient.assigned_ward_bed?.bed_name || null,
    admissionId: selectedPatient.assigned_ward_bed?.admission_id || null,
    bedType: selectedPatient.bedType || selectedPatient.bed_type_name,
    priority: selectedPatient.priority || selectedPatient.priority_name,
    expectedDays: selectedPatient.expectedDays || selectedPatient.expected_stay_duration,
    status: selectedPatient.status || apiPatientStatus,
  } : {
    id: "ADM-84920",
    patientId: "P-1001",
    name: "Eleanor Vance",
    dob: "68y",
    sex: "Female",
    phone: "+1 (555) 019-2834",
    emergencyContact: "+1 (555) 992-1049 (Spouse)",
    physician: "Dr. Robert Miller",
    targetWard: "Cardiology (CW-3)",
    assignedBed: "Bed 304-B",
    bedType: "Telemetry Bed",
    priority: "Urgent",
    status: "Bed Assigned",
    diagnosis: "Acute exacerbation of CHF with dyspnea. Requires continuous telemetry monitoring and IV diuretics.",
    expectedDays: 4,
    waiting: "Oct 24, 08:30",
  };

  const [p, setP] = React.useState(initialPatient);
  const [toastMessage, setToastMessage] = React.useState("");
  const roleId = Number(useSelector((state) => state.auth.user?.role_id));
  const { data: historyData, isLoading: historyLoading, isError: historyError } = useGetAllHistoryQuery();
  const [dischargePatient, { isLoading: isDischarging }] = useDischargePatientMutation();
  const patientHistory = useMemo(
    () => (historyData?.history || [])
      .filter((entry) => String(entry.patient_id) === String(p.id))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    [historyData, p.id]
  );

  const handleDischargePatient = async () => {
    if (roleId !== 3 || !p.admissionId || p.status === "Discharged") return;
    try {
      await dischargePatient({ admission_id: p.admissionId }).unwrap();
      setP((current) => ({ ...current, status: "Discharged" }));
      setToastMessage(`Patient ${p.name} was discharged.`);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (error) {
      alert(error?.data?.error || "Unable to discharge this patient.");
    }
  };

  const timelineEvents = patientHistory.map((entry) => mapHistoryTimelineEvent(entry, p.bedType));

  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-teal-800 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in fade-in slide-in-from-top">
            {toastMessage}
          </div>
        )}

        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 border-b flex justify-between items-center px-6 py-2 h-16"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => navigate('/patients')}
              className="flex items-center justify-center p-2 rounded-full transition-colors hover:bg-slate-100"
              style={{ color: colors.onSurfaceVariant }}
              title="Back to Patient Directory"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="relative w-64">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.outline }} />
              <input
                className="w-full pl-9 pr-3 h-8 rounded-full border text-sm outline-none transition-shadow"
                style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}
                placeholder="Search patient..."
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <UserProfileHover />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto">
            {/* Patient Header Banner */}
            <div
              className="rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start gap-4 shadow-sm border"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
                    style={{ borderColor: colors.surface, backgroundColor: colors.surfaceContainerHigh, color: colors.primary }}
                  >
                    {p.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-1 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
                    <span
                      className="font-mono px-2.5 py-1 rounded-lg border text-sm font-bold"
                      style={{ backgroundColor: colors.surfaceContainerHigh, borderColor: colors.outlineVariant, color: colors.primary }}
                    >
                      {p.patientId || p.id}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${p.status === 'Discharged' ? 'bg-red-100 text-red-900 border-red-200' : 'bg-teal-100 text-teal-900 border-teal-200'}`}>
                      Status: {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4 flex-wrap text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User size={16} /> Age / Gender: <strong>{p.dob} / {p.sex}</strong>
                    </span>
                    <span>•</span>
                    <span>Doctor: <strong>{p.physician || "Dr. Robert Miller"}</strong></span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold bg-slate-50 text-slate-800"
                    >
                      <DoorOpen size={18} className="text-teal-700" />
                      <span>Ward: <strong>{p.targetWard}</strong></span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-bold bg-emerald-50 text-emerald-900 border-emerald-200"
                    >
                      <BedDouble size={18} className="text-emerald-700" />
                      <span>Bed: {p.assignedBed || "Pending Assignment"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {roleId === 3 && <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => navigate('/transfers')}
                  disabled={!p.admissionId || p.status === "Discharged"}
                  className="px-6 h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 bg-teal-700 hover:bg-teal-800 text-white"
                >
                  <ArrowLeftRight size={16} />
                  Initiate Transfer
                </button>
                <button
                  onClick={handleDischargePatient}
                  disabled={!p.admissionId || p.status === "Discharged" || isDischarging}
                  className="px-6 h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm border transition-transform active:scale-95 bg-red-700 hover:bg-red-800 text-white disabled:opacity-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  {isDischarging ? "Discharging..." : p.status === "Discharged" ? "Discharged" : "Discharge Patient"}
                </button>
              </div>}
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: Essential Patient Information */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                {/* Patient Information Card */}
                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <h3 className="text-xl font-bold border-b pb-3 mb-4 flex items-center gap-2 text-teal-900">
                    <IdCard size={20} className="text-teal-700" />
                    Patient Contact & Admission Information
                  </h3>
                  <dl className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Patient Contact Number
                      </dt>
                      <dd className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <Phone size={15} className="text-teal-700" />
                        {p.phone || "+1 (555) 019-2834"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Emergency Contact Number
                      </dt>
                      <dd className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <Smartphone size={15} className="text-red-700" />
                        {p.emergencyContact || "+1 (555) 992-1049 (Spouse)"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Attending Physician
                      </dt>
                      <dd className="font-semibold text-gray-900">{p.physician || "Dr. Robert Miller"}</dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Requested Ward & Bed Type
                      </dt>
                      <dd className="font-semibold text-gray-900">{p.targetWard} — <span className="text-teal-800">{p.bedType || 'Telemetry Bed'}</span></dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Expected Stay Duration
                      </dt>
                      <dd className="font-bold text-gray-900">{p.expectedDays || 4} Days</dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Priority Level
                      </dt>
                      <dd>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                          {p.priority || "Urgent"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Primary Diagnosis Card */}
                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <h3 className="text-lg font-bold border-b pb-3 mb-3 flex items-center gap-2 text-teal-900">
                    <Stethoscope size={18} className="text-teal-700" />
                    Primary Clinical Diagnosis / Admission Reason
                  </h3>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {p.diagnosis || "Acute exacerbation of CHF with dyspnea. Requires continuous telemetry monitoring and IV diuretics."}
                  </p>
                </div>
              </div>

              {/* Right Column: Workflow Timeline */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                <div className="rounded-xl p-6 shadow-sm border flex-1" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-teal-900">
                      <Route size={20} className="text-teal-700" />
                      Patient Flow & Admission Timeline
                    </h3>
                  </div>

                  {/* Flow Timeline */}
                  <div className="relative pl-4">
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-300" />
                    <div className="space-y-6">
                      {historyLoading ? (
                        <p className="pl-8 text-sm text-slate-500">Loading patient history...</p>
                      ) : historyError ? (
                        <p className="pl-8 text-sm text-red-700">Unable to load patient history.</p>
                      ) : timelineEvents.length === 0 ? (
                        <p className="pl-8 text-sm text-slate-500">No history has been recorded for this patient.</p>
                      ) : timelineEvents.map((item) => (
                        <div key={item.id} className="relative flex items-start gap-4">
                          <div
                            className="absolute -left-4 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10 border-teal-700"
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-teal-700" />
                          </div>
                          <div
                            className="flex-1 rounded-xl p-4 border shadow-sm transition-all bg-slate-50 border-slate-200"
                          >
                            <div className="flex justify-between items-start mb-2 gap-4">
                              <div>
                                <p className="mb-1 text-[11px] font-medium text-gray-500">{item.date}</p>
                                <h4 className="text-sm font-bold flex items-center gap-1.5 text-gray-900">
                                  <item.icon size={16} className="text-teal-700" />
                                  {item.title}
                                </h4>
                                <p className="text-xs font-medium text-teal-800 mt-0.5">
                                  {item.subtitle}
                                </p>
                              </div>
                              <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-200 text-slate-800 whitespace-nowrap">
                                {item.time}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg border bg-white border-slate-200 text-xs text-gray-700">
                              <p className="font-medium">{item.note}</p>
                              {item.by && (
                                <p className="text-[11px] mt-1 text-gray-500 font-semibold">
                                  Action by: {item.by}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
