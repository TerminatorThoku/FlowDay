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
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Focus Analytics</h1>
          <p className="text-sm text-stone-500 mt-1">Track your productive hours</p>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1">
          {weeks.map((w, i) => (
            <button key={w} onClick={() => setActiveWeek(i)}
              className={cn("rounded-full px-4 py-1.5 text-xs transition-all",
                activeWeek === i ? "bg-stone-100 text-stone-900" : "text-stone-400 hover:text-stone-500")}>
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {/* Card 1: Focus Gauge */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col items-center">
          <svg viewBox="0 0 120 70" className="w-[140px]">
            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#e7e5e4" strokeWidth="8" strokeLinecap="round"/>
            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="157" strokeDashoffset="132"/>
            <text x="60" y="52" textAnchor="middle" fill="#1c1917" fontSize="16">{"\u26A1"}</text>
          </svg>
          <p className="mt-2"><span className="font-mono text-2xl font-bold text-stone-900">2.5h</span><span className="text-xs text-stone-500 ml-1">/ 16h</span></p>
          <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">At risk</span>
          <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-2">Focus Time</p>
        </div>
        {/* Card 2: Classes */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-stone-900">10h</p>
          <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-1">Classes</p>
          <span className="text-xs text-stone-500 mt-2 block">No change</span>
        </div>
        {/* Card 3: Study */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-stone-900">6h</p>
          <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-1">Study Time</p>
          <span className="text-xs text-green-600 mt-2 block">+2h ↑</span>
        </div>
        {/* Card 4: Free */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="font-mono text-3xl font-bold text-stone-900">25h</p>
          <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-1">Free Time</p>
          <span className="text-xs text-red-600 mt-2 block">↓ 5h decrease</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Bar Chart */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Daily Focus Time</h3>
          <div className="flex gap-2 h-[140px]">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-stone-300 font-mono w-5 shrink-0 pb-5">
              <span>3h</span><span>2h</span><span>1h</span><span>0h</span>
            </div>
            {/* Bars */}
            <div className="flex items-end justify-between gap-2 flex-1">
              {[{d:"M",h:0},{d:"T",h:0.5},{d:"W",h:0},{d:"T",h:1},{d:"F",h:1},{d:"S",h:0},{d:"S",h:0}].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className={`w-full rounded-t-md transition-all duration-700 ${item.h > 0 ? 'bg-gradient-to-t from-violet-500 to-indigo-500' : 'bg-stone-100'}`}
                    style={{height: item.h > 0 ? `${Math.max((item.h / 3) * 100, 8)}%` : '2px'}}/>
                  <span className="text-[10px] text-stone-400 font-mono mt-1">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Donut Chart */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-stone-900 mb-4">Time Breakdown</h3>
          <div className="flex items-center gap-6">
            <svg viewBox="0 0 120 120" className="w-[130px] h-[130px] shrink-0">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#e7e5e4" strokeWidth="12"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#7c3aed" strokeWidth="12"
                strokeDasharray="14 269" strokeDashoffset="0" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#4f46e5" strokeWidth="12"
                strokeDasharray="58 225" strokeDashoffset="-14" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#16a34a" strokeWidth="12"
                strokeDasharray="35 248" strokeDashoffset="-72" transform="rotate(-90 60 60)"/>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#ea580c" strokeWidth="12"
                strokeDasharray="29 254" strokeDashoffset="-107" transform="rotate(-90 60 60)"/>
              <text x="60" y="57" textAnchor="middle" fill="#1c1917" fontSize="14" fontWeight="bold">49h</text>
              <text x="60" y="70" textAnchor="middle" fill="#a8a29e" fontSize="8">this week</text>
            </svg>
            <div className="flex flex-col gap-2 text-xs">
              {[{c:"#7c3aed",l:"Focus",v:"2.5h"},{c:"#4f46e5",l:"Classes",v:"10h"},{c:"#16a34a",l:"Study",v:"6h"},{c:"#ea580c",l:"Gym",v:"5h"},{c:"#d6d3d1",l:"Free",v:"25.5h"}].map(x=>(
                <div key={x.l} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:x.c}}/>
                  <span className="text-stone-500 w-14">{x.l}</span>
                  <span className="text-stone-900 font-mono">{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-4">
        <h3 className="text-[11px] uppercase tracking-wider text-stone-400 mb-3">Breakdown by Category</h3>
        <div className="space-y-2">
          {[
            {cat:"Focus Time",hrs:"2.5h",detail:"Deep work sessions",pct:15,clr:"bg-violet-600"},
            {cat:"Classes",hrs:"10h",detail:"OOP, Algebra, Data Analytics",pct:60,clr:"bg-indigo-600"},
            {cat:"Study",hrs:"6h",detail:"OOP Practice, Revision",pct:37,clr:"bg-green-600"},
            {cat:"Exercise",hrs:"5h",detail:"Gym 3x, Swimming 2x",pct:31,clr:"bg-indigo-600"},
          ].map(c=>(
            <div key={c.cat} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-stone-900">{c.cat}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{c.detail}</p>
                </div>
                <span className="font-mono text-lg font-bold text-stone-900">{c.hrs}</span>
              </div>
              <div className="mt-2 h-[3px] bg-stone-100 rounded-full overflow-hidden">
                <div className={`h-full ${c.clr} rounded-full`} style={{width:`${c.pct}%`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
