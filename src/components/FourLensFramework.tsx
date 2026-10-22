"use client";

import React, { useState } from "react";
import {
  Layers,
  TrendingUp,
  ShieldAlert,
  ShieldCheck, // Added for Lens 01
  Check,
  LucideIcon,
} from "lucide-react";

interface CriteriaPoint {
  id: number;
  text: string;
}

interface LensData {
  id: string;
  lensNumber: string;
  title: string;
  description: string;
  icon: LucideIcon; // Made non-optional since all lenses now have an icon
  points: CriteriaPoint[];
}

const LENSES_DATA: LensData[] = [
  {
    id: "lens-01",
    lensNumber: "Lens 01",
    title: "Fundamentals",
    description:
      "Rigorous vetting of team reputation, token mechanics, and underlying project viability before considering capital commitment.",
    icon: ShieldCheck, // Assigned icon for Lens 01
    points: [
      {
        id: 1,
        text: "Team background, track record, and operational credibility.",
      },
      {
        id: 2,
        text: "Tokenomics structure, emission schedules, and unlocked distribution.",
      },
      {
        id: 3,
        text: "Product development milestones and ecosystem adoption velocity.",
      },
    ],
  },
  {
    id: "lens-02",
    lensNumber: "Lens 02",
    title: "Valuation",
    description:
      "Comprehensive assessment of financial metrics, market capitalization ratios, and comparative sector valuation standards.",
    icon: Layers,
    points: [
      {
        id: 1,
        text: "Fully diluted valuation (FDV) vs current circulating market cap.",
      },
      {
        id: 2,
        text: "Historical trading multiples and peer comparison benchmarking.",
      },
      {
        id: 3,
        text: "Revenue generation capability and sustainable cash flow models.",
      },
    ],
  },
  {
    id: "lens-03",
    lensNumber: "Lens 03",
    title: "Market Structure",
    description:
      "Analysis of order book depth, liquidity dynamics, exchange distribution, and systemic market positioning.",
    icon: TrendingUp,
    points: [
      {
        id: 1,
        text: "Liquidity distribution across central and decentralized venues.",
      },
      {
        id: 2,
        text: "Volume profile, order book depth, and slippage tolerance.",
      },
      {
        id: 3,
        text: "Derivatives open interest and leverage positioning trends.",
      },
    ],
  },
  {
    id: "lens-04",
    lensNumber: "Lens 04",
    title: "Risk & Positioning",
    description:
      "Stress-testing downside exposure, smart contract vulnerabilities, regulatory risk, and portfolio sizing.",
    icon: ShieldAlert,
    points: [
      {
        id: 1,
        text: "Smart contract audit reports, battle-testing, and security coverage.",
      },
      {
        id: 2,
        text: "Regulatory compliance landscape across primary jurisdictions.",
      },
      {
        id: 3,
        text: "Downside risk modeling, stop-loss strategy, and allocation sizing.",
      },
    ],
  },
];

export default function FourLensFramework() {
  const [activeLensId, setActiveLensId] = useState<string>("lens-01");

  const activeLens =
    LENSES_DATA.find((lens) => lens.id === activeLensId) || LENSES_DATA[0];

  return (
    <section className="w-full max-w-6xl mx-auto p-6 md:p-10 mt-18 rounded-3xl border border-slate-100">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-my-deep-blue tracking-tight">
          The Four-Lens Framework
        </h2>
        <p className="mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Every investment must simultaneously pass all four analytical criteria
          before deployment.
        </p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {LENSES_DATA.map((lens) => {
          const isActive = activeLensId === lens.id;
          const IconComponent = lens.icon;

          return (
            <button
              key={lens.id}
              onClick={() => setActiveLensId(lens.id)}
              className={`relative flex flex-col justify-between p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                isActive
                  ? "bg-blue-50/60 border-my-blue/40 shadow-sm ring-1 ring-my-blue/40"
                  : "bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between w-full mb-6">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isActive ? "text-my-blue" : "text-slate-400"
                  }`}
                >
                  {lens.lensNumber}
                </span>

                {/* Right Icon/Badge - Now shows icon on all cards, colored when active */}
                <IconComponent
                  className={`w-5 h-5 stroke-[1.75] ${
                    isActive ? "text-my-blue" : "text-slate-400"
                  }`}
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900">{lens.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Main Details Panel */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 md:p-8">
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-my-blue">
              {activeLens.lensNumber} ANALYTICAL CRITERIA
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeLens.title} Analysis
            </h3>
          </div>

          <p className="text-xs md:text-sm text-slate-500 max-w-md md:text-right leading-relaxed">
            {activeLens.description}
          </p>
        </div>

        {/* Criteria Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeLens.points.map((point) => (
            <div
              key={point.id}
              className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-start gap-3.5"
            >
              <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-my-blue">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-snug">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}