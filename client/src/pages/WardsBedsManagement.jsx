import React, { useState } from "react";
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
    ChevronDown,
    Bell,
    Clock,
    ListFilter,
    Plus,
    HeartPulse,
    Stethoscope,
    Baby,
    Heart,
    SprayCan,
    CalendarClock,
    Wrench,
    AlertTriangle,
} from "lucide-react";

// ---- Design tokens (mirrors the original Tailwind config) ----
const colors = {
    primary: "#00647C",
    primaryContainer: "#007F9D",
    primaryFixed: "#B7EAFF",
    primaryFixedDim: "#6CD3F7",
    onPrimaryFixed: "#001F28",
    onPrimaryFixedVariant: "#004E61",
    onPrimary: "#FFFFFF",
    secondary: "#545F73",
    secondaryContainer: "#D5E0F8",
    secondaryFixed: "#D8E3FB",
    tertiary: "#894E00",
    tertiaryFixed: "#FFDCBF",
    onTertiaryFixed: "#2D1600",
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
    outline: "#6E797E",
    outlineVariant: "#BDC8CE",
};

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BedDouble, label: "Wards & Beds", active: true },
    { icon: User, label: "Patients" },
    { icon: LogIn, label: "Admissions" },
    { icon: ArrowLeftRight, label: "Transfers" },
    { icon: ListChecks, label: "Waiting List" },
    { icon: ClipboardList, label: "Ward Logs" },
    { icon: BarChart3, label: "Analytics" },
    { icon: FileText, label: "Reports" },
    { icon: BellRing, label: "Alerts" },
];

const wardSummaries = [
    { name: "ICU", floor: "Floor 2", icon: HeartPulse, iconColor: colors.error, accent: colors.errorContainer, occupancy: "95%", occColor: colors.error, beds: "19/20" },
    { name: "General Surgical", floor: "Floor 3", icon: Stethoscope, iconColor: colors.primary, accent: colors.primaryFixed, occupancy: "65%", occColor: colors.primary, beds: "26/40", active: true },
    { name: "Pediatrics", floor: "Floor 1", icon: Baby, iconColor: colors.secondary, accent: colors.secondaryFixed, occupancy: "40%", occColor: colors.onSurface, beds: "12/30" },
    { name: "Maternity", floor: "Floor 4", icon: Heart, iconColor: colors.tertiary, accent: colors.tertiaryFixed, occupancy: "80%", occColor: colors.onSurface, beds: "24/30" },
];

const beds = [
    { id: "GS-01", type: "occupied", patient: "Doe, J.", note: "Discharge: Today", alert: true },
    {
        id: "GS-02",
        type: "occupied",
        patient: "Smith, Aaron T.",
        note: "Discharge: 10/24",
        detail: {
            mrn: "994-201-44",
            initials: "AS",
            dob: "1980-05-12 (43)",
            sex: "Male",
            allergy: "Penicillin Allergy",
            admitted: "Oct 20, 2023 - 08:45 AM",
            admittedBy: "Dr. H. Ramirez (Surgery)",
            expectedDischarge: "Oct 24, 2023 - 11:00 AM",
            dischargeNote: "Pending final rounds",
        },
    },
    { id: "GS-03", type: "available" },
    { id: "GS-04", type: "cleaning", note: "Est: 30 mins" },
    { id: "GS-05", type: "available" },
    { id: "GS-06", type: "reserved", note: "Inc: Trauma L1", eta: "ETA: 14:00" },
    { id: "GS-07", type: "maintenance", note: "O2 Valve Repair" },
    { id: "GS-08", type: "occupied", patient: "Williams, K." },
    { id: "GS-09", type: "occupied", patient: "Chen, L." },
    { id: "GS-10", type: "occupied", patient: "Garcia, M." },
];

const legend = [
    { label: "Available", bg: "#E2E8F0", border: "#CBD5E1" },
    { label: "Occupied", bg: colors.primaryFixed, border: colors.primary },
    { label: "Reserved", bg: colors.tertiaryFixed, border: colors.tertiary },
    { label: "Cleaning", bg: colors.errorContainer, border: colors.error },
    { label: "Maintenance", bg: colors.surfaceVariant, border: colors.outlineVariant },
];

