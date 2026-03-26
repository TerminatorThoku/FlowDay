"use client";

export default function StreaksPage() {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-[#e8e4dc]">Streaks</h1>
      <p className="text-sm text-[#a8a29e] mt-1">Keep your momentum going</p>

      {/* Streak Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          {label:"Gym",emoji:"\uD83C\uDFCB\uFE0F",current:7,best:14,color:"#5b9a6f"},
          {label:"Study",emoji:"\uD83D\uDCDA",current:5,best:21,color:"#8b7ab8"},
          {label:"Sleep 7h+",emoji:"\uD83D\uDE34",current:12,best:30,color:"#6b8aad"},
          {label:"No Skip",emoji:"\uD83D\uDD25",current:3,best:10,color:"#c8944e"},
        ].map(s=>(
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#222222] flex items-center justify-center text-lg mb-3">{s.emoji}</div>
            <p className="text-xs text-[#6b6560] uppercase tracking-wider">{s.label}</p>
            <p className="font-mono text-3xl font-bold text-[#e8e4dc] mt-1">{s.current}<span className="text-sm font-normal text-[#6b6560] ml-1">days</span></p>
            <p className="text-xs text-[#6b6560] mt-1">Best: {s.best}d</p>
            <div className="mt-3 h-[3px] bg-[#222222] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{width:`${(s.current/s.best)*100}%`, background:s.color}}/>
            </div>
          </div>
        ))}
      </div>

      {/* 14-Day Timeline */}
      <div className="mt-8">
        <h3 className="text-[11px] uppercase tracking-wider text-[#6b6560] mb-3">Streak History</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex justify-between items-end gap-1 overflow-x-auto">
            {Array.from({length: 14}, (_, i) => {
              const date = new Date(Date.now() - (13 - i) * 86400000);
              const isToday = i === 13;
              const completed = [true,true,false,true,true,true,false,true,true,true,true,false,true,true][i];
              const dayLabel = date.toLocaleDateString('en', {weekday:'short'}).slice(0,2);
              const dateNum = date.getDate();
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono transition-all
                    ${completed ? 'bg-[#5b9a6f]/20 border-2 border-[#5b9a6f] text-[#5b9a6f]' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#4a4540]'}
                    ${isToday ? 'ring-2 ring-[#c8a44e] ring-offset-1 ring-offset-[#111111]' : ''}`}>
                    {completed ? '\u2713' : '\u2014'}
                  </div>
                  <span className="text-[9px] text-[#6b6560] font-mono">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
