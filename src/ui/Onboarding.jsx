import React from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { motionEase } from './motion/tokens';

export default function Onboarding({ v }) {
  return (
    <AnimatePresence>
    {v.showOnboarding && <m.div
      key="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: v.onbOpacity, scale: v.onbOpacity ? 1 : 0.992 }}
      exit={{ opacity: 0, scale: 0.992 }}
      transition={{ duration: 0.4, ease: motionEase.out }}
      className="fixed inset-0 z-50 overflow-y-auto bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-size-[26px_26px]"
    >
      <div className="absolute left-30 top-30 hidden h-[70px] w-[130px] bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[11px_8px_12px_7px] opacity-35 animate-[floaty2_7s_ease-in-out_infinite] sm:block"></div>
      <div className="absolute right-[150px] top-40 hidden h-[66px] w-30 bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[10px_9px_11px_8px] opacity-30 animate-[floaty2_8s_ease-in-out_infinite] sm:block"></div>
      <div className="absolute left-55 bottom-[150px] hidden h-[66px] w-30 bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[9px_11px_8px_12px] opacity-[.28] animate-[floaty2_9s_ease-in-out_infinite] sm:block"></div>
      <div className="absolute right-[210px] bottom-[170px] hidden h-[70px] w-[130px] bg-paper-2 border-[1.5px] border-[#b6bec1] rounded-[11px_8px_12px_8px] opacity-30 animate-[floaty2_7.5s_ease-in-out_infinite] sm:block"></div>

      <div className="absolute top-4 left-4 flex items-baseline gap-2.5 sm:top-[22px] sm:left-[26px]">
        <span className="font-hand text-[26px] font-bold text-ink">Skein</span>
        <span className="hidden text-xs text-[#a4abae] sm:inline">parallel interests, one calm canvas</span>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-[min(760px,calc(100vw-32px))] flex-col justify-center py-20 text-center">
        <div className="min-h-[48px] font-hand text-[38px] font-bold leading-[1.05] text-ink transition-opacity duration-300 sm:min-h-[54px] sm:text-[46px]" style={{ opacity: v.hOpacity }} aria-live="polite" aria-label={v.headline}>
          <m.span key={v.headline} className="inline-block" initial="hidden" animate="shown" variants={{hidden:{},shown:{transition:{staggerChildren:.018}}}} aria-hidden="true">
            {[...v.headline].map((char,index)=><m.span key={`${char}-${index}`} className="inline-block whitespace-pre" variants={{hidden:{opacity:0,y:9,scale:.96,filter:'blur(3px)'},shown:{opacity:1,y:0,scale:1,filter:'blur(0px)',transition:{duration:.34,ease:motionEase.out}}}}>{char}</m.span>)}
          </m.span>
        </div>
        <div className="mt-2 mb-6 text-[15px] text-muted-2">Type what's on your mind, a whole sentence is fine. I'll untangle it into a map.</div>

        <div className="focus-surface flex items-center gap-2.5 rounded-[16px_13px_15px_12px] border-[1.6px] border-ink-line bg-paper-2 px-3 py-2 text-left shadow-[2px_3px_0_rgba(58,64,69,.12)] transition-[border-color,box-shadow,transform] duration-200 focus-within:-translate-y-px focus-within:border-accent focus-within:shadow-[2px_3px_0_rgba(58,64,69,.12),0_0_0_3px_rgba(122,154,111,.16)] sm:px-3.5">
          <input value={v.inputVal} onChange={v.onbInput} onKeyDown={v.onbKey} onFocus={v.onbFocus} aria-label="Thoughts to weave into a canvas" placeholder="I want to learn Japanese, get fit, and finally ship my game…" className="min-w-0 flex-1 border-none bg-transparent px-0.5 py-1 text-[15px] text-ink outline-none sm:text-base"/>
          <div className="relative h-9 w-9 flex-none">
            <AnimatePresence initial={false} mode="wait">
              {(!v.canWeave||v.listening)?(
                <m.button key="voice" initial={{opacity:0,scale:.88}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.88}} transition={{duration:.14,ease:motionEase.out}} onClick={v.toggleMic} title="speak your thoughts" aria-label="speak your thoughts" className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full border-[1.4px] border-ink-line" style={{ background: v.micBg, animation: v.micAnim }}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke={v.micStroke} strokeWidth="1.6" strokeLinecap="round"><rect x="6" y="2" width="4" height="8" rx="2"/><path d="M4 8a4 4 0 0 0 8 0M8 12v2"/></svg>
                </m.button>
              ):(
                <m.button key="weave" initial={{opacity:0,scale:.82,rotate:-8}} animate={{opacity:1,scale:1,rotate:0}} exit={{opacity:0,scale:.82,rotate:8}} transition={{duration:.16,ease:motionEase.out}} whileTap={{scale:.9}} onClick={v.weave} disabled={v.weaving} title="weave into a map" aria-label={v.weaving?'weaving thoughts into a map':'weave into a map'} className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full border-[1.4px] border-ink-line bg-accent text-white shadow-[1px_2px_0_rgba(58,64,69,.16)] disabled:cursor-wait">
                  {v.weaving?<span className="h-2 w-2 rounded-full bg-white" style={{animation:'micPulse 1.1s ease-in-out infinite'}}/>:<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg>}
                </m.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-2 h-4 text-xs text-accent">{v.micNote}</div>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-[13px] font-semibold text-[#596268]">try</span>
          {v.onbChips.map(c => (
            <button key={c.short} onClick={c.onClick} className="cursor-pointer px-[13px] py-[7px] text-[12.5px] text-[#4c5257] bg-panel border-[1.5px] border-[#b7bec1] rounded-[10px_8px_11px_8px]">{c.short}</button>
          ))}
        </div>

        <div className="mt-[26px]">
          <button onClick={v.loadExample} className="cursor-pointer bg-transparent p-0 pb-px text-sm font-semibold text-accent border-b-[1.5px] border-dashed border-accent">or explore an example canvas →</button>
        </div>
      </div>
    </m.div>}
    </AnimatePresence>
  );
}
