# Skein

Parallel interests, one calm canvas — a spatial canvas for juggling multiple interests without guilt. Implemented as a Next.js app from the mocks in the [Claude Design project](https://claude.ai/design/p/eb47ef53-57ca-4ded-a64e-35c29eea63f5).

## Routes

- `/` — marketing landing page (from `Skein Landing.dc.html`) with working waitlist input (local-only, no backend yet) and links into the canvas.
- `/canvas` — the app itself (from `Interest Canvas.dc.html`): first-run "weave" onboarding, draggable interest cards, auto-classified groups with hand-drawn enclosures, connect mode, brain dump, "decide for me" (weighted shuffle or time/energy/mood filter), focus sessions with pomodoro, interest detail drawer + expanded dashboard (streaks, momentum sparkline, hours/week, session journal), undo/redo, keyboard shortcuts, localStorage persistence (`skein.*` keys).
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

## How GPT-5.6 is used

Skein calls **GPT-5.6** (default `openai/gpt-5.6-terra`, configurable via `OPENROUTER_MODEL`) through [OpenRouter](https://openrouter.ai) using the Vercel AI SDK (`ai` + `@openrouter/ai-sdk-provider`), in two places:

1. **Weave** (`POST /api/weave`) — the onboarding brain-dump. Your messy sentence goes to GPT-5.6 with a zod-enforced structured-output schema (`generateObject`) and comes back as a typed map: interests with cluster (`learn`/`craft`/`body`/`other`), energy (1–3), priority (1–3), a short "whisper" label, plus suggested edges between interests that feed each other. The canvas lays the nodes out grouped by cluster and draws the suggested connections.
2. **Suggest next step** (`POST /api/suggest`) — the "✦ suggest with AI" button in an interest's detail view sends the interest, its goal, and recent session notes to GPT-5.6, which replies with one tiny, verb-first next step.

**Graceful degradation:** both routes return `503` when `OPENROUTER_API_KEY` is absent, and the client falls back to the original local heuristics (regex sentence splitting + keyword grouping for weave; a keyword→step map for suggestions). The app is fully usable offline — the AI just makes the map and the steps meaningfully smarter. Data stays in localStorage; only the text you weave and the interest you ask a step for are sent to the API.

## Structure

- `src/app/` — App Router pages: `page.jsx` (landing), `canvas/page.jsx`, `design/page.jsx`, `layout.jsx` (fonts + metadata), `globals.css` (reset + keyframes), `Waitlist.jsx`.
- `src/App.jsx` — canvas application logic + canvas render.
- `src/ui/` — canvas surfaces: Toolbar, DecideFlow, BrainDump, DetailDrawer, ExpandedDetail, FocusOverlay, Onboarding.
- `design/` — the original `.dc.html` mocks and `support.js` runtime from the Claude Design project, kept verbatim for reference (includes the Loom-branded explorations and the directions file that the final screens evolved from).
