import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  LogOut,
} from "lucide-react";
import { logout } from "../store/slices/authSlice";

const colors = {
  primary: "#00647C",
  secondaryContainer: "#D5E0F8",
  surfaceContainerLowest: "#FFFFFF",
  onSurfaceVariant: "#3E484D",
  outlineVariant: "#BDC8CE",
};

const commonNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BedDouble, label: "Wards & Beds", path: "/wards-beds" },
  { icon: ClipboardList, label: "Ward Logs", path: "/ward-logs" },
];

const sharedLastNavItems = [
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: FileText, label: "Alerts & Reports", path: "/alerts" },
];

const roleNavItems = {
  1: [
    { icon: User, label: "Patients", path: "/patients" },
  ],
  2: [
    { icon: User, label: "Patients", path: "/patients" },
    { icon: LogIn, label: "Admissions", path: "/admissions" },
  ],
  3: [
    { icon: User, label: "Patients", path: "/patients" },
    { icon: ArrowLeftRight, label: "Transfers", path: "/transfers" },
    { icon: ListChecks, label: "Waiting List", path: "/waiting-list" },
  ],
};

const roleNames = { 1: "Staff", 2: "Doctor", 3: "Ward Manager" };

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);
  const roleId = Number(user?.role_id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItems = [...commonNavItems, ...(roleNavItems[roleId] || []), ...sharedLastNavItems];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 overflow-y-auto gap-1 p-4 z-50 border-r shadow-sm"
      style={{ backgroundColor: colors.surfaceContainerLowest, borderColor: colors.outlineVariant }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
          CityCare General
        </h2>
        <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
          {roleNames[roleId] || "Hospital user"}
        </p>
      </div>
      <ul className="flex flex-col gap-1 flex-1">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors active:scale-95 duration-150 ${isActive ? "font-semibold" : ""
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { color: colors.primary, backgroundColor: colors.secondaryContainer }
                  : { color: colors.onSurfaceVariant }
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-red-50 text-left"
        style={{ color: "#B91C1C" }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
