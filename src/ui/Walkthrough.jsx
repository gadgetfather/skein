'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { motionEase } from './motion/tokens';

const TOUR_STEPS = [
  {
    target: '[data-tour="interest-card"]',
    eyebrow: 'your canvas',
    title: 'Everything belongs here.',
    body: 'Skein groups your interests and links the ones that can feed each other. Open any card to work with one thread at a time.',
    action: 'open this thread →',
  },
  {
    target: '[data-tour="thread-direction"]',
    eyebrow: 'give it direction',
    title: 'Turn an interest into a living thread.',
    body: 'Add where you want to go and what is true right now. Skein uses that context to shape a route and smaller next moves.',
    action: 'show me how Skein chooses →',
  },
  {
    target: '[data-tour="decide-control"]',
    eyebrow: 'hand off the choice',
    title: 'When choosing is hard, hand it over.',
    body: 'Skein considers your time, energy, momentum, and reachable route steps—then surfaces one place to begin.',
    action: 'try decide for me →',
  },
  {
    target: '[data-tour="decide-menu"]',
    eyebrow: 'begin',
    title: 'One thread. One clear move.',
    body: 'Pick freely or answer three quick questions. “Start this” opens a focus timer and logs the session when you are done.',
    action: 'finish the tour',
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function Walkthrough({ v }) {
  const stepIndex = v.walkthroughStep;
  const open = Number.isInteger(stepIndex) && stepIndex >= 0 && stepIndex < TOUR_STEPS.length;
  const step = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
  const [targetRect, setTargetRect] = useState(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const primaryRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) return undefined;
    let frame = 0;
    const timers = [];
    const measure = (bringIntoView = false) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
      const element = document.querySelector(step.target);
      if (!element) { setTargetRect(null); return; }
      const initial = element.getBoundingClientRect();
      if (bringIntoView && (initial.left < 8 || initial.right > width - 8 || initial.top < 8 || initial.bottom > height - 8)) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      const rect = element.getBoundingClientRect();
      const pad = 9;
      setTargetRect({
        left: clamp(rect.left - pad, 4, width - 4),
        top: clamp(rect.top - pad, 4, height - 4),
        width: Math.max(0, Math.min(rect.width + pad * 2, width - 8)),
        height: Math.max(0, Math.min(rect.height + pad * 2, height - 8)),
      });
    };
    frame = requestAnimationFrame(() => measure(true));
    timers.push(setTimeout(() => measure(false), 120));
    timers.push(setTimeout(() => measure(false), 360));
    const onResize = () => measure(false);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', onResize);
    };
  }, [open, step.target, stepIndex]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => primaryRef.current?.focus(), 420);
    return () => clearTimeout(timer);
  }, [open, stepIndex]);

  const cardStyle = useMemo(() => {
    if (!viewport.width || viewport.width < 640) {
      return { left: 12, right: 12, bottom: stepIndex === 0 || stepIndex === 2 ? 84 : 16 };
    }
    const width = 360;
    const estimatedHeight = 278;
    if (!targetRect) return { width, right: 24, top: 88 };
    const roomRight = viewport.width - targetRect.left - targetRect.width;
    const roomLeft = targetRect.left;
    let left;
    let top;
    if (roomRight >= width + 32) {
      left = targetRect.left + targetRect.width + 18;
      top = clamp(targetRect.top, 18, viewport.height - estimatedHeight - 18);
    } else if (roomLeft >= width + 32) {
      left = targetRect.left - width - 18;
      top = clamp(targetRect.top, 18, viewport.height - estimatedHeight - 18);
    } else {
      left = clamp(targetRect.left + targetRect.width / 2 - width / 2, 18, viewport.width - width - 18);
      top = targetRect.top > estimatedHeight + 34
        ? targetRect.top - estimatedHeight - 16
        : clamp(targetRect.top + targetRect.height + 16, 18, viewport.height - estimatedHeight - 18);
    }
    return { width, left, top };
  }, [stepIndex, targetRect, viewport]);

  return (
    <AnimatePresence>
      {open && (
        <m.div key="walkthrough" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="pointer-events-none fixed inset-0 z-[70]">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
            <defs>
              <mask id="skein-walkthrough-cutout">
                <rect width="100%" height="100%" fill="white" />
                {targetRect && <rect x={targetRect.left} y={targetRect.top} width={targetRect.width} height={targetRect.height} rx="16" fill="black" />}
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(43,48,52,.46)" mask="url(#skein-walkthrough-cutout)" />
            {targetRect && <rect x={targetRect.left} y={targetRect.top} width={targetRect.width} height={targetRect.height} rx="16" fill="none" stroke="#9fbd95" strokeWidth="2.2" strokeDasharray="6 5" />}
          </svg>

          <m.aside
            key={stepIndex}
            role="dialog"
            aria-modal="true"
            aria-label={`Skein walkthrough, step ${stepIndex + 1} of ${TOUR_STEPS.length}`}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.24, ease: motionEase.out }}
            style={cardStyle}
            className="pointer-events-auto fixed rounded-[18px_14px_19px_13px] border-[1.8px] border-ink-line bg-panel p-5 shadow-[6px_8px_0_rgba(43,48,52,.2)]"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[.1em] text-accent-deep">{stepIndex + 1} / {TOUR_STEPS.length}</span>
                <span className="h-1 w-1 rounded-full bg-hairline" />
                <span className="text-[10px] font-semibold uppercase tracking-[.08em] text-muted">{step.eyebrow}</span>
              </div>
              <button onClick={v.skipWalkthrough} className="cursor-pointer border-none bg-transparent p-0 text-[11px] font-semibold text-muted underline decoration-dashed underline-offset-4 hover:text-ink">skip</button>
            </div>

            <h2 className="font-hand text-[28px] font-bold leading-[1.05] text-ink">{step.title}</h2>
            <p className="mt-2.5 text-[13px] leading-[1.55] text-muted-2">{step.body}</p>

            {stepIndex === TOUR_STEPS.length - 1 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 font-hand text-[16px] font-semibold text-accent-deep">
                <span>capture</span><span className="text-muted">→</span><span>connect</span><span className="text-muted">→</span><span>choose</span><span className="text-muted">→</span><span>begin</span>
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button ref={primaryRef} onClick={stepIndex === TOUR_STEPS.length - 1 ? v.completeWalkthrough : v.advanceWalkthrough} className="min-h-11 flex-1 cursor-pointer rounded-[12px_9px_13px_10px] border-[1.6px] border-ink-line bg-accent px-4 py-2.5 text-[13px] font-bold text-white shadow-[2px_3px_0_rgba(58,64,69,.18)] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {step.action}
              </button>
              <div aria-label={`Step ${stepIndex + 1} of ${TOUR_STEPS.length}`} className="flex gap-1.5">
                {TOUR_STEPS.map((_, index) => <span key={index} className="h-1.5 rounded-full transition-[width,background]" style={{ width:index === stepIndex ? 18 : 6, background:index <= stepIndex ? '#7a9a6f' : '#c8ced1' }} />)}
              </div>
            </div>
          </m.aside>
        </m.div>
      )}
    </AnimatePresence>
  );
}
