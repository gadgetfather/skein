import Link from 'next/link';
import Waitlist from './Waitlist';

export default function Landing() {
  return (
    <div className="bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:26px_26px]">
      <svg width="0" height="0" className="pointer-events-none absolute">
        <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>
        <filter id="edge"><feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8"/></filter>
      </svg>

      {/* NAV */}
      <div className="sticky top-0 z-30 border-b-[1.5px] border-[#d3d9db] bg-[rgba(237,240,241,.86)] backdrop-blur-[6px]">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
          <span className="font-hand text-[28px] font-bold text-ink">Skein</span>
          <div className="flex items-center gap-3 text-sm text-[#4c5257] sm:gap-[26px]">
            <a href="#how" className="hidden text-[#4c5257] hover:text-[#4c5257] sm:inline">how it works</a>
            <a href="#features" className="hidden text-[#4c5257] hover:text-[#4c5257] sm:inline">features</a>
            <a href="#faq" className="hidden text-[#4c5257] hover:text-[#4c5257] sm:inline">FAQ</a>
            <Link href="/canvas" className="rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-panel px-[15px] py-2 font-semibold text-ink hover:text-ink shadow-[2px_2px_0_rgba(58,64,69,.12)]">try the canvas</Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="mx-auto max-w-[760px] px-4 pt-12 text-center sm:px-6 sm:pt-19">
        <div className="mb-[22px] inline-block rounded-[20px] border-[1.4px] border-accent bg-[rgba(122,154,111,.12)] px-4 py-1 font-hand text-xl text-accent">for the multi-passionate</div>
        <div className="font-hand text-[48px] font-bold leading-[1.02] text-ink sm:text-[68px]">Untangle your parallel interests.</div>
        <div className="mx-auto mt-[18px] max-w-[560px] text-[15px] leading-[1.55] text-muted-2 sm:text-[17px]">Brain-dump every project, hobby, and someday-maybe. Skein weaves them into one calm map — then, when you're overwhelmed, quietly tells you the single thing to do next.</div>
        <div className="mt-[30px] flex items-center justify-center gap-2.5">
          <Waitlist />
        </div>
        <div className="mt-3.5"><Link href="/canvas" className="border-b-[1.5px] border-dashed border-accent pb-px text-sm font-semibold text-accent hover:text-accent">or try the live canvas →</Link></div>
        <div className="mt-2.5 text-xs text-[#a4abae]">free while in beta · no credit card</div>
      </div>

      {/* CANVAS PREVIEW */}
      <div className="mx-auto mt-9 max-w-[1000px] px-4 sm:mt-11 sm:px-6">
        <div className="overflow-hidden rounded-2xl border-[1.8px] border-ink-line bg-[#f4f6f7] shadow-[6px_8px_0_rgba(58,64,69,.12)]">
          <div className="flex items-center gap-[7px] border-b-[1.5px] border-[#dfe4e6] px-[15px] py-[11px]">
            <span className="h-[11px] w-[11px] rounded-full border border-ink-line bg-[#e0938a]"></span>
            <span className="h-[11px] w-[11px] rounded-full border border-ink-line bg-[#e5c07a]"></span>
            <span className="h-[11px] w-[11px] rounded-full border border-ink-line bg-[#8aa77f]"></span>
            <span className="ml-3 text-xs text-muted">skein · your canvas</span>
          </div>
          <div className="relative h-[270px] bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:22px_22px] sm:h-[340px]">
            <div className="absolute left-4 top-12 h-[180px] w-[180px] rounded-[26px_20px_28px_22px] border-[1.4px] border-dashed border-[rgba(122,154,111,.5)] bg-[rgba(122,154,111,.06)] [filter:url(#rough)] sm:left-[70px] sm:w-[220px]"></div>
            <div className="absolute left-7 top-8 flex items-center gap-[7px] rounded-[9px_8px_10px_8px] border-[1.4px] border-[rgba(122,154,111,.6)] bg-[#f4f6f7] px-2.5 py-[3px] sm:left-[84px]"><span className="h-2 w-2 rounded-full bg-accent"></span><span className="font-hand text-[15px] font-bold text-muted-2">learning</span></div>
            <div className="absolute right-3 top-[125px] h-[130px] w-[180px] rounded-[24px_22px_26px_20px] border-[1.4px] border-dashed border-[rgba(111,138,168,.5)] bg-[rgba(111,138,168,.06)] [filter:url(#rough)] sm:right-[120px] sm:top-[150px] sm:h-[150px] sm:w-[220px]"></div>
            <div className="absolute right-8 top-[111px] flex items-center gap-[7px] rounded-[9px_8px_10px_8px] border-[1.4px] border-[rgba(111,138,168,.6)] bg-[#f4f6f7] px-2.5 py-[3px] sm:right-[250px] sm:top-[134px]"><span className="h-2 w-2 rounded-full bg-[#6f8aa8]"></span><span className="font-hand text-[15px] font-bold text-muted-2">build &amp; ship</span></div>
            <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke="#9aa1a5" strokeWidth="1.3" strokeLinecap="round"><path d="M190 130 C340 180 500 150 620 200" opacity="0.8" filter="url(#edge)"/><path d="M170 190 C300 240 430 250 560 250" opacity="0.7" filter="url(#edge)"/></svg>
            <div className="absolute left-7 top-[66px] w-[140px] rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 px-3 py-[9px] shadow-[2px_3px_0_rgba(58,64,69,.12)] sm:left-[92px] sm:w-[150px]"><div className="text-sm font-semibold">Learn Japanese</div><div className="mt-1.5 flex gap-[3px]"><span className="h-[5px] w-[5px] rounded-full bg-accent"></span><span className="h-[5px] w-[5px] rounded-full bg-accent"></span><span className="h-[5px] w-[5px] rounded-full bg-accent"></span></div></div>
            <div className="absolute left-10 top-[150px] w-[140px] rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line bg-paper-2 px-3 py-[9px] shadow-[2px_3px_0_rgba(58,64,69,.12)] sm:left-[110px] sm:w-[150px]"><div className="text-sm font-semibold">Read more</div><div className="mt-1.5 flex gap-[3px]"><span className="h-[5px] w-[5px] rounded-full bg-accent"></span><span className="h-[5px] w-[5px] rounded-full bg-[#cbd0d2]"></span><span className="h-[5px] w-[5px] rounded-full bg-[#cbd0d2]"></span></div></div>
            <div className="absolute right-6 top-[155px] w-[140px] rounded-[10px_9px_11px_8px] border-[1.6px] border-ink-line bg-paper-2 px-3 py-[9px] shadow-[2px_3px_0_rgba(58,64,69,.12)] sm:right-[150px] sm:top-[180px] sm:w-[150px]"><div className="text-sm font-semibold">Ship the game</div><div className="mt-1.5 flex gap-[3px]"><span className="h-[5px] w-[5px] rounded-full bg-[#6f8aa8]"></span><span className="h-[5px] w-[5px] rounded-full bg-[#6f8aa8]"></span><span className="h-[5px] w-[5px] rounded-full bg-[#6f8aa8]"></span></div></div>
            <div className="absolute bottom-[22px] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[12px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent px-4 py-[9px] text-sm font-semibold text-white shadow-[2px_2px_0_rgba(58,64,69,.18)] animate-[floaty2_6s_ease-in-out_infinite]">🎲 decide for me</div>
          </div>
        </div>
      </div>

      {/* PROBLEM -> SHIFT */}
      <div className="mx-auto mt-16 max-w-[820px] px-4 text-center sm:mt-24 sm:px-6">
        <div className="text-[15px] text-[#a4abae]">sound familiar?</div>
        <div className="mt-2 font-hand text-[31px] font-bold leading-[1.15] text-ink sm:text-[38px]">"I have a dozen things I care about — and on the days I could do any of them, I freeze and do none."</div>
        <div className="mt-[18px] text-base leading-[1.6] text-muted-2">Skein isn't another to-do list that guilt-trips you. It holds all your interests in one gentle place, learns what you've been feeding and neglecting, and removes the hardest part — <b className="text-ink">choosing</b> — so you can just begin.</div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" className="mx-auto mt-16 max-w-[1120px] px-4 sm:mt-24 sm:px-6">
        <div className="mb-10 text-center"><div className="font-hand text-[40px] font-bold text-ink">How it works</div><div className="mt-1.5 text-[15px] text-[#7b8287]">four steps, about a minute.</div></div>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-4">
          <div className="rounded-[14px_11px_13px_10px] border-[1.6px] border-ink-line bg-paper-2 p-[22px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="font-hand text-[26px] font-bold text-accent">1</div>
            <div className="mt-1.5 text-lg font-bold">Brain-dump</div>
            <div className="mt-1.5 text-sm leading-[1.5] text-muted-2">Type a sentence — "learn Japanese, get fit, ship my game." Skein splits it into nodes.</div>
          </div>
          <div className="rounded-[11px_14px_10px_13px] border-[1.6px] border-ink-line bg-paper-2 p-[22px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="font-hand text-[26px] font-bold text-[#6f8aa8]">2</div>
            <div className="mt-1.5 text-lg font-bold">It groups itself</div>
            <div className="mt-1.5 text-sm leading-[1.5] text-muted-2">Related interests cluster into colored themes automatically — or drag your own groups.</div>
          </div>
          <div className="rounded-[13px_10px_14px_11px] border-[1.6px] border-ink-line bg-paper-2 p-[22px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="font-hand text-[26px] font-bold text-[#b07d67]">3</div>
            <div className="mt-1.5 text-lg font-bold">Decide for me</div>
            <div className="mt-1.5 text-sm leading-[1.5] text-muted-2">Overwhelmed? Skein weighs energy, priority &amp; neglect and picks one tiny next step.</div>
          </div>
          <div className="rounded-[10px_13px_11px_14px] border-[1.6px] border-ink-line bg-paper-2 p-[22px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="font-hand text-[26px] font-bold text-[#927696]">4</div>
            <div className="mt-1.5 text-lg font-bold">Focus &amp; log</div>
            <div className="mt-1.5 text-sm leading-[1.5] text-muted-2">Start a focus session, then it logs itself — building streaks and your progress.</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="mx-auto mt-16 max-w-[1120px] px-4 sm:mt-24 sm:px-6">
        <div className="mb-10 text-center"><div className="font-hand text-[40px] font-bold text-ink">Everything in one calm place</div></div>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 md:gap-[22px]">
          <div className="rounded-2xl border-[1.6px] border-ink-line bg-panel p-[26px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="text-xl font-bold">See how it all connects</div>
            <div className="mt-1.5 mb-4 text-sm leading-[1.5] text-muted-2">Colored, self-organizing groups and hand-drawn links reveal where two interests feed each other — no more mental tabs.</div>
            <div className="relative h-[140px] overflow-hidden rounded-xl border-[1.5px] border-[#cfd6d8] bg-paper">
              <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke="#9aa1a5" strokeWidth="1.3"><path d="M110 60 C200 90 300 60 380 80" opacity=".8" filter="url(#edge)"/></svg>
              <div className="absolute left-6 top-[38px] w-[110px] rounded-[9px_7px_10px_6px] border-[1.5px] border-ink-line bg-paper-2 px-[9px] py-[7px] text-xs font-semibold shadow-[2px_2px_0_rgba(58,64,69,.1)]">Learn Japanese</div>
              <div className="absolute right-[30px] top-14 w-[110px] rounded-[7px_9px_6px_10px] border-[1.5px] border-ink-line bg-paper-2 px-[9px] py-[7px] text-xs font-semibold shadow-[2px_2px_0_rgba(58,64,69,.1)]">Read books</div>
            </div>
          </div>
          <div className="rounded-2xl border-[1.6px] border-ink-line bg-panel p-[26px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="text-xl font-bold">The "just tell me" button</div>
            <div className="mt-1.5 mb-4 text-sm leading-[1.5] text-muted-2">A weighted shuffle or three quick filters (time · energy · mood) lands you on one thing — with a tiny next step and a why-now.</div>
            <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 p-4 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="text-[11px] text-[#7b8287]">right now, do this →</div>
              <div className="my-[3px] font-hand text-[26px] font-bold leading-[1.05]">Learn Japanese</div>
              <div className="inline-block rounded-lg border-[1.3px] border-accent bg-[rgba(122,154,111,.14)] px-2 py-[3px] text-[11px] text-accent-deep">15 min · low energy</div>
            </div>
          </div>
          <div className="rounded-2xl border-[1.6px] border-ink-line bg-panel p-[26px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="text-xl font-bold">Watch progress build</div>
            <div className="mt-1.5 mb-4 text-sm leading-[1.5] text-muted-2">Each interest gets a goal, streaks, weekly hours and a momentum trend — so neglect is visible and wins feel real.</div>
            <div className="flex h-24 items-end gap-2 rounded-xl border-[1.5px] border-[#cfd6d8] bg-paper-2 p-3.5">
              <div className="h-[30%] flex-1 rounded-t border-[1.4px] border-ink-line bg-[rgba(122,154,111,.5)]"></div>
              <div className="h-[48%] flex-1 rounded-t border-[1.4px] border-ink-line bg-[rgba(122,154,111,.5)]"></div>
              <div className="h-[38%] flex-1 rounded-t border-[1.4px] border-ink-line bg-[rgba(122,154,111,.5)]"></div>
              <div className="h-[64%] flex-1 rounded-t border-[1.4px] border-ink-line bg-[rgba(122,154,111,.5)]"></div>
              <div className="h-[80%] flex-1 rounded-t border-[1.4px] border-ink-line bg-accent"></div>
            </div>
          </div>
          <div className="rounded-2xl border-[1.6px] border-ink-line bg-panel p-[26px] shadow-[3px_4px_0_rgba(58,64,69,.1)]">
            <div className="text-xl font-bold">Then actually do it</div>
            <div className="mt-1.5 mb-4 text-sm leading-[1.5] text-muted-2">"Start this" opens a focus timer sized to your energy. Finish, and the session logs itself and bumps your streak.</div>
            <div className="flex h-24 items-center justify-center rounded-xl border-[1.5px] border-[#cfd6d8] bg-paper-2">
              <div className="relative h-[78px] w-[78px]">
                <svg width="78" height="78" viewBox="0 0 78 78"><circle cx="39" cy="39" r="32" fill="none" stroke="#e0e5e6" strokeWidth="7"/><circle cx="39" cy="39" r="32" fill="none" stroke="#7a9a6f" strokeWidth="7" strokeLinecap="round" strokeDasharray="130 201" transform="rotate(-90 39 39)"/></svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[17px] font-semibold">30:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="mx-auto mt-16 max-w-[820px] px-4 sm:mt-24 sm:px-6">
        <div className="mb-9 text-center"><div className="font-hand text-[40px] font-bold text-ink">Questions</div></div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-5 py-[18px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="text-base font-bold">Isn't this just another to-do app?</div>
            <div className="mt-1.5 text-sm leading-[1.55] text-muted-2">No. Skein isn't about clearing tasks — it's about holding your many interests without guilt and helping you choose one when you're stuck. No overdue-red, no backlog.</div>
          </div>
          <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-5 py-[18px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="text-base font-bold">How does "decide for me" actually choose?</div>
            <div className="mt-1.5 text-sm leading-[1.55] text-muted-2">It weighs how much energy each interest takes, the priority you set, and how long you've neglected it — then surfaces one, with a tiny next step. Not feeling it? "Not today" re-rolls.</div>
          </div>
          <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-5 py-[18px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="text-base font-bold">Is my data private?</div>
            <div className="mt-1.5 text-sm leading-[1.55] text-muted-2">Your canvas lives in your browser. It's your quiet space — no feed, no sharing, nothing public.</div>
          </div>
          <div className="rounded-xl border-[1.6px] border-ink-line bg-paper-2 px-5 py-[18px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="text-base font-bold">Do I need to fill everything in?</div>
            <div className="mt-1.5 text-sm leading-[1.55] text-muted-2">Nope. Drop one thought or a whole tangle. Goals, streaks and next steps are optional — Skein can even suggest a step with AI when you're blank.</div>
          </div>
        </div>
      </div>

      {/* WAITLIST FOOTER */}
      <div className="mx-auto mt-16 max-w-[1120px] px-4 sm:mt-24 sm:px-6">
        <div className="rounded-3xl border-[1.8px] border-ink-line bg-ink px-5 py-10 text-center shadow-[6px_8px_0_rgba(0,0,0,.16)] sm:px-10 sm:py-14">
          <div className="font-hand text-[38px] font-bold leading-[1.05] text-white sm:text-[46px]">Quiet the noise. Weave your interests.</div>
          <div className="mt-3 text-base text-[#aab1b4]">Join the waitlist for early access — or start weaving right now.</div>
          <div className="mt-[26px] flex flex-wrap items-center justify-center gap-2.5">
            <Waitlist dark />
            <Link href="/canvas" className="border-b-[1.5px] border-dashed border-accent pb-px text-[15px] font-semibold text-[#dfe4e6] hover:text-[#dfe4e6]">try the live canvas →</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-3 px-4 pt-9 pb-12 text-center sm:flex-row sm:px-6 sm:text-left">
        <span className="font-hand text-2xl font-bold text-ink">Skein</span>
        <span className="text-[13px] text-muted">parallel interests, one calm canvas · tryskein.com</span>
        <div className="flex gap-5 text-[13px] text-muted"><a href="#how" className="text-muted hover:text-muted">how it works</a><a href="#features" className="text-muted hover:text-muted">features</a><a href="#faq" className="text-muted hover:text-muted">FAQ</a></div>
      </div>
    </div>
  );
}
