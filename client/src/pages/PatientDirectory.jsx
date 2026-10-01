import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  ListFilter,
  Eye,
  Pencil,
  LogOut,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import {
  useGetPatientsQuery,
  useGetWardsQuery,
  useGetDoctorsQuery,
  useGetPriorityTypesQuery,
  useGetBedTypesQuery,
  useCreateAdmissionRequestMutation,
} from "../store/api/hospitalApi";

// ---- Design tokens ----
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

export default function PatientsManagement() {
  const user = useSelector((state) => state.auth.user);
  const canCreateAdmission = Number(user?.role_id) === 1;
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Queries
  const { data: patientsData, isLoading: patientsLoading } = useGetPatientsQuery();
  const { data: wardsData } = useGetWardsQuery();
  const { data: doctorsData } = useGetDoctorsQuery();
  const { data: prioritiesData } = useGetPriorityTypesQuery();
  const { data: bedTypesData } = useGetBedTypesQuery();

  // Mutation
  const [createAdmissionRequest, { isLoading: isCreating }] = useCreateAdmissionRequestMutation();

  const patients = patientsData?.patients || [];
  const wards = wardsData?.wards || [];
  const doctors = doctorsData?.doctors || [];
  const priorities = prioritiesData?.priority_types || [];
  const bedTypes = bedTypesData?.bed_types || [];

  // Admission request state for Staff Nurse
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    sex: "F",
    phone: "",
    emergencyContact: "",
    physicianId: "",
    priorityId: "",
    expectedDays: "4",
    diagnosis: "",
    targetWardId: "",
    bedTypeId: ""
  });

  const handleCreatePatientAdmission = async (e) => {
    e.preventDefault();
    try {
      await createAdmissionRequest({
        patientName: patientForm.name,
        age: Number(patientForm.age),
        gender: patientForm.sex,
        patientContactNo: patientForm.phone,
        emergencyContactNo: patientForm.emergencyContact,
        doctorId: patientForm.physicianId || doctors[0]?.id,
        expectedStayDuration: Number(patientForm.expectedDays),
        priorityId: patientForm.priorityId || priorities[0]?.id,
        diagnosis: patientForm.diagnosis,
        wardId: patientForm.targetWardId || wards[0]?.id,
        bedTypeId: patientForm.bedTypeId || bedTypes[0]?.id,
      }).unwrap();

      setShowAddModal(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);

      setPatientForm({
        name: "",
        age: "",
        sex: "F",
        phone: "",
        emergencyContact: "",
        physicianId: "",
        priorityId: "",
        expectedDays: "4",
        diagnosis: "",
        targetWardId: "",
        bedTypeId: ""
      });
    } catch (err) {
      console.error("Failed to create admission request", err);
      alert(err?.data?.error || "Failed to create patient");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  );

  return (
    <div className="h-full min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {successToast && (
          <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <span className="font-bold text-sm">✅ Patient Admission Request Created & Sent to Doctor Approval Queue!</span>
          </div>
        )}

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
            <UserProfileHover />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-[1440px] mx-auto space-y-6">
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
              {canCreateAdmission && <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold shadow-sm transition-colors active:scale-95 duration-150"
                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
              >
                <UserPlus size={18} />
                + Add Patient / Create Admission
              </button>}
            </div>

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
                />
              </div>
            </div>

            <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] table-fixed text-left border-collapse">
                  <colgroup>
                    <col className="w-[13%]" />
                    <col className="w-[21%]" />
                    <col className="w-[12%]" />
                    <col className="w-[27%]" />
                    <col className="w-[27%]" />
                  </colgroup>
                  <thead>
                    <tr className="text-xs font-semibold border-b" style={{ backgroundColor: colors.surface, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}>
                      <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Patient ID</th>
                      <th className="py-3 px-4 text-left align-middle">Name</th>
                      <th className="py-3 px-4 text-left align-middle whitespace-nowrap">Age / Sex</th>
                      <th className="py-3 px-4 text-left align-middle">Doctor Approval Status</th>
                      <th className="py-3 px-4 text-left align-middle">Current Assigned Ward &amp; Bed</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y" style={{ borderColor: colors.outlineVariant }}>
                    {patientsLoading ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">
                          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                          Loading patients...
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">
                          No active patient records found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => navigate('/patient-profile', { state: { patient: p } })}
                          className="group transition-colors hover:bg-slate-50 cursor-pointer"
                          style={{ borderColor: colors.outlineVariant }}
                        >
                          <td className="py-3 px-4 align-middle font-mono font-medium whitespace-nowrap" style={{ color: colors.primary }}>
                            P-{p.id}
                          </td>
                          <td className="py-3 px-4 align-middle font-bold text-gray-900 break-words">{p.name}</td>
                          <td className="py-3 px-4 align-middle whitespace-nowrap text-gray-700">
                            {p.age}y / {p.gender}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {p.doctor_approval_status?.approved === "Yes" ? (
                              <span className="inline-flex max-w-full items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 whitespace-normal">
                                ✅ Approved by {p.doctor_approval_status.doctor_name}
                              </span>
                            ) : (
                              <span className="inline-flex max-w-full items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 whitespace-normal">
                                ⏳ Pending Doctor Approval
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 align-middle font-medium break-words">
                            {p.assigned_ward_bed ? (
                              <div className="flex flex-col">
                                <span className="font-bold text-emerald-900">{p.assigned_ward_bed.ward_name}</span>
                                <span className="font-mono text-xs text-emerald-700 font-semibold">
                                  Bed: {p.assigned_ward_bed.bed_name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Unassigned
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div
                className="px-6 py-3 border-t flex items-center justify-between text-sm"
                style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
              >
                <span>Dynamic Real-Time Patient Directory</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">Total Records: {patients.length}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && canCreateAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border flex flex-col gap-4 animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2">
                  <UserPlus size={22} /> Add Patient & Create Admission Request
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Staff Nurse / Reception Form — Request sent directly to Doctor Approval Queue.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatientAdmission} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Patient Demographics & Contact Info</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Patient Full Name *</label>
                    <input
                      required
                      type="text"
                      value={patientForm.name}
                      onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Age / Gender *</label>
                    <div className="flex gap-2">
                      <input
                        required
                        type="number"
                        value={patientForm.age}
                        onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                        className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                      />
                      <select
                        value={patientForm.sex}
                        onChange={(e) => setPatientForm({ ...patientForm, sex: e.target.value })}
                        className="p-2 rounded-lg border text-sm focus:outline-none"
                      >
                        <option value="F">F</option>
                        <option value="M">M</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Patient Contact No *</label>
                    <input
                      required
                      type="tel"
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact No *</label>
                    <input
                      required
                      type="tel"
                      value={patientForm.emergencyContact}
                      onChange={(e) => setPatientForm({ ...patientForm, emergencyContact: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Clinical Assessment & Request Details</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Attending Physician *</label>
                    <select
                      required
                      value={patientForm.physicianId}
                      onChange={(e) => setPatientForm({ ...patientForm, physicianId: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>Dr. {d.doctor_name} ({d.specialist})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expected Stay (Days) *</label>
                    <input
                      required
                      type="number"
                      value={patientForm.expectedDays}
                      onChange={(e) => setPatientForm({ ...patientForm, expectedDays: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Priority Level *</label>
                    <select
                      required
                      value={patientForm.priorityId}
                      onChange={(e) => setPatientForm({ ...patientForm, priorityId: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                    >
                      <option value="">Select Priority</option>
                      {priorities.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Primary Clinical Diagnosis / Reason *</label>
                  <textarea
                    required
                    rows={3}
                    value={patientForm.diagnosis}
                    onChange={(e) => setPatientForm({ ...patientForm, diagnosis: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Ward & Bed Requirements</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Requested Ward *</label>
                    <select
                      required
                      value={patientForm.targetWardId}
                      onChange={(e) => setPatientForm({ ...patientForm, targetWardId: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                    >
                      <option value="">Select Ward</option>
                      {wards.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Required Equipment *</label>
                    <select
                      required
                      value={patientForm.bedTypeId}
                      onChange={(e) => setPatientForm({ ...patientForm, bedTypeId: e.target.value })}
                      className="w-full p-2 rounded-lg border text-sm focus:outline-none"
                    >
                      <option value="">Select Type</option>
                      {bedTypes.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow flex items-center gap-2"
                >
                  {isCreating ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                  Submit to Doctor Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
