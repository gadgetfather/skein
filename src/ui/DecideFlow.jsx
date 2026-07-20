import React from 'react';

export default function DecideFlow({ v }) {
  return (
    <>
      {/* decide: menu / filter modal */}
      {v.modalOpen && (
        <>
          <div onClick={v.closeDecide} className="fixed inset-0 z-40 bg-[rgba(43,48,52,.28)] backdrop-blur-[2px]"></div>

          {v.phaseMenu && (
            <div className="fixed top-1/2 left-1/2 z-[41] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-[1.8px] border-ink-line bg-panel p-[26px] shadow-[6px_8px_0_rgba(58,64,69,.18)] animate-[popIn_.18s_ease]">
              <div className="font-hand text-[28px] font-bold text-ink">feeling scattered?</div>
              <div className="mt-0.5 mb-4 text-[13px] text-[#7b8287]">two ways to land on one thing.</div>
              {v.hasNeglect && (
                <div className="mb-4 flex items-start gap-2 rounded-[10px_8px_11px_8px] border-[1.4px] border-accent bg-[rgba(122,154,111,.12)] px-3 py-[9px] text-[12.5px] leading-[1.4] text-[#4c5257]">
                  <span className="text-sm leading-[1.1] text-accent">✦</span><span>{v.neglectNote}</span>
                </div>
              )}
              <button onClick={v.startShuffle} className="mb-3 flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left text-white bg-accent rounded-[13px_10px_13px_10px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)]">
                <svg width="26" height="26" viewBox="0 0 16 16" className="flex-none"><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="#fff" strokeWidth="1.5"/><circle cx="5" cy="5" r="1.3" fill="#fff"/><circle cx="11" cy="5" r="1.3" fill="#fff"/><circle cx="8" cy="8" r="1.3" fill="#fff"/><circle cx="5" cy="11" r="1.3" fill="#fff"/><circle cx="11" cy="11" r="1.3" fill="#fff"/></svg>
                <span><span className="block text-base font-bold">just pick for me</span><span className="text-xs opacity-90">weighs calling, continuity, and quiet threads</span></span>
              </button>
              <button onClick={v.startFilter} className="flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left text-ink bg-paper-2 rounded-[10px_13px_10px_13px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.12)]">
                <svg width="26" height="26" viewBox="0 0 16 16" className="flex-none" fill="none" stroke="#2b3034" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h12l-4.5 5.5V14L6.5 12V8.5z"/></svg>
                <span><span className="block text-base font-bold">ask me 3 things</span><span className="text-xs text-[#7b8287]">time · energy · mood, then a match</span></span>
              </button>
            </div>
          )}

          {v.phaseFilter && (
            <div className="fixed top-1/2 left-1/2 z-[41] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-[1.8px] border-ink-line bg-panel p-[26px] shadow-[6px_8px_0_rgba(58,64,69,.18)] animate-[popIn_.18s_ease]">
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
              <button onClick={v.runFilter} className="mt-1.5 w-full cursor-pointer p-3 font-hand text-[22px] font-bold text-white bg-accent rounded-[12px_10px_12px_10px] border-[1.8px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)]">show me one thing →</button>
            </div>
          )}
        </>
      )}

      {/* result card */}
      {v.resultOpen && (
        <>
          <div onClick={v.closeResult} className="fixed inset-0 z-40 bg-[rgba(43,48,52,.28)] backdrop-blur-[2px]"></div>
          <div className="fixed top-1/2 left-1/2 z-[41] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-[1.8px] border-ink-line bg-panel p-[26px] shadow-[6px_8px_0_rgba(58,64,69,.18)] animate-[popIn_.2s_ease]">
            <div className="text-[13px] text-[#7b8287]">right now, do this →</div>
            <div className="mt-1.5 mb-1 font-hand text-[38px] leading-[1.05] font-bold text-ink">{v.chosenLabel}</div>
            <div className="mb-2 inline-block px-2.5 py-[3px] text-xs text-accent-deep bg-[rgba(122,154,111,.14)] rounded-[9px] border-[1.4px] border-accent">{v.chosenReason}</div>
            <div className="mb-4 text-[12.5px] leading-[1.45] text-[#5c6166]">{v.chosenWhy}</div>
            <div className="p-3.5 bg-paper-2 rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="mb-[5px] flex items-center justify-between gap-2 text-[11px] uppercase tracking-[.06em] text-[#90999d]"><span>your reachable move</span>{v.chosenStepSource&&<span className="normal-case tracking-normal text-accent-deep">{v.chosenStepSource}</span>}</div>
              <div className="text-base leading-[1.35] text-ink">{v.chosenStep}</div>
              {!v.chosenStepBusy&&(v.chosenDoneWhen||v.chosenDuration)&&<div className="mt-2.5 flex flex-wrap items-center gap-2 border-t-[1.2px] border-dashed border-[#d3d9db] pt-2 text-[11px] text-muted-2">{v.chosenDuration&&<span className="rounded-md bg-[rgba(122,154,111,.12)] px-1.5 py-0.5 font-semibold text-accent-deep">~{v.chosenDuration} min</span>}{v.chosenDoneWhen&&<span><b className="text-ink">done when:</b> {v.chosenDoneWhen}</span>}</div>}
            </div>
            {v.hasCombo && (
              <div className="mt-3 bg-transparent px-3.5 py-[11px] rounded-[11px_8px_12px_7px] border-[1.4px] border-dashed border-[#b6bec1]">
                <div className="text-[11px] font-semibold uppercase tracking-[.06em] text-muted">✦ or, two-in-one with {v.chosenComboPartner}</div>
                <div className="mt-1 text-[13px] leading-[1.35] text-muted-2">{v.chosenCombo}</div>
              </div>
            )}
            <div className="mt-[18px] flex gap-2.5">
              <button onClick={v.startThis} disabled={v.chosenStepBusy} className="flex-1 cursor-pointer p-[11px] text-[15px] font-bold text-white bg-accent rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)] disabled:cursor-wait disabled:opacity-60">{v.chosenStepBusy?'shaping the step…':'start this'}</button>
              <button onClick={v.notToday} className="cursor-pointer px-4 py-[11px] text-sm font-semibold text-ink bg-paper-2 rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.1)]">not today ↻</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
