import React, { useEffect, useRef, useState } from 'react';

const directionMeta = {
  directed: { icon:'↗', label:'directed' },
  open: { icon:'∞', label:'open-ended' },
  unclear: { icon:'?', label:'unclear' },
};

export default function DetailDrawer({ v }) {
  const [groupOpen,setGroupOpen]=useState(false);
  const [groupQuery,setGroupQuery]=useState('');
  const [newGroupName,setNewGroupName]=useState('');
  const groupPickerRef=useRef(null);
  useEffect(()=>{setGroupOpen(false);setGroupQuery('');setNewGroupName('');},[v.selOpen,v.sel?.id]);
  useEffect(()=>{
    if(!groupOpen)return;
    const onPointerDown=e=>{if(groupPickerRef.current&&!groupPickerRef.current.contains(e.target))setGroupOpen(false);};
    const onKeyDown=e=>{if(e.key==='Escape')setGroupOpen(false);};
    document.addEventListener('pointerdown',onPointerDown);
    window.addEventListener('keydown',onKeyDown);
    return ()=>{document.removeEventListener('pointerdown',onPointerDown);window.removeEventListener('keydown',onKeyDown);};
  },[groupOpen]);
  if (!v.selOpen || !v.sel) return null;
  const sel = v.sel;
  const direction = directionMeta[sel.directionState] || directionMeta.unclear;
  const currentGroup=sel.clusterChips.find(c=>c.active)||sel.clusterChips[0];
  const query=groupQuery.trim().toLowerCase();
  const visibleGroups=sel.clusterChips.filter(c=>!query||c.label.toLowerCase().includes(query));
  const createGroup=e=>{e.preventDefault();const name=newGroupName.trim();if(!name)return;sel.onCreateGroup(name);setNewGroupName('');setGroupQuery('');setGroupOpen(false);};

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

        <section aria-label="Interest group and energy" className="relative mb-5 flex items-start justify-between gap-4 border-y-[1px] border-dashed border-[#cbd1d3] py-3">
          <div ref={groupPickerRef} className="min-w-0 flex-1">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.08em] text-muted">group</div>
            <button onClick={()=>setGroupOpen(open=>!open)} aria-haspopup="listbox" aria-expanded={groupOpen} className="flex h-[34px] max-w-full cursor-pointer items-center gap-2 rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-paper-2 px-2.5 text-left text-[11px] font-semibold text-ink shadow-[1px_2px_0_rgba(58,64,69,.08)] transition-transform hover:-translate-y-px">
              <span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-full border border-ink-line/30" style={{background:currentGroup?.tone||'#8a9196'}}></span>
              <span className="min-w-0 truncate">{currentGroup?.label||'choose a group'}</span>
              <span aria-hidden="true" className={`ml-auto text-[10px] text-muted transition-transform ${groupOpen?'rotate-180':''}`}>⌄</span>
            </button>

            {groupOpen&&<div className="absolute top-[calc(100%+8px)] right-0 left-0 z-[55] rounded-[14px_10px_15px_11px] border-[1.6px] border-ink-line bg-panel p-3 shadow-[4px_5px_0_rgba(58,64,69,.16)] animate-[fadeUp_.14s_ease]">
              <label className="relative block"><span className="sr-only">Search groups</span><svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute top-1/2 left-3 -translate-y-1/2 text-muted"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg><input autoFocus value={groupQuery} onChange={e=>setGroupQuery(e.target.value)} placeholder="find a group…" className="w-full rounded-[9px_7px_10px_8px] border-[1.4px] border-[#b7bec1] bg-paper-2 py-2 pr-3 pl-9 text-[12px] text-ink outline-none focus:border-accent"/></label>
              <div role="listbox" aria-label="Groups" className="mt-2 max-h-[190px] space-y-1 overflow-y-auto pr-1">
                {visibleGroups.map(c=><button key={c.key} role="option" aria-selected={c.active} onClick={()=>{c.onSelect();setGroupOpen(false);setGroupQuery('');}} className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px_7px_9px_7px] border-none px-2.5 py-2 text-left text-[11px] font-semibold transition-colors hover:bg-[rgba(122,154,111,.09)]" style={{background:c.active?'rgba(122,154,111,.11)':'transparent',color:c.active?'#5c7a52':'#2b3034'}}><span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-full border border-ink-line/25" style={{background:c.tone}}></span><span className="min-w-0 flex-1 truncate">{c.label}</span>{c.active&&<span className="font-bold text-accent-deep">✓</span>}</button>)}
                {!visibleGroups.length&&<div className="px-2.5 py-3 text-center text-[11px] text-muted">No matching group.</div>}
              </div>
              <form onSubmit={createGroup} className="mt-2 flex gap-2 border-t-[1px] border-dashed border-[#d2d7d9] pt-2"><input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder="new group name…" maxLength={48} className="min-w-0 flex-1 rounded-[8px_7px_9px_7px] border-[1.3px] border-[#b7bec1] bg-paper-2 px-2.5 py-1.5 text-[11px] text-ink outline-none focus:border-accent"/><button type="submit" disabled={!newGroupName.trim()} className="cursor-pointer rounded-[8px_7px_9px_7px] border-[1.3px] border-ink-line bg-accent px-2.5 py-1.5 text-[10px] font-bold text-white disabled:cursor-default disabled:opacity-45">+ create</button></form>
            </div>}
          </div>
          <div className="w-[76px] flex-none">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.08em] text-muted">energy</div>
            <div className="flex gap-1.5">{sel.dots.map((d, i) => (<button key={i} onClick={d.onClick} aria-label={`energy ${i+1}`} className="h-[19px] w-[19px] cursor-pointer rounded-full border-[1.4px] border-ink-line transition-transform hover:-translate-y-px" style={{ background:d.bg }}></button>))}</div>
          </div>
        </section>

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

          {sel.routeFrontier && (
            <div className="mb-2.5 rounded-[11px_8px_12px_9px] border-[1.5px] border-[rgba(122,154,111,.68)] bg-[rgba(122,154,111,.08)] p-3 shadow-[1px_2px_0_rgba(58,64,69,.08)]">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[.09em] text-accent-deep">ready on your route</span>
                <button onClick={sel.routeFrontier.onOpen} className="cursor-pointer border-none bg-transparent p-0 text-[10px] font-semibold text-[#806b35]">view map ↗</button>
              </div>
              <div className="flex items-start gap-2.5">
                <button onClick={sel.routeFrontier.onToggle} aria-label={`complete route move ${sel.routeFrontier.text}`} title="mark complete" className="mt-0.5 flex h-[19px] w-[19px] flex-none cursor-pointer items-center justify-center rounded-[6px] border-[1.5px] border-accent bg-paper-2 transition-colors hover:bg-[rgba(122,154,111,.12)]"></button>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold leading-[1.35] text-ink">{sel.routeFrontier.text}</div>
                  <div className="mt-1 text-[10px] leading-[1.35] text-muted-2">{sel.routeFrontier.duration&&<span className="mr-1.5 font-semibold text-accent-deep">~{sel.routeFrontier.duration} min</span>}done when: {sel.routeFrontier.doneWhen}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {sel.steps.map(st => (
              <div key={st.id} className="group/step flex items-start gap-2 rounded-[8px] px-1 py-1.5 hover:bg-[rgba(122,154,111,.06)]">
                <button onClick={st.onToggle} aria-label={st.done?'mark step incomplete':'mark step complete'} className="mt-0.5 flex h-[17px] w-[17px] flex-none cursor-pointer items-center justify-center rounded-[5px] border-[1.5px] border-ink-line text-[10px] leading-none text-white" style={{ background: st.box }}>{st.check}</button>
                <span className="min-w-0 flex-1 text-[13px] leading-[1.35]" style={{ color: st.col, textDecoration: st.deco }}>{st.text}</span>
                <button onClick={st.onRemove} aria-label="remove step" className="cursor-pointer border-none bg-transparent px-1 text-base leading-none text-[#b3babd] opacity-0 transition-opacity group-hover/step:opacity-100 focus:opacity-100">×</button>
              </div>
            ))}
          </div>

          {sel.noSteps && <p className="mb-2 text-[12px] text-[#929a9e]">{sel.routeFrontier?'No separate saved moves — the route frontier above is ready now.':'No move yet. Add one or let Skein suggest it.'}</p>}

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
