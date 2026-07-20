import React from 'react';

export default function Onboarding({ v }) {
  if (!v.showOnboarding) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-size-[26px_26px] transition-opacity duration-400 ease-[ease]" style={{ opacity: v.onbOpacity }}>
      <div className="absolute left-30 top-30 h-[70px] w-[130px] bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[11px_8px_12px_7px] opacity-35 animate-[floaty2_7s_ease-in-out_infinite]"></div>
      <div className="absolute right-[150px] top-40 h-[66px] w-30 bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[10px_9px_11px_8px] opacity-30 animate-[floaty2_8s_ease-in-out_infinite]"></div>
      <div className="absolute left-55 bottom-[150px] h-[66px] w-30 bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[9px_11px_8px_12px] opacity-[.28] animate-[floaty2_9s_ease-in-out_infinite]"></div>
      <div className="absolute right-[210px] bottom-[170px] h-[70px] w-[130px] bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[11px_8px_12px_8px] opacity-30 animate-[floaty2_7.5s_ease-in-out_infinite]"></div>

      <div className="absolute top-[22px] left-[26px] flex items-baseline gap-2.5">
        <span className="font-hand text-[26px] font-bold text-ink">Skein</span>
        <span className="text-xs text-[#a4abae]">parallel interests, one calm canvas</span>
      </div>

      <div className="absolute left-1/2 top-1/2 w-[min(760px,90vw)] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="min-h-[54px] font-hand text-[46px] font-bold leading-[1.05] text-ink transition-opacity duration-400 ease-[ease]" style={{ opacity: v.hOpacity }}>{v.headline}</div>
        <div className="mt-2 mb-6 text-[15px] text-[#7b8287]">Type what's on your mind — a whole sentence is fine. I'll untangle it into a map.</div>

        <div className="flex items-center gap-3 px-3.5 py-3 text-left bg-paper-2 border-[1.8px] border-ink-line rounded-[16px_13px_15px_12px] shadow-[3px_4px_0_rgba(58,64,69,.13)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#8a9196" strokeWidth="1.8" strokeLinecap="round"><path d="M9 3v12M3 9h12"/></svg>
          <input value={v.inputVal} onChange={v.onbInput} onKeyDown={v.onbKey} placeholder="I want to learn Japanese, get fit, and finally ship my game…" className="flex-1 border-none outline-none bg-transparent text-base text-ink"/>
          <button onClick={v.toggleMic} title="speak your thoughts" className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-[1.6px] border-ink-line" style={{ background: v.micBg, animation: v.micAnim }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={v.micStroke} strokeWidth="1.6" strokeLinecap="round"><rect x="6" y="2" width="4" height="8" rx="2"/><path d="M4 8a4 4 0 0 0 8 0M8 12v2"/></svg>
          </button>
          <button onClick={v.weave} disabled={v.weaving} title="weave into a map" className="flex cursor-pointer items-center gap-[7px] px-4 py-[9px] text-[15px] font-bold text-white bg-accent border-[1.6px] border-ink-line rounded-[12px_10px_12px_9px] shadow-[2px_2px_0_rgba(58,64,69,.18)] disabled:cursor-wait disabled:opacity-70">{v.weaving ? 'weaving…' : 'weave'}<span className="text-[15px]" style={v.weaving ? { animation:'micPulse 1.4s ease-in-out infinite', display:'inline-block' } : undefined}>✦</span></button>
        </div>
        <div className="mt-2 h-4 text-xs text-accent">{v.micNote}</div>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="font-hand text-[18px] text-[#a4abae]">try:</span>
          {v.onbChips.map(c => (
            <button key={c.short} onClick={c.onClick} className="cursor-pointer px-[13px] py-[7px] text-[12.5px] text-[#4c5257] bg-panel border-[1.5px] border-[#b7bec1] rounded-[10px_8px_11px_8px]">{c.short}</button>
          ))}
        </div>

        <div className="mt-[26px]">
          <button onClick={v.loadExample} className="cursor-pointer bg-transparent p-0 pb-px text-sm font-semibold text-accent border-b-[1.5px] border-dashed border-accent">or explore an example canvas →</button>
        </div>
      </div>
    </div>
  );
}
