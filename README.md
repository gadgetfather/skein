# Skein

Parallel interests, one calm canvas — a spatial canvas for juggling multiple interests without guilt. Implemented as a Next.js app from the mocks in the [Claude Design project](https://claude.ai/design/p/eb47ef53-57ca-4ded-a64e-35c29eea63f5).

## Routes

- `/` — marketing landing page (from `Skein Landing.dc.html`) with direct calls to action into the live canvas.
- `/canvas` — the app itself (from `Interest Canvas.dc.html`): first-run "weave" onboarding, draggable interest cards, auto-classified groups with hand-drawn enclosures, connect mode, brain dump, route maps with per-interest notes/links/PDF/image context, route-aware "decide for me", focus sessions, interest detail, undo/redo, keyboard shortcuts, local-first persistence, and optional Supabase cloud save.
- `/design` — the design-system reference sheet (from `Design System.dc.html`): color tokens, type scale, radii/shadows, component specs, shortcuts, principles.

## Stack

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind CSS v4, plain JavaScript. The canvas logic is ported nearly verbatim from the design mock's `DCLogic` class into a React class component (`src/App.jsx`), rendered client-only via `next/dynamic` (`ssr: false`) since it reads localStorage on construction. Styling is Tailwind utilities on the design system's tokens (declared in `@theme` in `src/app/globals.css`: paper/ink/muted/accent colors, Caveat + Shantell Sans fonts, sketch shadows, 4px-base spacing); runtime-computed values (node positions, pan/zoom transforms, group colors) remain minimal inline `style` objects.

## Development

```sh
npm install
cp .env.example .env.local   # add your OpenRouter API key (optional — see below)
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Supabase cloud save

Skein remains fully usable without an account. Every change is written to the existing `skein.*` localStorage keys first. When Supabase is configured, the canvas also offers passwordless email sign-in and debounced cloud backup.

1. Create a Supabase project.
2. Run the migrations in [`supabase/migrations`](./supabase/migrations) in timestamp order in the Supabase SQL editor, or link the Supabase CLI and run `supabase db push`. The second migration creates the private Route Materials bucket and owner-only Storage policies.
3. Add the following browser-safe project values to `.env.local`:

   ```sh
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

4. In Supabase Authentication → URL Configuration, add `http://localhost:3000/canvas` for local development and your production `/canvas` URL as allowed redirect URLs.
5. Restart `npm run dev`, open `/canvas`, and use the `local only` control in the upper-right corner to email a sign-in link.

The migration creates one JSONB canvas document per user, enables RLS, removes anonymous table access, grants CRUD only to the `authenticated` role, and applies owner-only policies using `auth.uid()`. Never expose a `service_role` key through a `NEXT_PUBLIC_*` variable.

On first sign-in, an empty cloud account receives the existing local canvas. If both copies differ, Skein stops and asks whether to keep the device or cloud copy. Signing out preserves the local copy so offline work is never discarded.

## How GPT-5.6 is used

Skein calls **GPT-5.6** (default `openai/gpt-5.6-terra`, configurable via `OPENROUTER_MODEL`) through [OpenRouter](https://openrouter.ai) using the Vercel AI SDK (`ai` + `@openrouter/ai-sdk-provider`), in four places:

1. **Weave** (`POST /api/weave`) — the onboarding brain-dump. Your messy sentence goes to GPT-5.6 with a zod-enforced structured-output schema (`generateObject`) and comes back as a typed map: interests with cluster (`learn`/`craft`/`body`/`other`), energy (1–3), priority (1–3), a short "whisper" label, plus suggested edges between interests that feed each other. The canvas lays the nodes out grouped by cluster and draws the suggested connections.
2. **Suggest next step** (`POST /api/suggest`) — the "✦ suggest with AI" button in an interest's detail view sends the interest, its goal, and recent session notes to GPT-5.6, which replies with one tiny, verb-first next step.
3. **Route materials** (`POST /api/materials/extract`) — public page text, PDFs, and images are reduced once into a bounded factual summary and useful excerpts. Source content is explicitly treated as untrusted data, not model instructions.
4. **Route Map** (`POST /api/route-map`) — combines the direction, current position, recent activity, saved moves, and up to eight selected material summaries into an editable dependency route. Generated nodes retain material IDs when a source materially grounds them.

**Graceful degradation:** AI routes return `503` when `OPENROUTER_API_KEY` is absent, and the client uses local fallbacks. The app remains usable offline. Canvas data stays in localStorage unless the user signs into the optional Supabase cloud save; only AI-request context is sent to the configured model API.

## Structure

- `src/app/` — App Router pages: `page.jsx` (landing), `canvas/page.jsx`, `design/page.jsx`, `layout.jsx` (fonts + metadata), and `globals.css` (reset + keyframes).
- `src/App.jsx` — canvas application logic + canvas render.
- `src/ui/` — canvas surfaces: Toolbar, DecideFlow, BrainDump, DetailDrawer, ExpandedDetail, RouteMap, RouteMaterials, AccountSync, FocusOverlay, Onboarding.
- `src/lib/canvas-document.js` — versioned local/cloud canvas document helpers and sync metadata.
- `src/lib/supabase/` — browser client and local-first account sync orchestration.
- `supabase/migrations/` — Postgres schema, grants, trigger, and RLS policies.
- `design/` — the original `.dc.html` mocks and `support.js` runtime from the Claude Design project, kept verbatim for reference (includes the Loom-branded explorations and the directions file that the final screens evolved from).
