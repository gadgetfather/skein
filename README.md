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
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

- `src/app/` — App Router pages: `page.jsx` (landing), `canvas/page.jsx`, `design/page.jsx`, `layout.jsx` (fonts + metadata), `globals.css` (reset + keyframes), `Waitlist.jsx`.
- `src/App.jsx` — canvas application logic + canvas render.
- `src/ui/` — canvas surfaces: Toolbar, DecideFlow, BrainDump, DetailDrawer, ExpandedDetail, FocusOverlay, Onboarding.
- `design/` — the original `.dc.html` mocks and `support.js` runtime from the Claude Design project, kept verbatim for reference (includes the Loom-branded explorations and the directions file that the final screens evolved from).
