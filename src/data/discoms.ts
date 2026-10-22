export interface UtilityDiscom {
  id: string;
  name: string;
  region: string;
  baseRate: number; // ₹ / kWh
  avgRate: number;  // ₹ / kWh
  peakSurcharge: string;
}

export const NATIONAL_DISCOMS: UtilityDiscom[] = [
  {
    id: "aeml_mumbai",
    name: "Adani Electricity Mumbai Ltd (AEML)",
    region: "Mumbai, Maharashtra",
    baseRate: 7.50,
    avgRate: 7.20,
    peakSurcharge: "NIL"
  },
  {
    id: "tata_mumbai",
    name: "Tata Power Mumbai",
    region: "Mumbai, Maharashtra",
    baseRate: 7.30,
    avgRate: 7.10,
    peakSurcharge: "NIL"
  },
  {
    id: "best_mumbai",
    name: "BEST Undertaking (Brihanmumbai)",
    region: "Mumbai, Maharashtra",
    baseRate: 7.15,
    avgRate: 6.95,
    peakSurcharge: "NIL"
  },
  {
    id: "msedcl",
    name: "MSEDCL (Mahavitaran)",
    region: "Maharashtra (Excl. Mumbai Island)",
    baseRate: 7.85,
    avgRate: 7.40,
    peakSurcharge: "NIL"
  },
  {
    id: "bescom",
    name: "BESCOM (Bengaluru)",
    region: "Bengaluru, Karnataka",
    baseRate: 7.20,
    avgRate: 6.90,
    peakSurcharge: "NIL"
  },
  {
    id: "bses_delhi",
    name: "BSES Rajdhani / Yamuna (Delhi)",
    region: "Delhi NCR",
    baseRate: 6.80,
    avgRate: 6.50,
    peakSurcharge: "NIL"
  },
  {
    id: "tpddl_delhi",
    name: "Tata Power Delhi Distribution Ltd (TPDDL)",
    region: "North & NW Delhi",
    baseRate: 6.90,
    avgRate: 6.55,
    peakSurcharge: "NIL"
  },
  {
    id: "tangedco",
    name: "TANGEDCO (Tamil Nadu)",
    region: "Tamil Nadu",
    baseRate: 7.00,
    avgRate: 6.70,
    peakSurcharge: "NIL"
  },
  {
    id: "tsspdcl",
    name: "TSSPDCL (Telangana)",
    region: "Telangana (Hyderabad Zone)",
    baseRate: 7.30,
    avgRate: 6.95,
    peakSurcharge: "NIL"
  },
  {
    id: "cesc_kolkata",
    name: "CESC Limited (Kolkata)",
    region: "Kolkata, West Bengal",
    baseRate: 7.40,
    avgRate: 7.10,
    peakSurcharge: "NIL"
  },
  {
    id: "wbsedcl",
    name: "WBSEDCL (West Bengal)",
    region: "West Bengal",
    baseRate: 7.25,
    avgRate: 6.95,
    peakSurcharge: "NIL"
  },
  {
    id: "torrent_gujarat",
    name: "Torrent Power (Ahmedabad / Surat / Gandhinagar)",
    region: "Gujarat",
    baseRate: 6.95,
    avgRate: 6.65,
    peakSurcharge: "NIL"
  },
  {
    id: "ugvcl",
    name: "UGVCL / DGVCL (Gujarat State)",
    region: "Gujarat",
    baseRate: 6.85,
    avgRate: 6.55,
    peakSurcharge: "NIL"
  },
  {
    id: "jvvnl",
    name: "JVVNL / JdVVNL (Rajasthan DISCOMs)",
    region: "Rajasthan",
    baseRate: 7.25,
    avgRate: 6.95,
    peakSurcharge: "NIL"
  },
  {
    id: "mvvnl_up",
    name: "UPPCL / MVVNL / PVVNL (Uttar Pradesh)",
    region: "Uttar Pradesh",
    baseRate: 7.10,
    avgRate: 6.80,
    peakSurcharge: "NIL"
  },
  {
    id: "ksebl",
    name: "KSEBL (Kerala State Electricity Board)",
    region: "Kerala",
    baseRate: 7.15,
    avgRate: 6.85,
    peakSurcharge: "NIL"
  },
  {
    id: "mppkvvcl",
    name: "MPPKVVCL / MPMKVVCL (Madhya Pradesh)",
    region: "Madhya Pradesh",
    baseRate: 7.20,
    avgRate: 6.90,
    peakSurcharge: "NIL"
  },
  {
    id: "apepdcl",
    name: "APEPDCL / APSPDCL (Andhra Pradesh)",
    region: "Andhra Pradesh",
    baseRate: 7.15,
    avgRate: 6.85,
    peakSurcharge: "NIL"
  },
  {
    id: "sbpdcl",
    name: "SBPDCL / NBPDCL (Bihar State)",
    region: "Bihar",
    baseRate: 7.10,
    avgRate: 6.80,
    peakSurcharge: "NIL"
  },
  {
    id: "pspcl",
    name: "PSPCL (Punjab State Power Corp)",
    region: "Punjab",
    baseRate: 6.90,
    avgRate: 6.60,
    peakSurcharge: "NIL"
  },
  {
    id: "dhbvn_haryana",
    name: "DHBVN / UHBVN (Haryana)",
    region: "Haryana (Gurugram / Faridabad)",
    baseRate: 7.10,
    avgRate: 6.80,
    peakSurcharge: "NIL"
  },
  {
    id: "tata_odisha",
    name: "TPCODL / TPWODL (Tata Power Odisha)",
    region: "Odisha",
    baseRate: 6.90,
    avgRate: 6.60,
    peakSurcharge: "NIL"
  },
  {
    id: "apdcl_assam",
    name: "APDCL (Assam Power Distribution)",
    region: "Assam & Northeast",
    baseRate: 6.90,
    avgRate: 6.60,
    peakSurcharge: "NIL"
  },
  {
    id: "upcl_uk",
    name: "UPCL (Uttarakhand Power Corp)",
    region: "Uttarakhand",
    baseRate: 6.80,
    avgRate: 6.50,
    peakSurcharge: "NIL"
  },
  {
    id: "hpsebl_hp",
    name: "HPSEBL (Himachal Pradesh State)",
    region: "Himachal Pradesh",
    baseRate: 6.60,
    avgRate: 6.30,
    peakSurcharge: "NIL"
  },
  {
    id: "custom_schedule",
    name: "Custom Rate Schedule",
    region: "User Configured",
    baseRate: 7.50,
    avgRate: 7.00,
    peakSurcharge: "NIL"
  }
];

