import React from 'react';
import Sidebar from '../components/Sidebar';
import UserProfileHover from '../components/UserProfileHover';

export default function CapacityOptimization() {
  return (
    <div className="min-h-screen flex font-sans bg-[#F6FAFD]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 p-8">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">Capacity Optimization - CityCare General</h1>
          <UserProfileHover />
        </div>
        <p className="text-slate-500">This module is currently under development.</p>
      </div>
    </div>
  );
}
