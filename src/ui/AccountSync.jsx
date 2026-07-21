'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { popoverSurface } from './motion/tokens';

const statusCopy = {
  local: 'saved on this device',
  loading: 'checking the cloud…',
  saving: 'saving…',
  synced: 'saved to cloud',
  conflict: 'choose a copy',
  error: 'sync needs attention',
};

export default function AccountSync({ sync, placement = 'canvas' }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (placement === 'hidden') return null;

  const submit = async event => {
    event.preventDefault();
    const value = email.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    const result = await sync.signIn(value);
    setSubmitting(false);
    if (!result.error) setEmail('');
  };

  const dot = sync.status === 'synced' ? '#7a9a6f' : sync.status === 'error' || sync.status === 'conflict' ? '#b07d67' : '#b7bec1';
  const buttonLabel = sync.user ? (statusCopy[sync.status] || 'cloud save') : 'local only';
  const compact = placement !== 'canvas';
  const positionClass = placement === 'drawer'
    ? 'top-4 right-[104px] md:right-[420px]'
    : placement === 'expanded'
      ? 'top-4 right-[104px] md:right-[calc(min(680px,52vw)+20px)]'
      : 'top-4 right-5';

  return (
    <div className={`fixed z-[50] font-sans ${positionClass}`}>
      <button
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={`Account and sync: ${buttonLabel}`}
        title={compact ? buttonLabel : undefined}
        className={`relative flex cursor-pointer items-center rounded-[10px_8px_11px_8px] border-[1.4px] border-[#b7bec1] bg-[rgba(251,251,250,.94)] text-[11px] font-semibold text-muted-2 shadow-[1px_2px_0_rgba(58,64,69,.09)] backdrop-blur-[4px] hover:border-ink-line ${compact ? 'h-8 w-8 justify-center p-0' : 'gap-2 px-3 py-2'}`}
      >
        {compact ? (
          <>
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="#697177" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.2 15.2h9.2a3.1 3.1 0 0 0 .4-6.2A5.1 5.1 0 0 0 5 7.7a3.8 3.8 0 0 0 .2 7.5Z" />
            </svg>
            <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full border border-[rgba(58,64,69,.22)]" style={{ background: dot }}></span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full border border-[rgba(58,64,69,.22)]" style={{ background: dot }}></span>
            <span>{buttonLabel}</span>
            <span className="text-[9px] text-muted">{open ? '▲' : '▼'}</span>
          </>
        )}
      </button>

      <AnimatePresence>{open && (
        <m.section {...popoverSurface} aria-label="Account and cloud sync" className={`${compact ? 'fixed top-[60px] right-3 w-[calc(100vw-24px)] max-w-[310px] md:absolute md:top-[calc(100%+8px)] md:right-0 md:w-[310px]' : 'absolute top-[calc(100%+8px)] right-0 w-[310px]'} rounded-[15px_11px_16px_12px] border-[1.6px] border-ink-line bg-panel p-4 shadow-[4px_5px_0_rgba(58,64,69,.15)]`}>
          <div className="font-hand text-[22px] font-bold leading-none text-ink">keep your skein with you</div>

          {!sync.configured ? (
            <div className="mt-3 text-[12px] leading-[1.45] text-muted-2">
              <p>Cloud save is ready in the app, but this deployment still needs its Supabase URL and publishable key.</p>
              <p className="mt-2 rounded-[8px] border border-dashed border-[#c7ced0] bg-paper-2 p-2 font-mono text-[9px] leading-[1.5] text-ink">NEXT_PUBLIC_SUPABASE_URL<br/>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</p>
            </div>
          ) : sync.user ? (
            <div className="mt-3">
              <div className="rounded-[9px_7px_10px_8px] border border-[#d1d6d8] bg-paper-2 px-3 py-2">
                <div className="truncate text-[12px] font-semibold text-ink">{sync.user.email}</div>
                <div className="mt-0.5 text-[10px] text-muted-2">{statusCopy[sync.status] || 'cloud save active'}</div>
              </div>

              {sync.conflict && (
                <div className="mt-3 rounded-[10px_8px_11px_9px] border-[1.4px] border-[#b07d67] bg-[rgba(176,125,103,.08)] p-3">
                  <div className="text-[12px] font-bold text-ink">Two different canvases found</div>
                  <p className="mt-1 text-[10px] leading-[1.4] text-muted-2">Nothing was overwritten. Choose whether this device or the account’s cloud copy should become your canvas.</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => sync.resolveConflict('local')} className="flex-1 cursor-pointer rounded-[8px] border-[1.3px] border-ink-line bg-accent px-2 py-1.5 text-[10px] font-bold text-white">keep this device</button>
                    <button onClick={() => sync.resolveConflict('cloud')} className="flex-1 cursor-pointer rounded-[8px] border-[1.3px] border-[#b7bec1] bg-paper px-2 py-1.5 text-[10px] font-bold text-ink">use cloud copy</button>
                  </div>
                </div>
              )}

              {sync.error && <p role="alert" className="mt-2 text-[10px] leading-[1.4] text-[#a56f8f]">{sync.error}</p>}
              <p className="mt-3 text-[10px] leading-[1.4] text-muted">Changes save locally first, then sync after a short pause.</p>
              <button onClick={sync.signOut} className="mt-3 cursor-pointer border-none bg-transparent p-0 text-[11px] font-semibold text-muted-2 underline decoration-dashed underline-offset-4">sign out · keep local copy</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-3">
              <p className="text-[11px] leading-[1.45] text-muted-2">Your canvas already saves locally. Add email sign-in for an RLS-protected cloud copy.</p>
              <label className="mt-3 block text-[9px] font-bold uppercase tracking-[.08em] text-muted">email</label>
              <input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-paper-2 px-3 py-2 text-[12px] text-ink outline-none focus:border-accent"/>
              <button disabled={submitting} className="mt-2.5 w-full cursor-pointer rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-accent px-3 py-2 text-[12px] font-bold text-white shadow-[2px_2px_0_rgba(58,64,69,.14)] disabled:cursor-wait disabled:opacity-60">{submitting ? 'sending…' : 'email me a sign-in link'}</button>
              {sync.linkSent && <p role="status" className="mt-2 text-[10px] font-semibold text-accent-deep">Link sent—open it in this browser.</p>}
              {sync.error && <p role="alert" className="mt-2 text-[10px] leading-[1.4] text-[#a56f8f]">{sync.error}</p>}
            </form>
          )}
        </m.section>
      )}</AnimatePresence>
    </div>
  );
}
