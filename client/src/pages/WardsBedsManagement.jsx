import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  BedDouble,
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserProfileHover from "../components/UserProfileHover";
import {
  hospitalApi,
  useGetWardsQuery,
  useGetAllBedsByWardQuery,
} from "../store/api/hospitalApi";

// ---- Design tokens ----
const colors = {
  primary: "#00647C",
  primaryContainer: "#007F9D",
  onPrimary: "#FFFFFF",
  secondaryContainer: "#D5E0F8",
  surface: "#F6FAFD",
  surfaceBright: "#F6FAFD",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F0F4F7",
  surfaceVariant: "#DFE3E6",
  onSurface: "#171C1E",
  onSurfaceVariant: "#3E484D",
  outlineVariant: "#BDC8CE",
};

// Ward icon cycling
const WARD_ICONS = [HeartPulse, Stethoscope, Activity, ShieldAlert];
const BED_TYPE_ORDER = ["telemetry", "standard medical", "intensive care"];

function getBedTypeOrder(name) {
  const normalizedName = name.toLowerCase();
  const orderIndex = BED_TYPE_ORDER.findIndex((type) => normalizedName.includes(type));
  return orderIndex === -1 ? BED_TYPE_ORDER.length : orderIndex;
}

// ---- Bed grid for the selected ward ----
function WardBedGrid({ wardId, wardName, selectedBedId, onSelectBed }) {
  const { data, isLoading, isError } = useGetAllBedsByWardQuery(wardId, { skip: !wardId });
  const beds = data?.beds || [];

  // Group beds by bed_type_name
  const grouped = beds.reduce((acc, bed) => {
    const type = bed.bed_type_name || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(bed);
    return acc;
  }, {});
  const orderedGroups = Object.entries(grouped).sort(([nameA], [nameB]) => {
    const orderDifference = getBedTypeOrder(nameA) - getBedTypeOrder(nameB);
    return orderDifference || nameA.localeCompare(nameB);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading beds…</span>
      </div>
    );
  }

  if (isError || beds.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        {isError ? "Failed to load beds." : "No beds configured for this ward."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderedGroups.map(([bedType, bedList]) => (
        <div key={bedType} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-teal-900 uppercase tracking-wider flex items-center gap-2">
              <BedDouble size={16} className="text-teal-700" />
              {bedType}
              <span className="text-xs font-normal text-gray-500">({bedList.length} Beds)</span>
            </h4>
            <span className="text-xs font-semibold text-gray-600 bg-white px-2.5 py-0.5 rounded border">
              {bedList.filter(b => b.status === "AVAILABLE").length} Available
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bedList.map((bed) => {
              const isSelected = bed.id === selectedBedId;
              const isOccupied = bed.status === "OCCUPIED";
              return (
                <div
                  key={bed.id}
                  onClick={() => onSelectBed(bed)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-teal-600 bg-white shadow"
                      : "bg-white hover:border-teal-400"
                  }`}
                  style={{ borderColor: isSelected ? colors.primary : colors.outlineVariant }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {wardName ? wardName.substring(0, 3).toUpperCase() : ""} - {bed.name}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: isOccupied ? "#DBEAFE" : "#DCFCE7",
                        color: isOccupied ? "#1E40AF" : "#15803D",
                      }}
                    >
                      {isOccupied ? "Occupied" : "Available"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {bed.patient_name ? (
                      <div className="font-semibold text-teal-900 truncate">👤 {bed.patient_name}</div>
                    ) : (
                      <div className="text-emerald-700 font-semibold">🟢 Available for occupancy</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WardsAndBeds() {
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  const dispatch = useDispatch();
  const { data: wardsData, isLoading: wardsLoading, isFetching: wardsFetching, refetch } = useGetWardsQuery();
  const wards = wardsData?.wards || [];

  // Auto-select first ward
  const activeWardId = selectedWardId || (wards.length > 0 ? String(wards[0].id) : null);
  const currentWard = wards.find(w => String(w.id) === activeWardId) || wards[0];

  const handleSelectWard = (ward) => {
    setSelectedWardId(String(ward.id));
    setSelectedBed(null);
  };

  const handleRefresh = () => {
    refetch();
    dispatch(hospitalApi.util.invalidateTags(["Beds"]));
  };

  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header
          className="sticky top-0 z-40 border-b flex justify-between items-center px-6 py-2 h-16"
          style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
        >
          <h1 className="text-xl font-bold" style={{ color: colors.primary }}>
            Wards &amp; Beds Capacity Management
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={wardsFetching}
              aria-label="Refresh ward and bed data"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-slate-100 transition-all"
              style={{ color: colors.primary }}
            >
              <RefreshCw size={14} className={wardsFetching ? "animate-spin" : ""} /> {wardsFetching ? "Refreshing…" : "Refresh"}
            </button>
            <UserProfileHover />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden flex flex-col gap-6">
          {/* Page header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Wards &amp; Bed Grid</h1>
            <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Real-time bed availability and occupancy status across all hospital wards.
            </p>
          </div>

          {/* Ward Cards Grid */}
          {wardsLoading ? (
            <div className="flex items-center gap-2 text-gray-400 py-4">
              <Loader2 size={18} className="animate-spin" /> Loading wards…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {wards.map((ward, i) => {
                const isSelected = String(ward.id) === activeWardId;
                const IconComp = WARD_ICONS[i % WARD_ICONS.length];
                const total = Number(ward.total_beds) || 0;
                const occupied = Number(ward.occupied_beds) || 0;
                const available = Number(ward.available_beds) || 0;
                return (
                  <div
                    key={ward.id}
                    onClick={() => handleSelectWard(ward)}
                    className={`rounded-2xl p-5 border cursor-pointer transition-all duration-150 shadow-sm bg-white ${
                      isSelected ? "ring-2 ring-teal-600" : "hover:border-teal-400"
                    }`}
                    style={{ borderColor: isSelected ? colors.primary : colors.outlineVariant }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{ward.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">{total} Total Beds</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800">
                        <IconComp size={22} />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-semibold">Total Beds:</span>
                        <span className="font-bold text-gray-900">{total} Beds</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-semibold">Available:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {available} Available
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-semibold">Occupied:</span>
                        <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {occupied} Occupied
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bed Grid + Inspector */}
          {activeWardId && currentWard && (
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left: Bed Grid */}
              <div
                className="col-span-12 lg:col-span-8 rounded-2xl border p-6 bg-white shadow-sm"
                style={{ borderColor: colors.outlineVariant }}
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentWard.name} Bed Grid</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Showing all beds in this ward grouped by bed type.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900">
                    {currentWard.total_beds} Total Beds
                  </span>
                </div>
                <WardBedGrid
                  wardId={activeWardId}
                  wardName={currentWard.name}
                  selectedBedId={selectedBed?.id}
                  onSelectBed={setSelectedBed}
                />
              </div>

              {/* Right: Bed Inspector */}
              <div
                className="col-span-12 lg:col-span-4 rounded-2xl border p-6 bg-white shadow-sm sticky top-20"
                style={{ borderColor: colors.outlineVariant }}
              >
                <h3 className="text-lg font-bold border-b pb-3 mb-4 text-teal-900 flex items-center gap-2">
                  <BedDouble size={20} className="text-teal-700" /> Bed Details Inspector
                </h3>
                {selectedBed ? (
                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-gray-500 uppercase">Selected Bed</div>
                      <div className="text-2xl font-mono font-bold text-gray-900 mt-1">
                        {selectedBed.name} ({currentWard.name})
                      </div>
                      <div className="text-xs text-teal-800 font-semibold mt-0.5">{selectedBed.bed_type_name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border bg-slate-50">
                        <div className="text-xs font-semibold text-gray-500">Ward</div>
                        <div className="font-bold text-gray-900 mt-0.5">{currentWard.name}</div>
                      </div>
                      <div className="p-3 rounded-lg border bg-slate-50">
                        <div className="text-xs font-semibold text-gray-500">Status</div>
                        <div
                          className="font-bold mt-0.5"
                          style={{ color: selectedBed.status === "OCCUPIED" ? "#1E40AF" : "#15803D" }}
                        >
                          {selectedBed.status}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Occupancy Info</div>
                      {selectedBed.patient_name ? (
                        <div className="space-y-1">
                          <div className="font-bold text-gray-900">{selectedBed.patient_name}</div>
                          <div className="text-xs text-gray-600">Patient ID: {selectedBed.patient_id}</div>
                          <div className="text-xs text-gray-500 mt-1">Assigned &amp; active under patient care.</div>
                        </div>
                      ) : (
                        <div className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle2 size={16} /> Bed sanitized and ready for patient assignment.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-sm text-gray-400">
                    Click any bed to see its details here.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
