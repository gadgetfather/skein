import React from 'react';

export default function DetailDrawer({ v }) {
  if (!v.selOpen || !v.sel) return null;
  const sel = v.sel;
  return (
    <>
      <div onClick={v.closeDrawer} className="fixed inset-0 z-30 bg-[rgba(43,48,52,.22)]"></div>
      <div className="fixed top-0 right-0 bottom-0 z-[31] flex w-[392px] flex-col overflow-y-auto border-l-[1.8px] border-ink-line bg-[#f4f6f7] px-[26px] py-5 shadow-[-6px_0_0_rgba(58,64,69,.08)] animate-[fadeUp_.18s_ease]">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[.07em] text-muted">interest</span>
          <div className="flex items-center gap-2">
            <button onClick={v.expandCurrent} title="expand to full detail" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-ink-line bg-paper-2"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#3a4045" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h4v4M13 3l-5 5M7 13H3V9M3 13l5-5"/></svg></button>
            <button onClick={v.closeDrawer} className="cursor-pointer border-none bg-transparent p-0 text-[22px] leading-none text-muted">×</button>
          </div>
        </div>
        <input value={sel.label} onChange={v.onRenameInput} placeholder="name…" className="mb-1 w-full border-none bg-transparent font-hand text-[36px] font-bold leading-[1.02] text-ink outline-none"/>
        <input value={sel.meta} onChange={v.onMetaInput} placeholder="a short tag (e.g. language, make)…" className="mb-3 w-full border-none bg-transparent text-[13px] text-[#7b8287] outline-none"/>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[.06em] text-muted">energy it takes</div>
        <div className="mb-3 flex gap-[9px]">
          {sel.dots.map((d, i) => (
            <span key={i} onClick={d.onClick} className="h-5 w-5 cursor-pointer rounded-full border-[1.5px] border-ink-line" style={{ background: d.bg }}></span>
          ))}
        </div>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[.06em] text-muted">group</div>
        <div className="mb-3 flex flex-wrap gap-2">
          {sel.clusterChips.map((c, i) => (
            <button key={i} onClick={c.onSelect} className="cursor-pointer rounded-[10px_8px_11px_8px] border-[1.6px] px-[13px] py-[7px] text-[13px] font-semibold" style={{ color: c.color, background: c.bg, borderColor: c.border }}>{c.label}</button>
          ))}
        </div>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[.06em] text-muted">priority</div>
        <div className="mb-3 flex flex-wrap gap-2">
          {sel.priorityChips.map(p => (
            <button key={p.label} onClick={p.onSelect} className="cursor-pointer rounded-[10px_8px_11px_8px] border-[1.6px] px-[13px] py-[7px] text-[13px] font-semibold" style={{ color: p.color, background: p.bg, borderColor: p.border }}>{p.label}</button>
          ))}
        </div>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[.06em] text-muted">notes</div>
        <textarea value={sel.note} onChange={v.onNoteInput} placeholder="why does this pull at you? where did you leave off?" className="mb-3 h-[104px] min-h-12 w-full resize-none rounded-xl border-[1.6px] border-ink-line bg-paper-2 p-3 text-sm leading-[1.5] text-ink outline-none shadow-[inset_1px_1px_0_rgba(58,64,69,.06)]"></textarea>

        <div className="mb-2 text-xs font-semibold uppercase tracking-[.06em] text-muted">next steps</div>
        {sel.steps.map(st => (
          <div key={st.id} className="flex items-center gap-[9px] py-[5px]">
            <button onClick={st.onToggle} className="flex h-[18px] w-[18px] flex-none cursor-pointer items-center justify-center rounded-[5px] border-[1.6px] border-ink-line text-xs leading-none text-white" style={{ background: st.box }}>{st.check}</button>
            <span className="flex-1 text-sm" style={{ color: st.col, textDecoration: st.deco }}>{st.text}</span>
            <button onClick={st.onRemove} className="cursor-pointer border-none bg-transparent text-base leading-none text-[#b3babd]">×</button>
          </div>
        ))}
        {sel.noSteps && (
          <div className="pt-[2px] pb-1 text-xs text-[#a4abae]">No steps yet — add one, or <button onClick={sel.onSuggest} className="cursor-pointer border-none bg-transparent p-0 font-semibold text-accent">✦ suggest with AI</button></div>
        )}
        {v.aiBusy && (
          <div className="py-[2px] text-xs text-accent">✦ thinking…</div>
        )}
        <div className="mt-2 mb-3 flex flex-none gap-2">
          <input value={v.stepDraft} onChange={v.onStepDraft} onKeyDown={sel.onStepKey} placeholder="add a step — e.g. read chapter 4" className="flex-1 rounded-[9px] border-[1.5px] border-ink-line bg-paper-2 px-2.5 py-2 text-[13px] text-ink outline-none"/>
          <button onClick={sel.onAddStep} className="cursor-pointer rounded-[9px] border-[1.5px] border-ink-line bg-accent px-3 py-2 text-[13px] font-bold text-white">add</button>
        </div>

        <div className="mb-3 flex flex-none items-center justify-between">
          <span className="text-[13px] text-[#7b8287]">last touched · <b className="text-ink">{sel.touched}</b></span>
          <button onClick={v.logToday} className="cursor-pointer rounded-[10px_8px_11px_8px] border-[1.6px] border-ink-line bg-accent px-3.5 py-2 text-[13px] font-semibold text-white shadow-[2px_3px_0_rgba(58,64,69,.16)]">did this today ✓</button>
        </div>

        <button onClick={v.deleteSelected} className="mt-auto flex cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border-[1.5px] border-[#cbd0d2] bg-paper-2 p-[11px] text-[13px] font-semibold text-muted-2">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#6c7378" strokeWidth="1.4" strokeLinecap="round"><path d="M2 3.5h10M5 3.5V2h4v1.5M3.5 3.5l.6 8h5.8l.6-8"/></svg>
          delete this interest
        </button>
      </div>
    </>
  );
}
