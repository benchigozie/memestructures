"use client";

import React, { useState } from "react";
import { Layers, ShieldAlert, BadgePercent } from "lucide-react";

const TABS = [
  { id: "four-lens", label: "Four-Lens Framework", icon: Layers },
  { id: "risk", label: "Risk Controls", icon: ShieldAlert },
  { id: "fee", label: "Fee Alignment", icon: BadgePercent }, // Swapped Upload for BadgePercent/Receipt
];

export default function StructureBeforeDeployment() {
  const [activeTab, setActiveTab] = useState("four-lens");

  return (
    <section className="bg-my-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-my-deep-blue tracking-tight">
            Structure Before Deployment
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
            We apply institutional rigor, strict downside controls, and complete fee
            alignment to long-term digital asset allocation.
          </p>
        </div>

        {/* Navigation / Filter Tabs */}
        <div className="mt-10 md:mt-12 max-w-2xl mx-auto bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-my-blue text-my-blue-white shadow-md ring-1 ring-my-blue/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-my-blue-white" : "text-slate-500"}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}