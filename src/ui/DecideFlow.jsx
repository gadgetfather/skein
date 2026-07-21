import React from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import CalmLoader from './CalmLoader';
import { fadeBackdrop, modalSurface } from './motion/tokens';

function ModalStage({ children, width }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[41] flex items-center justify-center p-3">
      <m.div
        {...modalSurface}
        className={`pointer-events-auto max-h-[calc(100dvh-24px)] w-full ${width} overflow-y-auto rounded-[18px] border-[1.8px] border-ink-line bg-panel p-5 shadow-[6px_8px_0_rgba(58,64,69,.18)] sm:p-[26px]`}
      >
        {children}
      </m.div>
    </div>
  );
}

export default function DecideFlow({ v }) {
  return (
    <>
      <AnimatePresence>
        {v.modalOpen && <m.div key="decide-backdrop" {...fadeBackdrop} onClick={v.closeDecide} className="fixed inset-0 z-40 bg-[rgba(43,48,52,.28)] backdrop-blur-[2px]" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {v.phaseMenu && (
          <ModalStage key="decide-menu" width="max-w-[440px]">
            <div className="font-hand text-[28px] font-bold text-ink">feeling scattered?</div>
            <div className="mt-0.5 mb-4 text-[13px] text-[#7b8287]">two ways to land on one thing.</div>
            {v.hasNeglect && (
              <div className="mb-4 flex items-start gap-2 rounded-[10px_8px_11px_8px] border-[1.4px] border-accent bg-[rgba(122,154,111,.12)] px-3 py-[9px] text-[12.5px] leading-[1.4] text-[#4c5257]">
                <span className="text-sm leading-[1.1] text-accent">✦</span><span>{v.neglectNote}</span>
              </div>
            )}
            <m.button data-tour="decide-menu" whileTap={{scale:.985}} onClick={v.startShuffle} className="mb-3 flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left text-white bg-accent rounded-[13px_10px_13px_10px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)]">
              <svg width="26" height="26" viewBox="0 0 16 16" className="flex-none"><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="#fff" strokeWidth="1.5"/><circle cx="5" cy="5" r="1.3" fill="#fff"/><circle cx="11" cy="5" r="1.3" fill="#fff"/><circle cx="8" cy="8" r="1.3" fill="#fff"/><circle cx="5" cy="11" r="1.3" fill="#fff"/><circle cx="11" cy="11" r="1.3" fill="#fff"/></svg>
              <span><span className="block text-base font-bold">just pick for me</span><span className="text-xs opacity-90">weighs calling, continuity, and quiet threads</span></span>
            </m.button>
            <m.button whileTap={{scale:.985}} onClick={v.startFilter} className="flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left text-ink bg-paper-2 rounded-[10px_13px_10px_13px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.12)]">
              <svg width="26" height="26" viewBox="0 0 16 16" className="flex-none" fill="none" stroke="#2b3034" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h12l-4.5 5.5V14L6.5 12V8.5z"/></svg>
              <span><span className="block text-base font-bold">ask me 3 things</span><span className="text-xs text-[#7b8287]">time · energy · mood, then a match</span></span>
            </m.button>
          </ModalStage>
        )}

        {v.phaseFilter && (
          <ModalStage key="decide-filter" width="max-w-[480px]">
            <div className="font-hand text-[28px] font-bold text-ink">where are you right now?</div>
            <div className="mt-0.5 mb-[18px] text-[13px] text-[#7b8287]">tap what fits — I'll narrow it down.</div>
            {v.filterGroups.map(g => (
              <div key={g.q} className="mb-4">
                <div className="mb-2 text-[13px] font-semibold text-ink">{g.q}</div>
                <div className="flex flex-wrap gap-2">
                  {g.options.map(o => (
                    <button key={o.label} onClick={o.onSelect} className="cursor-pointer px-3.5 py-[7px] text-[13px] font-semibold rounded-[10px_8px_11px_8px] border-[1.6px]" style={{ color: o.color, background: o.bg, borderColor: o.border }}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))}
            <m.button whileTap={{scale:.985}} onClick={v.runFilter} className="mt-1.5 w-full cursor-pointer p-3 font-hand text-[22px] font-bold text-white bg-accent rounded-[12px_10px_12px_10px] border-[1.8px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)]">show me one thing →</m.button>
          </ModalStage>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {v.resultOpen && <m.div key="result-backdrop" {...fadeBackdrop} onClick={v.closeResult} className="fixed inset-0 z-40 bg-[rgba(43,48,52,.28)] backdrop-blur-[2px]" />}
        {v.resultOpen && (
          <ModalStage key="result" width="max-w-[420px]">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-[8px] border-[1.3px] border-[#c9d0d2] bg-paper-2 px-2 py-1 text-[9px] font-bold uppercase tracking-[.09em] text-muted">picked thread</span>
              <span className="font-hand text-[21px] font-bold leading-none text-ink">{v.chosenLabel}</span>
              <span className="rounded-[8px] border-[1.3px] border-accent bg-[rgba(122,154,111,.12)] px-2 py-1 text-[10px] text-accent-deep">{v.chosenReason}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {v.chosenStepBusy ? (
                <m.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><CalmLoader label="shaping one reachable move…" detail="using where you are now, not the whole destination"/></m.div>
              ) : (
                <m.div key="result-content" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="text-[12px] font-semibold uppercase tracking-[.08em] text-muted">your next move →</div>
                  <div className="mt-1.5 font-hand text-[34px] leading-[1.06] font-bold text-ink sm:text-[38px]">{v.chosenStep}</div>
                  <div className="mt-3 text-[12.5px] leading-[1.45] text-[#5c6166]">{v.chosenWhy}</div>
                  <div className="mt-4 rounded-[11px_8px_12px_7px] border-[1.5px] border-ink-line bg-paper-2 p-3.5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
                    <div className="mb-2 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[.07em] text-muted"><span>finish line for this move</span>{v.chosenStepSource&&<span className="normal-case font-semibold tracking-normal text-accent-deep">{v.chosenStepSource}</span>}</div>
                    <div className="flex flex-wrap items-start gap-2 text-[11px] leading-[1.45] text-muted-2">{v.chosenDuration&&<span className="rounded-md bg-[rgba(122,154,111,.12)] px-1.5 py-0.5 font-semibold text-accent-deep">~{v.chosenDuration} min</span>}{v.chosenDoneWhen&&<span><b className="text-ink">done when:</b> {v.chosenDoneWhen}</span>}</div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
            {v.hasCombo && (
              <div className="mt-3 bg-transparent px-3.5 py-[11px] rounded-[11px_8px_12px_7px] border-[1.4px] border-dashed border-[#b6bec1]">
                <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-muted">✦ or, two-in-one with {v.chosenComboPartner}</div>
                <div className="mt-1 text-[13px] leading-[1.35] text-muted-2">{v.chosenCombo}</div>
              </div>
            )}
            <div className="mt-[18px] flex flex-col gap-2.5 sm:flex-row">
              <m.button whileTap={{scale:.98}} onClick={v.startThis} disabled={v.chosenStepBusy} className="flex-1 cursor-pointer p-[11px] text-[15px] font-bold text-white bg-accent rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)] disabled:cursor-wait disabled:opacity-60">{v.chosenStepBusy?'shaping the step…':'start this'}</m.button>
              <button onClick={v.notToday} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.1)]">not today ↻</button>
            </div>
          </ModalStage>
        )}
      </AnimatePresence>
    </>
  );
}
