import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111215] text-[#111111]">
      {/* Fixed/Sticky Dark Telemetry Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden bg-[#fcf9f2] min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
