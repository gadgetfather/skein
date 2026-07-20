import React from 'react';

export default function FocusOverlay({ v }) {
  return (
    <>
      {/* focus / pomodoro takeover (after decide → start this) */}
      {v.focusVisible && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(43,48,52,.55)]">
          <div className="w-[min(760px,86vw)] overflow-hidden rounded-3xl border-[1.8px] border-ink-line bg-paper shadow-[8px_10px_0_rgba(0,0,0,.22)] animate-[popIn_.2s_ease]">
            <div className="flex items-center justify-between px-[22px] py-4 border-b-[1.5px] border-[#dfe4e6]">
              <button onClick={v.toggleAmbient} className="flex cursor-pointer items-center gap-[7px] px-[11px] py-[7px] text-xs font-semibold text-[#4c5257] bg-panel border-[1.5px] border-ink-line rounded-[10px]"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#4c5257" strokeWidth="1.5" strokeLinecap="round"><path d="M3 6v4h3l4 3V3L6 6H3zM12 6a3 3 0 0 1 0 4"/></svg> ambient</button>
              <div className="flex items-center gap-[9px]"><span className="h-[9px] w-[9px] rounded-full" style={{ background: v.focusColor }}></span><span className="text-xs text-[#7b8287]">{v.focusLabel} · <b className="text-ink">focus session</b></span></div>
              <button onClick={v.skipFocus} title="end & log" className="h-[30px] w-[30px] cursor-pointer text-base text-ink-line bg-panel border-[1.5px] border-ink-line rounded-lg">×</button>
            </div>

            <div className="flex items-center justify-center px-11 pt-11 pb-5">
              <div className="relative h-70 w-70 flex-none">
                <div className="absolute inset-[34px] rounded-full bg-[rgba(122,154,111,.14)] animate-[breathe_5s_ease-in-out_infinite]"></div>
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <circle cx="140" cy="140" r="120" fill="none" stroke="#e0e5e6" strokeWidth="14"></circle>
                  <circle cx="140" cy="140" r="120" fill="none" stroke={v.focusColor} strokeWidth="14" strokeLinecap="round" strokeDasharray={v.focusRingDash} transform="rotate(-90 140 140)"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono text-[56px] font-semibold tracking-[1px] text-ink">{v.focusTimeTxt}</div>
                  <div className="mt-0.5 text-xs text-muted">{v.focusEnergyTxt}</div>
                </div>
              </div>
            </div>

            <div className="px-11 pb-1.5 text-center">
              <div className="inline-block px-[18px] py-2.5 text-[15px] text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[11px_8px_12px_7px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">{v.focusStep}</div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-3.5 pb-1">
              <span className="text-xs text-[#a4abae]">length</span>
              {v.focusPresets.map(p => (
                <button key={p.m} onClick={p.onSel} className="cursor-pointer px-2.5 py-1 text-xs border-[1.4px] rounded-lg" style={{ color: p.color, background: p.bg, borderColor: p.border }}>{p.m}</button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-3.5 pb-[26px]">
              <button onClick={v.togglePauseFocus} className="flex cursor-pointer items-center gap-2 px-5 py-[11px] text-[15px] font-bold text-white bg-accent border-[1.6px] border-ink-line rounded-[12px_9px_12px_9px] shadow-[2px_3px_0_rgba(58,64,69,.18)]"><svg width="14" height="14" viewBox="0 0 16 16" fill="#fff"><rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/></svg> {v.focusPauseTxt}</button>
              <button onClick={v.extendFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[9px_11px_8px_12px]">+5 min</button>
              <button onClick={v.skipFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[11px_9px_12px_9px]">skip & log</button>
              <button onClick={v.minimizeFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-muted-2 bg-paper-2 border-[1.5px] border-[#cbd0d2] rounded-[9px_11px_8px_12px]">exit to canvas</button>
            </div>

            {v.focusDone && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(237,240,241,.96)] rounded-3xl">
                <div className="font-hand text-[44px] font-bold text-ink">session complete ✓</div>
                <div className="text-[15px] font-semibold text-accent-deep">logged · streak +1 · nicely done</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* minimized focus pill on canvas */}
      {v.focusPill && (
        <div onClick={v.resumeFromPill} className="fixed left-6 bottom-[22px] z-22 flex cursor-pointer items-center gap-2.5 px-3.5 py-[9px] text-white bg-ink rounded-[14px] shadow-[3px_4px_0_rgba(0,0,0,.25)]">
          <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-white" style={{ background: v.focusColor }}></span>
          <span className="text-xs">{v.focusLabel} · <b className="font-mono">{v.focusTimeTxt}</b></span>
          <span className="text-[11px] opacity-70">tap to resume ▸</span>
        </div>
      )}
    </>
  );
}
