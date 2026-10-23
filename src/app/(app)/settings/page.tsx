"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface UserSettingsState {
  demoMode: boolean;
  telemetrySource: string;
  hardwareNodeId: string;
  hardwareBridgeConnected: boolean;
  alertOvernight: boolean;
  alertMultiHeavy: boolean;
  alertPowerSpikes: boolean;
  receiveEmail: boolean;
  emailAddress: string;
  receiveWhatsApp: boolean;
  phoneNumber: string;
  receiveBrowser: boolean;
  operatorName: string;
  operatorRole: string;
  residenceName: string;
  isCloudSynced?: boolean;
}

const DEFAULT_SETTINGS: UserSettingsState = {
  demoMode: true,
  telemetrySource: "dataset_historical",
  hardwareNodeId: "ESP32-CT-NODE-01",
  hardwareBridgeConnected: true,
  alertOvernight: true,
  alertMultiHeavy: true,
  alertPowerSpikes: true,
  receiveEmail: true,
  emailAddress: "aditya.k@residence.in",
  receiveWhatsApp: true,
  phoneNumber: "+91 98921 12345",
  receiveBrowser: true,
  operatorName: "Aditya K.",
  operatorRole: "lead_operator",
  residenceName: "Bandra Residence",
  isCloudSynced: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettingsState>(DEFAULT_SETTINGS);
  const [actualPassword, setActualPassword] = useState("Passcode@2026");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Masking toggles for privacy
  const [showEmail, setShowEmail] = useState(false);
  const [showAltEmail, setShowAltEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  // Modals
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Change password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    success: false,
    submitting: false,
  });

  // Phone number inline edit
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState("");

  // Load settings on mount
  useEffect(() => {
    async function fetchSettingsData() {
      try {
        setLoading(true);
        const storedEmail =
          typeof window !== "undefined"
            ? localStorage.getItem("wattwise_user_email") ||
              (() => {
                try {
                  const s = localStorage.getItem("wattwise_session");
                  return s ? JSON.parse(s)?.user?.email : null;
                } catch {
                  return null;
                }
              })()
            : null;

        const res = await api.settings.get(storedEmail || undefined);
        if (res && res.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
            emailAddress: res.data.emailAddress || storedEmail || prev.emailAddress,
            demoMode: res.data.telemetrySource !== "physical_sensors",
          }));
          setTempPhone(res.data.phoneNumber || "+91 98921 12345");
          if (res.data.unmaskedPassword) {
            setActualPassword(res.data.unmaskedPassword);
          } else if (typeof window !== "undefined") {
            const localPass = localStorage.getItem("wattwise_user_password");
            if (localPass) setActualPassword(localPass);
          }
        } else if (storedEmail) {
          setSettings((prev) => ({ ...prev, emailAddress: storedEmail }));
        }
      } catch (err: any) {
        console.warn("Could not load settings from server, using local defaults:", err);
        if (typeof window !== "undefined") {
          const storedEmail = localStorage.getItem("wattwise_user_email");
          if (storedEmail) {
            setSettings((prev) => ({ ...prev, emailAddress: storedEmail }));
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSettingsData();
  }, []);


  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save changes handler
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const res = await api.settings.update(settings);
      if (res && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
        }));
      }
      showToast("Settings updated and synchronized with Supabase cloud");
    } catch (err: any) {
      console.error("Save settings error:", err);
      showToast(err.message || "Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset to factory defaults handler
  const handleResetSettings = async () => {
    if (!confirm("Are you sure you want to reset all telemetry and alert preferences to factory defaults?")) {
      return;
    }
    try {
      setSaving(true);
      const res = await api.settings.reset();
      if (res && res.data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...res.data,
        });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      showToast("Settings reset to baseline factory parameters");
    } catch (err: any) {
      console.error("Reset settings error:", err);
      showToast("Reset failed: " + (err.message || "Unknown error"), "error");
    } finally {
      setSaving(false);
    }
  };

  // Password change submission
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordForm((p) => ({ ...p, error: "", submitting: true }));

    if (passwordForm.newPassword.length < 10) {
      setPasswordForm((p) => ({
        ...p,
        error: "Password cipher must contain at least 10 characters.",
        submitting: false,
      }));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm((p) => ({
        ...p,
        error: "New password and confirmation cipher do not match.",
        submitting: false,
      }));
      return;
    }

    try {
      await api.settings.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        email: settings.emailAddress,
      });

      setActualPassword(passwordForm.newPassword);
      if (typeof window !== "undefined") {
        localStorage.setItem("wattwise_user_password", passwordForm.newPassword);
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: "",
        success: true,
        submitting: false,
      });

      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordForm((p) => ({ ...p, success: false }));
        showToast("Access key password updated and encrypted in database");
      }, 1200);
    } catch (err: any) {
      setPasswordForm((p) => ({
        ...p,
        error: err.message || "Failed to change password. Please check current credentials.",
        submitting: false,
      }));
    }
  };

  // Count active alerts
  const activeAlertsCount = [
    settings.alertOvernight,
    settings.alertMultiHeavy,
    settings.alertPowerSpikes,
  ].filter(Boolean).length;

  const maskEmail = (email: string) => {
    if (!email) return "aditya.k@residence.in";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const name = parts[0];
    const visible = name.slice(0, Math.min(4, name.length));
    return `${visible}****@${parts[1]}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "+91 98*** 12345";
    const trimmed = phone.trim();
    if (trimmed.length > 8) {
      return `${trimmed.slice(0, 6)}*** ${trimmed.slice(-5)}`;
    }
    return "+91 98*** 12345";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] text-[#111111]">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 font-mono text-xs shadow-2xl transition-all border ${
            toastType === "success"
              ? "bg-[#111215] text-white border-[#333]"
              : "bg-[#7f1d1d] text-white border-red-500"
          }`}
        >
          {toastType === "success" ? (
            <span className="text-[#10b981]">✓</span>
          ) : (
            <span className="text-red-300">⚠</span>
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="h-[65px] border-b border-[#dedbd4] bg-[#fcf9f2] px-6 sm:px-8 flex items-center justify-between">
        {/* Left Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#55515a]">
          <span className="font-bold text-black text-sm">Settings</span>
          <span className="text-[#a09c95]">●</span>
          <span className="text-[#727782]">Household &amp; Preferences</span>
        </div>

        {/* Right Status Badges & Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-[#d5d0c8] bg-white px-3 py-1 font-mono text-xs text-[#222] shadow-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                settings.demoMode ? "bg-[#10b981]" : "bg-[#7939e8]"
              }`}
            />
            <span className="font-medium">
              {settings.demoMode ? "Sample Data Mode" : "Physical Node Active"}
            </span>
          </div>

          {/* Bell Icon with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="flex h-9 w-9 items-center justify-center border border-[#dedbd4] bg-white hover:bg-[#f4f2ec] transition-colors relative"
              aria-label="Alert notifications"
            >
              <svg className="w-4 h-4 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 bg-[#7939E8] text-white text-[9px] font-mono font-bold px-1 rounded-sm">
                3
              </span>
            </button>

            {/* Notification Drawer */}
            {showNotificationDrawer && (
              <div className="absolute right-0 top-11 z-50 w-80 border border-[#dedbd4] bg-white p-3.5 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#eee] pb-2">
                  <span className="font-bold text-black">SMART ALERTS QUEUE</span>
                  <span className="text-[10px] text-[#7939E8] font-bold">3 ACTIVE</span>
                </div>
                <div className="divide-y divide-[#f0f0f0] mt-2 space-y-2">
                  <div className="pt-2">
                    <span className="font-bold text-[#b91c1c] block">🌙 Water Heater Left On</span>
                    <span className="text-[11px] text-[#666]">Triggered at 03:14 AM. Exceeded 120min continuous draw.</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#b45309] block">⚡ Heavy Co-Occurrence</span>
                    <span className="text-[11px] text-[#666]">AC + Geyser + Microwave simultaneous draw (4.2 kW).</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#10b981] block">● Supabase Cloud Sync</span>
                    <span className="text-[11px] text-[#666]">Telemetry database synchronized (latency 12ms).</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Circle Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white cursor-pointer hover:opacity-90 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 px-6 sm:px-8 py-7 space-y-7 max-w-[1500px] w-full mx-auto">
        {/* TITLE ROW WITH ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-1px] text-black">
              Settings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#666]">
              Manage your telemetry data source, alert preferences, and account security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetSettings}
              disabled={saving}
              className="px-4 py-2 text-xs font-mono font-bold text-[#444] border border-[#d5d0c8] bg-transparent hover:bg-[#eae6dd] transition-colors"
            >
              Reset
            </button>

            {/* Save Changes Button */}
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold text-white bg-black hover:bg-[#222] shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="animate-spin text-sm">⟳</span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT COLUMN: Data & Sensors, Account Credentials, Account & Security */}
          <div className="lg:col-span-6 space-y-6">
            {/* CARD 1: DATA & SENSORS */}
            <section className="border border-[#dedbd4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#7939E8] font-bold">((•))</span>
                  <h2 className="font-bold text-sm tracking-tight text-black">
                    Data &amp; Sensors
                  </h2>
                </div>
                <span className="border border-[#e0d7f5] bg-[#f4effe] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#7939E8]">
                  {settings.demoMode ? "Sample Mode" : "Physical Bridge"}
                </span>
              </div>

              {/* Demo Mode Action Box */}
              <div className="border border-[#e7e3da] bg-[#fbf9f4] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dedbd4] bg-white text-[#7939E8] shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-black">
                      Demo Mode (Sample Data)
                    </h3>
                    <p className="text-xs text-[#666] mt-0.5">
                      Simulated household appliances and telemetry stream
                    </p>
                  </div>
                </div>

                {/* Active Toggle / Button */}
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      demoMode: !prev.demoMode,
                      telemetrySource: !prev.demoMode ? "dataset_historical" : "physical_sensors",
                    }))
                  }
                  className={`px-3 py-1 font-mono text-xs font-bold text-white transition-colors ${
                    settings.demoMode
                      ? "bg-[#7939E8] hover:bg-[#682cd1]"
                      : "bg-[#727782] hover:bg-[#585c65]"
                  }`}
                >
                  {settings.demoMode ? "Active" : "Enable"}
                </button>
              </div>

              {/* Explanatory Notice */}
              <div className="mt-4 border-l-2 border-[#dedbd4] pl-3 py-1 text-xs text-[#666] leading-relaxed">
                {settings.demoMode ? (
                  <span>
                    WattWise is operating in simulated mode using realistic synthetic load profiles so you can explore all telemetry and smart reporting features.
                  </span>
                ) : (
                  <span>
                    WattWise is listening for real-time CT sensor packets from hardware node{" "}
                    <span className="font-mono font-bold text-black">{settings.hardwareNodeId}</span> on Bandra Residence mains.
                  </span>
                )}
              </div>
            </section>

            {/* CARD 2: ACCOUNT CREDENTIALS (SECURITY) */}
            <section className="border border-[#dedbd4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <h2 className="font-bold text-sm tracking-tight text-black">
                    Account Credentials
                  </h2>
                </div>
                <span className="font-mono text-[9px] font-bold tracking-[1.5px] text-[#727782] uppercase">
                  SECURITY
                </span>
              </div>

              <div className="space-y-4 font-mono">
                {/* Account Email Field */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-3.5">
                  <div className="flex items-center justify-between text-[10px] text-[#727782] font-bold tracking-wider mb-1">
                    <span>ACCOUNT EMAIL</span>
                    <span className="text-[#10b981] bg-[#ecfdf5] px-1.5 py-0.5 border border-[#a7f3d0]">
                      PRIMARY
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm text-black font-medium">
                      {showEmail ? settings.emailAddress : maskEmail(settings.emailAddress)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEmail(!showEmail)}
                      className="text-[#666] hover:text-black transition-colors p-1"
                      aria-label="Toggle email visibility"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showEmail ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-3.5">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1">
                    <span className="text-[#727782]">PASSWORD</span>
                    <button
                      type="button"
                      onClick={() => setShowChangePasswordModal(true)}
                      className="text-[#7939E8] hover:underline"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm tracking-widest text-black">
                      ••••••••••••
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 3: ACCOUNT & SECURITY (PROTECTED) */}
            <section className="border border-[#dedbd4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <h2 className="font-bold text-sm tracking-tight text-black">
                    Account &amp; Security
                  </h2>
                </div>
                <span className="border border-[#dedbd4] bg-[#f4f2ec] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#555]">
                  Protected
                </span>
              </div>

              <div className="space-y-3 font-mono">
                <div className="text-[10px] text-[#727782] font-bold tracking-wider">
                  ACCOUNT CREDENTIALS
                </div>

                {/* Email Item */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <span className="text-[11px] font-bold text-black block">Account Email</span>
                      <span className="text-xs text-[#555]">
                        {showAltEmail ? settings.emailAddress : maskEmail(settings.emailAddress)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAltEmail(!showAltEmail)}
                    className="text-[#666] hover:text-black transition-colors p-1"
                    aria-label="Toggle email masking"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showAltEmail ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>

                {/* Password Item */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 2l-2 2m-1.5 1.5L12 11l-4-4-6 6a3 3 0 1 0 4.24 4.24l6-6 4 4 5.5-5.5z" />
                    </svg>
                    <div>
                      <span className="text-[11px] font-bold text-black block">Password</span>
                      <span className="text-xs text-[#555] tracking-widest">
                        ••••••••••••
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-3 border-t border-[#eee] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#888]">Danger Zone</span>
                  <button
                    type="button"
                    onClick={() => setShowDeleteProfileModal(true)}
                    className="text-[#dc2626] hover:text-[#b91c1c] flex items-center gap-1.5 transition-colors font-bold"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Delete Profile</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Smart Alerts & Notifications with Purple Accent Bar */}
          <div className="lg:col-span-6">
            <section className="border border-[#dedbd4] border-l-4 border-l-[#7939E8] bg-white p-5 sm:p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <h2 className="font-bold text-sm sm:text-base tracking-tight text-black">
                    Smart Alerts &amp; Notifications
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#555] font-semibold">
                  {activeAlertsCount} Active
                </span>
              </div>

              {/* SECTION: WHEN TO ALERT */}
              <div className="space-y-4">
                <div className="font-mono text-[10px] font-bold tracking-wider text-[#727782] uppercase">
                  WHEN TO ALERT
                </div>

                {/* Alert Item 1: Overnight */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🌙</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        Appliance left on overnight
                      </h4>
                      <p className="text-xs text-[#666] mt-0.5">
                        e.g. water heater running at 3 AM
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.alertOvernight}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        alertOvernight: !prev.alertOvernight,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.alertOvernight ? "bg-[#7939E8]" : "bg-[#d1d5db]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.alertOvernight ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Alert Item 2: Multiple heavy appliances */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg text-amber-500">⚡</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        Multiple heavy appliances running together
                      </h4>
                      <p className="text-xs text-[#666] mt-0.5">
                        e.g. AC + Geyser + Microwave
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.alertMultiHeavy}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        alertMultiHeavy: !prev.alertMultiHeavy,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.alertMultiHeavy ? "bg-[#7939E8]" : "bg-[#d1d5db]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.alertMultiHeavy ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Alert Item 3: Unusual power spikes */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg text-purple-600">📈</span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        Unusual power spikes
                      </h4>
                      <p className="text-xs text-[#666] mt-0.5">
                        &gt;50% above normal expected draw
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.alertPowerSpikes}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        alertPowerSpikes: !prev.alertPowerSpikes,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.alertPowerSpikes ? "bg-[#7939E8]" : "bg-[#d1d5db]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.alertPowerSpikes ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* SECTION: HOW TO RECEIVE ALERTS */}
              <div className="space-y-4 pt-2">
                <div className="font-mono text-[10px] font-bold tracking-wider text-[#727782] uppercase">
                  HOW TO RECEIVE ALERTS
                </div>

                {/* Channel 1: Email */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white text-[#555]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        Email
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 font-mono text-xs text-[#666]">
                        <span>{showEmail ? settings.emailAddress : maskEmail(settings.emailAddress)}</span>
                        <button
                          type="button"
                          onClick={() => setShowEmail(!showEmail)}
                          className="hover:text-black transition-colors"
                          aria-label="Toggle email"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {showEmail ? (
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            ) : (
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.receiveEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          receiveEmail: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#7939E8] focus:ring-[#7939E8] accent-[#7939E8] cursor-pointer"
                    />
                  </label>
                </div>

                {/* Channel 2: WhatsApp / SMS */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white text-[#555]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        WhatsApp / SMS
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 font-mono text-xs text-[#666]">
                        {isEditingPhone ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={tempPhone}
                              onChange={(e) => setTempPhone(e.target.value)}
                              className="px-1.5 py-0.5 border border-[#ccc] bg-white text-black text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSettings((p) => ({ ...p, phoneNumber: tempPhone }));
                                setIsEditingPhone(false);
                              }}
                              className="text-[10px] bg-black text-white px-2 py-0.5 font-bold"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>{showPhone ? settings.phoneNumber : maskPhone(settings.phoneNumber)}</span>
                            <button
                              type="button"
                              onClick={() => setShowPhone(!showPhone)}
                              className="hover:text-black transition-colors"
                              aria-label="Toggle phone masking"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {showPhone ? (
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                ) : (
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                )}
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingPhone(true)}
                              className="text-[10px] text-[#7939e8] hover:underline"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.receiveWhatsApp}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          receiveWhatsApp: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#7939E8] focus:ring-[#7939E8] accent-[#7939E8] cursor-pointer"
                    />
                  </label>
                </div>

                {/* Channel 3: Browser Notifications */}
                <div className="border border-[#e7e3da] bg-[#faf8f3] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white text-[#555]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-black">
                        Browser Notifications
                      </h4>
                      <p className="text-xs text-[#666] mt-0.5">
                        Popups on your computer or phone
                      </p>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.receiveBrowser}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSettings((prev) => ({
                          ...prev,
                          receiveBrowser: checked,
                        }));
                        if (checked && typeof window !== "undefined" && "Notification" in window) {
                          Notification.requestPermission();
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#7939E8] focus:ring-[#7939E8] accent-[#7939E8] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-[#dedbd4] bg-[#fcf9f2] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#666] mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black">WattWise for Homes</span>
          <span>•</span>
          <span>Version 3.12</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#10b981] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Synced with cloud
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span>Need help?</span>
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="text-[#7939E8] font-bold hover:underline"
          >
            Read the Homeowner Energy Guide
          </button>
        </div>
      </footer>

      {/* MODAL 1: CHANGE PASSWORD */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md border border-[#333] bg-[#111215] text-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#24262b] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-[#7939E8] text-base">🔒</span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                  Update Password Cipher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(false)}
                className="text-[#888] hover:text-white font-mono text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#a0a5b1] mb-1 font-bold">
                  Current Password Cipher
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current passcode"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  className="w-full border border-[#2b2e36] bg-[#1a1c22] px-3 py-2 text-white focus:border-[#7939E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a0a5b1] mb-1 font-bold">
                  New Password Cipher (Min 10 chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter strong new passcode"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  className="w-full border border-[#2b2e36] bg-[#1a1c22] px-3 py-2 text-white focus:border-[#7939E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a0a5b1] mb-1 font-bold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new passcode"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  className="w-full border border-[#2b2e36] bg-[#1a1c22] px-3 py-2 text-white focus:border-[#7939E8] focus:outline-none"
                />
              </div>

              {passwordForm.error && (
                <div className="border border-red-500/50 bg-red-950/40 p-2.5 text-red-300 text-[11px]">
                  {passwordForm.error}
                </div>
              )}

              {passwordForm.success && (
                <div className="border border-emerald-500/50 bg-emerald-950/40 p-2.5 text-emerald-300 text-[11px]">
                  Password cipher successfully updated!
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#24262b]">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 border border-[#333] hover:bg-[#222] text-[#aaa] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordForm.submitting}
                  className="px-5 py-2 bg-[#7939E8] hover:bg-[#682cd1] text-white font-bold transition-colors disabled:opacity-50"
                >
                  {passwordForm.submitting ? "Encrypting..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE PROFILE / DANGER ZONE */}
      {showDeleteProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md border border-red-900 bg-[#141113] text-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-3 mb-4">
              <div className="flex items-center gap-2 text-red-500">
                <span>⚠️</span>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                  Delete Resident Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteProfileModal(false)}
                className="text-[#888] hover:text-white font-mono text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#ccc] leading-relaxed font-sans mb-4">
              This action will reset your operator profile, clear localized telemetry caches, and restore household parameters to standard Tata Power Mumbai baseline specifications.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-red-900/40 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteProfileModal(false)}
                className="px-4 py-2 border border-[#333] hover:bg-[#222] text-[#aaa] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowDeleteProfileModal(false);
                  await handleResetSettings();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Confirm Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HOMEOWNER ENERGY GUIDE */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl border border-[#dedbd4] bg-[#fcf9f2] text-black p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dedbd4] pb-4 mb-5">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#7939E8] uppercase">
                  WATTWISE DOCUMENTATION
                </span>
                <h3 className="text-2xl font-black tracking-tight text-black mt-0.5">
                  Homeowner Energy Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-[#888] hover:text-black font-mono text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs text-[#444] leading-relaxed">
              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-black flex items-center gap-1.5">
                  <span>🌙</span> Nighttime Geyser &amp; Leak Monitoring
                </h4>
                <p>
                  Geysers account for over 22% of morning electrical load in Mumbai residences. If continuous power draw (&gt;1,800W) is detected between 01:00 AM and 05:00 AM, WattWise triggers an overnight leak alert to prevent coil burnouts and excess tariff slab billing.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-black flex items-center gap-1.5">
                  <span>⚡</span> Heavy Appliance Co-Occurrence
                </h4>
                <p>
                  Bandra Residence operates on a 5.0 kW sanctioned single-phase connection. Running the Dual Inverter AC (1.45 kW), Water Geyser (2.0 kW), and Microwave (1.2 kW) simultaneously breaches the 4.5 kW thermal safety threshold. Toggling this alert notifies family members before the main MCB trips.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-black flex items-center gap-1.5">
                  <span>📈</span> Non-Intrusive Load Monitoring (NILM)
                </h4>
                <p>
                  High-frequency current and voltage signatures decompose aggregate mains data into individual appliance footprints. Power spikes exceeding 50% of nominal duty cycles trigger diagnostic warnings to check for motor degradation or voltage sags.
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-[#dedbd4] flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 font-mono text-xs font-bold text-white bg-black hover:bg-[#222]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
