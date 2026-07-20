'use client';

import { useEffect, useState } from 'react';

// The mock shows a static email pill; this makes it a real input with a
// local-only confirmation (no backend yet).
//
// The interactive <input> is swapped in only after mount: autofill browser
// extensions mutate email inputs as soon as the HTML loads, which breaks
// React's hydration if the input is part of the server-rendered markup.
// Until then we render the mock's static pill, which is pixel-identical.
export default function Waitlist({ dark }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  useEffect(() => setMounted(true), []);

  const pillTone = dark
    ? 'bg-[#f4f6f7] shadow-[3px_4px_0_rgba(0,0,0,.25)]'
    : 'bg-paper-2 shadow-[3px_4px_0_rgba(58,64,69,.13)]';
  const btnTone = dark
    ? 'shadow-[2px_2px_0_rgba(0,0,0,.2)]'
    : 'shadow-[2px_2px_0_rgba(58,64,69,.18)]';
  const pillClass = `flex items-center gap-2 rounded-[14px_11px_13px_10px] border-[1.8px] border-ink-line py-1.5 pr-1.5 pl-4 ${pillTone}`;
  const btnClass = `cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent px-[18px] py-[11px] text-[15px] font-bold text-white ${btnTone}`;

  if (joined) {
    return (
      <div className={`flex items-center gap-2 rounded-[14px_11px_13px_10px] border-[1.8px] border-ink-line px-[22px] py-[13px] text-[15px] font-semibold text-accent-deep ${pillTone}`}>
        you're in — we'll be in touch ✦
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className={pillClass}>
        <span className="w-[200px] text-left text-[15px] text-[#a4abae]">you@email.com</span>
        <span className={btnClass}>join the waitlist</span>
      </div>
    );
  }

  const join = () => { if (email.trim()) setJoined(true); };
  return (
    <div className={pillClass}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') join(); }}
        placeholder="you@email.com"
        aria-label="email address"
        className="w-[200px] border-none bg-transparent text-left text-[15px] text-ink outline-none"
      />
      <button onClick={join} className={btnClass}>join the waitlist</button>
    </div>
  );
}
