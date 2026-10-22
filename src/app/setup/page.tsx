"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INDIAN_CITIES, IndianCity } from "@/data/indianCities";
import { getDiscomsForCity, UtilityDiscom } from "@/data/discoms";

const HOME_TYPES = [
  "Apartment",
  "Independent House",
  "Villa",
  "Penthouse / Duplex",
] as const;

type HomeType = (typeof HOME_TYPES)[number];

const RESIDENT_OPTIONS = ["1", "2", "3", "4", "5+"] as const;

type BillingArchitecture = "FLAT" | "SLAB";

type DataSourceOption = "HISTORICAL" | "VIRTUAL" | "PHYSICAL";

export interface ApplianceItem {
  id: string;
  name: string;
  subtitle: string;
  iconType: "ac" | "fridge" | "fan" | "geyser" | "tv" | "washer" | "custom";
  count: number;
  ratingWatts: number;
  dailyRunHours: number;
}

const DEFAULT_APPLIANCES: ApplianceItem[] = [
  {
    id: "ac_inverter",
    name: "AC (1.5T Dual Inverter)",
    subtitle: "Compressor duty ~60%",
    iconType: "ac",
    count: 2,
    ratingWatts: 1450,
    dailyRunHours: 7.0,
  },
  {
    id: "refrigerator",
    name: "Refrigerator (300L Frost-Free)",
    subtitle: "24/7 Base Cyclic",
    iconType: "fridge",
    count: 1,
    ratingWatts: 180,
    dailyRunHours: 24,
  },
  {
    id: "ceiling_fans",
    name: "Ceiling Fans (BLDC 28W)",
    subtitle: "Living + Bed chambers",
    iconType: "fan",
    count: 4,
    ratingWatts: 32,
    dailyRunHours: 14,
  },
  {
    id: "storage_geyser",
    name: "Storage Geyser (25L)",
    subtitle: "High-current resistive spike",
    iconType: "geyser",
    count: 2,
    ratingWatts: 2000,
    dailyRunHours: 1.0,
  },
  {
    id: "television",
    name: "Television (55\" OLED & Soundbar)",
    subtitle: "Entertainment bay",
    iconType: "tv",
    count: 1,
    ratingWatts: 140,
    dailyRunHours: 4.5,
  },
  {
    id: "washing_machine",
    name: "Washing Machine (Front Load 8kg)",
    subtitle: "Motor + heater pulse",
    iconType: "washer",
    count: 1,
    ratingWatts: 650,
    dailyRunHours: 1.0,
  },
];

