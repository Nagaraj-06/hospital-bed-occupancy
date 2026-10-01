import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Truck,
  ArrowLeftRight,
  BedDouble,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import {
  useGetActiveAdmissionsQuery,
  useGetWardsQuery,
  useTransferPatientMutation,
} from "../store/api/hospitalApi";
import { useGetAllBedsByWardQuery } from "../store/api/hospitalApi";

// ---- Design tokens ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  primaryFixed: "#B7EAFF",
  primaryFixedDim: "#6CD3F7",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  tertiaryContainer: "#A86516",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",
  surface: "#F6FAFD",
  surfaceBright: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceContainer: "#EAEEF1",
  surfaceContainerHigh: "#E5E9EB",
  surfaceVariant: "#DFE3E6",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outlineVariant: "#BDC8CE",
};

// Sub-component to fetch available beds for the selected target ward
function AvailableBedSelect({ wardId, excludeBedId, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetAllBedsByWardQuery(wardId, { skip: !wardId });
  const beds = (data?.beds || []).filter(
    (b) => b.status === "AVAILABLE" && String(b.id) !== String(excludeBedId)
  );

  useEffect(() => {
    setIsOpen(false);
    if (beds.length > 0 && !beds.find(b => String(b.id) === String(value))) {
      onChange(String(beds[0].id));
    }
  }, [wardId, beds.length]);

  if (isLoading) {
    return (
      <div className="w-full rounded-lg p-2 text-sm border border-teal-300 bg-white text-gray-500 flex items-center gap-2">
        <Loader2 size={14} className="animate-spin" /> Loading beds...
      </div>
    );
  }

  if (beds.length === 0) {
    return (
      <div className="w-full rounded-lg p-2 text-sm border border-amber-300 bg-amber-50 text-amber-800 font-semibold">
        No available beds in this ward
      </div>
    );
  }

  const selectedBed = beds.find((bed) => String(bed.id) === String(value)) || beds[0];

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="w-full rounded-lg p-2 text-sm font-bold border border-teal-300 bg-white text-gray-900 outline-none cursor-pointer flex items-center justify-between"
      >
        <span>{selectedBed.name} ({selectedBed.bed_type_name})</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          aria-label="Available beds"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-teal-300 bg-white py-1 shadow-lg"
        >
          {beds.map((bed) => (
            <li key={bed.id} role="option" aria-selected={String(bed.id) === String(value)}>
              <button
                type="button"
                onClick={() => {
                  onChange(String(bed.id));
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-teal-50 ${String(bed.id) === String(value) ? "bg-teal-50 font-bold text-teal-900" : "text-gray-900"}`}
              >
                {bed.name} ({bed.bed_type_name})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PatientTransfers() {
  const { data: admissionsData, isLoading: admissionsLoading } = useGetActiveAdmissionsQuery();
  const { data: wardsData } = useGetWardsQuery();
  const [transferPatient, { isLoading: isTransferring }] = useTransferPatientMutation();

  const admissions = admissionsData?.admissions || [];
  const wards = wardsData?.wards || [];

  // Selected patient
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const selectedPatient = admissions.find((a) => String(a.admission_id) === selectedAdmissionId) || admissions[0] || null;

  // Auto-select first on load
  useEffect(() => {
    if (admissions.length > 0 && !selectedAdmissionId) {
      setSelectedAdmissionId(String(admissions[0].admission_id));
    }
  }, [admissions.length]);

  // Target ward: all wards EXCEPT the patient's current ward
  const targetWards = wards.filter((w) => selectedPatient ? String(w.id) !== String(selectedPatient.ward_id) : true);
  const [targetWardId, setTargetWardId] = useState("");
  const [targetBedId, setTargetBedId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [transfersList, setTransfersList] = useState([]);

  // Reset target ward when patient changes
  useEffect(() => {
    if (targetWards.length > 0) {
      setTargetWardId(String(targetWards[0].id));
      setTargetBedId("");
    }
  }, [selectedAdmissionId, wards.length]);

  const selectedTargetWard = wards.find((w) => String(w.id) === targetWardId);

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !targetBedId || !targetWardId) return;

    try {
      await transferPatient({
        admission_id: selectedPatient.admission_id,
        patient_id: selectedPatient.patient_id,
        from_ward_id: selectedPatient.ward_id,
        from_bed_id: selectedPatient.bed_id,
        to_ward_id: Number(targetWardId),
        to_bed_id: Number(targetBedId),
        transfer_reason: transferReason || null,
      }).unwrap();

      // Add to local transfer log display
      const newTransfer = {
        id: `TR-${Math.floor(100 + Math.random() * 900)}`,
        patientName: selectedPatient.patient_name,
        patientId: `P-${selectedPatient.patient_id}`,
        fromWard: selectedPatient.ward_name,
        fromBed: selectedPatient.bed_name,
        toWard: selectedTargetWard?.name || "",
        toBed: targetBedId,
        status: "Direct Transferred",
        time: "Just now",
      };
      setTransfersList((prev) => [newTransfer, ...prev]);

      setToastMessage(`✅ Transfer Initiated for ${selectedPatient.patient_name} to ${selectedTargetWard?.name}`);
      setTimeout(() => setToastMessage(""), 4000);
      setTransferReason("");
      setTargetBedId("");
    } catch (err) {
      alert(err?.data?.error || "Transfer failed");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      {/* Side Nav */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen" style={{ backgroundColor: colors.surfaceContainerLow }}>
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-teal-800 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in fade-in slide-in-from-top">
            {toastMessage}
          </div>
        )}

        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 flex justify-between items-center px-6 py-3 h-16 border-b shadow-sm"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-800">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.primary }}>
                Ward Manager - Patient Transfers
              </h1>
              <p className="text-xs text-gray-500">Coordinate ward transfers and bed reassignment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserProfileHover />
          </div>
        </header>

        {/* Main canvas */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1300px] mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Transfer Management</h1>
              <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                Select an admitted patient, choose the destination ward and available bed, and initiate transfer.
              </p>
            </div>

            {/* Execute Transfer Card */}
            <div
              className="rounded-xl p-6 relative overflow-visible border shadow-sm"
              style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
              <h3 className="text-xl font-bold mb-4 border-b pb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                <ArrowLeftRight size={20} /> Execute Internal Patient Transfer
              </h3>

              {/* 1. Select Patient Dropdown */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Select Patient (Assigned Beds) *
                </label>
                {admissionsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 size={16} className="animate-spin" /> Loading admitted patients...
                  </div>
                ) : admissions.length === 0 ? (
                  <p className="text-sm text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
                    No patients currently admitted with beds for transfer.
                  </p>
                ) : (
                  <select
                    value={selectedAdmissionId}
                    onChange={(e) => setSelectedAdmissionId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border text-sm font-semibold bg-slate-50 border-slate-300 outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                  >
                    {admissions.map((a) => (
                      <option key={a.admission_id} value={String(a.admission_id)}>
                        {a.patient_name} (Patient ID: P-{a.patient_id}) — Currently in {a.ward_name} ({a.bed_name})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 2. From / To Ward & Bed Layout */}
              {selectedPatient && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
                  {/* FROM LOCATION */}
                  <div className="rounded-xl p-5 border bg-slate-50 border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Current Location (From)
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900">{selectedPatient.ward_name}</h4>
                      <p className="text-sm font-mono text-teal-800 font-semibold mt-1">
                        Current Bed: {selectedPatient.bed_name}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-gray-600 space-y-1">
                      <div>Patient Name: <strong>{selectedPatient.patient_name}</strong></div>
                      <div>Diagnosis: <strong>{selectedPatient.diagnosis || "Under Care"}</strong></div>
                    </div>
                  </div>

                  {/* TO LOCATION */}
                  <div
                    className="rounded-xl p-5 border flex flex-col justify-between shadow-inner"
                    style={{ backgroundColor: colors.primaryFixed, borderColor: colors.primary }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-600 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-800" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
                          Destination Location (To)
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-teal-900 mb-1">
                            Target Ward *
                          </label>
                          <select
                            value={targetWardId}
                            onChange={(e) => { setTargetWardId(e.target.value); setTargetBedId(""); }}
                            className="w-full rounded-lg p-2 text-sm font-bold border border-teal-300 bg-white text-gray-900 outline-none cursor-pointer"
                          >
                            {targetWards.map((w) => (
                              <option key={w.id} value={String(w.id)}>{w.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-teal-900 mb-1">
                            Available Bed in Target Ward *
                          </label>
                          {targetWardId && (
                            <AvailableBedSelect
                              wardId={targetWardId}
                              excludeBedId={selectedPatient.bed_id}
                              value={targetBedId}
                              onChange={setTargetBedId}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-teal-300/60 text-xs text-teal-900">
                      🟢 Ready to transfer to <strong>{selectedTargetWard?.name}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button & Reason Field */}
              <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: colors.outlineVariant }}>
                <div className="flex-1 max-w-md">
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Reason for Transfer
                  </label>
                  <input
                    type="text"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="E.g. Step down to general ward..."
                    className="w-full p-2.5 rounded-lg border text-sm font-semibold bg-white border-slate-300 outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div className="flex justify-end items-end h-full mt-2 sm:mt-0">
                  <button
                    onClick={handleConfirmTransfer}
                    disabled={!selectedPatient || !targetBedId || !transferReason.trim() || isTransferring}
                    className="px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95 bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 h-10"
                  >
                    {isTransferring ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Confirm &amp; Execute Transfer
                  </button>
                </div>
              </div>
            </div>

            {/* In-Progress Transfers Table */}
            {transfersList.length > 0 && (
              <div
                className="rounded-xl overflow-hidden border shadow-sm"
                style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
              >
                <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }}>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Truck size={18} className="text-teal-700" /> In-Progress Internal Transfers Queue
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                    {transfersList.length} Active Movements
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-semibold border-b" style={{ backgroundColor: colors.surface, color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}>
                        <th className="py-3 px-4">Transfer Ref</th>
                        <th className="py-3 px-4">Patient Name &amp; ID</th>
                        <th className="py-3 px-4">From Location</th>
                        <th className="py-3 px-4">To Destination</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y" style={{ borderColor: colors.outlineVariant }}>
                      {transfersList.map((t) => (
                        <tr key={t.id} className="group transition-colors hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono text-xs font-semibold text-gray-500">{t.id}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {t.patientName} <span className="font-mono text-xs font-normal text-teal-800">({t.patientId})</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-red-900 bg-red-50/50">
                            <div>{t.fromWard}</div>
                            <span className="text-xs font-mono font-semibold text-red-700">{t.fromBed}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-emerald-900 bg-emerald-50/50">
                            <div>{t.toWard}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                              <Truck size={14} /> {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
