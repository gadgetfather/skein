# Skein Motion System

## Status

Implementation specification for Motion (`motion/react`) across the landing page and canvas app.

## Thesis

- **Visual thesis:** quiet paper surfaces that settle into place like threads being arranged by hand.
- **Content plan:** establish the promise in the hero, demonstrate the canvas, reveal supporting proof, and preserve a calm final CTA.
- **Interaction thesis:** orchestrated entrances establish hierarchy; directional transitions preserve spatial context; short tactile responses confirm intentional actions.

Motion should make Skein feel composed and responsive. It must not make the interface feel busy, elastic, game-like, or perpetually animated.

## Goals

1. Give the landing page two memorable moments: a sequenced hero entrance and a canvas preview that assembles as it enters view.
2. Give transient app surfaces complete enter and exit transitions instead of abrupt removal.
3. Make modal and panel movement communicate where UI came from and where it goes.
4. Respect the operating system's reduced-motion preference globally.
5. Keep Motion away from high-frequency canvas transforms already managed by pointer input.

## Technical approach

- Install the `motion` package and import React APIs from `motion/react`.
- Use `LazyMotion`, the `m` component, and `domAnimation`; do not load drag or layout features in the first implementation.
- Mount one shared `MotionProvider` in the root layout.
- Configure `MotionConfig reducedMotion="user"`.
- Keep the landing page a Server Component. Add small Client Component motion islands around only the animated regions.
- Keep simple hover colors, tooltip fades, loading loops, and canvas transforms in CSS.

## Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `easeOut` | `[0.22, 1, 0.36, 1]` | Entrances and direct manipulation feedback |
| `easeIn` | `[0.4, 0, 1, 1]` | Exits |
| `fast` | `0.14s` | Press feedback and compact popovers |
| `base` | `0.22s` | Modals and overlays |
| `panel` | `0.28s` | Drawers and full-height panels |
| `stagger` | `0.06s` | Hero and preview children |

Movement distances stay between 6 and 24 pixels. Scale entrances stay between `0.97` and `1`. Springs are reserved for direct actions; structural transitions use controlled tweens.

## Landing page

### Hero sequence

- Animate the audience label, headline, supporting copy, waitlist control, secondary link, and beta note in reading order.
- Use opacity plus 10–14px upward settling.
- Start immediately after hydration; complete in under one second.
- The hero remains fully readable with JavaScript disabled and under reduced motion.

### Canvas preview

- Reveal the preview shell once when roughly 20% enters the viewport.
- Settle the shell upward by 18px while fading in.
- Stagger group washes, labels, nodes, and the decision control.
- Draw the two SVG connectors using animated `pathLength`.
- Do not continuously float the decision control after the reveal.

### Supporting sections

- Reveal only the problem statement, how-it-works group, features group, and final CTA as complete compositions.
- Use a small fade/translate and trigger each once.
- Do not animate every FAQ item or every individual piece of body copy.

## Canvas app

### Modal surfaces

Applies to decision menu/filter/result, focus takeover, and nested session logging.

- Backdrop fades independently over 160–180ms.
- Modal fades and settles from 8px below with a subtle `0.98 → 1` scale.
- Exits are slightly faster than entrances.
- Decision phases use `AnimatePresence` with sequential replacement so content does not overlap.

### Drawers and panels

Applies to brain dump, interest drawer, expanded detail, route map, and account sync popover.

- Full-height drawers enter from 20–24px right on desktop and mobile, preserving their edge-of-screen origin.
- Backdrops fade separately and remain clickable throughout their visible presence.
- Route map uses a shallow fade/scale because it is a full workspace, not a drawer.
- Compact popovers use a 6px vertical settle.

### Onboarding handoff

- Preserve the existing async weave behavior.
- Fade and slightly scale onboarding away before revealing the canvas.
- Keep headline rotation as an opacity transition.
- Decorative background cards may retain slow CSS drift, but reduced motion must disable it.

### Feedback

- Use `whileTap` only for primary CTA-like actions introduced inside motion islands.
- Existing routine Tailwind hover transitions remain CSS.
- Existing loaders and timer progress remain CSS/SVG state updates.

## Explicit exclusions

- Canvas node dragging, selection, and positioning.
- Canvas and route-map pan/zoom transforms.
- Connector geometry during interaction.
- Timer ticks and live progress-ring updates.
- Global page-transition animation between unrelated routes.
- Decorative parallax, cursor followers, magnetic buttons, and repeated scroll reveals.

## Accessibility and performance

- `MotionConfig reducedMotion="user"` is mandatory.
- The CSS reduced-motion rule must also disable all remaining looping keyframes.
- Reduced motion substitutes opacity-only changes for spatial movement where Motion remains active.
- Animate only `opacity` and `transform` in structural transitions.
- Use `viewport={{ once: true }}` for landing-page reveals.
- Use `domAnimation`; do not add `domMax` until a reviewed shared-layout or Motion drag requirement exists.

## Acceptance criteria

- Landing hero has a coherent staged entrance without delaying interaction.
- Canvas preview visibly assembles once and does not loop.
- Major app drawers and modals animate both in and out.
- Decision menu → filters → result changes do not visually overlap.
- Canvas dragging, panning, zooming, and keyboard interactions behave as before.
- Reduced-motion mode removes loops and meaningful spatial movement.
- Production build succeeds without hydration warnings.
