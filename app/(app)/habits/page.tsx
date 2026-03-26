"use client";

export default function HabitsPage() {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#e8e4dc]">Habits</h1>
          <p className="text-sm text-[#a8a29e] mt-1">Build consistency, track streaks</p>
        </div>
        <button className="rounded-xl bg-[#c8a44e] text-black px-4 py-2 text-sm font-medium hover:bg-[#d4b05a] active:scale-[0.97] transition-all">
          + Add Habit
        </button>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3 mt-6">
        {[
          {name:"Gym",icon:"\uD83C\uDFCB\uFE0F",freq:"5x / week",dur:"1\u20131.5h",streak:7,next:"Tomorrow, 7:00 AM",pct:85,color:"#5b9a6f"},
          {name:"Swimming",icon:"\uD83C\uDFCA",freq:"2x / week",dur:"1h",streak:3,next:"Saturday, 11:00 AM",pct:70,color:"#06b6d4"},
          {name:"Study Session",icon:"\uD83D\uDCDA",freq:"Daily",dur:"1.5\u20132h",streak:5,next:"Today, 2:30 PM",pct:60,color:"#8b7ab8"},
          {name:"Sleep 7h+",icon:"\uD83D\uDE34",freq:"Daily",dur:"7\u20138h",streak:12,next:"Tonight",pct:90,color:"#6b8aad"},
        ].map(h=>(
          <div key={h.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 hover:border-[#3a3a3a] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#222222] flex items-center justify-center text-xl shrink-0">{h.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#e8e4dc]">{h.name}</p>
              <p className="text-xs text-[#a8a29e]">{h.freq} &middot; {h.dur}</p>
              <p className="text-xs text-[#6b6560] mt-0.5">Next: {h.next}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-mono text-[#a8a29e]">{"\uD83D\uDD25"} {h.streak}</span>
              <svg viewBox="0 0 36 36" className="w-9 h-9">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke={h.color} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${h.pct * 0.94} ${94 - h.pct * 0.94}`} strokeDashoffset="23.5"
                  transform="rotate(-90 18 18)"/>
                <text x="18" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{h.pct}%</text>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="mt-8">
        <h3 className="text-[11px] uppercase tracking-wider text-[#6b6560] mb-3">Activity</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 overflow-x-auto">
          <div className="grid gap-[3px]" style={{gridTemplateColumns: 'repeat(12, minmax(12px, 1fr))'}}>
            {Array.from({length: 84}, (_, i) => {
              const v = [0,0,1,2,3,1,0,2,1,3,0,1,2,0,1,3,2,1,0,0,1,2,3,1,2,0,1,3,2,1,0,2,1,0,3,2,1,1,0,2,3,1,0,1,2,3,0,1,2,1,3,0,2,1,0,1,3,2,1,0,2,1,3,0,1,2,0,1,3,2,1,0,2,1,3,0,1,2,1,0,3,2,1,0][i];
              const colors = ["bg-[#222222]","bg-[#5b9a6f]/20","bg-[#5b9a6f]/40","bg-[#5b9a6f]/60"];
              return <div key={i} className={`w-3 h-3 rounded-sm ${colors[Math.min(v,3)]}`}/>;
            })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-3 text-[9px] text-[#6b6560]">
            <span>Less</span>
            {["bg-[#222222]","bg-[#5b9a6f]/20","bg-[#5b9a6f]/40","bg-[#5b9a6f]/60"].map((c,i)=>(
              <div key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`}/>
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