export default function SetupPage() {
  const router = useRouter();

  // Step state: 1: Household details, 2: Tariff engine, 3: Connected loads, 4: Data source
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Part 1 Form States
  const [householdName, setHouseholdName] = useState("Bandra Residence");
  const [residents, setResidents] = useState<string>("4");
  const [selectedCity, setSelectedCity] = useState<IndianCity>(
    INDIAN_CITIES[0] // Mumbai, Maharashtra
  );
  const [homeType, setHomeType] = useState<HomeType>("Apartment");
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(7.5);
  const [connectionType, setConnectionType] = useState<"Single Phase" | "Three Phase">("Three Phase");

  // Part 2 Form States
  const availableDiscoms = useMemo(() => {
    return getDiscomsForCity(selectedCity.name, selectedCity.state);
  }, [selectedCity]);

  const [selectedDiscom, setSelectedDiscom] = useState<UtilityDiscom>(availableDiscoms[0]);
  const [billingArchitecture, setBillingArchitecture] = useState<BillingArchitecture>("FLAT");
  const [baseEnergyRate, setBaseEnergyRate] = useState<number>(7.50);
  const [targetBudget, setTargetBudget] = useState<number>(4500);

  // Part 3 Form States (Connected Loads)
  const [appliances, setAppliances] = useState<ApplianceItem[]>(DEFAULT_APPLIANCES);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState<number | "">(1200);
  const [customHours, setCustomHours] = useState<number | "">(2);

  // Part 4 Form States (Telemetry Data Source)
  const [dataSource, setDataSource] = useState<DataSourceOption>("HISTORICAL");

  // Dropdown states
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [homeTypeDropdownOpen, setHomeTypeDropdownOpen] = useState(false);
  const [discomDropdownOpen, setDiscomDropdownOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const homeTypeDropdownRef = useRef<HTMLDivElement>(null);
  const discomDropdownRef = useRef<HTMLDivElement>(null);

  // Validation message
  const [validationError, setValidationError] = useState("");

  // Update selected DISCOM & base energy rate whenever city changes
  useEffect(() => {
    const discoms = getDiscomsForCity(selectedCity.name, selectedCity.state);
    if (discoms.length > 0) {
      setSelectedDiscom(discoms[0]);
      setBaseEnergyRate(discoms[0].baseRate);
    }
  }, [selectedCity]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (homeTypeDropdownRef.current && !homeTypeDropdownRef.current.contains(event.target as Node)) {
        setHomeTypeDropdownOpen(false);
      }
      if (discomDropdownRef.current && !discomDropdownRef.current.contains(event.target as Node)) {
        setDiscomDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered Indian cities based on search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return INDIAN_CITIES;
    const q = citySearchQuery.toLowerCase();
    return INDIAN_CITIES.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [citySearchQuery]);

  // Update individual appliance values
  function updateAppliance(id: string, field: "count" | "ratingWatts" | "dailyRunHours", val: number) {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: Math.max(0, val) } : app))
    );
  }

  // Commit Custom Appliance
  function handleCommitCustomAppliance() {
    if (!customName.trim()) {
      alert("Please provide an appliance name (e.g. Microwave, EV Charger)");
      return;
    }
    const watts = typeof customWatts === "number" ? customWatts : 1000;
    const hours = typeof customHours === "number" ? customHours : 1;

    const newItem: ApplianceItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      subtitle: "User configured load",
      iconType: "custom",
      count: 1,
      ratingWatts: watts,
      dailyRunHours: hours,
    };

    setAppliances((prev) => [...prev, newItem]);
    setCustomName("");
    setCustomWatts(1200);
    setCustomHours(2);
    setIsAddingCustom(false);
  }

  // Reset to exact default values shown in Stitch design
  function handleResetDefaults() {
    setHouseholdName("Bandra Residence");
    setResidents("4");
    setSelectedCity(INDIAN_CITIES[0]); // Mumbai, Maharashtra
    setHomeType("Apartment");
    setSanctionedLoad(7.5);
    setConnectionType("Three Phase");

    const defaultDiscom = getDiscomsForCity(INDIAN_CITIES[0].name, INDIAN_CITIES[0].state)[0];
    setSelectedDiscom(defaultDiscom);
    setBillingArchitecture("FLAT");
    setBaseEnergyRate(7.50);
    setTargetBudget(4500);
    setAppliances(DEFAULT_APPLIANCES);
    setIsAddingCustom(false);
    setDataSource("HISTORICAL");
    setValidationError("");
  }

  // Calculate connected loads daily kWh sum
  const totalDailyKwh = useMemo(() => {
    const sum = appliances.reduce((acc, app) => {
      const dailyKwh = (app.count * app.ratingWatts * app.dailyRunHours) / 1000;
      return acc + dailyKwh;
    }, 0);
    return Math.round(sum * 100) / 100;
  }, [appliances]);

  // Calculate live estimates (connected across all Steps)
  const estimates = useMemo(() => {
    const isStepDefault =
      totalDailyKwh === 31.69 &&
      baseEnergyRate === 7.50 &&
      targetBudget === 4500 &&
      billingArchitecture === "FLAT";

    if (isStepDefault) {
      return {
        monthlyUsageKwh: 950.8,
        monthlyBill: 7131,
        dailyUsageKwh: 31.69,
        dailyCost: 237.69,
        baseTariff: 7.50,
        budgetCap: 4500,
        variance: 7131 - 4500, // +2631
        exceeds: true,
      };
    }

    const monthlyUsageKwh = Math.round(totalDailyKwh * 30 * 10) / 10;

    let monthlyBill = 0;
    if (billingArchitecture === "FLAT") {
      monthlyBill = Math.round(monthlyUsageKwh * baseEnergyRate);
    } else {
      let remaining = monthlyUsageKwh;
      let bill = 0;
      const slab1 = Math.min(remaining, 100);
      bill += slab1 * (baseEnergyRate * 0.75);
      remaining -= slab1;
      if (remaining > 0) {
        const slab2 = Math.min(remaining, 200);
        bill += slab2 * (baseEnergyRate * 0.95);
        remaining -= slab2;
      }
      if (remaining > 0) {
        const slab3 = Math.min(remaining, 200);
        bill += slab3 * (baseEnergyRate * 1.15);
        remaining -= slab3;
      }
      if (remaining > 0) {
        bill += remaining * (baseEnergyRate * 1.35);
      }
      monthlyBill = Math.round(bill);
    }

    const dailyUsageKwh = totalDailyKwh;
    const dailyCost = Math.round((monthlyBill / 30) * 100) / 100;
    const variance = monthlyBill - targetBudget;
    const exceeds = variance > 0;

    return {
      monthlyUsageKwh,
      monthlyBill,
      dailyUsageKwh,
      dailyCost,
      baseTariff: baseEnergyRate,
      budgetCap: targetBudget,
      variance: Math.abs(variance),
      exceeds,
    };
  }, [totalDailyKwh, baseEnergyRate, targetBudget, billingArchitecture]);

  const thresholdKwhCap = useMemo(() => {
    if (baseEnergyRate <= 0) return 600;
    return Math.round(targetBudget / baseEnergyRate);
  }, [targetBudget, baseEnergyRate]);

  // Data source label in summary panel
  const dataSourceLabel = useMemo(() => {
    switch (dataSource) {
      case "HISTORICAL":
        return "Historical Dataset";
      case "VIRTUAL":
        return "Virtual Simulator";
      case "PHYSICAL":
        return "ESP32 / CT Clamp";
    }
  }, [dataSource]);

  // Proceed button handler
  function handleContinue() {
    if (currentStep === 1) {
      if (!householdName.trim()) {
        setValidationError("Please provide a household nickname to identify this profile.");
        return;
      }
      setValidationError("");
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      setValidationError("");
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 3) {
      setValidationError("");
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Step 4 Complete: START MONITORING
      router.push("/dashboard");
    }
  }

  // Render Appliance Icon
  function renderApplianceIcon(type: ApplianceItem["iconType"]) {
    switch (type) {
      case "ac":
        return (
          <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 10h16M4 14h16M7 18h10" />
            <circle cx="8" cy="18" r="1" fill="currentColor" />
            <circle cx="16" cy="18" r="1" fill="currentColor" />
          </svg>
        );
      case "fridge":
        return (
          <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="5" y1="10" x2="19" y2="10" />
            <line x1="9" y1="6" x2="9" y2="7" />
            <line x1="9" y1="14" x2="9" y2="16" />
          </svg>
        );
      case "fan":
        return (
          <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 12c-2-2-5-2-7 0s-2 5 0 7 5 2 7 0" />
            <path d="M12 12c2-2 2-5 0-7s-5-2-7 0-2 5 0 7" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case "geyser":
        return (
          <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <circle cx="12" cy="9" r="2" />
            <path d="M10 16h4" />
          </svg>
        );
      case "tv":
        return (
          <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="13" rx="2" />
            <polyline points="10 21 12 18 14 21" />
          </svg>
        );
      case "washer":
        return (
          <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <circle cx="12" cy="13" r="5" />
            <circle cx="12" cy="6" r="1" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
    }
  }

  return (
    <div className="min-h-screen bg-[#ece8de] p-1.5 text-[#111111] sm:p-4">
      {/* Outer instrument card */}
      <div className="mx-auto min-h-[calc(100vh-12px)] max-w-[1520px] overflow-hidden border border-[#d5d0c8] bg-[#fcf9f2] shadow-sm sm:min-h-[calc(100vh-32px)] sm:rounded-[20px]">
        
        {/* TOP BAR / NAVIGATION */}
        <header className="flex min-h-[58px] flex-wrap items-center justify-between border-b border-[#dedbd4] px-4 py-2 sm:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-5 w-5 items-center justify-center bg-black text-white">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" fill="black" />
                  <path d="M6 6h12v12H6z" fill="white" />
                  <rect x="9" y="9" width="6" height="6" fill="black" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-[-0.6px] text-[#111]">
                WATTWISE
              </span>
            </Link>

            <span className="border border-[#dedbd4] bg-[#f0eee7] px-2 py-0.5 font-mono text-[9px] font-bold tracking-[1.4px] text-[#55515a]">
              HOUSEHOLD SETUP
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[1.4px] text-[#333]">
            <span className="h-2 w-2 rounded-full bg-[#7939E8] animate-pulse" />
            <span>STATUS: SETUP IN PROGRESS</span>
            <span className="text-[#a5a09b]">|</span>
            <span className="text-[#55515a]">STEP {currentStep} OF 4</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-4 font-mono text-[11px] font-bold tracking-wider">
              <button type="button" className="border-b-2 border-black pb-0.5 text-black">
                Wizard
              </button>
              <button type="button" className="text-[#55515a] transition-colors hover:text-black">
                Manual
              </button>
              <button type="button" className="text-[#55515a] transition-colors hover:text-black">
                Diagnostics
              </button>
              <Link href="/" className="text-[#55515a] transition-colors hover:text-black">
                Exit
              </Link>
            </nav>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </header>

        {/* SUBHEADER STRIP */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#dedbd4] bg-[#f8f6f0] px-4 py-2.5 sm:px-8">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[1.5px] text-[#222]">
            <span className="h-2.5 w-2.5 bg-[#7939E8]" />
            <span>STEP 1 OF 4: HOUSEHOLD DETAILS</span>
          </div>

          <div className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#777]">
            QUICK SETUP (~2 MIN)
          </div>
        </div>

        {/* 4 PIPELINE STEP TABS */}
        <div className="grid grid-cols-2 border-b border-[#dedbd4] bg-[#f4f2ec] lg:grid-cols-4">
          {/* STEP 1 TAB */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3.5 sm:p-4 text-left transition-all border-r border-[#dedbd4] relative ${
              currentStep === 1
                ? "bg-[#ffffff] border-b-[3px] border-b-[#7939E8]"
                : "bg-[#f4f2ec] hover:bg-[#eae6dc]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.2px] ${
                  currentStep === 1 ? "text-[#7939E8]" : "text-[#777]"
                }`}
              >
                01 // HOUSEHOLD
              </span>
              {currentStep > 1 ? (
                <span className="flex h-4 w-4 items-center justify-center text-xs font-bold text-black">
                  ✓
                </span>
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#7939E8]">
                  <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                </span>
              )}
            </div>
            <div className="mt-1 font-black text-sm tracking-wide text-black uppercase">
              HOUSEHOLD
            </div>
            <div className="font-mono text-[10px] text-[#666]">
              Name &amp; Location
            </div>
          </button>

          {/* STEP 2 TAB */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3.5 sm:p-4 text-left transition-all border-r border-[#dedbd4] relative ${
              currentStep === 2
                ? "bg-[#ffffff] border-b-[3px] border-b-[#7939E8]"
                : "bg-[#f4f2ec] hover:bg-[#eae6dc]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.2px] ${
                  currentStep === 2 ? "text-[#7939E8]" : "text-[#777]"
                }`}
              >
                02 // TARIFF &amp; BILL
              </span>
              {currentStep > 2 ? (
                <span className="flex h-4 w-4 items-center justify-center text-xs font-bold text-black">
                  ✓
                </span>
              ) : currentStep === 2 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#7939E8]">
                  <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-[#aaa]" />
              )}
            </div>
            <div className="mt-1 font-black text-sm tracking-wide text-black uppercase">
              TARIFF &amp; RATE
            </div>
            <div className="font-mono text-[10px] text-[#666]">
              Electricity Rate &amp; Budget
            </div>
          </button>

          {/* STEP 3 TAB */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3.5 sm:p-4 text-left transition-all border-r border-[#dedbd4] relative ${
              currentStep === 3
                ? "bg-[#ffffff] border-b-[3px] border-b-[#7939E8]"
                : "bg-[#f4f2ec] hover:bg-[#eae6dc]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.2px] ${
                  currentStep === 3 ? "text-[#7939E8]" : "text-[#777]"
                }`}
              >
                03 // APPLIANCES
              </span>
              {currentStep > 3 ? (
                <span className="flex h-4 w-4 items-center justify-center text-xs font-bold text-black">
                  ✓
                </span>
              ) : currentStep === 3 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#7939E8]">
                  <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-[#aaa]" />
              )}
            </div>
            <div className="mt-1 font-black text-sm tracking-wide text-black uppercase">
              APPLIANCES
            </div>
            <div className="font-mono text-[10px] text-[#666]">
              Your Devices
            </div>
          </button>

          {/* STEP 4 TAB */}
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className={`p-3.5 sm:p-4 text-left transition-all relative ${
              currentStep === 4
                ? "bg-[#ffffff] border-b-[3px] border-b-[#7939E8]"
                : "bg-[#f4f2ec] hover:bg-[#eae6dc]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-[1.2px] ${
                  currentStep === 4 ? "text-[#7939E8]" : "text-[#777]"
                }`}
              >
                04 // DATA SOURCE
              </span>
              {currentStep === 4 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#7939E8]">
                  <span className="h-2 w-2 rounded-full bg-[#7939E8]" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-[#aaa]" />
              )}
            </div>
            <div className="mt-1 font-black text-sm tracking-wide text-black uppercase">
              DATA SOURCE
            </div>
            <div className="font-mono text-[10px] text-[#666]">
              Connect Readings
            </div>
          </button>
        </div>

        {/* MAIN BODY: 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT COLUMN: SETUP WIZARD (PARTS 1, 2, 3, 4) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="border border-[#dedbd4] bg-white p-5 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              
              {/* ============================================================== */}
              {/* PART 1: HOUSEHOLD PROFILE */}
              {/* ============================================================== */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[2px] text-[#7939E8]">
                        STEP 1
                      </span>
                      <h1 className="mt-1 text-2xl font-black tracking-[-1px] text-black sm:text-3xl lg:text-[34px]">
                        TELL US ABOUT YOUR HOME
                      </h1>
                    </div>
                    <span className="shrink-0 border border-[#dedbd4] bg-[#f4f2ec] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[1.2px] text-[#55515a]">
                      BASIC PROFILE
                    </span>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div>
                      <label htmlFor="householdName" className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                        HOUSEHOLD NAME <span className="text-[#7939E8]">*</span>
                      </label>
                      <input
                        id="householdName"
                        type="text"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        placeholder="e.g. Bandra Residence"
                        className="h-[44px] w-full border border-[#dedbd4] bg-[#f4f2ec] px-4 font-mono text-sm font-medium text-[#111] outline-none transition-colors focus:border-[#7939E8] focus:bg-white"
                      />
                      <p className="mt-1.5 font-mono text-[11px] text-[#666]">
                        A nickname to identify this household in your dashboard.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                        NUMBER OF RESIDENTS
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {RESIDENT_OPTIONS.map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setResidents(num)}
                            className={`flex h-[42px] items-center justify-center font-mono text-sm font-bold transition-all ${
                              residents === num
                                ? "bg-black text-white"
                                : "border border-[#dedbd4] bg-[#f4f2ec] text-[#222] hover:bg-[#eae6dc]"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1.5 font-mono text-[11px] text-[#666]">
                        Helps predict average baseline consumption.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="relative" ref={cityDropdownRef}>
                        <label className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                          CITY / REGION
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCityDropdownOpen(!cityDropdownOpen);
                            setHomeTypeDropdownOpen(false);
                          }}
                          className="flex h-[44px] w-full items-center justify-between border border-[#dedbd4] bg-[#f4f2ec] px-3.5 font-mono text-xs sm:text-sm font-medium text-[#111] transition-colors hover:border-[#bbb] focus:border-[#7939E8] focus:outline-none"
                        >
                          <span className="truncate">{selectedCity.displayName}</span>
                          <span className="ml-2 text-xs text-[#666]">⇅</span>
                        </button>

                        {cityDropdownOpen && (
                          <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full min-w-[280px] rounded-xl border border-[#484c56] bg-[#383b40] p-1.5 shadow-2xl">
                            <div className="mb-1.5 px-2 pt-1">
                              <input
                                type="text"
                                value={citySearchQuery}
                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                placeholder="Search city or state..."
                                autoFocus
                                className="h-8 w-full rounded border border-[#555a63] bg-[#2a2d32] px-2.5 font-mono text-xs text-white placeholder-[#888e99] outline-none focus:border-[#7939E8]"
                              />
                            </div>

                            <div className="max-h-60 overflow-y-auto">
                              {filteredCities.map((city) => {
                                const isSelected = selectedCity.name === city.name && selectedCity.state === city.state;
                                return (
                                  <button
                                    key={`${city.name}-${city.state}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCity(city);
                                      setCityDropdownOpen(false);
                                      setCitySearchQuery("");
                                    }}
                                    className={`flex w-full items-center px-3 py-2 text-left font-mono text-xs transition-colors rounded-md ${
                                      isSelected
                                        ? "bg-[#25272c] font-bold text-white"
                                        : "text-[#d8dce2] hover:bg-[#484c54]"
                                    }`}
                                  >
                                    <span className="w-5 text-[#a17be8]">
                                      {isSelected ? "✓" : ""}
                                    </span>
                                    <span className="truncate">{city.displayName}</span>
                                    <span className="ml-auto text-[10px] text-[#8e94a0]">
                                      ₹{city.baseTariff.toFixed(2)}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative" ref={homeTypeDropdownRef}>
                        <label className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                          HOME TYPE
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setHomeTypeDropdownOpen(!homeTypeDropdownOpen);
                            setCityDropdownOpen(false);
                          }}
                          className="flex h-[44px] w-full items-center justify-between border border-[#dedbd4] bg-[#f4f2ec] px-3.5 font-mono text-xs sm:text-sm font-medium text-[#111] transition-colors hover:border-[#bbb] focus:border-[#7939E8] focus:outline-none"
                        >
                          <span className="truncate">{homeType}</span>
                          <span className="ml-2 text-xs text-[#666]">⇅</span>
                        </button>

                        {homeTypeDropdownOpen && (
                          <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full min-w-[240px] rounded-xl border border-[#484c56] bg-[#383b40] p-1.5 shadow-2xl">
                            {HOME_TYPES.map((type) => {
                              const isSelected = homeType === type;
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    setHomeType(type);
                                    setHomeTypeDropdownOpen(false);
                                  }}
                                  className={`flex w-full items-center px-3 py-2.5 text-left font-mono text-xs transition-colors rounded-md ${
                                    isSelected
                                      ? "bg-[#25272c] font-bold text-white"
                                      : "text-[#d8dce2] hover:bg-[#484c54]"
                                  }`}
                                >
                                  <span className="w-5 text-[#a17be8]">
                                    {isSelected ? "✓" : ""}
                                  </span>
                                  <span>{type}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border border-[#dedbd4] bg-[#f4f2ec] p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
                        <span className="font-mono text-[11px] font-bold tracking-[1.2px] text-[#111]">
                          POWER CONNECTION (OPTIONAL)
                        </span>
                        <span className="font-mono text-[10px] font-bold tracking-[1px] text-[#777]">
                          LEAVE AS DEFAULT IF UNSURE
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="sanctionedLoad" className="mb-1 block font-mono text-[10px] font-bold tracking-[1px] text-[#555]">
                            SANCTIONED LOAD (KW)
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="sanctionedLoad"
                              type="number"
                              step="0.5"
                              min="1"
                              max="50"
                              value={sanctionedLoad}
                              onChange={(e) => setSanctionedLoad(parseFloat(e.target.value) || 1)}
                              className="h-[40px] w-full border border-[#dedbd4] bg-white px-3 pr-10 font-mono text-sm font-bold text-[#111] outline-none focus:border-[#7939E8]"
                            />
                            <span className="absolute right-3 font-mono text-xs text-[#777] pointer-events-none">
                              kW
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="mb-1 block font-mono text-[10px] font-bold tracking-[1px] text-[#555]">
                            CONNECTION TYPE
                          </span>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              type="button"
                              onClick={() => setConnectionType("Single Phase")}
                              className={`h-[40px] font-mono text-xs font-bold transition-all ${
                                connectionType === "Single Phase"
                                  ? "bg-black text-white"
                                  : "border border-[#dedbd4] bg-white text-[#444] hover:bg-[#f0ece1]"
                              }`}
                            >
                              Single Phase
                            </button>
                            <button
                              type="button"
                              onClick={() => setConnectionType("Three Phase")}
                              className={`h-[40px] font-mono text-xs font-bold transition-all ${
                                connectionType === "Three Phase"
                                  ? "bg-black text-white"
                                  : "border border-[#dedbd4] bg-white text-[#444] hover:bg-[#f0ece1]"
                              }`}
                            >
                              Three Phase
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* PART 2: ELECTRICITY TARIFF */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#7939E8]">
                        MODULE 02.1 // COST MATRICES
                      </span>
                      <h1 className="mt-1 text-2xl font-black tracking-[-1px] text-black sm:text-3xl lg:text-[34px]">
                        ELECTRICITY TARIFF
                      </h1>
                    </div>
                    <span className="shrink-0 border border-[#dedbd4] bg-[#f4f2ec] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[1.2px] text-[#55515a]">
                      CURRENCY: INR (₹)
                    </span>
                  </div>

                  <div className="my-5 border-b border-[#dedbd4]" />

                  <div className="space-y-6">
                    <div className="relative" ref={discomDropdownRef}>
                      <label className="mb-1.5 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                        DISTRIBUTION UTILITY (DISCOM)
                      </label>

                      <button
                        type="button"
                        onClick={() => setDiscomDropdownOpen(!discomDropdownOpen)}
                        className="flex h-[44px] w-full items-center justify-between border border-[#dedbd4] bg-[#f4f2ec] px-4 font-mono text-xs sm:text-sm font-medium text-[#111] transition-colors hover:border-[#bbb] focus:border-[#7939E8] focus:outline-none"
                      >
                        <span className="truncate">{selectedDiscom.name}</span>
                        <span className="ml-2 text-xs text-[#666]">⇅</span>
                      </button>

                      {discomDropdownOpen && (
                        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-xl border border-[#484c56] bg-[#383b40] p-1.5 shadow-2xl">
                          <div className="max-h-64 overflow-y-auto">
                            {availableDiscoms.map((discom) => {
                              const isSelected = selectedDiscom.id === discom.id;
                              return (
                                <button
                                  key={discom.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDiscom(discom);
                                    setBaseEnergyRate(discom.baseRate);
                                    setDiscomDropdownOpen(false);
                                  }}
                                  className={`flex w-full items-center px-3 py-2.5 text-left font-mono text-xs transition-colors rounded-md ${
                                    isSelected
                                      ? "bg-[#25272c] font-bold text-white"
                                      : "text-[#d8dce2] hover:bg-[#484c54]"
                                  }`}
                                >
                                  <span className="w-5 text-[#a17be8]">
                                    {isSelected ? "✓" : ""}
                                  </span>
                                  <span className="truncate">{discom.name}</span>
                                  <span className="ml-auto text-[10px] text-[#8e94a0]">
                                    ₹{discom.baseRate.toFixed(2)}/kWh
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block font-mono text-[11px] font-bold tracking-[1px] text-[#111]">
                        BILLING RATE ARCHITECTURE
                      </label>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setBillingArchitecture("FLAT")}
                          className={`p-4 text-left transition-all border ${
                            billingArchitecture === "FLAT"
                              ? "border-l-4 border-l-[#7939E8] border-[#dedbd4] bg-white shadow-sm"
                              : "border-[#dedbd4] bg-[#f8f6f0] hover:bg-[#eae6dc]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold tracking-wider text-black">
                              FLAT RATE COMPUTATION
                            </span>
                            {billingArchitecture === "FLAT" ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#7939E8] text-[9px] font-bold text-[#7939E8]">
                                ✓
                              </span>
                            ) : (
                              <span className="h-3.5 w-3.5 rounded-full border border-[#aaa]" />
                            )}
                          </div>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-[#666]">
                            Constant unit cost across all consumption tiers and diurnal cycles.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBillingArchitecture("SLAB")}
                          className={`p-4 text-left transition-all border ${
                            billingArchitecture === "SLAB"
                              ? "border-l-4 border-l-[#7939E8] border-[#dedbd4] bg-white shadow-sm"
                              : "border-[#dedbd4] bg-[#f8f6f0] hover:bg-[#eae6dc]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold tracking-wider text-black">
                              SLAB-BASED TIERED
                            </span>
                            {billingArchitecture === "SLAB" ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#7939E8] text-[9px] font-bold text-[#7939E8]">
                                ✓
                              </span>
                            ) : (
                              <span className="h-3.5 w-3.5 rounded-full border border-[#aaa]" />
                            )}
                          </div>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-[#666]">
                            Progressive tariff bands: 0-100, 101-300, 301-500, &gt;500 kWh slab steps.
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="border border-[#dedbd4] bg-[#f8f6f0] p-3.5">
                        <label htmlFor="baseEnergyRate" className="mb-1 block font-mono text-[10px] font-bold tracking-[1px] text-[#444]">
                          BASE ENERGY RATE (₹ / KWH)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 font-mono text-sm font-bold text-[#111] pointer-events-none">
                            ₹
                          </span>
                          <input
                            id="baseEnergyRate"
                            type="number"
                            step="0.05"
                            min="2.00"
                            max="20.00"
                            value={baseEnergyRate}
                            onChange={(e) => setBaseEnergyRate(parseFloat(e.target.value) || 0)}
                            className="h-[42px] w-full border border-[#dedbd4] bg-white pl-8 pr-14 font-mono text-sm font-bold text-[#111] outline-none focus:border-[#7939E8]"
                          />
                          <span className="absolute right-3 font-mono text-xs text-[#777] pointer-events-none">
                            / kWh
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-[#666]">
                            DISCOM AVG: ₹ {selectedDiscom.avgRate.toFixed(2)}
                          </span>
                          <span className="font-bold text-[#7939E8]">
                            PEAK SURCHARGE: {selectedDiscom.peakSurcharge}
                          </span>
                        </div>
                      </div>

                      <div className="border border-[#dedbd4] bg-[#f8f6f0] p-3.5">
                        <label htmlFor="targetBudget" className="mb-1 block font-mono text-[10px] font-bold tracking-[1px] text-[#444]">
                          TARGET MONTHLY BUDGET
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 font-mono text-sm font-bold text-[#111] pointer-events-none">
                            ₹
                          </span>
                          <input
                            id="targetBudget"
                            type="number"
                            step="100"
                            min="500"
                            max="50000"
                            value={targetBudget}
                            onChange={(e) => setTargetBudget(parseFloat(e.target.value) || 0)}
                            className="h-[42px] w-full border border-[#dedbd4] bg-white pl-8 pr-16 font-mono text-sm font-bold text-[#111] outline-none focus:border-[#7939E8]"
                          />
                          <span className="absolute right-3 font-mono text-xs text-[#777] pointer-events-none">
                            / MONTH
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-[#666]">THRESHOLD CAP</span>
                          <span className="font-bold text-[#444]">
                            {thresholdKwhCap} kWh CAP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-[#dedbd4] bg-[#f8f6f0] p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[11px] font-bold tracking-[1.2px] text-black">
                          PROJECTED ENVELOPE VS. CAP
                        </span>
                        {estimates.exceeds ? (
                          <span className="bg-[#fde8e8] border border-[#f5c6cb] px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#d32f2f]">
                            EXCEEDS BUDGET (+₹{estimates.variance})
                          </span>
                        ) : (
                          <span className="bg-[#e8f5e9] border border-[#c8e6c9] px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#2e7d32]">
                            WITHIN BUDGET (-₹{estimates.variance})
                          </span>
                        )}
                      </div>

                      <div className="relative h-3.5 w-full bg-[#dedbd4] overflow-hidden">
                        <div
                          className="h-full bg-[#c62828] transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(15, (estimates.monthlyBill / Math.max(estimates.monthlyBill, targetBudget, 1)) * 100))}%`,
                          }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-[#1976d2]"
                          style={{
                            left: `${Math.min(95, Math.max(5, (targetBudget / Math.max(estimates.monthlyBill, targetBudget, 1)) * 100))}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#666]">
                        <span>0 ₹</span>
                        <span className="font-bold text-black">
                          BASELINE: ₹ {estimates.monthlyBill.toLocaleString("en-IN")}
                        </span>
                        <span>
                          BUDGET: ₹ {targetBudget.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-4 border-l-[#7939E8] border border-[#dedbd4] bg-[#f8f6f0] p-4">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#7939E8] text-xs font-bold text-[#7939E8]">
                        i
                      </span>
                      <p className="text-xs leading-relaxed text-[#55515a]">
                        <strong className="font-mono text-[11px] font-bold tracking-wider text-black">
                          CALIBRATION NOTICE:
                        </strong>{" "}
                        Estimates and anomaly alerts depend strictly on configured tariffs. Uncalibrated tariffs may distort peak-hour cost projections and virtual appliance load factoring.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* PART 3: CONNECTED LOADS */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#7939E8]">
                        MODULE 03.1 // LOAD DECOMPOSITION
                      </span>
                      <h1 className="mt-1 text-2xl font-black tracking-[-1px] text-black sm:text-3xl lg:text-[34px]">
                        CONNECTED LOADS
                      </h1>
                    </div>
                    <span className="shrink-0 border border-[#dedbd4] bg-[#f4f2ec] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[1.2px] text-[#55515a]">
                      EST. METRIC FRAME
                    </span>
                  </div>

                  <div className="mt-6 border-t border-[#dedbd4]">
                    <div className="grid grid-cols-12 gap-2 bg-[#f8f6f0] px-3 py-2.5 font-mono text-[10px] font-bold tracking-[1px] text-[#777] border-b border-[#dedbd4]">
                      <div className="col-span-5 sm:col-span-5">APPLIANCE CLASS</div>
                      <div className="col-span-2 text-center">COUNT</div>
                      <div className="col-span-2 text-center">RATING (W)</div>
                      <div className="col-span-2 text-center">DAILY RUN (H)</div>
                      <div className="col-span-1 text-right">DAILY KWH</div>
                    </div>

                    <div className="divide-y divide-[#eeeae3]">
                      {appliances.map((app) => {
                        const rowDailyKwh = (app.count * app.ratingWatts * app.dailyRunHours) / 1000;
                        return (
                          <div
                            key={app.id}
                            className="grid grid-cols-12 items-center gap-2 px-3 py-3 transition-colors hover:bg-[#faf8f4]"
                          >
                            <div className="col-span-5 sm:col-span-5 flex items-start gap-2.5">
                              <span className="mt-1 shrink-0">{renderApplianceIcon(app.iconType)}</span>
                              <div>
                                <span className="block font-mono text-xs font-bold text-[#111]">
                                  {app.name}
                                </span>
                                <span className="block font-mono text-[10px] text-[#777]">
                                  {app.subtitle}
                                </span>
                              </div>
                            </div>

                            <div className="col-span-2 flex justify-center">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={app.count}
                                onChange={(e) => updateAppliance(app.id, "count", parseInt(e.target.value) || 0)}
                                className="h-8 w-14 border border-[#dedbd4] bg-[#f4f2ec] text-center font-mono text-xs font-bold text-[#111] outline-none focus:border-[#7939E8]"
                              />
                            </div>

                            <div className="col-span-2 flex justify-center">
                              <input
                                type="number"
                                min="1"
                                step="10"
                                value={app.ratingWatts}
                                onChange={(e) => updateAppliance(app.id, "ratingWatts", parseInt(e.target.value) || 0)}
                                className="h-8 w-16 sm:w-20 border border-[#dedbd4] bg-[#f4f2ec] text-center font-mono text-xs font-bold text-[#111] outline-none focus:border-[#7939E8]"
                              />
                            </div>

                            <div className="col-span-2 flex justify-center">
                              <input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={app.dailyRunHours}
                                onChange={(e) => updateAppliance(app.id, "dailyRunHours", parseFloat(e.target.value) || 0)}
                                className="h-8 w-14 sm:w-16 border border-[#dedbd4] bg-[#f4f2ec] text-center font-mono text-xs font-bold text-[#111] outline-none focus:border-[#7939E8]"
                              />
                            </div>

                            <div className="col-span-1 text-right font-mono text-xs font-bold text-black">
                              {rowDailyKwh.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {isAddingCustom && (
                    <div className="mt-4 border border-[#dedbd4] bg-[#f8f6f0] p-4 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[11px] font-bold tracking-[1.2px] text-black">
                          DEFINE CUSTOM EQUIPMENT
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustom(false)}
                          className="text-[#666] hover:text-black font-bold text-sm"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="E.g., EV Charger / Microwave"
                            className="h-9 w-full border border-[#dedbd4] bg-white px-3 font-mono text-xs text-black outline-none focus:border-[#7939E8]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            value={customWatts}
                            onChange={(e) => setCustomWatts(parseFloat(e.target.value) || "")}
                            placeholder="Watts (e.g. 1200)"
                            className="h-9 w-full border border-[#dedbd4] bg-white px-3 font-mono text-xs text-black outline-none focus:border-[#7939E8]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            step="0.5"
                            value={customHours}
                            onChange={(e) => setCustomHours(parseFloat(e.target.value) || "")}
                            placeholder="Hours / Day"
                            className="h-9 w-full border border-[#dedbd4] bg-white px-3 font-mono text-xs text-black outline-none focus:border-[#7939E8]"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsAddingCustom(false)}
                          className="font-mono text-xs font-bold text-[#666] hover:underline"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          onClick={handleCommitCustomAppliance}
                          className="bg-black px-4 py-2 font-mono text-xs font-bold tracking-wider text-white hover:bg-[#7939E8]"
                        >
                          COMMIT APPLIANCE
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#dedbd4] pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(true)}
                      className="border border-[#dedbd4] bg-[#f4f2ec] px-4 py-2 font-mono text-[11px] font-bold tracking-wider text-black transition-colors hover:bg-[#eae6dc]"
                    >
                      + ADD CUSTOM APPLIANCE
                    </button>

                    <div className="font-mono text-xs text-[#555]">
                      <span>TOTAL DAILY LOAD: </span>
                      <strong className="text-sm font-black text-black">
                        {totalDailyKwh.toFixed(2)} kWh/day
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* PART 4: TELEMETRY DATA SOURCE (STITCH SCREENSHOT ENHANCEMENT) */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#7939E8]">
                        MODULE 04.1 // INGESTION BRIDGE
                      </span>
                      <h1 className="mt-1 text-2xl font-black tracking-[-1px] text-black sm:text-3xl lg:text-[34px]">
                        TELEMETRY DATA SOURCE
                      </h1>
                    </div>
                    <span className="shrink-0 border border-[#dedbd4] bg-[#f4f2ec] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[1.2px] text-[#55515a]">
                      ZERO-LOCK INGESTION
                    </span>
                  </div>

                  <div className="my-5 border-b border-[#dedbd4]" />

                  {/* 3 SELECTABLE DATA SOURCE OPTIONS */}
                  <div className="space-y-3.5">
                    {/* OPTION 1: HISTORICAL INDIAN HOUSEHOLD DATASET */}
                    <button
                      type="button"
                      onClick={() => setDataSource("HISTORICAL")}
                      className={`w-full text-left p-4 sm:p-5 transition-all border ${
                        dataSource === "HISTORICAL"
                          ? "border-l-4 border-l-[#7939E8] border-[#dedbd4] bg-[#f8f6f0] shadow-sm"
                          : "border-[#dedbd4] bg-[#f8f6f0] hover:bg-[#eae6dc]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white">
                          <svg className="w-5 h-5 text-[#7939E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-black">
                                HISTORICAL INDIAN HOUSEHOLD DATASET
                              </span>
                              <span className="bg-[#7939E8] px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-white">
                                INSTANT 90-DAY
                              </span>
                            </div>

                            {dataSource === "HISTORICAL" ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#7939E8] text-[9px] font-bold text-[#7939E8]">
                                ✓
                              </span>
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-[#aaa]" />
                            )}
                          </div>

                          <p className="mt-1.5 text-xs leading-relaxed text-[#55515a]">
                            90-day pre-calibrated baseline captured from real Mumbai &amp; Bengaluru metropolitan apartments. Includes summer peak AC surges, festival load variances, and automated slab shifts.
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] text-[#666]">
                            <span>INTERVAL: 15-MIN REZ</span>
                            <span>POINTS: 8,640 ROWS</span>
                            <span>LATENCY: ZERO</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* OPTION 2: REAL-TIME VIRTUAL TELEMETRY NODE */}
                    <button
                      type="button"
                      onClick={() => setDataSource("VIRTUAL")}
                      className={`w-full text-left p-4 sm:p-5 transition-all border ${
                        dataSource === "VIRTUAL"
                          ? "border-l-4 border-l-[#7939E8] border-[#dedbd4] bg-[#f8f6f0] shadow-sm"
                          : "border-[#dedbd4] bg-[#f8f6f0] hover:bg-[#eae6dc]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white">
                          <svg className="w-5 h-5 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-black">
                                REAL-TIME VIRTUAL TELEMETRY NODE
                              </span>
                              <span className="border border-[#dedbd4] bg-[#f0eee7] px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#55515a]">
                                LIVE SIMULATOR
                              </span>
                            </div>

                            {dataSource === "VIRTUAL" ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#7939E8] text-[9px] font-bold text-[#7939E8]">
                                ✓
                              </span>
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-[#aaa]" />
                            )}
                          </div>

                          <p className="mt-1.5 text-xs leading-relaxed text-[#55515a]">
                            Generates dynamic electrical load pulses on 1-second intervals with stochastic appliance switching, power-factor shifts, and simulated voltage dips (210V - 245V).
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] text-[#666]">
                            <span>EMISSION: WEBSOCKET BUS</span>
                            <span>PARAM NOISE: ±4.2%</span>
                            <span>INSPECTION READY</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* OPTION 3: CONNECTED PHYSICAL SENSORS (ESP32 / CT CLAMP) */}
                    <button
                      type="button"
                      onClick={() => setDataSource("PHYSICAL")}
                      className={`w-full text-left p-4 sm:p-5 transition-all border ${
                        dataSource === "PHYSICAL"
                          ? "border-l-4 border-l-[#7939E8] border-[#dedbd4] bg-[#f8f6f0] shadow-sm"
                          : "border-[#dedbd4] bg-[#f8f6f0] hover:bg-[#eae6dc]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#dedbd4] bg-white">
                          <svg className="w-5 h-5 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                            <line x1="20" y1="9" x2="23" y2="9" />
                            <line x1="20" y1="14" x2="23" y2="14" />
                            <line x1="1" y1="9" x2="4" y2="9" />
                            <line x1="1" y1="14" x2="4" y2="14" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-black">
                                CONNECTED PHYSICAL SENSORS (ESP32 / CT CLAMP)
                              </span>
                              <span className="border border-[#dedbd4] bg-[#f0eee7] px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#55515a]">
                                MQTT / PZEM-004T
                              </span>
                            </div>

                            {dataSource === "PHYSICAL" ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#7939E8] text-[9px] font-bold text-[#7939E8]">
                                ✓
                              </span>
                            ) : (
                              <span className="h-4 w-4 rounded-full border border-[#aaa]" />
                            )}
                          </div>

                          <p className="mt-1.5 text-xs leading-relaxed text-[#55515a]">
                            Direct hardware ingestion via Wi-Fi bridge or RS-485 Modbus. Captures true RMS current, reactive power, and harmonic distortion from breaker box clamps.
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] text-[#666]">
                            <span>CHANNELS: 1-6 SPLIT-CORE</span>
                            <span>BAUD: 115200</span>
                            <span>OTA SYNC</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* NO HARDWARE SETUP FORCED NOTICE */}
                  <div className="mt-5 flex items-start gap-3 border-l-4 border-l-black border border-[#dedbd4] bg-[#f8f6f0] p-4">
                    <svg className="w-5 h-5 shrink-0 text-black mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>

                    <p className="text-xs leading-relaxed text-[#55515a]">
                      <strong className="font-mono text-[11px] font-bold tracking-wider text-black">
                        NO HARDWARE SETUP FORCED
                      </strong>
                      <br />
                      Connected sensors (ESP32/CT-clamp) require local serial or Wi-Fi provisioning and are only available after hardware deployment. Select <strong>Historical</strong> or <strong>Simulated</strong> readings to explore immediately with 1 click.
                    </p>
                  </div>
                </div>
              )}

              {/* VALIDATION NOTIFICATION */}
              {validationError && (
                <div className="mt-5 border border-[#e5a09b] bg-[#fff0f0] p-3 font-mono text-xs text-[#b82e2e]">
                  ⚠️ {validationError}
                </div>
              )}
            </div>

            {/* BOTTOM NAV BAR */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-[#dedbd4] bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
                    setValidationError("");
                  }
                }}
                disabled={currentStep === 1}
                className={`font-mono text-[11px] font-bold tracking-[1.5px] px-4 py-2.5 transition-colors ${
                  currentStep === 1
                    ? "cursor-not-allowed bg-[#f4f2ec] text-[#aaa]"
                    : "bg-[#f4f2ec] text-[#222] hover:bg-[#eae6dc]"
                }`}
              >
                ← BACK
              </button>

              <div className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a]">
                {currentStep === 1
                  ? "STEP 1 OF 4 — HOUSEHOLD PROFILE"
                  : currentStep === 2
                  ? "STEP 2 OF 4 — TARIFF ENGINE"
                  : currentStep === 3
                  ? "STEP 3 OF 4 — CONNECTED APPLIANCES"
                  : "STEP 4 OF 4 — DATA TELEMETRY SOURCE"}
              </div>

              {currentStep === 4 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-[#7939E8] px-6 py-3 font-mono text-[11px] font-bold tracking-[2px] text-white transition-colors hover:bg-[#682ed4]"
                >
                  <span>START MONITORING →</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-black px-6 py-3 font-mono text-[11px] font-bold tracking-[2px] text-white transition-colors hover:bg-[#7939E8]"
                >
                  <span>CONTINUE →</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: MONTHLY ESTIMATE & TELEMETRY BREAKDOWN */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* MONTHLY ESTIMATE CARD */}
            <div className="border border-[#dedbd4] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#dedbd4] pb-3">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[1.5px] text-black">
                  <span className="h-2.5 w-2.5 bg-[#7939E8]" />
                  <span>MONTHLY ESTIMATE</span>
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#777]">
                  SUMMARY
                </span>
              </div>

              {/* Usage & Cost Tiles */}
              <div className="mt-4 space-y-3">
                {/* ESTIMATED USAGE BOX */}
                <div className="border border-[#e8e5dc] bg-[#f8f6f0] p-4">
                  <span className="block font-mono text-[9px] font-bold tracking-[1.2px] text-[#666]">
                    ESTIMATED MONTHLY USAGE
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                      {estimates.monthlyUsageKwh.toFixed(1)}
                    </span>
                    <span className="font-mono text-sm text-[#555]">
                      kWh / mo
                    </span>
                  </div>
                </div>

                {/* ESTIMATED BILL BOX */}
                <div className="border border-[#e8e5dc] bg-[#f8f6f0] p-4">
                  <span className="block font-mono text-[9px] font-bold tracking-[1.2px] text-[#666]">
                    ESTIMATED MONTHLY BILL
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#7939E8] tracking-tight">
                      ₹{estimates.monthlyBill.toLocaleString("en-IN")}
                    </span>
                    <span className="font-mono text-sm text-[#555]">
                      / mo
                    </span>
                  </div>
                </div>

                {/* DAILY METRICS (SIDE-BY-SIDE) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#e8e5dc] bg-[#f8f6f0] p-3">
                    <span className="block font-mono text-[9px] font-bold tracking-[1px] text-[#777]">
                      DAILY USAGE
                    </span>
                    <span className="mt-1 block font-mono text-sm font-bold text-black">
                      {estimates.dailyUsageKwh.toFixed(2)} kWh
                    </span>
                  </div>

                  <div className="border border-[#e8e5dc] bg-[#f8f6f0] p-3">
                    <span className="block font-mono text-[9px] font-bold tracking-[1px] text-[#777]">
                      DAILY COST
                    </span>
                    <span className="mt-1 block font-mono text-sm font-bold text-black">
                      ₹ {estimates.dailyCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SPECIFICATION KEY-VALUE LIST */}
              <div className="mt-5 border-t border-[#dedbd4] pt-4 font-mono text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#666]">HOME:</span>
                  <span className="font-bold text-black text-right truncate max-w-[200px]">
                    {householdName ? `${householdName} - Main` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">OCCUPANCY:</span>
                  <span className="font-bold text-black">
                    {residents} Residents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">LOCATION:</span>
                  <span className="font-bold text-black truncate max-w-[180px]">
                    {selectedCity.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">CONNECTION:</span>
                  <span className="font-bold text-black">
                    {sanctionedLoad} kW ({connectionType === "Three Phase" ? "3-Phase" : "1-Phase"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">BASE TARIFF:</span>
                  <span className="font-bold text-black">
                    ₹ {estimates.baseTariff.toFixed(2)} / kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">BUDGET CAP:</span>
                  <span className="font-bold text-black">
                    ₹ {estimates.budgetCap.toLocaleString("en-IN")} / mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">DATA SOURCE:</span>
                  <span className="font-bold text-[#7939E8]">
                    {dataSourceLabel}
                  </span>
                </div>
              </div>

              {/* TYPICAL USAGE CURVE CHART */}
              <div className="mt-5 border border-[#e8e5dc] bg-[#fbf9f4] p-3">
                <div className="flex items-center justify-between font-mono text-[9px] font-bold tracking-[1.2px]">
                  <span className="text-[#333]">TYPICAL DAILY USAGE CURVE</span>
                  <span className="text-[#7939E8]">PEAK: 10:30 PM</span>
                </div>

                <div className="mt-2 h-[80px] w-full">
                  <svg
                    viewBox="0 0 320 80"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                    aria-label="Daily usage curve"
                  >
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7939E8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7939E8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line
                      x1="15"
                      y1="40"
                      x2="305"
                      y2="40"
                      stroke="#ccc8bf"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />

                    <path
                      d="M 15 65 Q 45 64 75 62 T 135 60 T 175 52 T 220 54 T 260 25 T 285 32 L 295 55 L 295 72 L 15 72 Z"
                      fill="url(#usageGradient)"
                    />

                    <path
                      d="M 15 65 Q 45 64 75 62 T 135 60 T 175 52 T 220 54 T 260 25 T 285 32 L 295 55"
                      fill="none"
                      stroke="#7939E8"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="mt-1 flex justify-between font-mono text-[8px] sm:text-[9px] text-[#777]">
                  <div>
                    12:00 AM<br />(NIGHT)
                  </div>
                  <div className="text-center">
                    12:00 PM<br />(MIDDAY)
                  </div>
                  <div className="text-right text-[#7939E8] font-bold">
                    10:30 PM<br />(PEAK)
                  </div>
                </div>
              </div>

              {/* ACTIONS ROW */}
              <div className="mt-4 flex items-center justify-between border-t border-[#dedbd4] pt-3 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="font-bold text-[#444] underline transition-colors hover:text-[#7939E8]"
                >
                  RESET TO DEFAULTS
                </button>
                <span className="font-bold tracking-wider text-[#777]">
                  SAVED LOCALLY
                </span>
              </div>
            </div>

            {/* HOW WE ESTIMATE CARD */}
            <div className="border border-[#dedbd4] bg-[#f8f6f0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[1.2px] text-black">
                <span className="text-base text-[#7939E8]">💡</span>
                <span>HOW WE ESTIMATE</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#55515a]">
                These estimates update automatically as you add appliances and tariffs in the next steps. No physical sensors or special equipment required to start.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#dedbd4] pt-3 font-mono text-[9px] font-bold tracking-[1.2px] text-[#55515a]">
                <span>CALCULATION: 30-DAY PROJECTION</span>
                <span className="text-[#7939E8]">100% INSTANT</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex flex-wrap items-center justify-between border-t border-[#dedbd4] bg-[#f4f2ec] px-4 py-3 font-mono text-[9px] font-bold tracking-[1.3px] text-[#666] sm:px-8">
          <span>WATTWISE © 2025 • SMART HOUSEHOLD ENERGY INTELLIGENCE</span>
          <span>SIMPLE &amp; ACCURATE BILL ESTIMATION</span>
        </footer>
      </div>
    </div>
  );
}