export function getDiscomsForCity(cityName: string, stateName: string): UtilityDiscom[] {
  const normCity = cityName.toLowerCase();
  const normState = stateName.toLowerCase();

  // Primary matches based on City
  if (normCity.includes("mumbai") || normCity.includes("thane") || normCity.includes("navi mumbai")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "tata_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "msedcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "tangedco")!,
      NATIONAL_DISCOMS.find(d => d.id === "tsspdcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("delhi") || normCity.includes("noida") || normCity.includes("gurugram") || normCity.includes("faridabad")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "tpddl_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "dhbvn_haryana")!,
      NATIONAL_DISCOMS.find(d => d.id === "mvvnl_up")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("bengaluru") || normCity.includes("bangalore") || normState.includes("karnataka")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      {
        id: "mescom_hescom",
        name: `MESCOM / HESCOM (${cityName})`,
        region: "Karnataka Regional",
        baseRate: 7.10,
        avgRate: 6.85,
        peakSurcharge: "NIL"
      },
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "tangedco")!,
      NATIONAL_DISCOMS.find(d => d.id === "tsspdcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("kolkata") || normCity.includes("howrah") || normState.includes("west bengal")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "cesc_kolkata")!,
      NATIONAL_DISCOMS.find(d => d.id === "wbsedcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("chennai") || normState.includes("tamil nadu")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "tangedco")!,
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      NATIONAL_DISCOMS.find(d => d.id === "tsspdcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("hyderabad") || normState.includes("telangana")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "tsspdcl")!,
      {
        id: "tsnpdcl",
        name: "TSNPDCL (Northern Telangana)",
        region: "Telangana",
        baseRate: 7.15,
        avgRate: 6.85,
        peakSurcharge: "NIL"
      },
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      NATIONAL_DISCOMS.find(d => d.id === "tangedco")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("ahmedabad") || normCity.includes("surat") || normState.includes("gujarat")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "torrent_gujarat")!,
      NATIONAL_DISCOMS.find(d => d.id === "ugvcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "msedcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normCity.includes("pune") || normState.includes("maharashtra")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "msedcl")!,
      NATIONAL_DISCOMS.find(d => d.id === "tata_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normState.includes("rajasthan")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "jvvnl")!,
      NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normState.includes("uttar pradesh")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "mvvnl_up")!,
      NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  if (normState.includes("kerala")) {
    return [
      NATIONAL_DISCOMS.find(d => d.id === "ksebl")!,
      NATIONAL_DISCOMS.find(d => d.id === "tangedco")!,
      NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
      NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
    ];
  }

  // Fallback state matches
  const stateMatch = NATIONAL_DISCOMS.find(d => d.region.toLowerCase().includes(normState));
  const primaryList = stateMatch ? [stateMatch] : [
    {
      id: `state_discom_${normCity}`,
      name: `${cityName} State Power Distribution Co.`,
      region: `${cityName}, ${stateName}`,
      baseRate: 7.20,
      avgRate: 6.90,
      peakSurcharge: "NIL"
    }
  ];

  return [
    ...primaryList,
    NATIONAL_DISCOMS.find(d => d.id === "aeml_mumbai")!,
    NATIONAL_DISCOMS.find(d => d.id === "tata_mumbai")!,
    NATIONAL_DISCOMS.find(d => d.id === "bescom")!,
    NATIONAL_DISCOMS.find(d => d.id === "bses_delhi")!,
    NATIONAL_DISCOMS.find(d => d.id === "custom_schedule")!
  ];
}
