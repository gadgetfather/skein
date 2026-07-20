import React from 'react';

export default function ExpandedDetail({ v }) {
  if (!v.expandedId || !v.exp) return null;
  const exp = v.exp;
  return (
    <>
      <div onClick={v.closeExpanded} className="fixed inset-0 z-[32] bg-[rgba(43,48,52,.28)] backdrop-blur-[1px]"></div>
      <div className="fixed top-0 right-0 bottom-0 z-[33] flex w-[min(680px,52vw)] flex-col border-l-[1.8px] border-ink-line bg-[#f4f6f7] shadow-[-8px_0_0_rgba(58,64,69,.08)] animate-[fadeUp_.2s_ease]">
        <div className="flex-none px-[30px] pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[9px]"><span className="h-[11px] w-[11px] rounded-full" style={{ background: exp.color }}></span><span className="text-[11px] uppercase tracking-[.07em] text-muted">{exp.groupLabel}</span></div>
            <div className="flex gap-2">
              <button onClick={v.collapseDrawer} title="collapse to drawer" className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-ink-line bg-paper-2"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#3a4045" strokeWidth="1.6" strokeLinecap="round"><path d="M10 3l-4 5 4 5"/></svg></button>
              <button onClick={v.closeExpanded} title="close" className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-ink-line bg-paper-2 text-base text-ink-line">×</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-[30px] pb-6">
          <div className="flex items-center gap-[22px]">
            <div className="relative h-[132px] w-[132px] flex-none">
              <svg width="132" height="132" viewBox="0 0 132 132">
                <circle cx="66" cy="66" r="54" fill="none" stroke="#e3e8e9" strokeWidth="13"></circle>
                {exp.progressKnown&&<circle cx="66" cy="66" r="54" fill="none" stroke={exp.color} strokeWidth="13" strokeLinecap="round" strokeDasharray={exp.ringDash} transform="rotate(-90 66 66)"></circle>}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-hand text-[30px] leading-none font-bold text-ink">{exp.progressTxt}</div>
                <div className="text-[10px] text-muted">{exp.progressCaption}</div>
              </div>
            </div>
            <div>
              <div className="font-hand text-[38px] leading-[1.02] font-bold text-ink">{exp.label}</div>
              <div className="mt-[3px] max-w-[320px] text-[13px] leading-[1.4] text-[#7b8287]">{exp.goal}</div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="rounded-[9px] border-[1.4px] border-accent bg-[rgba(122,154,111,.14)] px-2.5 py-1 text-xs text-accent-deep">🔥 {exp.streak}-day streak</span>
                <span className="rounded-[9px] border-[1.4px] border-[#cfd6d8] bg-paper-2 px-2.5 py-1 text-xs text-[#4c5257]">{exp.weekTxt}</span>
                <button onClick={exp.onOpenRoute} className="cursor-pointer rounded-[9px] border-[1.4px] border-[#b0975a] bg-[rgba(176,151,90,.12)] px-2.5 py-1 text-xs font-semibold text-[#806b35]">open route map ↗</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-[18px] py-4 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="flex items-baseline justify-between"><span className="text-xs font-semibold uppercase tracking-[.06em] text-muted">Momentum</span><span className="text-[13px] font-semibold text-accent-deep">{exp.momentum}</span></div>
            <svg width="100%" height="70" viewBox="0 0 560 70" preserveAspectRatio="none" className="mt-2 overflow-visible">
              <polyline points={exp.sparkFill} fill="rgba(122,154,111,.12)" stroke="none"></polyline>
              <polyline points={exp.sparkPts} fill="none" stroke="#7a9a6f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></polyline>
            </svg>
            <div className="mt-0.5 text-[11px] text-muted">avg session length over the last 8 weeks</div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_150px] gap-3.5">
            <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-4 py-3.5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-[.06em] text-muted">Hours / week</div>
              <div className="flex h-16 items-end gap-2">
                {exp.weeks.map((w, i) => (
                  <div key={i} className="flex-1 rounded-[4px_4px_0_0] border-[1.4px] border-ink-line" style={{ height: w.h2, background: w.bg }}></div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-4 py-3.5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="font-hand text-[34px] leading-none font-bold text-ink">{exp.longest}</div>
              <div className="mt-[3px] text-[11px] text-muted">longest streak (days)</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-[.06em] text-muted">Next steps</div>
            {exp.steps.map(st => (
              <div key={st.id} className="flex items-center gap-[9px] py-1.5">
                <button onClick={st.onToggle} className="flex h-[18px] w-[18px] flex-none cursor-pointer items-center justify-center rounded-[5px] border-[1.6px] border-ink-line text-xs leading-none text-white" style={{ background: st.box }}>{st.check}</button>
                <span className="flex-1 text-sm" style={{ color: st.col, textDecoration: st.deco }}>{st.text}</span>
                <button onClick={st.onRemove} className="cursor-pointer border-none bg-transparent text-base leading-none text-[#b3babd]">×</button>
              </div>
            ))}
            {exp.noSteps && (
              <div className="pt-0.5 pb-1 text-[13px] text-[#a4abae]">No steps yet — add one, or <button onClick={exp.onSuggest} className="cursor-pointer border-none bg-transparent p-0 font-semibold text-accent">✦ suggest with AI</button></div>
            )}
            {v.aiBusy && (
              <div className="py-0.5 text-xs text-accent">✦ thinking…</div>
            )}
            <div className="mt-2 flex gap-2">
              <input value={v.stepDraft} onChange={v.onStepDraft} onKeyDown={exp.onStepKey} placeholder="add a step — e.g. build the login screen" className="flex-1 rounded-[9px] border-[1.5px] border-ink-line bg-paper-2 px-[11px] py-[9px] text-sm text-ink outline-none"/>
              <button onClick={exp.onAddStep} className="cursor-pointer rounded-[9px] border-[1.5px] border-ink-line bg-accent px-[13px] py-[9px] text-[13px] font-bold text-white">add</button>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-[.06em] text-muted">What you did</div>
            {exp.empty && (
              <div className="rounded-xl border-[1.5px] border-dashed border-[#cfd6d8] bg-paper-2 p-[18px] text-center text-[13px] text-[#a4abae]">No sessions yet — hit <b>did this today</b> or <b>+ log session</b> to start the story.</div>
            )}
            <div className="flex flex-col">
              {exp.journal.map(x => (
                <div key={x.ts} className="flex gap-3.5 pt-0.5 pb-3.5">
                  <div className="flex flex-none flex-col items-center">
                    <span className="h-[11px] w-[11px] rounded-full border-[1.5px] border-ink-line" style={{ background: x.dot }}></span>
                    <span className="mt-0.5 w-[1.5px] flex-1 bg-[#d3d9db]"></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2.5"><span className="text-[13px] text-ink">{x.note}</span><span className="flex flex-none items-center gap-2"><span className="text-xs font-semibold text-accent-deep">{x.dur}</span><button onClick={x.onRemove} title="remove session" className="cursor-pointer border-none bg-transparent text-sm leading-none text-[#c3c9cb]">×</button></span></div>
                    <div className="mt-0.5 text-[11px] text-muted">{x.date} · felt {x.mood}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2.5 border-t-[1.5px] border-[#dfe4e6] bg-[#eef1f2] px-[30px] py-3.5">
          <button onClick={v.logToday} className="cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent px-3.5 py-2.5 text-sm font-bold text-white shadow-[2px_3px_0_rgba(58,64,69,.18)]">did this today ✓</button>
          <button onClick={v.openLog} className="cursor-pointer rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line bg-paper-2 px-3.5 py-2.5 text-sm font-semibold text-ink">+ log session</button>
          <div className="flex-1"></div>
          <span className="font-mono text-[18px] font-semibold text-ink">{v.pomoTxt}</span>
          {v.pomoRunning ? (
            <button onClick={v.pausePomo} className="cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-ink px-3.5 py-2.5 text-sm font-semibold text-white">pause</button>
          ) : (
            <button onClick={v.startPomo} className="cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-ink px-3.5 py-2.5 text-sm font-semibold text-white">start pomodoro</button>
          )}
          <button onClick={v.resetPomo} title="reset" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-ink-line bg-paper-2"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#3a4045" strokeWidth="1.6" strokeLinecap="round"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2v3h-3"/></svg></button>
        </div>

        {/* log session form */}
        {v.logOpen && (
          <>
            <div onClick={v.closeLog} className="absolute inset-0 z-[5] bg-[rgba(43,48,52,.3)]"></div>
            <div className="absolute top-1/2 left-1/2 z-[6] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-[1.8px] border-ink-line bg-panel p-[22px] shadow-[6px_8px_0_rgba(58,64,69,.18)]">
              <div className="mb-3.5 font-hand text-[26px] font-bold text-ink">log a session</div>
              <div className="mb-1.5 text-xs text-muted">minutes</div>
              <input value={v.logDur} onChange={v.onLogDur} type="number" className="mb-3.5 w-full rounded-[10px] border-[1.6px] border-ink-line bg-paper-2 px-[11px] py-[9px] text-[15px] text-ink outline-none"/>
              <div className="mb-1.5 text-xs text-muted">what did you do?</div>
              <input value={v.logNote} onChange={v.onLogNote} placeholder="e.g. Anki + one grammar point" className="mb-3.5 w-full rounded-[10px] border-[1.6px] border-ink-line bg-paper-2 px-[11px] py-[9px] text-sm text-ink outline-none"/>
              <div className="mb-1.5 text-xs text-muted">how did it feel?</div>
              <div className="mb-5 flex gap-2">
                <button onClick={v.setLogMoodUp} className="flex-1 cursor-pointer rounded-[10px] border-[1.6px] p-2 text-[13px] font-semibold" style={{ borderColor: v.moodUpBorder, background: v.moodUpBg, color: v.moodUpColor }}>↑ focused</button>
                <button onClick={v.setLogMoodOk} className="flex-1 cursor-pointer rounded-[10px] border-[1.6px] p-2 text-[13px] font-semibold" style={{ borderColor: v.moodOkBorder, background: v.moodOkBg, color: v.moodOkColor }}>→ ok</button>
                <button onClick={v.setLogMoodDown} className="flex-1 cursor-pointer rounded-[10px] border-[1.6px] p-2 text-[13px] font-semibold" style={{ borderColor: v.moodDownBorder, background: v.moodDownBg, color: v.moodDownColor }}>↓ tired</button>
              </div>
              <div className="flex gap-2.5">
                <button onClick={v.submitLog} className="flex-1 cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent p-[11px] text-[15px] font-bold text-white shadow-[2px_3px_0_rgba(58,64,69,.18)]">save session</button>
                <button onClick={v.closeLog} className="cursor-pointer rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line bg-paper-2 px-4 py-[11px] text-sm font-semibold text-ink">cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
