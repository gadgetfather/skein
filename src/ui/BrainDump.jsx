import React from 'react';

export default function BrainDump({ v }) {
  if (!v.dumpOpen) return null;
  return (
    <>
      <div onClick={v.toggleDump} className="fixed inset-0 z-30 bg-[rgba(43,48,52,.22)]"></div>
      <div className="fixed top-0 right-0 bottom-0 z-[31] flex w-[380px] flex-col border-l-[1.8px] border-ink-line bg-[#f4f6f7] p-6 shadow-[-6px_0_0_rgba(58,64,69,.08)] animate-[fadeUp_.18s_ease]">
        <div className="font-hand text-[28px] font-bold text-ink">empty your head</div>
        <div className="mt-0.5 mb-3.5 text-[13px] text-[#7b8287]">one thought per line. I'll scatter them onto the canvas as notes.</div>
        <textarea value={v.dumpText} onChange={v.onDumpInput} placeholder={'learn japanese\nfix the devit bug\nmeal-prep sunday\nread 10 pages…'} className="flex-1 resize-none p-3.5 text-[15px] leading-[1.6] text-ink bg-paper-2 rounded-xl border-[1.6px] border-ink-line outline-none shadow-[inset_1px_1px_0_rgba(58,64,69,.06)]"></textarea>
        <button onClick={v.scatterDump} className="mt-3.5 cursor-pointer p-[13px] font-hand text-[22px] font-bold text-white bg-accent rounded-[12px_10px_12px_10px] border-[1.8px] border-ink-line shadow-[2px_3px_0_rgba(58,64,69,.18)]">scatter onto canvas ✦</button>
      </div>
    </>
  );
}
