"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { api } from "@/lib/api";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";

export interface ApplianceRecord {
  id: string;
  name: string;
  specification: string;
  roomLocation: string;
  category: string;
  wattage: number;
  count: number;
  hoursPerDay: number;
  dailyKwh: number;
  monthlyCostInr: number;
  dataSource: "MEASURED (SMART PLUG)" | "DATASET MODEL" | "ESTIMATED" | string;
  status: "normal" | "high_draw" | "possible_leak" | string;
  statusLabel: string;
  icon: string;
  isCustom?: boolean;
}

// 9 DATASET APPLIANCES BACKED BY HISTORICAL TELEMETRY (MUMBAI 90D DATASET)
const INITIAL_DATASET_APPLIANCES: ApplianceRecord[] = [
  {
    id: "app-001",
    name: "Air Conditioner",
    specification: "1.5 Ton",
    roomLocation: "Bedroom",
    category: "Cooling",
    wattage: 1500,
    count: 1,
    hoursPerDay: 6.2,
    dailyKwh: 5.8,
    monthlyCostInr: 1420,
    dataSource: "MEASURED (SMART PLUG)",
    status: "high_draw",
    statusLabel: "28% ABOVE BASELINE",
    icon: "snowflake",
  },
  {
    id: "app-002",
    name: "Refrigerator (Double Door)",
    specification: "340L",
    roomLocation: "Kitchen",
    category: "Kitchen",
    wattage: 250,
    count: 1,
    hoursPerDay: 24.0,
    dailyKwh: 2.6,
    monthlyCostInr: 640,
    dataSource: "MEASURED (SMART PLUG)",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "fridge",
  },
  {
    id: "app-003",
    name: "Water Geyser",
    specification: "25L Storage",
    roomLocation: "Bathroom",
    category: "Heating",
    wattage: 2000,
    count: 1,
    hoursPerDay: 2.4,
    dailyKwh: 2.1,
    monthlyCostInr: 515,
    dataSource: "DATASET MODEL",
    status: "possible_leak",
    statusLabel: "UNUSUAL USAGE PATTERN",
    icon: "geyser",
  },
  {
    id: "app-004",
    name: "Living Room AC",
    specification: "2.0 Ton Split",
    roomLocation: "Living Room",
    category: "Cooling",
    wattage: 1800,
    count: 1,
    hoursPerDay: 1.2,
    dailyKwh: 1.8,
    monthlyCostInr: 440,
    dataSource: "ESTIMATED",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "ac_split",
  },
  {
    id: "app-005",
    name: "Microwave Oven",
    specification: "28L Convection",
    roomLocation: "Kitchen",
    category: "Kitchen",
    wattage: 1200,
    count: 1,
    hoursPerDay: 0.8,
    dailyKwh: 0.96,
    monthlyCostInr: 235,
    dataSource: "ESTIMATED",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "microwave",
  },
  {
    id: "app-006",
    name: "Washing Machine",
    specification: "7.5 Kg Front Load",
    roomLocation: "Utility",
    category: "Kitchen",
    wattage: 500,
    count: 1,
    hoursPerDay: 1.1,
    dailyKwh: 0.55,
    monthlyCostInr: 135,
    dataSource: "DATASET MODEL",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "washer",
  },
  {
    id: "app-007",
    name: "Television & Console",
    specification: "65-Inch OLED",
    roomLocation: "Living Room",
    category: "Living",
    wattage: 140,
    count: 1,
    hoursPerDay: 4.5,
    dailyKwh: 0.63,
    monthlyCostInr: 155,
    dataSource: "MEASURED (SMART PLUG)",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "tv",
  },
  {
    id: "app-008",
    name: "Home Workstation / PC",
    specification: "Dual Displays",
    roomLocation: "Study",
    category: "Living",
    wattage: 320,
    count: 1,
    hoursPerDay: 7.0,
    dailyKwh: 0.82,
    monthlyCostInr: 200,
    dataSource: "ESTIMATED",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "monitor",
  },
  {
    id: "app-009",
    name: "Lighting & Ceiling Fans",
    specification: "14 Fixtures",
    roomLocation: "All Rooms",
    category: "Living",
    wattage: 110,
    count: 1,
    hoursPerDay: 5.5,
    dailyKwh: 0.60,
    monthlyCostInr: 150,
    dataSource: "ESTIMATED",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "bulb",
  },
];

