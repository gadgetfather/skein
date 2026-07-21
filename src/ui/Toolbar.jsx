import React from 'react';

// Uniform toolbar buttons: 40px squares (4px-base spacing scale), icon
// centered, keyboard-shortcut hint bottom-right, full label in a styled
// tooltip on hover. `accent` marks the primary action, `active` the
// engaged tool.
function ToolButton({ title, hint, active, accent, wide, tour, onClick, children }) {
  const tone = accent
    ? 'bg-accent text-white shadow-[2px_2px_0_rgba(58,64,69,.18)]'
    : active
      ? 'bg-accent text-white'
      : 'bg-paper-2 text-ink';
  return (
    <button
      onClick={onClick}
      aria-label={title}
      data-tour={tour}
      className={`group relative flex h-10 ${wide ? 'min-w-12 px-1.5' : 'w-10'} flex-none cursor-pointer items-center justify-center rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line ${tone}`}
    >
      {children}
      {hint && (
        <span aria-hidden="true" className="pointer-events-none absolute right-[3px] bottom-px font-mono text-[9px] leading-none opacity-55">{hint}</span>
      )}
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-[9px] bg-ink px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-[2px_2px_0_rgba(0,0,0,.18)] transition-opacity delay-150 duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">{title}</span>
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-[1.4px] flex-none bg-hairline"></span>;
}

export default function Toolbar({ v }) {
  return (
    <div className="fixed right-3 bottom-[max(12px,env(safe-area-inset-bottom))] left-3 z-20 flex max-w-none flex-nowrap items-center justify-start gap-1.5 overflow-x-auto rounded-2xl border-[1.6px] border-ink-line bg-panel p-2 shadow-[3px_4px_0_rgba(58,64,69,.16)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:right-auto sm:bottom-6 sm:left-1/2 sm:max-w-[calc(100vw-24px)] sm:-translate-x-1/2 sm:justify-center md:overflow-visible">
      <ToolButton title="undo (Cmd/Ctrl+Z)" onClick={v.undo}>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 4L3 7l3.5 3"/><path d="M3 7h8a4 4 0 0 1 0 8H8"/></svg>
      </ToolButton>
      <ToolButton title="redo (Cmd/Ctrl+Shift+Z)" onClick={v.redo}>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11.5 4L15 7l-3.5 3"/><path d="M15 7H7a4 4 0 0 0 0 8h3"/></svg>
      </ToolButton>
      <Divider />
      <ToolButton title="zoom out" onClick={v.zoomOut}>
        <span className="text-xl leading-none">−</span>
      </ToolButton>
      <ToolButton wide title="reset zoom & recenter" onClick={v.zoomReset}>
        <span className="text-xs font-semibold">{v.zoomPct}%</span>
      </ToolButton>
      <ToolButton title="zoom in" onClick={v.zoomIn}>
        <span className="text-xl leading-none">+</span>
      </ToolButton>
      <Divider />
      <ToolButton title="add a thought (T) · or double-click canvas" hint="T" onClick={v.addThoughtCenter}>
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M7 2v10M2 7h10"/></svg>
      </ToolButton>
      <ToolButton title="brain dump (B)" hint="B" onClick={v.toggleDump}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 3h11M2 7h11M2 11h7"/></svg>
      </ToolButton>
      <ToolButton title="connect (C) · drag between cards to link" hint="C" active={v.connectMode} onClick={v.toggleConnect}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="3.5" cy="12.5" r="2"/><circle cx="12.5" cy="3.5" r="2"/><path d="M5.2 10.8L10.8 5.2"/></svg>
      </ToolButton>
      <ToolButton title="auto-group (G)" hint="G" onClick={v.autoGroup}>
        <span className="text-[15px] leading-none text-accent">✦</span>
      </ToolButton>
      <ToolButton title="add group" onClick={v.addGroup}>
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.4" y="1.4" width="11.2" height="11.2" rx="3" strokeDasharray="2.6 2"/></svg>
      </ToolButton>
      <Divider />
      <ToolButton accent title="decide for me (D)" hint="D" tour="decide-control" onClick={v.openDecide}>
        <svg width="17" height="17" viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="5" cy="5" r="1.3" fill="currentColor"/><circle cx="11" cy="5" r="1.3" fill="currentColor"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="5" cy="11" r="1.3" fill="currentColor"/><circle cx="11" cy="11" r="1.3" fill="currentColor"/></svg>
      </ToolButton>
      <Divider />
      <ToolButton title="show walkthrough" tour="walkthrough-replay" onClick={v.startWalkthrough}>
        <span className="font-hand text-xl font-bold leading-none">?</span>
      </ToolButton>
    </div>
  );
}
