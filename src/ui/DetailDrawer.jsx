import React from 'react';

const directionMeta = {
  directed: { icon:'↗', label:'directed' },
  open: { icon:'∞', label:'open-ended' },
  unclear: { icon:'?', label:'unclear' },
};

export default function DetailDrawer({ v }) {
  if (!v.selOpen || !v.sel) return null;
  const sel = v.sel;
  const direction = directionMeta[sel.directionState] || directionMeta.unclear;

  return (
    <>
      <div onClick={v.closeDrawer} className="fixed inset-0 z-30 bg-[rgba(43,48,52,.22)]"></div>
      <aside aria-label={`${sel.label} interest details`} className="fixed inset-0 z-[31] flex w-full flex-col overflow-y-auto bg-[#f4f6f7] px-5 py-5 pb-[max(20px,env(safe-area-inset-bottom))] animate-[fadeUp_.18s_ease] sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[400px] sm:border-l-[1.8px] sm:border-ink-line sm:px-6 sm:shadow-[-6px_0_0_rgba(58,64,69,.08)]">
        <header className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[.1em] text-muted">interest</span>
            <div className="flex items-center gap-2">
              <button onClick={v.expandCurrent} title="expand to full detail" aria-label="expand to full detail" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[9px_7px_10px_8px] border-[1.5px] border-ink-line bg-paper-2 transition-transform hover:-rotate-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#3a4045" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h4v4M13 3l-5 5M7 13H3V9M3 13l5-5"/></svg>
              </button>
              <button onClick={v.closeDrawer} aria-label="close interest details" className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[25px] leading-none text-muted transition-colors hover:text-ink">×</button>
            </div>
          </div>
          <input value={sel.label} onChange={v.onRenameInput} placeholder="name…" aria-label="interest name" className="w-full border-none bg-transparent font-hand text-[34px] font-bold leading-[1.02] text-ink outline-none"/>
          <input value={sel.meta} onChange={v.onMetaInput} placeholder="add a short tag…" aria-label="interest tag" className="mt-1 w-full border-none bg-transparent text-[12px] text-[#7b8287] outline-none"/>
        </header>

        <section aria-labelledby="direction-heading" className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 id="direction-heading" className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted">direction</h2>
            <span className="flex items-center gap-1 font-hand text-[15px] font-semibold text-accent-deep"><span>{direction.icon}</span>{direction.label}</span>
          </div>
          <textarea value={sel.direction} onChange={v.onDirectionInput} placeholder={sel.directionPrompt} aria-label="direction" className="h-[68px] min-h-[58px] w-full resize-none rounded-[12px_9px_13px_8px] border-[1.7px] border-ink-line bg-paper-2 px-3 py-2.5 text-[14px] leading-[1.4] text-ink outline-none shadow-[inset_1px_1px_0_rgba(58,64,69,.06)] focus:border-accent"></textarea>
          <label className="mt-2.5 block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.08em] text-muted">you are here</span>
            <input value={sel.currentPosition} onChange={v.onCurrentPositionInput} placeholder="what is true right now?" className="w-full rounded-[10px_8px_11px_8px] border-[1.5px] border-[#aeb6ba] bg-paper-2 px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"/>
          </label>
        </section>

        <button onClick={sel.onOpenRoute} className="group mb-5 flex w-full cursor-pointer items-center justify-between rounded-[11px_8px_12px_9px] border-[1.5px] border-ink-line bg-[rgba(176,151,90,.1)] px-3.5 py-2.5 text-left shadow-[1px_2px_0_rgba(58,64,69,.09)] transition-transform hover:-translate-y-px">
          <span>
            <span className="block font-hand text-[19px] font-bold leading-none text-ink">route map</span>
            <span className="mt-1 block text-[10px] text-muted-2">{sel.routeCount?sel.routeCount+' mapped '+(sel.routeCount===1?'move':'moves'):'map what unlocks the way'}</span>
          </span>
          <span className="font-hand text-[24px] leading-none text-[#b0975a] transition-transform group-hover:translate-x-1">→</span>
        </button>

        <section aria-labelledby="moves-heading" className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 id="moves-heading" className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted">next moves</h2>
            <button onClick={sel.onSuggest} disabled={v.aiBusy} className="cursor-pointer border-none bg-transparent p-0 text-[11px] font-semibold text-accent disabled:cursor-wait disabled:opacity-60">{v.aiBusy?'✦ thinking…':'✦ suggest a move'}</button>
          </div>

          <div className="space-y-1">
            {sel.steps.map(st => (
              <div key={st.id} className="group/step flex items-start gap-2 rounded-[8px] px-1 py-1.5 hover:bg-[rgba(122,154,111,.06)]">
                <button onClick={st.onToggle} aria-label={st.done?'mark step incomplete':'mark step complete'} className="mt-0.5 flex h-[17px] w-[17px] flex-none cursor-pointer items-center justify-center rounded-[5px] border-[1.5px] border-ink-line text-[10px] leading-none text-white" style={{ background: st.box }}>{st.check}</button>
                <span className="min-w-0 flex-1 text-[13px] leading-[1.35]" style={{ color: st.col, textDecoration: st.deco }}>{st.text}</span>
                <button onClick={st.onRemove} aria-label="remove step" className="cursor-pointer border-none bg-transparent px-1 text-base leading-none text-[#b3babd] opacity-0 transition-opacity group-hover/step:opacity-100 focus:opacity-100">×</button>
              </div>
            ))}
          </div>

          {sel.noSteps && <p className="mb-2 text-[12px] text-[#929a9e]">No saved move yet. Add one or let Skein suggest it.</p>}

          <div className="flex gap-2">
            <input value={v.stepDraft} onChange={v.onStepDraft} onKeyDown={sel.onStepKey} placeholder="add a small next move…" className="min-w-0 flex-1 rounded-[9px] border-[1.5px] border-ink-line bg-paper-2 px-2.5 py-2 text-[13px] text-ink outline-none focus:border-accent"/>
            <button onClick={sel.onAddStep} aria-label="add next move" className="flex h-[38px] w-[42px] cursor-pointer items-center justify-center rounded-[9px_7px_10px_8px] border-[1.5px] border-ink-line bg-accent font-hand text-[22px] font-bold text-white shadow-[1px_2px_0_rgba(58,64,69,.14)]">+</button>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between gap-3 rounded-[10px_8px_11px_9px] bg-[rgba(122,154,111,.07)] px-3 py-2.5">
          <span className="text-[11px] text-[#7b8287]">last touched <b className="text-ink">{sel.touched}</b></span>
          <button onClick={v.logToday} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.4px] border-ink-line bg-accent px-3 py-1.5 text-[11px] font-semibold text-white shadow-[1px_2px_0_rgba(58,64,69,.14)]">mark today ✓</button>
        </div>

        <details className="group/settings mt-auto rounded-[10px_8px_11px_9px] border-[1.4px] border-dashed border-[#c5cccf] bg-[rgba(251,251,250,.55)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-[11px] font-semibold text-muted-2 outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(122,154,111,.35)] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2"><span className="inline-block transition-transform group-open/settings:rotate-90">›</span>details &amp; settings</span>
            <span className="truncate font-normal text-[#9aa1a5]">{sel.posture} · {sel.season}</span>
          </summary>

          <div className="border-t-[1px] border-dashed border-[#d2d7d9] px-3 pt-3 pb-3">
            <div className="mb-3">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.07em] text-muted">direction type</div>
              <div className="flex flex-wrap gap-1.5">
                {sel.directionStateChips.map(p => (
                  <button key={p.label} onClick={p.onSelect} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.4px] px-2 py-1 text-[10px] font-semibold" style={{ color:p.color,background:p.bg,borderColor:p.border }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.07em] text-muted">posture</div>
                <div className="flex flex-wrap gap-1.5">{sel.postureChips.map(p => (<button key={p.label} onClick={p.onSelect} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.4px] px-2 py-1 text-[10px] font-semibold" style={{ color:p.color,background:p.bg,borderColor:p.border }}>{p.label}</button>))}</div>
              </div>
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.07em] text-muted">season</div>
                <div className="flex flex-wrap gap-1.5">{sel.seasonChips.map(p => (<button key={p.label} onClick={p.onSelect} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.4px] px-2 py-1 text-[10px] font-semibold" style={{ color:p.color,background:p.bg,borderColor:p.border }}>{p.label}</button>))}</div>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.07em] text-muted">energy</div>
                <div className="flex gap-1.5">{sel.dots.map((d, i) => (<button key={i} onClick={d.onClick} aria-label={`energy ${i+1}`} className="h-[18px] w-[18px] cursor-pointer rounded-full border-[1.4px] border-ink-line" style={{ background:d.bg }}></button>))}</div>
              </div>
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.07em] text-muted">group</div>
                <div className="flex flex-wrap gap-1">{sel.clusterChips.map((c, i) => (<button key={i} onClick={c.onSelect} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.3px] px-2 py-1 text-[9px] font-semibold" style={{ color:c.color,background:c.bg,borderColor:c.border }}>{c.label}</button>))}</div>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.07em] text-muted">private context</span>
              <textarea value={sel.note} onChange={v.onNoteInput} placeholder="why this matters, references, things worth remembering…" className="h-[72px] w-full resize-none rounded-[9px] border-[1.4px] border-[#c5cccf] bg-paper-2 p-2.5 text-[12px] leading-[1.4] text-ink outline-none focus:border-accent"></textarea>
            </label>

            <button onClick={v.deleteSelected} className="mt-3 cursor-pointer border-none bg-transparent p-0 text-[10px] font-semibold text-[#9a6d67] underline decoration-dashed underline-offset-4">delete this interest</button>
          </div>
        </details>
      </aside>
    </>
  );
}
