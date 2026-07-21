import { useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { motionEase } from './motion/tokens';

const TYPE_LABELS = { note: 'note', link: 'link', pdf: 'PDF', image: 'image' };
const TYPE_MARKS = { note: '≡', link: '↗', pdf: 'P', image: '▧' };
const ERROR_COPY = {
  invalid_url: 'That does not look like a complete public link.',
  unsafe_url: 'That link points to a private or unsupported address.',
  page_too_large: 'That page is too large to read safely.',
  page_unavailable: 'The page could not be reached.',
  unsupported_page: 'That link is not a readable HTML or text page.',
  unsupported_file: 'Use a PDF, PNG, JPG, or WebP file.',
  file_too_large: 'Files must be 6 MB or smaller.',
  missing_api_key: 'File reading needs the AI provider to be configured.',
  upload_failed: 'The context was read, but its private original could not be saved. Try again.',
  delete_failed: 'The private original could not be deleted. Nothing was removed; please try again.',
  sign_in_required: 'Sign in before adding private files.',
  extraction_failed: 'Skein could not read that material. Try a clearer file or paste the important part as a note.',
  too_many_materials: 'This interest already has 12 materials. Remove one before adding another.',
  too_many_active: 'Up to eight materials can shape one route draft. Uncheck one first.',
};

export default function RouteMaterials({ r }) {
  const [mode, setMode] = useState('note');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');
  const fileRef = useRef(null);
  const submitNote = async event => {
    event.preventDefault();
    if (await r.onAddNote(note)) setNote('');
  };
  const submitLink = async event => {
    event.preventDefault();
    if (await r.onAddLink(link)) setLink('');
  };
  const chooseFile = async event => {
    const file = event.target.files?.[0];
    if (file) await r.onAddFile(file);
    event.target.value = '';
  };
  return <AnimatePresence>{r.materialsOpen && <>
    <m.button
      aria-label="Close Route Materials"
      onClick={r.onCloseMaterials}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .16 }}
      className="fixed inset-0 z-[56] cursor-default bg-[rgba(43,48,52,.22)] backdrop-blur-[1px]"
    />
    <m.aside
      role="dialog" aria-modal="true" aria-labelledby="route-materials-title"
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}
      transition={{ duration: .26, ease: motionEase.out }}
      className="fixed top-0 right-0 z-[57] flex h-dvh w-full max-w-[430px] flex-col border-l-[1.8px] border-ink-line bg-panel shadow-[-7px_0_0_rgba(58,64,69,.10)]"
    >
      <header className="flex items-start justify-between gap-4 border-b-[1.4px] border-[#c7ced0] px-5 py-5">
        <div>
          <div className="mb-1 text-[9px] font-bold uppercase tracking-[.1em] text-accent-deep">route context</div>
          <h2 id="route-materials-title" className="font-hand text-[28px] font-bold leading-none text-ink">materials for the road</h2>
          <p className="mt-2 max-w-[330px] text-[11px] leading-[1.45] text-muted-2">Add what you already know. Only checked materials shape the next AI draft.</p>
        </div>
        <button onClick={r.onCloseMaterials} aria-label="Close" className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-[9px] border-[1.4px] border-ink-line bg-paper text-lg text-ink">×</button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex rounded-[10px_8px_11px_9px] border-[1.3px] border-[#c7ced0] bg-paper p-1">
          {[['note','note'],['link','public link'],['file','PDF / image']].map(([key,label]) => <button key={key} onClick={() => setMode(key)} className={`flex-1 cursor-pointer rounded-[7px] px-2 py-1.5 text-[10px] font-bold transition-colors ${mode===key?'bg-ink text-white':'text-muted-2 hover:bg-paper-2'}`}>{label}</button>)}
        </div>

        {mode === 'note' && <form onSubmit={submitNote} className="mt-3">
          <textarea autoFocus value={note} onChange={event => setNote(event.target.value)} maxLength={6000} placeholder="Paste the brief, your rough notes, constraints, or the part that matters…" className="h-32 w-full resize-y rounded-[11px_8px_12px_9px] border-[1.4px] border-ink-line bg-paper-2 p-3 text-[12px] leading-[1.5] text-ink outline-none focus:border-accent" />
          <div className="mt-2 flex items-center justify-between gap-3"><span className="text-[9px] text-muted">stored with this interest · {note.length}/6000</span><button disabled={!note.trim()||r.materialBusy} className="cursor-pointer rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-accent px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-default disabled:opacity-45">add note</button></div>
        </form>}

        {mode === 'link' && <form onSubmit={submitLink} className="mt-3">
          <label className="text-[9px] font-bold uppercase tracking-[.08em] text-muted">public URL</label>
          <input autoFocus type="url" value={link} onChange={event => setLink(event.target.value)} maxLength={2048} placeholder="https://example.com/resource" className="mt-1.5 w-full rounded-[10px_8px_11px_8px] border-[1.4px] border-ink-line bg-paper-2 px-3 py-2.5 text-[12px] text-ink outline-none focus:border-accent" />
          <div className="mt-2 flex items-center justify-between gap-3"><span className="text-[9px] leading-[1.35] text-muted">Skein reads public page text without your cookies.</span><button disabled={!link.trim()||r.materialBusy} className="cursor-pointer rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-accent px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-wait disabled:opacity-45">{r.materialBusy?'reading…':'read link'}</button></div>
        </form>}

        {mode === 'file' && <div className="mt-3 rounded-[12px_9px_13px_10px] border-[1.4px] border-dashed border-[#aeb7ba] bg-paper-2 p-4 text-center">
          <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={chooseFile} className="hidden" />
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-[1.4px] border-[#b7bec1] bg-paper font-hand text-xl font-bold text-accent-deep">+</div>
          <div className="mt-2 text-[12px] font-bold text-ink">PDF, screenshot, or image</div>
          <p className="mx-auto mt-1 max-w-[280px] text-[10px] leading-[1.45] text-muted-2">Up to 6 MB. Skein extracts planning context once; the original stays private in your account.</p>
          <button onClick={() => fileRef.current?.click()} disabled={!r.canUploadFiles||r.materialBusy} className="mt-3 cursor-pointer rounded-[9px_7px_10px_8px] border-[1.4px] border-ink-line bg-paper px-3 py-1.5 text-[11px] font-bold text-ink disabled:cursor-default disabled:opacity-45">{r.materialBusy?'reading material…':r.canUploadFiles?'choose a file':'sign in to add files'}</button>
          {!r.canUploadFiles && <p className="mt-2 text-[9px] leading-[1.35] text-[#9a6f45]">Close Route Map and use the cloud control to sign in first.</p>}
        </div>}

        {r.materialError && <div role="alert" className="mt-3 rounded-[9px_7px_10px_8px] border-[1.3px] border-[#b07d67] bg-[rgba(176,125,103,.08)] px-3 py-2 text-[10px] leading-[1.4] text-[#8f5e4a]">{ERROR_COPY[r.materialError] || ERROR_COPY.extraction_failed}</div>}

        <div className="mt-5 flex items-baseline justify-between border-b border-dashed border-[#c7ced0] pb-2">
          <h3 className="font-hand text-[21px] font-bold text-ink">context pack</h3>
          <span className="text-[9px] font-bold uppercase tracking-[.07em] text-muted">{r.activeMaterialCount} active · {r.materials.length}/12</span>
        </div>
        {r.materials.length === 0 ? <div className="py-8 text-center text-[11px] leading-[1.5] text-muted"><span className="font-hand text-[20px] text-muted-2">nothing pinned yet</span><br/>A compact brief is often enough to make a route noticeably sharper.</div> : <ul className="mt-2 space-y-2">
          {r.materials.map(material => <li key={material.id} className={`rounded-[11px_8px_12px_9px] border-[1.3px] bg-paper px-3 py-2.5 shadow-[1px_2px_0_rgba(58,64,69,.07)] ${material.enabled?'border-ink-line':'border-[#cbd1d3] opacity-65'}`}>
            <div className="flex items-start gap-2.5">
              <button onClick={() => r.onToggleMaterial(material.id)} aria-label={`${material.enabled?'Exclude':'Include'} ${material.title}`} aria-pressed={material.enabled} className={`mt-0.5 flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded-[6px] border-[1.3px] text-[10px] font-bold ${material.enabled?'border-accent bg-accent text-white':'border-[#aeb7ba] bg-paper text-transparent'}`}>✓</button>
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border border-[#c7ced0] bg-paper-2 text-[10px] font-bold text-accent-deep">{TYPE_MARKS[material.type] || '·'}</span>
              <div className="min-w-0 flex-1"><div className="flex min-w-0 items-baseline gap-2"><span className="truncate text-[11px] font-bold text-ink">{material.title}</span><span className="flex-none text-[8px] font-bold uppercase tracking-[.07em] text-muted">{TYPE_LABELS[material.type] || material.type}</span></div><p className="mt-1 line-clamp-2 text-[9px] leading-[1.4] text-muted-2">{material.summary}</p></div>
              <button onClick={() => r.onRemoveMaterial(material.id)} aria-label={`Remove ${material.title}`} className="flex-none cursor-pointer border-none bg-transparent text-base leading-none text-[#aeb5b8] hover:text-[#a56f8f]">×</button>
            </div>
          </li>)}
        </ul>}
      </div>
      <footer className="border-t-[1.3px] border-[#c7ced0] bg-paper px-5 py-3 text-[9px] leading-[1.4] text-muted">Files are read once by your configured AI provider. Later route drafts send only active summaries and excerpts, not the raw files again.</footer>
    </m.aside>
  </>}</AnimatePresence>;
}
