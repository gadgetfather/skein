export const metadata = { title: 'Design System — Skein' };

const surfaces = [
  { name: 'paper', hex: '#edf0f1', token: '--skein-paper' },
  { name: 'paper-2', hex: '#fbfbfa', token: '--skein-paper-2' },
  { name: 'panel', hex: '#f7f8f8', token: '--skein-panel' },
  { name: 'ink', hex: '#2b3034', token: '--skein-ink' },
  { name: 'ink-line', hex: '#3a4045', token: '--skein-ink-line' },
  { name: 'muted', hex: '#8a9196', token: '--skein-muted' },
  { name: 'muted-2', hex: '#6c7378', token: '--skein-muted-2' },
  { name: 'hairline', hex: '#c8ced1', token: '--skein-hairline' },
];

const accents = [
  { name: 'accent', hex: '#7a9a6f', token: '--skein-accent' },
  { name: 'accent-deep', hex: '#5c7a52', token: '--skein-accent-deep' },
  { name: 'accent-wash', hex: '#e6ecE2', token: 'rgba(122,154,111,.14)' },
];

const typeScale = [
  { family: "'Caveat',cursive", weight: 700, px: 44, sample: 'Display / Caveat', spec: 'Caveat 700 · 44px' },
  { family: "'Caveat',cursive", weight: 700, px: 28, sample: 'Section head', spec: 'Caveat 700 · 28px' },
  { family: "'Shantell Sans',cursive", weight: 700, px: 19, sample: 'Node title (strong)', spec: 'Shantell 700 · 19px' },
  { family: "'Shantell Sans',cursive", weight: 600, px: 16, sample: 'Body / UI emphasis', spec: 'Shantell 600 · 16px' },
  { family: "'Shantell Sans',cursive", weight: 400, px: 14, sample: 'Body copy, calm & plain', spec: 'Shantell 400 · 14px' },
  { family: "'Shantell Sans',cursive", weight: 400, px: 11, sample: 'Meta / caption', spec: 'Shantell 400 · 11px' },
];

const spacing = [4, 8, 12, 16, 24, 32];

const principles = [
  { title: 'Quiet by default', body: 'Cool paper, low contrast, generous space. The canvas should lower the heart rate, not raise it.' },
  { title: 'One accent, earned', body: 'Sage means "here" — selection, the calling node, the decisive action. Never decorative.' },
  { title: 'Made by hand', body: 'Wobble radii, offset shadows, roughened lines. Nothing looks machine-perfect; it looks thought-through.' },
  { title: 'Decide, don’t archive', body: 'The graph exists to surface one next step — not to be maintained. Every screen ends in a choice.' },
];

const shortcuts = [
  ['Select / Hand tool', 'V / H'],
  ['Undo / Redo', '⌘Z / ⌘⇧Z'],
  ['Add thought / Brain-dump', 'T / B'],
  ['Select all', '⌘A'],
  ['Connect / Auto-group', 'C / G'],
  ['Copy / Paste / Cut', '⌘C / ⌘V / ⌘X'],
  ['Decide for me', 'D'],
  ['Duplicate', '⌘D'],
  ['Back out / Deselect', 'Esc'],
  ['Delete selected', 'Del / ⌫'],
];

function Swatch({ c }) {
  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-ink-line bg-panel shadow-[2px_3px_0_rgba(58,64,69,.1)]">
      <div className="h-[74px] border-b-[1.5px] border-ink-line" style={{ background: c.hex }}></div>
      <div className="px-[11px] py-[9px]">
        <div className="text-sm font-semibold text-ink">{c.name}</div>
        <div className="mono mt-0.5 text-xs text-[#7b8287]">{c.hex}</div>
        <div className="mono text-[11px] text-[#a4abae]">{c.token}</div>
      </div>
    </div>
  );
}