function BedBox({ bed, selected, onSelect }) {
    const base =
        "cursor-pointer rounded-lg p-2 flex flex-col h-24 relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border";

    const styleMap = {
        occupied: { backgroundColor: colors.primaryFixed, borderColor: colors.primary },
        available: { backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant },
        reserved: { backgroundColor: colors.tertiaryFixed, borderColor: colors.tertiary },
        cleaning: { backgroundColor: colors.errorContainer, borderColor: colors.error },
        maintenance: {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.outlineVariant,
            backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)",
        },
    };

    const idColorMap = {
        occupied: colors.onPrimaryFixed,
        reserved: colors.onTertiaryFixed,
        cleaning: colors.onErrorContainer,
        available: colors.onSurfaceVariant,
        maintenance: colors.onSurfaceVariant,
    };

    const noteColorMap = {
        occupied: colors.onPrimaryFixedVariant,
        reserved: colors.onTertiaryFixed,
        cleaning: colors.onErrorContainer,
        maintenance: colors.onSurfaceVariant,
    };

    return (
        <div
            className={base}
            style={{
                ...styleMap[bed.type],
                boxShadow: selected ? `0 0 0 2px ${colors.onSurface}` : undefined,
                outline: selected ? `2px solid ${colors.primaryFixedDim}` : "none",
                outlineOffset: selected ? "1px" : undefined,
            }}
            onClick={() => onSelect(bed.id)}
        >
            <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-bold" style={{ color: idColorMap[bed.type] }}>
                    {bed.id}
                </span>
                {bed.type === "occupied" && <User size={16} style={{ color: colors.primary }} />}
                {bed.type === "cleaning" && <SprayCan size={16} style={{ color: colors.error }} />}
                {bed.type === "reserved" && <CalendarClock size={16} style={{ color: colors.tertiary }} />}
                {bed.type === "maintenance" && <Wrench size={16} style={{ color: colors.onSurfaceVariant }} />}
            </div>

            {bed.type === "available" ? (
                <div className="mt-auto flex justify-center items-center h-full">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                        Available
                    </span>
                </div>
            ) : (
                <div className="mt-auto">
                    {bed.patient && (
                        <div className="text-[10px] truncate" style={{ color: noteColorMap[bed.type] }}>
                            {bed.patient}
                        </div>
                    )}
                    {bed.note && (
                        <div className="font-mono text-[10px]" style={{ color: noteColorMap[bed.type] }}>
                            {bed.note}
                        </div>
                    )}
                    {bed.eta && (
                        <div className="font-mono text-[10px]" style={{ color: noteColorMap[bed.type] }}>
                            {bed.eta}
                        </div>
                    )}
                </div>
            )}

            {bed.alert && (
                <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.error }}
                />
            )}
        </div>
    );
}