// APPLIANCE ICONS
function ApplianceIcon({ type }: { type: string }) {
  switch (type) {
    case "snowflake":
      return (
        <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      );
    case "fridge":
      return (
        <svg className="w-4 h-4 text-[#444]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="5" y1="10" x2="19" y2="10" />
          <line x1="8" y1="5" x2="8" y2="8" />
          <line x1="8" y1="13" x2="8" y2="16" />
        </svg>
      );
    case "geyser":
      return (
        <svg className="w-4 h-4 text-[#b91c1c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2c-4 4-6 7.5-6 10.5 0 3.6 2.7 6.5 6 6.5s6-2.9 6-6.5C18 9.5 16 6 12 2z" />
          <path d="M12 12c-1.5 1.5-2 3-2 4 0 1.1.9 2 2 2s2-.9 2-2c0-1-.5-2.5-2-4z" />
        </svg>
      );
    case "ac_split":
      return (
        <svg className="w-4 h-4 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="8" rx="1" />
          <line x1="6" y1="18" x2="18" y2="18" />
          <path d="M7 14l-2 4" />
          <path d="M17 14l2 4" />
        </svg>
      );
    case "microwave":
      return (
        <svg className="w-4 h-4 text-[#d97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="15" rx="2" />
          <rect x="4" y="6" width="11" height="11" rx="1" />
          <circle cx="18" cy="8" r="1" />
          <circle cx="18" cy="12" r="1" />
        </svg>
      );
    case "washer":
      return (
        <svg className="w-4 h-4 text-[#0891b2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="13" r="5" />
          <circle cx="7" cy="6" r="1" />
        </svg>
      );
    case "tv":
      return (
        <svg className="w-4 h-4 text-[#4b5563]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="13" rx="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      );
    case "monitor":
      return (
        <svg className="w-4 h-4 text-[#4f46e5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "bulb":
      return (
        <svg className="w-4 h-4 text-[#ca8a04]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

export default function AppliancesPage() {
  const [appliances, setAppliances] = useState<ApplianceRecord[]>(INITIAL_DATASET_APPLIANCES);
  const [loading, setLoading] = useState(true);
  const [tariff, setTariff] = useState(8.20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dateRange, setDateRange] = useState<"TODAY" | "7D" | "30D" | "CUSTOM">("TODAY");

  // Notification drawer
  const [showNotifications, setShowNotifications] = useState(false);

  // Add Appliance Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    specification: "",
    roomLocation: "Bedroom",
    category: "Cooling",
    wattage: 1200,
    hoursPerDay: 4.0,
    dataSource: "ESTIMATED",
    status: "normal",
    statusLabel: "NORMAL",
    icon: "snowflake",
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Detail Modal / Drawer
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceRecord | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for ⌘K search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch live appliances from backend & Supabase
  const loadAppliances = async () => {
    try {
      setLoading(true);
      const res = await api.appliances.list();
      if (res && res.data && res.data.appliances && res.data.appliances.length > 0) {
        setAppliances(res.data.appliances);
        if (res.data.summary?.effectiveTariff) {
          setTariff(res.data.summary.effectiveTariff);
        }
      } else {
        setAppliances(INITIAL_DATASET_APPLIANCES);
      }
    } catch (err) {
      console.warn("Could not load appliances from backend, using dataset baseline:", err);
      setAppliances(INITIAL_DATASET_APPLIANCES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppliances();
  }, []);

  // Compute live aggregates from dataset appliances
  const totalDailyKwh = useMemo(() => {
    const sum = appliances.reduce((acc, a) => acc + (a.dailyKwh || (a.wattage * a.hoursPerDay) / 1000), 0);
    return Number(sum.toFixed(1));
  }, [appliances]);

  const dailyCost = useMemo(() => {
    return Math.round(totalDailyKwh * tariff);
  }, [totalDailyKwh, tariff]);

  const monthlyCostEst = useMemo(() => {
    return Math.round(dailyCost * 30);
  }, [dailyCost]);

  const highestConsumer = useMemo(() => {
    if (appliances.length === 0) return INITIAL_DATASET_APPLIANCES[0];
    return [...appliances].sort((a, b) => b.dailyKwh - a.dailyKwh)[0];
  }, [appliances]);

  const highestConsumerPct = useMemo(() => {
    if (!totalDailyKwh || !highestConsumer) return 39;
    return Math.round((highestConsumer.dailyKwh / totalDailyKwh) * 100);
  }, [totalDailyKwh, highestConsumer]);

  const activeCount = useMemo(() => {
    return appliances.filter((a) => a.hoursPerDay >= 2.0).length || 5;
  }, [appliances]);

  const standbyCount = useMemo(() => {
    return Math.max(0, appliances.length - activeCount);
  }, [appliances, activeCount]);

  // Categories & Counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      All: appliances.length,
      Cooling: 0,
      Heating: 0,
      Kitchen: 0,
      Living: 0,
    };
    appliances.forEach((a) => {
      const cat = a.category;
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      } else {
        counts[cat] = 1;
      }
    });
    return counts;
  }, [appliances]);

  // Filtered Appliances
  const filteredAppliances = useMemo(() => {
    return appliances.filter((app) => {
      const matchCat = selectedCategory === "All" || app.category.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        app.name.toLowerCase().includes(query) ||
        (app.specification && app.specification.toLowerCase().includes(query)) ||
        (app.roomLocation && app.roomLocation.toLowerCase().includes(query)) ||
        app.category.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [appliances, selectedCategory, searchQuery]);

  // Export Inventory as CSV
  const handleExportCSV = () => {
    const headers = [
      "Appliance",
      "Specification",
      "Room / Location",
      "Category",
      "Rated Power (W)",
      "Daily Usage (hrs)",
      "Daily Consumption (kWh)",
      "Est. Monthly Cost (INR)",
      "Data Source",
      "Status",
    ];

    const rows = appliances.map((a) => [
      `"${a.name}"`,
      `"${a.specification || ""}"`,
      `"${a.roomLocation || ""}"`,
      `"${a.category}"`,
      a.wattage,
      a.hoursPerDay,
      a.dailyKwh,
      a.monthlyCostInr || Math.round(a.dailyKwh * 30 * tariff),
      `"${a.dataSource}"`,
      `"${a.statusLabel || a.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wattwise_appliances_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Appliance telemetry inventory exported as CSV file");
  };

  // Handle Add Appliance Submit
  const handleAddApplianceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      alert("Please provide an appliance name");
      return;
    }

    try {
      setSubmittingAdd(true);
      const res = await api.appliances.add({
        name: addForm.name.trim(),
        specification: addForm.specification.trim(),
        roomLocation: addForm.roomLocation,
        category: addForm.category,
        wattage: Number(addForm.wattage),
        hoursPerDay: Number(addForm.hoursPerDay),
        dataSource: addForm.dataSource,
        icon: addForm.icon,
        status: addForm.status,
        statusLabel: addForm.statusLabel,
      });

      if (res && res.data) {
        setAppliances((prev) => [...prev, res.data]);
      } else {
        const fallback: ApplianceRecord = {
          id: `app-custom-${Date.now()}`,
          name: addForm.name.trim(),
          specification: addForm.specification.trim(),
          roomLocation: addForm.roomLocation,
          category: addForm.category,
          wattage: Number(addForm.wattage),
          count: 1,
          hoursPerDay: Number(addForm.hoursPerDay),
          dailyKwh: Number(((Number(addForm.wattage) * Number(addForm.hoursPerDay)) / 1000).toFixed(2)),
          monthlyCostInr: Math.round(((Number(addForm.wattage) * Number(addForm.hoursPerDay)) / 1000) * 30 * tariff),
          dataSource: addForm.dataSource,
          status: addForm.status,
          statusLabel: addForm.statusLabel,
          icon: addForm.icon,
          isCustom: true,
        };
        setAppliances((prev) => [...prev, fallback]);
      }

      setShowAddModal(false);
      showToast(`Added "${addForm.name}" to telemetry monitor and Supabase`);
      setAddForm({
        name: "",
        specification: "",
        roomLocation: "Bedroom",
        category: "Cooling",
        wattage: 1200,
        hoursPerDay: 4.0,
        dataSource: "ESTIMATED",
        status: "normal",
        statusLabel: "NORMAL",
        icon: "snowflake",
      });
    } catch (err: any) {
      alert(err.message || "Failed to add appliance");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Handle Remove Appliance
  const handleRemoveAppliance = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your telemetry load decomposition?`)) {
      return;
    }
    try {
      await api.appliances.remove(id);
      setAppliances((prev) => prev.filter((a) => a.id !== id));
      showToast(`Removed "${name}" from inventory`);
    } catch {
      setAppliances((prev) => prev.filter((a) => a.id !== id));
      showToast(`Removed "${name}" from local view`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] text-[#111111]">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border border-[#dedbd4] bg-black px-4 py-3 font-mono text-xs text-white shadow-2xl animate-in slide-in-from-bottom-2">
          <span className="text-[#10b981]">●</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="h-[65px] border-b border-[#dedbd4] bg-[#fcf9f2] px-6 sm:px-8 flex items-center justify-between">
        {/* Left System Range Selector */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs text-[#55515a] overflow-x-auto">
          <span className="font-bold text-[#727782] text-[10px] tracking-wider uppercase hidden md:inline">
            SYS RANGE
          </span>
          <div className="flex items-center gap-1.5 border border-[#d5d0c8] bg-white px-2.5 py-1 text-black font-semibold shadow-sm">
            <span>📅</span>
            <span>Today, Oct 24, 2026</span>
          </div>

          <div className="flex items-center border border-[#d5d0c8] bg-white shadow-sm">
            {(["TODAY", "7D", "30D", "CUSTOM"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold transition-colors ${
                  dateRange === r ? "bg-black text-white" : "text-[#444] hover:bg-[#eae6dd]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Right Status Badges & User Profile Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 border border-[#d5d0c8] bg-white px-3 py-1 font-mono text-[11px] text-[#222] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span>DATA SOURCE: DEMO DATA (SIMULATED) // SAMPLE APARTMENT</span>
          </div>

          {/* Bell Icon with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
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

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-11 z-50 w-80 border border-[#dedbd4] bg-white p-3.5 shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#eee] pb-2">
                  <span className="font-bold text-black">APPLIANCE TELEMETRY ALERTS</span>
                  <span className="text-[10px] text-[#7939E8] font-bold">3 ACTIVE</span>
                </div>
                <div className="divide-y divide-[#f0f0f0] mt-2 space-y-2">
                  <div className="pt-2">
                    <span className="font-bold text-[#7e22ce] block">❄️ Air Conditioner Draw +28%</span>
                    <span className="text-[11px] text-[#666]">1.5 Ton Master Bedroom AC exceeded normal expected curve.</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#b91c1c] block">🌙 Water Geyser Continuous Draw</span>
                    <span className="text-[11px] text-[#666]">Bathroom geyser active at 03:14 AM. Exceeded 120min baseline limit.</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-[#10b981] block">● Smart Plugs Synced</span>
                    <span className="text-[11px] text-[#666]">All 9 appliance load signatures validated against Mumbai 90d dataset.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <UserProfileMenu />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 px-6 sm:px-8 py-7 space-y-6 max-w-[1500px] w-full mx-auto">
        {/* TITLE & ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-1px] text-black">
              My Appliances
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#666]">
              Every device. Every unit. One clear picture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metadata Pill */}
            <div className="hidden md:flex items-center gap-2 border border-[#dedbd4] bg-white px-3.5 py-2 font-mono text-xs text-[#333] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-black" />
              <span className="font-bold">MODE: SAMPLE HOUSEHOLD</span>
              <span className="text-[#999]">•</span>
              <span>{appliances.length} Monitored</span>
              <span className="text-[#999]">•</span>
              <span className="text-[#727782]">₹{tariff.toFixed(2)}/unit tariff</span>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 border border-[#d5d0c8] bg-white px-4 py-2 font-mono text-xs font-bold text-black hover:bg-[#eae6dd] transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export</span>
            </button>

            {/* Add Appliance Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-black hover:bg-[#222] text-white px-5 py-2 font-mono text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              <span className="text-base leading-none font-bold">+</span>
              <span>Add Appliance</span>
            </button>
          </div>
        </div>

        {/* 3 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CARD 1: Total Appliances */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#727782] font-mono font-bold">
                <span>Total Appliances</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ec] text-[#333]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                  {appliances.length}
                </span>
                <span className="text-sm text-[#666] font-mono">devices</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0eee6] flex items-center gap-2 font-mono text-xs text-[#555]">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span>{activeCount} active</span>
              <span className="text-[#aaa]">•</span>
              <span>{standbyCount} on standby</span>
            </div>
          </div>

          {/* CARD 2: Daily Usage Total */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#727782] font-mono font-bold">
                <span>Daily Usage Total</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ec] text-[#7939E8]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                  ~{totalDailyKwh}
                </span>
                <span className="text-sm text-[#666] font-mono">kWh / day</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0eee6] flex items-center justify-between font-mono text-xs text-[#444]">
              <span>~₹{dailyCost} / day</span>
              <span className="font-bold text-black">~₹{monthlyCostEst.toLocaleString()} / mo (Est.)</span>
            </div>
          </div>

          {/* CARD 3: Highest Consumer */}
          <div className="border border-[#dedbd4] bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#727782] font-mono font-bold">
                <span>Highest Consumer</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4effe] text-[#7939E8]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  </svg>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-black tracking-tight">
                  {highestConsumer?.name || "Air Conditioner"}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#f4effe] text-[#7939E8] border border-[#e0d7f5] px-2 py-0.5 font-mono text-[10px] font-bold">
                  ⚡ HIGHEST DRAW
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0eee6] flex items-center justify-between font-mono text-xs text-[#555]">
              <span className="text-[#7939E8] font-bold">
                ~{highestConsumer?.dailyKwh || 5.8} kWh (~{highestConsumerPct}% of total)
              </span>
              <span>Est. {highestConsumer?.hoursPerDay || 6.2} hrs active</span>
            </div>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER STRIP */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box with ⌘K */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#727782]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search appliance or room..."
              className="w-full pl-10 pr-12 py-2.5 border border-[#d5d0c8] bg-white font-mono text-xs text-black placeholder-[#888] focus:outline-none focus:border-black shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="border border-[#d5d0c8] bg-[#f8f6f0] px-1.5 py-0.5 font-mono text-[10px] text-[#777] rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {Object.entries(categories).map(([cat, count]) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer border whitespace-nowrap ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white text-[#333] border-[#d5d0c8] hover:bg-[#f4f2ec]"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* APPLIANCES DATA TABLE */}
        <div className="border border-[#dedbd4] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#dedbd4] bg-[#faf8f3] text-[11px] font-bold text-[#555] tracking-wider uppercase">
                  <th className="py-3 px-4">Appliance</th>
                  <th className="py-3 px-4">Room / Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rated Power</th>
                  <th className="py-3 px-4">Daily Usage</th>
                  <th className="py-3 px-4">Daily Cons.</th>
                  <th className="py-3 px-4">
                    Est. Monthly Cost <span className="text-[#888] font-normal">(₹{tariff.toFixed(2)}/u)</span>
                  </th>
                  <th className="py-3 px-4">Data Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece8df]">
                {filteredAppliances.map((app) => {
                  const cost = app.monthlyCostInr || Math.round(app.dailyKwh * 30 * tariff);
                  const isAnomaly = app.status === "possible_leak" || app.statusLabel.includes("UNUSUAL");
                  const isHighDraw = app.status === "high_draw" || app.statusLabel.includes("BASELINE");

                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedAppliance(app)}
                      className="hover:bg-[#fbf9f4] transition-colors cursor-pointer group"
                    >
                      {/* 1. Appliance */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-[#faf8f3] shadow-sm">
                            <ApplianceIcon type={app.icon} />
                          </div>
                          <div>
                            <span className="font-bold text-black text-sm block">
                              {app.name}
                            </span>
                            {app.specification && (
                              <span className="text-[11px] text-[#727782] block">
                                {app.specification}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Room / Location */}
                      <td className="py-3 px-4 text-black font-medium">
                        {app.roomLocation || "Living Room"}
                      </td>

                      {/* 3. Category */}
                      <td className="py-3 px-4 text-[#555]">
                        {app.category}
                      </td>

                      {/* 4. Rated Power */}
                      <td className="py-3 px-4 text-black font-semibold">
                        {app.wattage.toLocaleString()} W
                      </td>

                      {/* 5. Daily Usage */}
                      <td className="py-3 px-4 text-[#444]">
                        ~{app.hoursPerDay.toFixed(1)} hrs
                      </td>

                      {/* 6. Daily Cons. */}
                      <td className="py-3 px-4 font-bold text-black">
                        ~{app.dailyKwh.toFixed(1)} kWh
                      </td>

                      {/* 7. Est. Monthly Cost */}
                      <td className="py-3 px-4 font-bold text-black">
                        ~₹{cost.toLocaleString()}
                      </td>

                      {/* 8. Data Source Badge */}
                      <td className="py-3 px-4">
                        {app.dataSource.includes("MEASURED") ? (
                          <span className="inline-flex items-center gap-1.5 border border-[#d8b4fe] bg-[#f5edff] px-2 py-0.5 text-[10px] font-bold text-[#7e22ce] uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#7e22ce]" />
                            MEASURED (SMART PLUG)
                          </span>
                        ) : app.dataSource.includes("MODEL") ? (
                          <span className="inline-flex items-center gap-1.5 border border-[#d5d0c8] bg-[#edeae2] px-2 py-0.5 text-[10px] font-bold text-[#4b5563] uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6b7280]" />
                            DATASET MODEL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 border border-[#e5e7eb] bg-[#f4f2ec] px-2 py-0.5 text-[10px] font-bold text-[#6b7280] uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />
                            ESTIMATED
                          </span>
                        )}
                      </td>

                      {/* 9. Status Badge */}
                      <td className="py-3 px-4">
                        {isHighDraw ? (
                          <span className="inline-flex items-center gap-1.5 border border-[#d8b4fe] bg-[#f5edff] px-2 py-0.5 text-[10px] font-bold text-[#7e22ce] uppercase">
                            <span className="h-2 w-0.5 bg-[#7e22ce]" />
                            {app.statusLabel || "28% ABOVE BASELINE"}
                          </span>
                        ) : isAnomaly ? (
                          <span className="inline-flex items-center gap-1.5 border border-[#fecaca] bg-[#fef2f2] px-2 py-0.5 text-[10px] font-bold text-[#b91c1c] uppercase">
                            <span className="h-2 w-0.5 bg-[#b91c1c]" />
                            {app.statusLabel || "UNUSUAL USAGE PATTERN"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#059669]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                            NORMAL
                          </span>
                        )}
                      </td>

                      {/* 10. Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAppliance(app.id, app.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-[#b91c1c] hover:text-[#7f1d1d] p-1 transition-opacity cursor-pointer"
                          title="Remove Appliance"
                          aria-label={`Remove ${app.name}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredAppliances.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[#888]">
                      No appliances match query &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER CALLOUT */}
          <div className="border-t border-[#dedbd4] bg-[#faf8f3] px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-start gap-2 text-[#666] max-w-3xl">
              <svg className="w-4 h-4 text-[#7939E8] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                <strong className="text-black">DATA INTEGRITY NOTE:</strong> Values marked &apos;MEASURED&apos; come from individual smart plugs or CT clamps. &apos;DATASET MODEL&apos; uses baseline signature models. &apos;ESTIMATED&apos; is calculated from rated wattage × daily hours at ₹{tariff.toFixed(2)}/kWh. All costs are estimates.
              </span>
            </div>

            <div className="shrink-0 font-bold text-black font-mono">
              Aggregated Total: <span className="text-[#7939E8]">~{totalDailyKwh} kWh</span> (~₹{dailyCost} / day Est.)
            </div>
          </div>
        </div>
      </main>

      {/* APPLIANCE DETAILS MODAL / DRAWER */}
      {selectedAppliance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg border border-[#dedbd4] bg-white p-6 shadow-2xl font-mono text-xs space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#eee] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-[#dedbd4] bg-[#faf8f3] shadow-sm">
                  <ApplianceIcon type={selectedAppliance.icon} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black">
                    {selectedAppliance.name}
                  </h3>
                  <span className="text-[#727782]">
                    {selectedAppliance.specification} • {selectedAppliance.roomLocation}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppliance(null)}
                className="text-[#666] hover:text-black p-1 text-base cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#e7e3da] bg-[#faf8f3] p-3">
                <span className="text-[10px] text-[#727782] block">RATED DRAW</span>
                <span className="text-lg font-bold text-black">
                  {selectedAppliance.wattage.toLocaleString()} W
                </span>
              </div>
              <div className="border border-[#e7e3da] bg-[#faf8f3] p-3">
                <span className="text-[10px] text-[#727782] block">DAILY DUTY CYCLE</span>
                <span className="text-lg font-bold text-black">
                  ~{selectedAppliance.hoursPerDay.toFixed(1)} hrs
                </span>
              </div>
              <div className="border border-[#e7e3da] bg-[#faf8f3] p-3">
                <span className="text-[10px] text-[#727782] block">DAILY ENERGY</span>
                <span className="text-lg font-bold text-[#7939E8]">
                  ~{selectedAppliance.dailyKwh.toFixed(1)} kWh
                </span>
              </div>
              <div className="border border-[#e7e3da] bg-[#faf8f3] p-3">
                <span className="text-[10px] text-[#727782] block">PROJECTED MONTHLY</span>
                <span className="text-lg font-bold text-black">
                  ~₹{(selectedAppliance.monthlyCostInr || Math.round(selectedAppliance.dailyKwh * 30 * tariff)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Telemetry Signature Diagnostics */}
            <div className="border border-[#dedbd4] p-3.5 space-y-2 bg-[#fdfcf9]">
              <div className="flex items-center justify-between text-[11px] font-bold text-black">
                <span>TELEMETRY LOAD SIGNATURE</span>
                <span className="text-[#7939E8]">{selectedAppliance.dataSource}</span>
              </div>

              {selectedAppliance.status === "possible_leak" ? (
                <div className="border-l-2 border-[#b91c1c] pl-2.5 py-1 text-[#991b1b] text-[11px] leading-relaxed">
                  ⚠️ <strong>ANOMALY OBSERVED IN DATASET:</strong> Continuous power draw recorded at 03:14 AM (2,000 W). Exceeded the typical 120-minute safety threshold.
                </div>
              ) : selectedAppliance.status === "high_draw" ? (
                <div className="border-l-2 border-[#7e22ce] pl-2.5 py-1 text-[#6b21a8] text-[11px] leading-relaxed">
                  ⚡ <strong>DRAW EXCEEDS BASELINE:</strong> High cooling demand resulting in 28% higher consumption than the 90-day typical baseline.
                </div>
              ) : (
                <div className="border-l-2 border-[#10b981] pl-2.5 py-1 text-[#065f46] text-[11px] leading-relaxed">
                  ● <strong>OPERATING NORMALLY:</strong> Current power profile conforms to expected residential signature on Mumbai TPC grid.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAppliance(null)}
                className="px-4 py-2 border border-[#d5d0c8] bg-white font-bold text-black hover:bg-[#f4f2ec] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD APPLIANCE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleAddApplianceSubmit}
            className="w-full max-w-lg border border-[#dedbd4] bg-white p-6 shadow-2xl font-mono text-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <h3 className="text-base font-bold text-black">
                Add Appliance to Telemetry Stream
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#666] hover:text-black p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Field: Name */}
            <div>
              <label className="block text-[11px] font-bold text-black mb-1">
                Appliance Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Induction Cooktop, Water Purifier"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
              />
            </div>

            {/* Field: Specification */}
            <div>
              <label className="block text-[11px] font-bold text-black mb-1">
                Specification / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. 2000W Auto-Off, Dual Inverter"
                value={addForm.specification}
                onChange={(e) => setAddForm({ ...addForm, specification: e.target.value })}
                className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
              />
            </div>

            {/* Grid: Room & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Room / Location
                </label>
                <select
                  value={addForm.roomLocation}
                  onChange={(e) => setAddForm({ ...addForm, roomLocation: e.target.value })}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Utility">Utility</option>
                  <option value="Study">Study</option>
                  <option value="All Rooms">All Rooms</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Category
                </label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                  <option value="Cooling">Cooling</option>
                  <option value="Heating">Heating</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Living">Living</option>
                </select>
              </div>
            </div>

            {/* Grid: Rated Power & Daily Usage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Rated Power (Watts) *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="10000"
                  value={addForm.wattage}
                  onChange={(e) => setAddForm({ ...addForm, wattage: Number(e.target.value) })}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                </input>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Daily Usage (Hours) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0.1"
                  max="24"
                  value={addForm.hoursPerDay}
                  onChange={(e) => setAddForm({ ...addForm, hoursPerDay: Number(e.target.value) })}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Grid: Data Source & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Data Source
                </label>
                <select
                  value={addForm.dataSource}
                  onChange={(e) => setAddForm({ ...addForm, dataSource: e.target.value })}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                  <option value="MEASURED (SMART PLUG)">MEASURED (SMART PLUG)</option>
                  <option value="DATASET MODEL">DATASET MODEL</option>
                  <option value="ESTIMATED">ESTIMATED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Status
                </label>
                <select
                  value={addForm.status}
                  onChange={(e) => {
                    const st = e.target.value;
                    setAddForm({
                      ...addForm,
                      status: st,
                      statusLabel: st === "high_draw" ? "28% ABOVE BASELINE" : st === "possible_leak" ? "UNUSUAL USAGE PATTERN" : "NORMAL",
                    });
                  }}
                  className="w-full border border-[#d5d0c8] bg-[#faf8f3] px-3 py-2 text-black focus:outline-none focus:border-black"
                >
                  <option value="normal">NORMAL</option>
                  <option value="high_draw">ABOVE BASELINE</option>
                  <option value="possible_leak">UNUSUAL PATTERN</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eee]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-[#d5d0c8] bg-white font-bold text-black hover:bg-[#f4f2ec] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAdd}
                className="px-5 py-2 bg-black hover:bg-[#222] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingAdd ? "Saving to Supabase..." : "Add to Inventory"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