const sectionHead = 'mb-1 font-hand text-[30px] font-bold text-ink';
const cardLabel = 'mb-4 text-[13px] font-semibold uppercase tracking-[.06em] text-muted';

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-[#e4e8ea]">
      <svg width="0" height="0" className="pointer-events-none absolute">
        <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4"/></filter>
        <filter id="edge"><feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8"/></filter>
      </svg>

      <div className="mx-auto max-w-[1080px] px-12 pt-14 pb-24">

        {/* title */}
        <div className="mb-[44px] border-b-2 border-ink-line pb-[22px]">
          <div className="font-hand text-[52px] leading-none font-bold text-ink">Skein — Design System</div>
          <div className="mt-2 max-w-[640px] text-base leading-normal text-muted-2">The hand-drawn token set behind the Calm Constellation canvas. Cool paper, ink, and one sage accent. Values are copy-ready for handoff — group under <code className="rounded-[5px] bg-[#dde3e5] px-1.5 py-px text-[13px]">--skein-*</code> when you wire them up.</div>
        </div>

        {/* COLOR */}
        <div className={sectionHead}>01 · Color</div>
        <div className="mb-5 text-sm text-[#7b8287]">Whites & inks stay cool and low-saturation. A single sage accent carries all emphasis, selection, and the "calling now" state.</div>

        <div className="mb-3 text-[13px] font-semibold uppercase tracking-[.07em] text-muted">Surfaces &amp; ink</div>
        <div className="mb-8 grid grid-cols-4 gap-4">
          {surfaces.map(c => <Swatch key={c.name} c={c} />)}
        </div>

        <div className="mb-3 text-[13px] font-semibold uppercase tracking-[.07em] text-muted">Accent — sage</div>
        <div className="mb-[44px] grid grid-cols-4 gap-4">
          {accents.map(c => <Swatch key={c.name} c={c} />)}
        </div>

        {/* TYPE */}
        <div className={sectionHead}>02 · Type</div>
        <div className="mb-5 text-sm text-[#7b8287]">Two hand families. <b>Caveat</b> for display / labels, <b>Shantell&nbsp;Sans</b> for everything readable. JetBrains Mono only for data & tokens.</div>
        <div className="mb-[44px] flex flex-col gap-0.5 rounded-[14px] border-[1.5px] border-ink-line bg-panel px-[26px] py-6 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          {typeScale.map(t => (
            <div key={t.spec} className="flex items-baseline justify-between gap-5 border-b border-dashed border-[#d3d9db] py-2.5">
              <div className="leading-[1.1] text-ink" style={{ fontFamily: t.family, fontWeight: t.weight, fontSize: t.px }}>{t.sample}</div>
              <div className="mono whitespace-nowrap text-[11px] text-[#a4abae]">{t.spec}</div>
            </div>
          ))}
        </div>

        {/* STROKE, RADII, SHADOW */}
        <div className={sectionHead}>03 · Line, radius &amp; shadow</div>
        <div className="mb-5 text-sm text-[#7b8287]">The hand-drawn feel: uneven corner radii, a hard offset "sketch" shadow (no blur), and a turbulence filter that roughens borders & connectors.</div>
        <div className="mb-[22px] grid grid-cols-3 gap-4">
          <div className="rounded-xl border-[1.5px] border-ink-line bg-panel p-5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="mb-3.5 text-sm font-semibold text-ink">Wobble radii</div>
            <div className="mb-2 h-14 rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2"></div>
            <div className="mono text-[11px] text-[#7b8287]">node · 11px 8px 12px 7px</div>
            <div className="mono text-[11px] text-[#7b8287]">chip · 10px 8px 11px 8px</div>
          </div>
          <div className="rounded-xl border-[1.5px] border-ink-line bg-panel p-5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="mb-3.5 text-sm font-semibold text-ink">Sketch shadow</div>
            <div className="mb-2 h-14 rounded-[10px] border-[1.6px] border-ink-line bg-paper-2 shadow-sketch-sm"></div>
            <div className="mono text-[11px] text-[#7b8287]">sm · 2px 3px 0 / .14</div>
            <div className="mono text-[11px] text-[#7b8287]">lg · 6px 8px 0 / .10</div>
          </div>
          <div className="rounded-xl border-[1.5px] border-ink-line bg-panel p-5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className="mb-3.5 text-sm font-semibold text-ink">Rough filter</div>
            <svg width="100%" height="56" className="mb-2 block" fill="none" stroke="#3a4045" strokeWidth="1.7"><rect x="6" y="6" width="120" height="44" rx="8" filter="url(#rough)"/><path d="M150 30 h90" filter="url(#rough)"/></svg>
            <div className="mono text-[11px] text-[#7b8287]">feTurbulence 0.014 · scale 3.4</div>
          </div>
        </div>
        <div className="mb-[44px] rounded-xl border-[1.5px] border-ink-line bg-panel p-5 shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          <div className="mb-3 text-sm font-semibold text-ink">Spacing scale <span className="mono text-[11px] font-normal text-[#a4abae]">— 4px base</span></div>
          <div className="flex items-end gap-3.5">
            {spacing.map(px => (
              <div key={px} className="text-center">
                <div className="rounded-sm border-[1.4px] border-ink-line bg-accent" style={{ width: px, height: px }}></div>
                <div className="mono mt-[5px] text-[10px] text-[#7b8287]">{px}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPONENTS */}
        <div className={sectionHead}>04 · Components</div>
        <div className="mb-5 text-sm text-[#7b8287]">The recurring pieces of the canvas, with the tokens each one uses.</div>

        <div className="mb-5 grid grid-cols-2 gap-5">
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:22px_22px] p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Interest node</div>
            <div className="relative mx-auto w-[154px] rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 px-[13px] py-[11px] shadow-sketch-sm">
              <div className="text-[17px] font-semibold text-ink">Learn Japanese</div>
              <div className="mt-0.5 text-[11px] text-[#90999d]">language</div>
              <div className="mt-[9px] flex items-center gap-1"><span className="mr-0.5 text-[10px] text-[#90999d]">energy</span><span className="h-1.5 w-1.5 rounded-full bg-accent"></span><span className="h-1.5 w-1.5 rounded-full bg-accent"></span><span className="h-1.5 w-1.5 rounded-full bg-[#cbd0d2]"></span></div>
            </div>
          </div>
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:22px_22px] p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Node — "calling now"</div>
            <div className="relative mx-auto w-[154px] rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 px-[13px] py-[11px] animate-[callPulse_3s_ease-in-out_infinite]">
              <div className="absolute -top-[11px] -right-2 rounded-[9px_7px_9px_6px] bg-accent px-2 py-0.5 text-[10px] font-semibold text-white shadow-[1px_2px_0_rgba(58,64,69,.15)]">start here</div>
              <div className="text-[17px] font-semibold text-ink">Learn Japanese</div>
              <div className="mt-0.5 text-[11px] text-[#90999d]">language</div>
              <div className="mt-[9px] flex items-center gap-1"><span className="mr-0.5 text-[10px] text-[#90999d]">energy</span><span className="h-1.5 w-1.5 rounded-full bg-accent"></span><span className="h-1.5 w-1.5 rounded-full bg-accent"></span><span className="h-1.5 w-1.5 rounded-full bg-accent"></span></div>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-5">
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Buttons</div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent px-[17px] py-[9px] text-sm font-semibold text-white shadow-[2px_3px_0_rgba(58,64,69,.18)]">primary</button>
              <button className="cursor-pointer rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-panel px-[15px] py-[9px] text-sm font-semibold text-ink shadow-[2px_3px_0_rgba(58,64,69,.12)]">secondary</button>
            </div>
            <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">bg accent / paper-2 · border ink-line 1.6px<br/>radius wobble · shadow sm</div>
          </div>
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Filter chips</div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-[10px_8px_11px_8px] border-[1.6px] border-accent bg-accent px-3.5 py-[7px] text-[13px] font-semibold text-white">selected</span>
              <span className="rounded-[10px_8px_11px_8px] border-[1.6px] border-[#b7bec1] bg-paper-2 px-3.5 py-[7px] text-[13px] font-semibold text-ink">idle</span>
            </div>
            <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">selected: fill accent, white text<br/>idle: paper-2, muted border</div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-5">
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Node detail drawer</div>
            <div className="w-[210px] rounded-[12px_10px_13px_9px] border-[1.8px] border-ink-line bg-panel p-3 shadow-[3px_4px_0_rgba(58,64,69,.16)]">
              <div className="border-b-[1.4px] border-hairline pb-1 text-[15px] font-semibold text-ink">Learn Japanese</div>
              <div className="mt-[11px] flex items-center justify-between"><span className="text-[11px] text-[#90999d]">energy</span><div className="flex gap-1.5"><span className="h-[13px] w-[13px] rounded-full border-[1.4px] border-ink-line bg-accent"></span><span className="h-[13px] w-[13px] rounded-full border-[1.4px] border-ink-line bg-accent"></span><span className="h-[13px] w-[13px] rounded-full border-[1.4px] border-ink-line bg-[#cbd0d2]"></span></div></div>
              <div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-[#a4abae]">drag into a group to re-file</span><button className="cursor-pointer rounded-lg border-[1.5px] border-[#cbd0d2] bg-paper-2 px-[9px] py-[5px] text-xs font-semibold text-muted-2">delete</button></div>
            </div>
            <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">opens from the right on node select · 392px<br/>name · tag · energy · group · notes · next step · activity</div>
          </div>
          <div className="rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
            <div className={cardLabel}>Energy selector</div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 cursor-pointer rounded-full border-[1.5px] border-ink-line bg-accent"></span>
              <span className="h-4 w-4 cursor-pointer rounded-full border-[1.5px] border-ink-line bg-accent"></span>
              <span className="h-4 w-4 cursor-pointer rounded-full border-[1.5px] border-ink-line bg-[#cbd0d2]"></span>
            </div>
            <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">3 dots · filled = accent, empty = hairline<br/>click to set level 1–3 · persists to storage</div>
          </div>
        </div>

        <div className="mb-5 rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          <div className={cardLabel}>Keyboard shortcuts</div>
          <div className="grid max-w-[640px] grid-cols-2 gap-x-10 gap-y-2">
            {shortcuts.map(([action, keys]) => (
              <div key={action} className="flex justify-between text-[13px] text-ink-line"><span>{action}</span><span className="mono text-muted">{keys}</span></div>
            ))}
          </div>
          <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">shortcuts ignore keystrokes while typing in a field · ⌘ = Cmd on macOS, Ctrl elsewhere<br/>history captures every add / move / delete / connect / group / energy change (60 steps)</div>
        </div>

        <div className="mb-5 rounded-[14px] border-[1.5px] border-ink-line bg-panel p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          <div className={cardLabel}>Group colors</div>
          <div className="flex flex-wrap gap-[18px]">
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[1.4px] border-ink-line bg-accent"></span><span className="text-[13px] text-ink">learning · #7a9a6f</span></div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[1.4px] border-ink-line bg-[#6f8aa8]"></span><span className="text-[13px] text-ink">craft · #6f8aa8</span></div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[1.4px] border-ink-line bg-[#b07d67]"></span><span className="text-[13px] text-ink">body · #b07d67</span></div>
            <div className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-[1.4px] border-ink-line bg-[#927696]"></span><span className="text-[13px] text-ink">other · #927696</span></div>
          </div>
          <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">harmonized muted hues (similar L/C, varied hue) — one per group<br/>a group tints its enclosure wash (7%), dashed border (60%) &amp; label; member nodes echo it in their energy dots + corner dot<br/>manual groups pull the next palette hue: #b0975a · #5f9a92 · #a56f8f · #7f86b0 …<br/>sage stays the action accent (select / calling / decide) regardless of group hue</div>
        </div>

        {/* cluster + connector */}
        <div className="mb-[44px] rounded-[14px] border-[1.5px] border-ink-line bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:22px_22px] p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          <div className={cardLabel}>Cluster enclosure &amp; connector</div>
          <div className="relative h-[150px]">
            <div className="absolute top-[26px] left-5 h-[110px] w-[250px] rounded-[30px_24px_32px_26px] border-[1.4px] border-dashed border-[#b6bec1] bg-[rgba(58,64,69,.035)] [filter:url(#rough)]"></div>
            <div className="absolute top-3 left-[34px] flex items-center gap-2 rounded-[9px_8px_10px_8px] border-[1.4px] border-[#cfd6d8] bg-[#f4f6f7] pt-1 pr-3 pb-[5px] pl-[9px] shadow-[1px_2px_0_rgba(58,64,69,.08)]"><span className="font-hand text-lg leading-none font-bold text-muted-2">mind &amp; language</span></div>
            <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke="#9aa1a5" strokeWidth="1.3" strokeLinecap="round"><path d="M120 98 C170 72 250 120 300 94" opacity="0.85" filter="url(#edge)"/></svg>
            <div className="absolute top-14 left-[60px] w-[120px] rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 px-[11px] py-2 shadow-sketch-sm"><div className="text-sm font-semibold text-ink">Read books</div></div>
          </div>
          <div className="mono mt-2 text-[11px] leading-[1.6] text-[#a4abae]">enclosure: soft wash + 1.4px dashed #b6bec1 · rough filter · folder-tab label (grab to move)<br/>connector: #9aa1a5 1.3px · cubic arc · gentle #edge filter<br/>membership auto-assigned by theme keywords · relabels & reflows live<br/>connectors: seeded from overlaps · add/remove your own in connect mode</div>
        </div>

        {/* decide result */}
        <div className="mb-[44px] rounded-[14px] border-[1.5px] border-ink-line bg-paper bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:22px_22px] p-[26px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
          <div className={cardLabel}>Decide result</div>
          <div className="w-[340px] max-w-full rounded-[18px] border-[1.8px] border-ink-line bg-panel p-[22px] shadow-[6px_8px_0_rgba(58,64,69,.18)]">
            <div className="text-[13px] text-[#7b8287]">right now, do this →</div>
            <div className="my-1 font-hand text-[32px] leading-[1.05] font-bold text-ink">Learn Japanese</div>
            <div className="mb-2 inline-block rounded-[9px] border-[1.4px] border-accent bg-[rgba(122,154,111,.14)] px-2.5 py-[3px] text-xs text-accent-deep">a nudge toward what you've been circling</div>
            <div className="mb-3.5 text-[12.5px] leading-[1.45] text-[#5c6166]">It's been 12 days. A gentle re-entry beats a big push.</div>
            <div className="rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 p-[13px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="mb-[5px] text-[11px] uppercase tracking-[.06em] text-[#90999d]">your tiny next step</div>
              <div className="text-[15px] leading-[1.35] text-ink">Do just the due Anki cards — 15 minutes, nothing more.</div>
            </div>
            <div className="mt-4 flex gap-2.5">
              <span className="flex-1 rounded-[11px_9px_12px_9px] border-[1.6px] border-ink-line bg-accent p-2.5 text-center text-[15px] font-bold text-white">start this</span>
              <span className="rounded-[9px_11px_8px_12px] border-[1.6px] border-ink-line bg-paper-2 px-[15px] py-2.5 text-sm font-semibold text-ink">not today ↻</span>
            </div>
          </div>
          <div className="mono mt-4 text-[11px] leading-[1.6] text-[#a4abae]">reason chip (why chosen) + why-now line (from last-touched)<br/>shuffle is neglect-weighted · "not today" excludes &amp; re-rolls · "start this" logs activity<br/>decide menu shows a heads-up when an interest has gone untouched</div>
        </div>

        {/* PRINCIPLES */}
        <div className="mb-4 font-hand text-[30px] font-bold text-ink">05 · Principles</div>
        <div className="grid grid-cols-2 gap-4">
          {principles.map(p => (
            <div key={p.title} className="rounded-xl border-[1.5px] border-ink-line bg-panel px-5 py-[18px] shadow-[2px_3px_0_rgba(58,64,69,.1)]">
              <div className="mb-1 font-hand text-[22px] font-bold text-accent">{p.title}</div>
              <div className="text-sm leading-normal text-[#4c5257]">{p.body}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