export default function WardsAndBeds() {
    const [selectedId, setSelectedId] = useState("GS-02");
    const selectedBed = beds.find((b) => b.id === selectedId);

    return (
        <div className="min-h-screen flex font-sans" style={{ backgroundColor: colors.surface, color: colors.onSurface }}>
            {/* Side Nav */}
            <aside
                className="w-64 h-screen fixed left-0 top-0 overflow-y-auto border-r flex flex-col gap-1 p-4 z-50"
                style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
            >
                <div className="mb-6 px-2">
                    <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
                        CityCare General
                    </h1>
                    <div className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                        Staff ID: 94021
                    </div>
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className="flex items-center gap-3 px-4 py-2.5 rounded transition-colors active:scale-95 duration-150 text-sm"
                            style={
                                item.active
                                    ? { color: colors.primary, backgroundColor: colors.secondaryContainer, fontWeight: 600 }
                                    : { color: colors.onSurfaceVariant }
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </a>
                    ))}
                    <div className="mt-auto">
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-2.5 rounded transition-colors active:scale-95 duration-150 text-sm"
                            style={{ color: colors.onSurfaceVariant }}
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main content area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
                {/* Top Nav */}
                <header
                    className="sticky top-0 z-40 border-b flex justify-between items-center px-6 py-2 h-16"
                    style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                >
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="relative w-full max-w-sm hidden md:block">
                            <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.onSurfaceVariant }} />
                            <input
                                className="w-full h-8 pl-9 pr-3 rounded-md text-sm border outline-none transition-shadow"
                                style={{ backgroundColor: colors.surface, borderColor: colors.outlineVariant }}
                                placeholder="Search wards, beds, patients..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-1/3">
                        <h2 className="text-lg font-bold hidden md:block" style={{ color: colors.primary }}>
                            CityCare General Hospital
                        </h2>
                    </div>
                    <div className="flex items-center justify-end gap-4 w-1/3">
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-colors hover:opacity-80"
                            style={{ color: colors.onSurfaceVariant, borderColor: colors.outlineVariant }}
                        >
                            <span>Hospital/Branch Selector</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="p-1 transition-colors hover:opacity-80 cursor-pointer active:opacity-70" style={{ color: colors.onSurfaceVariant }}>
                                <Bell size={20} />
                            </button>
                            <button className="p-1 transition-colors hover:opacity-80 cursor-pointer active:opacity-70" style={{ color: colors.onSurfaceVariant }}>
                                <Clock size={20} />
                            </button>
                        </div>
                        <div
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold"
                            style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant }}
                        >
                            A
                        </div>
                    </div>
                </header>

                {/* Workspace */}
                <main className="flex-1 p-6 overflow-x-hidden flex flex-col md:flex-row gap-6">
                    {/* Left column */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">
                        {/* Controls row */}
                        <div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border"
                            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                        >
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-1">
                                    <ListFilter size={18} style={{ color: colors.onSurfaceVariant }} />
                                    <select
                                        className="h-8 border rounded text-sm px-2 focus:outline-none"
                                        style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                                    >
                                        <option>All Floors</option>
                                        <option>Floor 1</option>
                                        <option>Floor 2 (ICU)</option>
                                        <option>Floor 3</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <select
                                        className="h-8 border rounded text-sm px-2 focus:outline-none"
                                        style={{ borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest }}
                                    >
                                        <option>All Statuses</option>
                                        <option>Available Only</option>
                                        <option>Critical Occupancy</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm transition-colors"
                                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryContainer)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
                            >
                                <Plus size={18} />
                                Add Ward
                            </button>
                        </div>

                        {/* Ward summary grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {wardSummaries.map((w) => (
                                <div
                                    key={w.name}
                                    className={`rounded-xl p-4 flex flex-col relative overflow-hidden group border ${w.active ? "ring-1" : ""}`}
                                    style={{
                                        backgroundColor: colors.surfaceContainerLowest,
                                        borderColor: w.active ? colors.primary : colors.outlineVariant,
                                        boxShadow: w.active ? "0 4px 6px -1px rgba(0,0,0,0.05)" : undefined,
                                        cursor: w.active ? "pointer" : undefined,
                                    }}
                                >
                                    <div
                                        className="absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-8 -mt-8 opacity-20 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: w.accent }}
                                    />
                                    <div className="flex justify-between items-start mb-2 pb-2 border-b" style={{ borderColor: colors.surfaceVariant }}>
                                        <div>
                                            <h3 className="text-lg font-semibold">{w.name}</h3>
                                            <span className="text-xs font-semibold" style={{ color: colors.onSurfaceVariant }}>
                                                {w.floor}
                                            </span>
                                        </div>
                                        <w.icon size={22} style={{ color: w.iconColor }} />
                                    </div>
                                    <div className="flex justify-between items-end mt-auto pt-2">
                                        <div>
                                            <div className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                                                Occupancy
                                            </div>
                                            <div className="font-mono font-bold text-xl" style={{ color: w.occColor }}>
                                                {w.occupancy}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                                                Beds
                                            </div>
                                            <div className="font-mono">{w.beds}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bed map section */}
                        <div
                            className="rounded-xl border flex flex-col flex-1 min-h-[400px]"
                            style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                        >
                            <div
                                className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                style={{ borderColor: colors.surfaceVariant }}
                            >
                                <div>
                                    <h2 className="text-2xl font-semibold">General Surgical - Map</h2>
                                    <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                        Floor 3 • 40 Total Beds
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-[11px] font-semibold" style={{ color: colors.onSurfaceVariant }}>
                                    {legend.map((l) => (
                                        <div key={l.label} className="flex items-center gap-1">
                                            <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: l.bg, borderColor: l.border }} />
                                            {l.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 flex-1 overflow-auto" style={{ backgroundColor: colors.surfaceBright }}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                    {beds.map((bed) => (
                                        <BedBox key={bed.id} bed={bed} selected={bed.id === selectedId} onSelect={setSelectedId} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column: detail panel */}
                    <aside
                        className="w-full md:w-80 lg:w-96 rounded-xl border flex flex-col sticky top-20 h-[calc(100vh-100px)] overflow-y-auto"
                        style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                    >
                        {/* Panel header */}
                        <div
                            className="p-4 border-b flex justify-between items-start rounded-t-xl"
                            style={{ backgroundColor: colors.surfaceBright, borderColor: colors.surfaceVariant }}
                        >
                            <div>
                                <div className="text-xs font-semibold" style={{ color: colors.primary }}>
                                    BED DETAILS
                                </div>
                                <h2 className="text-2xl font-mono font-semibold">{selectedBed?.id}</h2>
                                <div className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                                    General Surgical • Floor 3
                                </div>
                            </div>
                            <div
                                className="text-[10px] px-2 py-1 rounded uppercase font-semibold tracking-wide"
                                style={{ backgroundColor: colors.primary, color: colors.onPrimary }}
                            >
                                {selectedBed?.type ?? "unknown"}
                            </div>
                        </div>

                        {/* Panel content */}
                        <div className="p-4 flex flex-col gap-6">
                            {selectedBed?.detail ? (
                                <>
                                    {/* Current patient block */}
                                    <div className="border rounded-lg p-4 relative" style={{ borderColor: colors.outlineVariant }}>
                                        <div
                                            className="absolute -top-3 left-3 px-1 text-[10px] font-semibold"
                                            style={{ backgroundColor: colors.surfaceContainerLowest, color: colors.onSurfaceVariant }}
                                        >
                                            CURRENT PATIENT
                                        </div>
                                        <div className="flex items-center gap-4 mb-4 mt-1">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                                                style={{ backgroundColor: colors.secondaryContainer, color: colors.primary }}
                                            >
                                                {selectedBed.detail.initials}
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{selectedBed.patient}</div>
                                                <div className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                                    MRN: {selectedBed.detail.mrn}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="p-2 rounded border" style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.surfaceVariant }}>
                                                <div className="text-[10px] font-semibold" style={{ color: colors.onSurfaceVariant }}>
                                                    DOB / AGE
                                                </div>
                                                <div className="font-mono mt-1">{selectedBed.detail.dob}</div>
                                            </div>
                                            <div className="p-2 rounded border" style={{ backgroundColor: colors.surfaceContainerLow, borderColor: colors.surfaceVariant }}>
                                                <div className="text-[10px] font-semibold" style={{ color: colors.onSurfaceVariant }}>
                                                    SEX
                                                </div>
                                                <div className="font-mono mt-1">{selectedBed.detail.sex}</div>
                                            </div>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between items-center" style={{ borderColor: colors.surfaceVariant }}>
                                            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: colors.error }}>
                                                <AlertTriangle size={16} /> {selectedBed.detail.allergy}
                                            </span>
                                            <button className="text-sm font-semibold hover:underline" style={{ color: colors.primary }}>
                                                View Chart
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stay timeline */}
                                    <div className="border rounded-lg p-4 relative" style={{ borderColor: colors.outlineVariant }}>
                                        <div
                                            className="absolute -top-3 left-3 px-1 text-[10px] font-semibold"
                                            style={{ backgroundColor: colors.surfaceContainerLowest, color: colors.onSurfaceVariant }}
                                        >
                                            STAY TIMELINE
                                        </div>
                                        <div className="flex flex-col gap-4 mt-2 relative">
                                            <div className="absolute left-[11px] top-[14px] bottom-[14px] w-[2px] z-0" style={{ backgroundColor: colors.outlineVariant }} />
                                            <div className="flex gap-4 relative z-10">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5"
                                                    style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.primary }}
                                                >
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                                                </div>
                                                <div className="flex-1 pb-4 border-b" style={{ borderColor: colors.surfaceVariant }}>
                                                    <div className="text-sm font-semibold">Admitted</div>
                                                    <div className="font-mono text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                                                        {selectedBed.detail.admitted}
                                                    </div>
                                                    <div className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                                                        {selectedBed.detail.admittedBy}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 relative z-10">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 mt-0.5"
                                                    style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold">Expected Discharge</div>
                                                    <div className="font-mono text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
                                                        {selectedBed.detail.expectedDischarge}
                                                    </div>
                                                    <div className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                                                        {selectedBed.detail.dischargeNote}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                                    {selectedBed?.type === "available"
                                        ? "This bed is available and ready for assignment."
                                        : selectedBed
                                            ? `Bed ${selectedBed.id} is currently marked as ${selectedBed.type}.${selectedBed.patient ? ` Patient: ${selectedBed.patient}.` : ""
                                            }`
                                            : "Select a bed to view details."}
                                </div>
                            )}
                        </div>

                        {/* Actions footer */}
                        <div
                            className="mt-auto p-4 border-t rounded-b-xl flex gap-2"
                            style={{ borderColor: colors.surfaceVariant }}
                        >
                            <button
                                className="flex-1 border text-sm font-semibold py-2 rounded transition-colors hover:opacity-80"
                                style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
                            >
                                Transfer
                            </button>
                            <button
                                className="flex-1 border text-sm font-semibold py-2 rounded transition-colors hover:opacity-80"
                                style={{ borderColor: colors.outlineVariant, color: colors.onSurfaceVariant }}
                            >
                                Discharge
                            </button>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}