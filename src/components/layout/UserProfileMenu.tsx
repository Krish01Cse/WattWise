"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfileMenuProps {
  currentEmail?: string;
  size?: "sm" | "md";
}

export function UserProfileMenu({ currentEmail, size = "md" }: UserProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string>(currentEmail || "");
  const [fullName, setFullName] = useState<string>("Operator Node");
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("wattwise_user_email");
      if (storedEmail) {
        setEmail(storedEmail);
      } else if (!email) {
        setEmail("aditya.k@residence.in");
      }

      try {
        const rawSession = localStorage.getItem("wattwise_session");
        if (rawSession) {
          const session = JSON.parse(rawSession);
          if (session?.user?.fullName) {
            setFullName(session.user.fullName);
          } else if (session?.user?.email) {
            setFullName(session.user.email.split("@")[0]);
          }
        }
      } catch {
        // ignore parse error
      }
    }
  }, [currentEmail]);

  // Sync if prop changes
  useEffect(() => {
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [currentEmail]);

  // Click outside listener to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle navigate to settings
  const handleNavigateSettings = () => {
    setIsOpen(false);
    router.push("/settings");
  };

  // Handle Sign in to different account
  const handleSignInDifferentAccount = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      // Clear active session to prompt credentials for new login
      localStorage.removeItem("wattwise_session");
      localStorage.removeItem("wattwise_user_email");
      localStorage.removeItem("wattwise_user_password");
    }
    router.push("/auth?mode=login");
  };

  // Handle Sign out of account
  const handleSignOut = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("wattwise_session");
      localStorage.removeItem("wattwise_user_email");
      localStorage.removeItem("wattwise_user_password");
    }
    router.push("/auth");
  };

  const buttonDimensions = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconDimensions = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* TRIGGER PROFILE ICON BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User profile and account options"
        className={`flex ${buttonDimensions} items-center justify-center rounded-full bg-black text-white hover:bg-[#222] transition-colors cursor-pointer border border-transparent hover:border-[#444] shadow-sm relative`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>

        {/* Small active dot */}
        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#10b981] border border-white" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-72 sm:w-80 border border-[#dedbd4] bg-white shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-top-1 duration-150 divide-y divide-[#ece8df]">
          {/* USER INFO BANNER */}
          <div className="p-3.5 bg-[#faf8f3]">
            <div className="flex items-center justify-between text-[10px] text-[#727782] font-bold tracking-wider mb-1.5">
              <span>ACTIVE OPERATOR</span>
              <span className="flex items-center gap-1 text-[#10b981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white font-bold text-xs border border-[#333]">
                {email ? email.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-black text-xs truncate">
                  {fullName}
                </div>
                <div className="text-[11px] text-[#666] truncate">
                  {email || "aditya.k@residence.in"}
                </div>
              </div>
            </div>
          </div>

          {/* 3 ACTIONS LIST */}
          <div className="p-1.5 space-y-1 bg-white">
            {/* OPTION 1: NAVIGATE TO SETTINGS */}
            <button
              type="button"
              onClick={handleNavigateSettings}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs text-[#222] hover:bg-[#f4f2ec] hover:text-black transition-colors rounded group cursor-pointer"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-[#faf8f3] group-hover:bg-white text-[#7939E8] transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-black flex items-center justify-between">
                  <span>Navigate to Settings</span>
                  <span className="text-[10px] text-[#727782] font-normal">04</span>
                </div>
                <div className="text-[10px] text-[#666]">
                  Telemetry, alerts &amp; security credentials
                </div>
              </div>
            </button>

            {/* OPTION 2: SIGN IN TO DIFFERENT ACCOUNT */}
            <button
              type="button"
              onClick={handleSignInDifferentAccount}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs text-[#222] hover:bg-[#f4f2ec] hover:text-black transition-colors rounded group cursor-pointer"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-[#faf8f3] group-hover:bg-white text-[#2563eb] transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-black">
                  Sign in to Different Account
                </div>
                <div className="text-[10px] text-[#666]">
                  Switch session to another registered profile
                </div>
              </div>
            </button>

            {/* OPTION 3: SIGN OUT OF ACCOUNT */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs text-[#b91c1c] hover:bg-[#fef2f2] transition-colors rounded group cursor-pointer"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#fecaca] bg-[#fff5f5] text-[#dc2626] group-hover:bg-[#fee2e2] transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#b91c1c]">
                  Sign Out of Account
                </div>
                <div className="text-[10px] text-[#7f1d1d]">
                  End active telemetry session and exit
                </div>
              </div>
            </button>
          </div>

          {/* FOOTER METRIC */}
          <div className="px-3.5 py-2 bg-[#f4f2ec] flex items-center justify-between text-[10px] text-[#727782]">
            <span>WATTWISE CLOUD</span>
            <span className="font-bold text-black">v3.12 • SECURED</span>
          </div>
        </div>
      )}
    </div>
  );
}
