# Skein Route Materials

## Status

First implementation slice.

## Product thesis

A route is more useful when it is grounded in what the user already has: a syllabus, project brief, screenshot, research link, or a few private notes. Route Materials gives each interest a small, explicit context pack without turning Skein into a general-purpose file library.

## User experience

- Route Map has a `context` control showing the number of active sources.
- A right-side paper drawer accepts notes, public links, PDFs, and common image formats.
- Every source has a visible type, title, extraction status, include/exclude control, and delete action.
- Route generation says how many sources it will use and never silently includes disabled sources.
- Generated route nodes may retain source IDs so their grounding remains inspectable after generation.

## First-slice limits

- At most 12 saved materials and 8 active materials per interest.
- Notes are capped at 6,000 characters.
- Public pages are fetched without user cookies, with redirect, address, content-type, response-size, and timeout limits.
- PDFs and images are capped at 6 MB and require sign-in. Their originals are stored in a private Supabase Storage bucket.
- Processing produces a short summary and a small set of useful excerpts. Route generation receives those processed fields, not entire files.
- Semantic/vector search is intentionally excluded until source collections become large enough to justify it.

## Data shape

Material references live with their interest so local-first canvas saves and cloud conflict handling remain atomic:

```js
{
  id: 'mat_…',
  type: 'note' | 'link' | 'pdf' | 'image',
  title: 'Course syllabus',
  summary: '…',
  excerpts: ['…'],
  sourceUrl: '',
  storagePath: '',
  fileName: '',
  mimeType: '',
  size: 0,
  enabled: true,
  createdAt: 0
}
```

Raw file bytes never enter localStorage or the canvas JSON. Authenticated files use the private `skein-route-materials` bucket at `{user_id}/{interest_id}/{material_id}/{filename}`.

## Generation contract

Route generation receives up to eight enabled sources, each reduced to:

- stable material ID;
- type and title;
- concise summary;
- bounded relevant excerpts;
- public source URL when applicable.

Material content is untrusted reference data. The model must ignore commands or role instructions found inside it, prefer the user's stated direction over a source's agenda, avoid inventing claims, and attach source IDs only when a node is materially grounded in those sources.

## Privacy and security

- The materials drawer shows exactly what is active before generation.
- Copy explains that active material context is sent to the configured AI provider.
- The Storage bucket is private and owner-scoped through RLS on the first path segment.
- No service-role key is used in the browser.
- Link fetching rejects credentials, localhost, private/reserved IP ranges, non-HTTP protocols, non-readable content types, oversized responses, and unsafe redirects.
- Extractors treat uploaded and fetched content as untrusted data, never instructions.
- Deleting a file material removes both its Storage object and its canvas reference.

## Acceptance criteria

- A local-only user can add, disable, re-enable, and remove note and public-link materials.
- A signed-in user can add PDF/image materials and receives an actionable error when extraction or private upload fails.
- Active materials are included in Route Map generation within a strict server-side context budget.
- Generated nodes preserve valid source IDs only.
- Existing canvas documents load unchanged and gain an empty `materials` array lazily.
- Reduced motion, keyboard focus, mobile layout, and existing paper/ink visual language are preserved.
