import React from "react";
import { useSelector } from "react-redux";

export default function UserProfileHover() {
  const user = useSelector((state) => state.auth.user);
  const name = user?.name || "Signed-in user";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative z-50 group">
      <button
        type="button"
        aria-label="Show signed-in user details"
        className="w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold text-teal-800 bg-teal-50 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        {initials || "U"}
      </button>
      <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg opacity-0 invisible transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
        {user?.email && <p className="mt-1 break-all text-xs text-slate-600">{user.email}</p>}
      </div>
    </div>
  );
}
