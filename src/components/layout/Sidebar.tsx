"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  number: string;
  badge?: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "OVERVIEW",
      href: "/dashboard",
      number: "01",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      name: "APPLIANCES",
      href: "/appliances",
      number: "02",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      name: "ANALYTICS",
      href: "/analytics",
      number: "03",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      name: "BILL ESTIMATOR",
      href: "/bills",
      number: "04",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      name: "ANOMALIES",
      href: "/anomalies",
      number: "05",
      badge: "2",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      name: "ENERGY INSIGHTS",
      href: "/insights",
      number: "06",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      ),
    },
    {
      name: "SETTINGS",
      href: "/settings",
      number: "07",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#141518] border-r border-[#24262b] flex flex-col justify-between text-white min-h-screen">
      <div>
        {/* Brand Logo Header */}
        <div className="h-[65px] px-6 flex items-center border-b border-[#24262b]">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-[-0.6px] text-white">
              WATTWISE
            </span>
            <span className="text-base text-[#7939E8] font-black">●</span>
          </Link>
        </div>

        {/* Section Title */}
        <div className="px-6 pt-6 pb-2">
          <span className="font-mono text-[9px] font-bold tracking-[1.8px] text-[#727782]">
            CORE TELEMETRY
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 transition-colors ${
                  isActive
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-[#989da8] hover:text-white hover:bg-[#1f2126]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-black" : "text-[#7b808d]"}>
                    {item.icon}
                  </span>
                  <span className="font-mono text-xs tracking-wider">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-[#7939E8] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                      {item.badge}
                    </span>
                  )}
                  <span
                    className={`font-mono text-xs ${
                      isActive ? "text-[#555]" : "text-[#535763]"
                    }`}
                  >
                    {item.number}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Node Location & User Info */}
      <div className="border-t border-[#24262b] p-4 bg-[#111215]">
        {/* Location Bay */}
        <div className="mb-4">
          <div className="flex items-center justify-between font-mono text-[9px] font-bold tracking-wider text-[#727782]">
            <span>LOCATION BAY</span>
            <span className="flex items-center gap-1 text-[#10b981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              ESP32 / SYNCED
            </span>
          </div>
          <div className="mt-1 font-mono text-xs font-bold text-white tracking-wide">
            BANDRA RESIDENCE
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-3 border-t border-[#202227]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#2a2c33] font-mono text-xs font-bold text-white border border-[#373a44]">
              AK
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-white leading-tight">
                Aditya K.
              </div>
              <div className="font-mono text-[9px] text-[#727782]">
                HOME ADMIN
              </div>
            </div>
          </div>

          <svg className="w-4 h-4 text-[#727782]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
