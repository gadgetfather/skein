import React from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { fadeBackdrop, modalSurface } from './motion/tokens';

export default function FocusOverlay({ v }) {
  return (
    <>
      {/* focus / pomodoro takeover (after decide → start this) */}
      <AnimatePresence>{v.focusVisible && (
        <m.div {...fadeBackdrop} className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(43,48,52,.55)] p-3">
          <m.div {...modalSurface} className="max-h-[calc(100dvh-24px)] w-full max-w-[760px] overflow-y-auto rounded-3xl border-[1.8px] border-ink-line bg-paper shadow-[8px_10px_0_rgba(0,0,0,.22)]">
            <div className="flex items-center justify-between px-[22px] py-4 border-b-[1.5px] border-[#dfe4e6]">
              <div className="flex items-center gap-[9px]"><span className="h-[9px] w-[9px] rounded-full" style={{ background: v.focusColor }}></span><span className="text-xs text-[#7b8287]">{v.focusLabel} · <b className="text-ink">focus session</b></span></div>
              <button onClick={v.skipFocus} title="end & log" className="h-[30px] w-[30px] cursor-pointer text-base text-ink-line bg-panel border-[1.5px] border-ink-line rounded-lg">×</button>
            </div>

            <div className="flex items-center justify-center px-5 pt-6 pb-4 sm:px-11 sm:pt-11 sm:pb-5">
              <div className="relative h-[220px] w-[220px] flex-none sm:h-70 sm:w-70">
                <div className="absolute inset-[34px] rounded-full bg-[rgba(122,154,111,.14)] animate-[breathe_5s_ease-in-out_infinite]"></div>
                <svg width="100%" height="100%" viewBox="0 0 280 280">
                  <circle cx="140" cy="140" r="120" fill="none" stroke="#e0e5e6" strokeWidth="14"></circle>
                  <circle cx="140" cy="140" r="120" fill="none" stroke={v.focusColor} strokeWidth="14" strokeLinecap="round" strokeDasharray={v.focusRingDash} transform="rotate(-90 140 140)"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono text-[44px] font-semibold tracking-[1px] text-ink sm:text-[56px]">{v.focusTimeTxt}</div>
                  <div className="mt-0.5 text-xs text-muted">{v.focusEnergyTxt}</div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-1.5 text-center sm:px-11">
              <div className="inline-block px-[18px] py-2.5 text-[15px] text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[11px_8px_12px_7px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">{v.focusStep}</div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-3.5 pb-1">
              <span className="text-xs text-[#a4abae]">length</span>
              {v.focusPresets.map(p => (
                <button key={p.m} onClick={p.onSel} className="cursor-pointer px-2.5 py-1 text-xs border-[1.4px] rounded-lg" style={{ color: p.color, background: p.bg, borderColor: p.border }}>{p.m}</button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 px-4 pt-3.5 pb-[max(20px,env(safe-area-inset-bottom))] sm:gap-3 sm:px-0 sm:pb-[26px]">
              <button onClick={v.togglePauseFocus} className="flex cursor-pointer items-center gap-2 px-5 py-[11px] text-[15px] font-bold text-white bg-accent border-[1.6px] border-ink-line rounded-[12px_9px_12px_9px] shadow-[2px_3px_0_rgba(58,64,69,.18)]"><svg width="14" height="14" viewBox="0 0 16 16" fill="#fff"><rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/></svg> {v.focusPauseTxt}</button>
              <button onClick={v.extendFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[9px_11px_8px_12px]">+5 min</button>
              <button onClick={v.skipFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 border-[1.6px] border-ink-line rounded-[11px_9px_12px_9px]">skip & log</button>
              <button onClick={v.minimizeFocus} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-muted-2 bg-paper-2 border-[1.5px] border-[#cbd0d2] rounded-[9px_11px_8px_12px]">keep running on canvas</button>
            </div>

            {v.focusDone && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(237,240,241,.96)] rounded-3xl">
                <div className="font-hand text-[44px] font-bold text-ink">session complete ✓</div>
                <div className="text-[15px] font-semibold text-accent-deep">logged · streak +1 · nicely done</div>
              </div>
            )}
          </m.div>
        </m.div>
      )}</AnimatePresence>

      {/* minimized focus pill on canvas */}
      <AnimatePresence>{v.focusPill && (
        <m.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} onClick={v.resumeFromPill} className="fixed right-3 bottom-[86px] left-3 z-22 flex cursor-pointer items-center justify-center gap-2.5 px-3.5 py-[9px] text-white bg-ink rounded-[14px] shadow-[3px_4px_0_rgba(0,0,0,.25)] sm:right-auto sm:bottom-[22px] sm:left-6 sm:justify-start">
          <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-white" style={{ background: v.focusColor }}></span>
          <span className="text-xs">{v.focusLabel} · <b className="font-mono">{v.focusTimeTxt}</b></span>
          <span className="text-[11px] opacity-70">tap to resume ▸</span>
        </m.div>
      )}</AnimatePresence>
    </>
  );
}
