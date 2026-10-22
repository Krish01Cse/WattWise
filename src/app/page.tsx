
"use client";

import React from "react";

function TelemetryChart() {
  return (
    <div className="border border-[#dedbd4] bg-white p-2 sm:p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-bold tracking-[2px] text-[#55515a] sm:text-xs">
        <span>24-HR PROFILE (00:00 - 23:59 IST)</span>
        <span className="text-[#7939E8]">
          1 CRITICAL OUTLIER IDENTIFIED
        </span>
      </div>

      <div className="relative h-[145px] overflow-hidden border border-[#d5d0c8] bg-[#fffefa] sm:h-[165px]">
        <svg
          viewBox="0 0 680 165"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Illustrative electricity usage graph showing an abnormal spike"
        >
          <defs>
            <pattern
              id="grid"
              width="34"
              height="19"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 34 0 L 0 0 0 19"
                fill="none"
                stroke="#aaa49b"
                strokeWidth="0.7"
                strokeDasharray="2 3"
              />
            </pattern>
          </defs>

          <rect width="680" height="165" fill="url(#grid)" />

          <path
            d="M0 123 L38 120 L75 119 L110 114 L145 116 L180 112 L215 115 L250 110 L285 111 L320 109 L345 112 L365 102 L376 65 L389 42 L400 103 L415 110 L455 113 L490 115 L525 112 L560 115 L600 110 L640 113 L680 117"
            fill="none"
            stroke="#19191D"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="M0 123 L38 120 L75 119 L110 114 L145 116 L180 112 L215 115 L250 110 L285 111 L320 109 L345 112 L365 102 L376 65 L389 42 L400 103 L415 110 L455 113 L490 115 L525 112 L560 115 L600 110 L640 113 L680 117 L680 165 L0 165 Z"
            fill="#7939E8"
            fillOpacity="0.045"
          />

          <circle
            cx="389"
            cy="42"
            r="5"
            fill="#7939E8"
            stroke="#ffffff"
            strokeWidth="2"
          />

          <circle
            cx="590"
            cy="30"
            r="15"
            fill="none"
            stroke="#7939E8"
            strokeWidth="1.5"
            opacity="0.65"
          />
        </svg>

        <div className="absolute left-[42%] top-[4px] z-10 border border-[#7939E8] bg-white px-2 py-1.5 shadow-sm sm:px-3 sm:py-2">
          <p className="font-mono text-[9px] font-bold tracking-wider text-[#7939E8] sm:text-[10px]">
            ■ 14:20 IST SPIKE
          </p>
          <p className="mt-1 font-mono text-[10px] font-black text-[#19191D] sm:text-sm">
            +340% SURGE (8.4 kW)
          </p>
          <p className="font-mono text-[8px] font-bold tracking-wider text-[#55515a] sm:text-[10px]">
            UNUSUAL CONSUMPTION
          </p>
          <p className="font-mono text-[8px] font-bold tracking-wider text-[#7939E8] sm:text-[10px]">
            ISOLATION SCORE: 0.89
          </p>
        </div>

        <div className="absolute inset-x-1 bottom-0 flex justify-between bg-white/90 px-1 font-mono text-[8px] font-bold tracking-wider text-[#55515a] sm:px-2 sm:text-[10px]">
          <span>00:00</span>
          <span>06:00</span>
          <span className="text-[#7939E8]">14:20 [ANOMALY]</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
}

const phases = [
  {
    number: "01",
    label: "HARDWARE",
    title: "MEASURE",
    detail: "DELAY: <100ms",
    active: false,
  },
  {
    number: "02",
    label: "MODELING",
    title: "ANALYZE",
    detail: "ML RESOLUTION: HIGH",
    active: false,
  },
  {
    number: "03",
    label: "ACTIVE",
    title: "ALERT",
    detail: "LATENCY: REAL-TIME",
    active: true,
  },
  {
    number: "04",
    label: "AUDIT",
    title: "SAVE",
    detail: "TARGET: -28% AVG RUN-RATE",
    active: false,
  },
];

const features = [
  {
    id: "01",
    title: "MONITOR",
    desc: "Track appliance consumption using measured, historical or estimated readings.",
  },
  {
    id: "02",
    title: "DETECT",
    desc: "Use Isolation Forest to flag consumption patterns that differ from the learned baseline.",
  },
  {
    id: "03",
    title: "FORECAST",
    desc: "Estimate daily, weekly and monthly electricity costs from consumption and tariff settings.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#a6acb5] p-[3px] text-[#111111] sm:p-4">
      <div className="mx-auto min-h-[calc(100vh-8px)] max-w-[1600px] overflow-hidden border border-[#d5d0c8] bg-[#fcf9f2] sm:min-h-[calc(100vh-32px)] sm:rounded-[30px]">

        {/* HEADER */}
        <header className="flex min-h-[60px] items-center justify-between border-b border-[#dedbd4] px-4 sm:px-8 lg:px-10">
          <a
            href="#home"
            className="font-mono text-[13px] font-black tracking-[1px] sm:text-base"
          >
            WATTWISE<span className="text-[#7939E8]">●</span>
            <span className="ml-2 hidden bg-[#e9e5dc] px-1.5 py-1 text-[9px] tracking-wider text-[#55515a] sm:inline-block">
              REV 2.4
            </span>
          </a>

          <nav className="flex items-center gap-3 font-mono text-[10px] font-bold tracking-wider sm:gap-6 sm:text-xs">
            <a
              href="#features"
              className="transition-colors hover:text-[#7939E8]"
            >
              FEATURES
            </a>
            <a
              href="#protocol"
              className="transition-colors hover:text-[#7939E8]"
            >
              PROTOCOL
            </a>
            <a
              href="/auth"
              className="border border-black bg-black px-3 py-2.5 text-white transition-colors hover:bg-[#7939E8] sm:px-4"
            >
              DEPLOY
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section
          id="home"
          className="grid grid-cols-1 gap-8 px-4 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:grid-cols-2 lg:items-start lg:gap-10 lg:px-10 lg:pt-10"
        >
          <div>
            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a] sm:text-xs sm:tracking-[2px]">
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#d5c2fa] bg-[#7939E8]" />
              HOUSEHOLD ENERGY INTELLIGENCE / SYSTEM 01
            </div>

            <h1 className="max-w-[620px] text-[38px] font-black leading-[1.1] tracking-[-2px] sm:text-5xl lg:text-[clamp(40px,3.1vw,58px)]">
              KNOW YOUR{" "}
              <span className="relative inline-block text-[#7939E8]">
                POWER
                <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#7939E8]" />
              </span>
              .
              <br />
              BEFORE THE BILL.
            </h1>

            <p className="mt-5 font-mono text-xs font-bold leading-6 tracking-[1.5px] text-[#7939E8] sm:text-sm">
              YOUR NEXT BILL SHOULDN&apos;T BE A SURPRISE.
            </p>

            <p className="mt-4 max-w-[620px] text-[15px] leading-[1.8] text-[#55515a] sm:text-base lg:text-[17px]">
              WATTWISE is an AI-driven household energy intelligence platform
              that tracks individual appliance consumption, flags unusual
              usage patterns using Isolation Forest machine learning, and
              estimates electricity costs before your monthly bill arrives.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* START MONITORING -> LOGIN / SIGN UP */}
              <a
                href="/auth"
                className="inline-flex min-h-[58px] items-center gap-4 border border-black bg-black px-5 font-mono text-xs font-bold tracking-wider text-white transition-colors hover:bg-[#7939E8] sm:px-6 sm:text-sm"
              >
                START MONITORING
                <span className="text-2xl leading-none">→</span>
              </a>

              {/* EXPLORE PROTOCOL -> SCROLL DOWN */}
              <a
                href="#protocol"
                className="inline-flex min-h-[58px] items-center border border-[#d5d0c8] bg-white px-5 font-mono text-xs font-bold tracking-wider transition-colors hover:border-[#7939E8] sm:px-6 sm:text-sm"
              >
                EXPLORE PROTOCOL
              </a>
            </div>

            <div className="mt-7 border-t border-[#dedbd4] pt-3 font-mono text-[9px] font-bold leading-5 tracking-[1px] text-[#55515a] sm:text-[11px] sm:tracking-[1.4px]">
              APPLIANCE-LEVEL MONITORING · AI ANOMALY DETECTION · ISOLATION
              FOREST TELEMETRY
            </div>
          </div>

          {/* TELEMETRY PREVIEW */}
          <div className="border-[7px] border-[#19191D] bg-[#19191D] p-1 shadow-[0_8px_16px_rgba(0,0,0,0.15)] sm:border-[9px] sm:p-1.5">
            <div className="flex min-h-8 items-center justify-between gap-2 px-1 font-mono text-[8px] font-bold tracking-[1px] text-[#a6a0ab] sm:px-2 sm:text-[10px] sm:tracking-[1.5px]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7939E8]" />
                FEED: SAMPLE DATA
              </span>
              <span>ENERGY GRID A // CH-04</span>
            </div>

            <div className="bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedbd4] pb-3">
                <div>
                  <p className="font-mono text-[10px] font-bold tracking-[1.5px] text-[#55515a] sm:text-xs">
                    INSTANTANEOUS LOAD
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-3xl font-black sm:text-4xl">
                      2.84
                    </span>
                    <span className="font-mono text-xs font-bold text-[#55515a]">
                      kW
                    </span>
                    <span className="bg-[#eee5ff] px-1.5 py-1 font-mono text-[9px] font-bold tracking-wider text-[#7939E8] sm:text-xs">
                      +14.2% OVER BASELINE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border border-[#dedbd4] px-2 py-2">
                  <span className="font-mono text-[9px] font-bold tracking-[1px] text-[#55515a] sm:text-[10px]">
                    SIGNAL
                  </span>
                  <svg
                    viewBox="0 0 92 24"
                    className="h-6 w-[75px] sm:w-[90px]"
                    role="img"
                    aria-label="Illustrative signal waveform"
                  >
                    <path
                      d="M0 13 L12 13 L18 5 L25 19 L32 9 L40 13 L48 13 L56 5 L62 17 L69 13 L78 13 L84 7 L92 13"
                      fill="none"
                      stroke="#19191D"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-3">
                <TelemetryChart />
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONAL PROTOCOL */}
        <section
          id="protocol"
          className="mx-4 scroll-mt-4 border-t border-[#dedbd4] py-8 sm:mx-8 sm:py-10 lg:mx-10"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-bold tracking-[1.5px] sm:text-xs sm:tracking-[2px]">
            <div>
              <span className="text-[#7939E8]">OPERATIONAL PROTOCOL</span>
              <span className="mx-2 text-[#d5d0c8]">//</span>
              <span className="text-[#55515a]">03</span>
            </div>
            <span className="text-[#55515a]">4-STAGE PIPELINE</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase) => (
              <article
                key={phase.number}
                className={`min-h-[136px] border bg-white p-4 ${
                  phase.active
                    ? "border-2 border-[#7939E8]"
                    : "border-[#d5d0c8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#dedbd4] pb-2 font-mono text-[10px] font-bold tracking-[1.5px]">
                  <span className="text-[#7939E8]">
                    PHASE {phase.number}
                  </span>
                  <span className="text-[#55515a]">
                    {phase.active && (
                      <span className="mr-1 text-[#7939E8]">●</span>
                    )}
                    {phase.label}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-[-1px]">
                  {phase.title}
                </h2>

                <div
                  className={`mt-4 border-t border-[#eeeae3] pt-2 font-mono text-[10px] font-bold tracking-[1.2px] sm:text-[11px] ${
                    phase.active ? "text-[#7939E8]" : "text-[#55515a]"
                  }`}
                >
                  {phase.detail}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="border-t border-[#dedbd4] bg-[#f5f2eb] px-4 py-8 sm:px-8 sm:py-10 lg:px-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[2px] text-[#7939E8]">
                SYSTEM CAPABILITIES // 01—03
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-1.5px] sm:text-4xl">
                BUILT TO FIND THE UNUSUAL.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#55515a]">
              Understand your household consumption with clear data, useful
              alerts and transparent cost estimates.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
            {features.map((item) => (
              <article
                key={item.id}
                className="border border-[#d5d0c8] bg-[#fcf9f2] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold tracking-[2px]">
                  <span className="text-[#7939E8]">MODULE {item.id}</span>
                  <span className="text-[#aaa49b]">↗</span>
                </div>
                <h3 className="mt-7 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#55515a]">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="border-t border-[#dedbd4] bg-[#19191D] px-5 py-9 text-white sm:px-10 sm:py-12">
          <p className="font-mono text-[10px] font-bold tracking-[2px] text-[#b99aff]">
            WATTWISE / HOUSEHOLD ENERGY INTELLIGENCE
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-1.5px] sm:text-5xl">
              YOUR NEXT BILL SHOULDN&apos;T BE A SURPRISE.
            </h2>
            <a
              href="/auth"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 border border-white px-5 font-mono text-xs font-bold tracking-wider transition-colors hover:bg-white hover:text-black"
            >
              START MONITORING <span className="text-xl">→</span>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex flex-col justify-between gap-4 border-t border-[#dedbd4] bg-[#f5f2eb] px-4 py-5 font-mono text-[9px] font-bold tracking-[1.5px] text-[#55515a] sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div>
            <span className="text-black">■ WATTWISE INSTRUMENTS</span>
            <span className="mx-2">/</span>
            BLR-IN
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#features" className="hover:text-[#7939E8]">
              SPECIFICATIONS
            </a>
            <a href="#protocol" className="hover:text-[#7939E8]">
              TOPOLOGY
            </a>
            <span className="text-[#7939E8]">ENERGY INTELLIGENCE</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
