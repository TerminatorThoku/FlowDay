"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const weeks = ["Last week", "This week", "Next week"];

export default function FocusPage() {
  const [activeWeek, setActiveWeek] = useState(1);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header + week toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#e8e4dc]">Focus Analytics</h1>
          <p className="text-sm text-[#a8a29e] mt-1">Track your productive hours</p>
        </div>
        <div className="flex items-center gap-1 bg-[#222222] rounded-full p-1">
          {weeks.map((w, i) => (
            <button key={w} onClick={() => setActiveWeek(i)}
              className={cn("rounded-full px-4 py-1.5 text-xs transition-all",
                activeWeek === i ? "bg-[#2a2a2a] text-[#e8e4dc]" : "text-[#6b6560] hover:text-[#a8a29e]")}>
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {/* Card 1: Focus Gauge */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex flex-col items-center">
          <svg viewBox="0 0 120 70" className="w-[140px]">
            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"/>
            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#8b7ab8" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="157" strokeDashoffset="132"/>
            <text x="60" y="52" textAnchor="middle" fill="white" fontSize="16">{"\u26A1"}</text>
          </svg>
          <p className="mt-2"><span className="font-mono text-2xl font-bold text-[#e8e4dc]">2.5h</span><span className="text-xs text-[#a8a29e] ml-1">/ 16h</span></p>
          <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#c8944e]/10 text-[#c8944e] border border-[#c8944e]/20">At risk</span>
          <p className="text-[11px] uppercase tracking-wider text-[#6b6560] mt-2">Focus Time</p>
        </div>
        {/* Card 2: Classes */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-[#e8e4dc]">10h</p>
          <p className="text-[11px] uppercase tracking-wider text-[#6b6560] mt-1">Classes</p>
          <span className="text-xs text-[#a8a29e] mt-2 block">No change</span>
        </div>
        {/* Card 3: Study */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-[#e8e4dc]">6h</p>
          <p className="text-[11px] uppercase tracking-wider text-[#6b6560] mt-1">Study Time</p>
          <span className="text-xs text-[#5b9a6f] mt-2 block">+2h ↑</span>
        </div>
        {/* Card 4: Free */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-[#e8e4dc]">25h</p>
          <p className="text-[11px] uppercase tracking-wider text-[#6b6560] mt-1">Free Time</p>
          <span className="text-xs text-[#b85c5c] mt-2 block">↓ 5h decrease</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Bar Chart */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#e8e4dc] mb-4">Daily Focus Time</h3>
          <div className="flex gap-2 h-[140px]">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-[#4a4540] font-mono w-5 shrink-0 pb-5">
              <span>3h</span><span>2h</span><span>1h</span><span>0h</span>
            </div>
            {/* Bars */}
            <div className="flex items-end justify-between gap-2 flex-1">
              {[{d:"M",h:0},{d:"T",h:0.5},{d:"W",h:0},{d:"T",h:1},{d:"F",h:1},{d:"S",h:0},{d:"S",h:0}].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className={`w-full rounded-t-md transition-all duration-700 ${item.h > 0 ? 'bg-gradient-to-t from-[#8b7ab8] to-[#6b8aad]' : 'bg-[#222222]'}`}
                    style={{height: item.h > 0 ? `${Math.max((item.h / 3) * 100, 8)}%` : '2px'}}/>
                  <span className="text-[10px] text-[#6b6560] font-mono mt-1">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Donut Chart */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#e8e4dc] mb-4">Time Breakdown</h3>
          <div className="flex items-center gap-6">
            <svg viewBox="0 0 120 120" className="w-[130px] h-[130px] shrink-0">
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#8b7ab8" strokeWidth="12"
                strokeDasharray="14 269" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#6b8aad" strokeWidth="12"
                strokeDasharray="58 225" strokeDashoffset="-14" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#5b9a6f" strokeWidth="12"
                strokeDasharray="35 248" strokeDashoffset="-72" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#c8944e" strokeWidth="12"
                strokeDasharray="29 254" strokeDashoffset="-107" transform="rotate(-90 60 60)"/>
              <text x="60" y="57" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">49h</text>
              <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">this week</text>
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              {[{c:"#8b7ab8",l:"Focus",v:"2.5h"},{c:"#6b8aad",l:"Classes",v:"10h"},{c:"#5b9a6f",l:"Study",v:"6h"},{c:"#c8944e",l:"Gym",v:"5h"},{c:"rgba(255,255,255,0.15)",l:"Free",v:"25.5h"}].map(x=>(
                <div key={x.l} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:x.c}}/>
                  <span className="text-[#a8a29e] w-14">{x.l}</span>
                  <span className="text-[#e8e4dc] font-mono">{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-4">
        <h3 className="text-[11px] uppercase tracking-wider text-[#6b6560] mb-3">Breakdown by Category</h3>
        <div className="space-y-2">
          {[
            {cat:"Focus Time",hrs:"2.5h",detail:"Deep work sessions",pct:15,clr:"bg-[#8b7ab8]"},
            {cat:"Classes",hrs:"10h",detail:"OOP, Algebra, Data Analytics",pct:60,clr:"bg-[#6b8aad]"},
            {cat:"Study",hrs:"6h",detail:"OOP Practice, Revision",pct:37,clr:"bg-[#5b9a6f]"},
            {cat:"Exercise",hrs:"5h",detail:"Gym 3x, Swimming 2x",pct:31,clr:"bg-[#c8a44e]"},
          ].map(c=>(
            <div key={c.cat} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-[#e8e4dc]">{c.cat}</p>
                  <p className="text-xs text-[#6b6560] mt-0.5">{c.detail}</p>
                </div>
                <span className="font-mono text-lg font-bold text-[#e8e4dc]">{c.hrs}</span>
              </div>
              <div className="mt-2 h-[3px] bg-[#222222] rounded-full overflow-hidden">
                <div className={`h-full ${c.clr} rounded-full`} style={{width:`${c.pct}%`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
