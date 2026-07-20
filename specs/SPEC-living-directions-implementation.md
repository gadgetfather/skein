# Skein — Living Directions Implementation

**Status:** First slice, Route Map UX, Supabase application integration, and Vercel production deployment complete  
**Started:** July 20, 2026  
**Last updated:** July 21, 2026  
**Product reference:** [SPEC-living-directions.md](./SPEC-living-directions.md)

This document is the implementation ledger for the Living Directions and Route Map work. Update it in the same change as the code so product intent, completed behavior, and remaining gaps stay aligned.

---

## Current checkpoint

- [x] Living Direction fields and backwards-compatible local persistence.
- [x] Direction-first interest drawer and simplified secondary settings.
- [x] Nested Route Map with AI drafting, typed dependencies, completion, unlocking, and manual node creation.
- [x] Draggable nodes, improved connectors, compact legend, direct completion controls, cursor-centered zoom, and unbounded Space-drag panning.
- [x] Route-aware Decide flow and generated meaningful next actions.
- [x] Proper URL routes, deep links, and browser Back/Forward restoration.
- [x] Production build and core browser walkthroughs.
- [x] Local-first Supabase Auth/sync code, one-time upload flow, conflict protection, schema migration, and owner-only RLS policies.
- [x] Supabase public project URL and publishable key added to the local environment.
- [x] Production deployment on Vercel with Supabase and OpenRouter environment configuration.

**Recommended next step:** begin the Weekly Reweave ritual product slice.

The implementation history is recorded in [Progress log](#4-progress-log). Outstanding work is maintained as checkboxes in [Remaining work](#6-remaining-work).

---

## 1. First implementation slice

The first slice must work as one connected loop:

> define an interest's direction → open its Route Map → expose a reachable node → let Decide use it → record progress without losing the return path

It must preserve existing localStorage data and Skein's paper-and-ink visual system.

### Scope

- [x] Add Living Thread fields to existing interests with conservative defaults and migration.
- [x] Replace the primary Notes/priority editing flow with Posture, Direction state, Direction, Current position, and Season.
- [x] Mark Directed, Open-ended, and Unclear interests in the drawer and canvas.
- [x] Add the first full-screen Route Map drill-down.
- [x] Support START/current position, destination/open road, typed route nodes, and directional edges.
- [x] Support adding child nodes and marking reachable nodes complete.
- [x] Add an AI Route Map draft endpoint and review/accept flow.
- [x] Make Decide prefer manual steps, resume cues, and reachable Route Map nodes.
- [x] Generate a contextual AI action when no explicit frontier exists.
- [x] Preserve an honest offline fallback without keyword-specific canned actions.
- [x] Verify production build and core interaction states.

---

## 2. Design constraints

- Reuse the existing `paper`, `paper-2`, `panel`, `ink`, `muted`, and sage action tokens.
- Reuse Caveat for expressive headings and Shantell Sans for interface copy.
- Keep 1.4–1.8px ink borders, irregular radii, and offset sketch shadows.
- The Route Map may be visually denser and more directional than the main canvas, but must feel like a page from the same notebook.
- Draw inspiration from the attached START-to-GOAL dependency maps through hierarchy, bold arrows, branching, and merging—not through copied anime imagery or saturated comic styling.
- Avoid generic cards, gradients, glass panels, dashboard chrome, and purple AI styling.
- Keep AI proposals visibly provisional and reversible.

---

## 3. Data compatibility

Existing nodes may contain only legacy fields such as `label`, `note`, `priority`, `steps`, and `sessions`. Loading must add defaults without deleting or rewriting those values.

Initial defaults:

```js
{
  posture: 'explore',
  directionState: 'unclear',
  direction: '',
  currentPosition: '',
  season: 'active',
  calling: legacyPriority || 2,
  resumeCue: '',
  routeMap: null
}
```

The connected Supabase migration is a later slice. This slice keeps the existing localStorage persistence while shaping data so it can migrate cleanly.

---

## 4. Progress log

### 2026-07-20 — Started

- Created the implementation ledger.
- Selected a vertical slice that connects detail editing, Route Map visualization, AI drafting, and Decide.
- Chose a nested graph rather than mixing task nodes into the top-level interest canvas.
- Made this implementation spec and its product reference trackable while leaving older scratch specs ignored.

### 2026-07-20 — First slice complete

- Added backward-compatible Living Thread defaults: posture, direction state, direction, current position, season, calling, resume cue, and nested Route Map.
- Reworked the interest drawer around intent and trajectory; legacy notes remain available as secondary context.
- Added direction-state and Route Map marks to canvas nodes without making the overview task-heavy.
- Built a full-screen, right-to-left Route Map inspired by START-to-GOAL dependency maps: typed nodes, branching edges, reachable/complete/locked states, manual child creation, and completion toggles.
- Added structured AI Route Map generation with explicit assumptions, review-before-use status, and duplicate/garbled-output guards.
- Rewired Decide to prefer user steps, resume cues, and reachable route nodes before asking AI for a contextual action.
- Replaced keyword-canned fallback steps with posture-aware, low-regret offline actions.
- Carried the selected action, duration, completion condition, and route-node provenance into focus mode.
- Excluded resting interests from ordinary selection and changed stale-thread copy from guilt language to an invitation.
- Kept the established paper, ink, sage, Caveat, Shantell Sans, irregular border, and sketch-shadow system throughout.

### 2026-07-20 — Canvas card overflow follow-up

- Fixed wrapped interest titles pushing the energy row through the bottom border.
- Limited titles to two visible lines with a full-label tooltip and truncation for unusually long names.
- Consolidated direction, energy, and Route Map count into one anchored footer row so every metadata state stays inside the fixed-height card.
- Visually verified the reported `Practice Japanese` case alongside single-line and other wrapped cards.

### 2026-07-20 — Route Map readability follow-up

- Increased Route Map node height and spacing so four- and five-line generated labels remain readable.
- Replaced bottom `walked` and prerequisite messages with compact completion and lock marks, leaving the card body entirely for its label.
- Moved `+ next` farther below each node so it no longer covers completion text.
- Raised locked-node opacity from 42% to 64% while retaining the visual distinction.
- Replaced thick filled-arrow connectors with slimmer layered sketch paths, small open arrowheads, rounded joins, and dashed secondary relationships.
- Verified a populated nine-node route and a completed long-label resource node in the live canvas.

### 2026-07-20 — Draggable Route Map follow-up

- Made every Route Map node draggable, including START, destination, reachable, completed, and locked nodes.
- Persisted custom `x/y` positions inside the nested Route Map so the arrangement survives closing and reopening the map.
- Recomputed connector paths continuously during dragging.
- Added movement thresholds and click suppression so dragging never marks a node complete accidentally.
- Isolated the `+ next` affordance from node dragging.
- Added `tidy map` to clear custom positions and restore the stage-and-order layout.
- Verified drag movement, live arrow attachment, persistence after reopening, and auto-arrange restoration in the populated route.

### 2026-07-20 — Proper URL routing follow-up

- Replaced state-only view switching with explicit Next.js App Router pages for the interest drawer, expanded detail, Route Map, Decide menu, Decide filters, and decision results.
- Added a persistent `/canvas` layout shell so pan, zoom, timers, and unsaved in-memory interaction state survive navigation between child routes.
- Added deep-linkable routes:
  - `/canvas/interests/:interestId`
  - `/canvas/interests/:interestId/details`
  - `/canvas/interests/:interestId/route`
  - `/canvas/decide`
  - `/canvas/decide/filter`
  - `/canvas/decide/result/:interestId`
- Made node clicks, drawer expansion, Route Map opening/closing, Decide transitions, result closing, Escape, deletion, and canvas deselection update the URL instead of only mutating overlay state.
- Synchronized route changes back into the existing canvas model so browser back/forward restores the correct view without remounting the canvas.
- Added safe recovery for stale or unknown interest IDs by replacing the invalid URL with `/canvas`.

### 2026-07-20 — Interest drawer simplification

- Rebuilt the drawer around two primary jobs: clarify the direction and choose the next move.
- Kept Direction, You are here, Route Map, Next moves, and the daily check-in visible without scrolling at a typical desktop height.
- Reduced the Route Map from a large promotional card to a compact navigational row with its mapped-move count.
- Combined the empty state, AI suggestion, step list, and quick-add field into one compact Next moves section.
- Moved direction type, posture, season, energy, group, private notes, and delete into one `details & settings` disclosure.
- Replaced the full-width delete control with a quiet danger action inside the secondary settings area.
- Added clearer landmark labels and accessible names for the drawer, its primary fields, and icon-only actions.
- Verified the collapsed and expanded states at 1280×720 and at the reported narrow 800px viewport without horizontal overflow.

### 2026-07-20 — Route Map guidance and lock clarity

- Moved completion and lock badges farther inside circular resource/capability nodes so the round mask no longer clips them.
- Added an expanded-by-default, collapsible `how to move through this map` guide above the route.
- Documented node states directly in the guide: glowing is available, filled is walked, and faded with a lock is waiting.
- Gave edge relationships distinct visual language and legend samples: solid ochre for required progression, dotted sage for optional support, and dashed blue for an alternate route.
- Explained arrow direction: arrows point toward what becomes possible next.
- Made locked nodes informative rather than inert; selecting one now reveals the exact unfinished prerequisite nodes blocking it.
- Kept locked-node prerequisite text in accessible button names while only announcing the expanded callout when the user opens it.
- Verified that walking the named solid-arrow prerequisite immediately changes the downstream node from locked to reachable, then restored the test route state.

### 2026-07-20 — Route Map completion clarity follow-up

- Replaced the expanded instructional block with a slim, always-visible legend that only explains completion, locked prerequisites, connector meanings, and dragging.
- Added a hollow check badge to every available unfinished node so its primary action is visible without hovering.
- Made completion language literal throughout the interaction: select an available node to mark it complete; select a completed node to mark it incomplete.
- Changed locked-node guidance from “walk” to “complete” and kept exact prerequisite names in the on-node callout.
- Kept START and destination as draggable landmarks rather than presenting them as completion actions.

### 2026-07-20 — Route Map zoom and completion-control follow-up

- Turned each available/completed check into an independent button rather than relying on the node card’s combined click-and-drag surface.
- Kept whole-node completion available while guaranteeing that selecting the hollow check directly marks the node complete.
- Added cursor-centered wheel zoom from 50% to 135% so dense routes can be viewed as a whole or inspected closely.
- Added the live zoom percentage and a one-click 100% reset to the compact legend.
- Added compact zoom-out and zoom-in controls as an accessible fallback to the wheel gesture.
- Added standard hold-Space-and-drag canvas panning, with temporary grab/grabbing cursors and precedence over node dragging while Space is held.
- Replaced finite scroll-offset panning with the root canvas’s unbounded translate-and-scale viewport, so the Route Map can be moved freely even when fully zoomed out.
- Corrected node dragging for the active zoom scale so a dragged node continues to track the pointer one-to-one at every zoom level.

### 2026-07-20 — Supabase local-first persistence slice

- Added passwordless email authentication through the official Supabase browser client without blocking anonymous or offline canvas use.
- Added a versioned canvas-document boundary covering nodes, edges, custom groups, empty frames, and label overrides.
- Added one RLS-protected JSONB canvas row per authenticated user, explicit authenticated grants, owner-only select/insert/update/delete policies, and an updated-at trigger.
- Kept localStorage as the immediate source of durability and added a debounced cloud write after local changes.
- Added first-sign-in migration: an empty cloud account receives the current local canvas automatically.
- Added safe reconciliation for returning devices and a user-visible choice when local and cloud copies have both diverged.
- Prevented a canvas last synced by one account from being silently uploaded into a different account.
- Added a compact paper-and-ink account/sync control with local, checking, saving, synced, conflict, and error states.
- Added `.env.example` and deployment instructions without exposing or requiring a service-role credential in the browser.

### 2026-07-20 — Supabase activation check

- Confirmed `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are populated locally without printing either value.
- Initially reached the configured Supabase Data API and received `PGRST205` for `public.skein_canvases`; after the migration was applied, the response changed to PostgreSQL `42501`, confirming the table exists and its anonymous grants are revoked.
- Confirmed both anonymous reads and anonymous writes are rejected, so canvas rows are unavailable until the client has an authenticated JWT.
- Reviewed the migration against the installed Supabase guidance: RLS is enabled, every policy is scoped to `authenticated` and the owning `auth.uid()`, UPDATE has both `USING` and `WITH CHECK`, and the unique `user_id` constraint supplies the index needed by the RLS predicate and cascading foreign key.
- Loaded the configured passwordless sign-in panel in the running app and confirmed there were no browser warnings or errors before authentication.
- Pinned `@supabase/supabase-js` to `2.110.7`; `npm audit signatures` verified registry signatures for all 60 installed packages and provenance attestations for 41.
- Completed passwordless authentication in Chrome and confirmed the account indicator reached `saved to cloud` after the initial owner-scoped read/upsert.
- Moved one existing card by `(32px, 20px)`, confirmed the authenticated update synced, reloaded the page, and confirmed the exact coordinates were restored; then returned the card to its original position and confirmed the restoration synced.
- Kept the test non-destructive: no canvas node or route data was created or deleted, and the test card finished at its original coordinates.
- Scoped sign-out to the current browser session so `sign out · keep local copy` does not unexpectedly revoke the user’s sessions on every device.
- Installed the requested `supabase` and `supabase-postgres-best-practices` agent skills for the next task turn.

### 2026-07-20 — Cloud status collision follow-up

- Replaced the full cloud-save label with a compact cloud-and-status control while an interest drawer or expanded detail panel is open.
- Positioned the compact control before the drawer actions on narrow screens and immediately outside the panel edge on wider screens, preventing it from covering expand or close controls.
- Hid the account control on full-screen nested workflows such as Route Map and Decide, where their own header actions need the top-right space; syncing continues in the background.
- Kept the full `saved to cloud` label on the root canvas and preserved the complete account panel behind the compact control.

### 2026-07-21 — Truly unbounded Route Map follow-up

- Removed the fixed 1360×740 staging-area clamp from manual Route Map node movement; nodes can now be placed at negative or arbitrarily large world coordinates.
- Kept the staged rectangle only as the automatic layout reference, so `tidy map` remains a reliable way to gather an intentionally scattered route.
- Made Space-drag read the held-key state synchronously, avoiding the brief state-render delay that could cause a quick Space-and-drag gesture to be ignored.
- Added middle-button drag as a second conventional infinite-canvas pan gesture and clarified the legend with `place anywhere` and `drag anywhere` language.
- Added direct empty-space dragging as the simplest pan gesture while preserving Space-drag from anywhere; nodes, completion controls, the legend, and assumptions remain protected from accidental canvas pans.

### 2026-07-21 — Vercel production deployment

- Linked the workspace to `gadgetfathers-projects/skein` and kept `.vercel` project metadata out of source control.
- Added the public Supabase URL, Supabase publishable key, and selected OpenRouter model to the Vercel Production environment.
- Added the OpenRouter API key as a sensitive Production environment variable after explicit approval.
- Deployed the current workspace to [skein-phi.vercel.app](https://skein-phi.vercel.app).
- Confirmed `/`, `/canvas`, and a nested interest-detail route return HTTP 200 in production.
- Confirmed the production canvas exposes the passwordless cloud sign-in form, proving the public Supabase configuration reached the client build.
- Confirmed `/api/route-map` returns `400 bad_request` for an intentionally empty payload rather than `503 missing_api_key`, proving the server-side OpenRouter credential is available without making a billable model call.
- Left the production Supabase magic-link redirect as an explicit remaining activation check because the Supabase dashboard requires a separate authenticated session.

### 2026-07-21 — Production auth activation complete

- Added `https://skein-phi.vercel.app/canvas` to the Supabase Auth redirect allow list.
- Confirmed the production magic-link sign-in and deployed cloud-sync experience are working.
- Closed the final activation gap; Weekly Reweave is now the next product slice.

### 2026-07-21 — Mobile landing and app pass

- Made the landing page responsive from phone widths upward: compact navigation, scaled typography, a stacked waitlist form, phone-sized canvas preview, single-column feature/FAQ flow, and reduced section spacing.
- Kept the spatial canvas available on phones instead of replacing it with a desktop-only warning.
- Added a horizontally scrollable touch toolbar, dynamic-viewport height, safe-area spacing, and content-fit reset so a full example canvas can be reached from a narrow screen.
- Converted Brain Dump, interest details, expanded detail, log-session, Decide, and focus surfaces into viewport-contained mobile sheets and modals.
- Made onboarding keyboard-safe and scrollable, with a stacked composer and full-width mobile action.
- Added a compact Route Map header and legend, touch panning, phone-fit initial zoom/reset, scrollable actions, and viewport-contained notices.
- Preserved the existing tablet and desktop layouts through breakpoint-specific styling.

---

## 5. Verification log

### Production build

- `npm run build` — passed on July 20, 2026.
- `npm run build` — passed again on July 21, 2026 before the Vercel deployment.
- `npm run build` — passed after the mobile landing and app pass on July 21, 2026.
- Next.js compiled the canvas, all interest/Decide child routes, and `/api/route-map`, `/api/suggest`, and `/api/weave` successfully.

### Vercel production smoke test

- Vercel production build and output deployment completed successfully.
- Stable production alias: [https://skein-phi.vercel.app](https://skein-phi.vercel.app).
- HTTP verification: `/` → 200, `/canvas` → 200, `/canvas/interests/demo/details` → 200.
- Opened the live `/canvas` experience and visually confirmed the fresh-state composer, microphone action, sample prompts, canvas controls, and cloud account control render correctly.
- Opened the production account control and confirmed it shows the configured passwordless email sign-in flow rather than the missing-environment setup state.
- Sent an empty payload to `/api/route-map`; the expected `400 bad_request` response confirmed server configuration without invoking an AI generation.

### In-app browser walkthrough

- Loaded the example canvas and opened the `Learn Japanese` interest drawer.
- Changed posture to Practice, set a Directed destination, and recorded the current position.
- Opened a blank Route Map, added the first child by hand, and marked it complete.
- Generated a nine-node AI route with branches, prerequisites, reachable nodes, and an assumptions review state.
- Ran `Decide for me`; the live model returned a concrete 15-minute action, observable `done when`, and provenance instead of a canned category string.
- Started that action and verified the exact generated move appeared in focus mode.
- Visually checked onboarding, canvas, drawer, empty Route Map, populated Route Map, decision result, and focus states at 1365×768.
- Polished issues found during the walkthrough: singular route-node copy, visible `+ next` affordances, non-obscuring assumptions, destination overflow, honest focus minimization copy, and no one-minute activity log for sub-minute exits.

### Routed canvas walkthrough

- Opened `Practice Japanese` from the canvas and verified the URL became `/canvas/interests/ja` with the drawer visible.
- Opened its Route Map and verified `/canvas/interests/ja/route`; browser Back restored the drawer and Forward restored the Route Map.
- Loaded `/canvas/interests/ja/details` directly and verified the expanded detail view hydrated from saved canvas data.
- Walked through `/canvas/decide` → `/canvas/decide/filter` → `/canvas/decide/result/ja`, then verified Back restored the filter state.
- Loaded a nonexistent interest detail URL and verified it safely replaced itself with `/canvas`.
- Changed canvas zoom to 120%, navigated to an interest through the UI, and verified zoom remained 120%, confirming the shared layout preserves the mounted canvas.
- Checked captured browser logs after the walkthrough; no warnings or errors were reported.

### Simplified drawer walkthrough

- Loaded an existing directed interest with a populated Route Map and confirmed its direction, current position, route count, next-move controls, and check-in remain immediately available.
- Expanded `details & settings` and confirmed all prior editing controls remain available through progressive disclosure.
- Checked the drawer at 800px viewport width; the 400px drawer remains contained and the canvas stays visible beside it.
- Rechecked the signed-in drawer at 405px CSS viewport width after compacting the cloud status: the 32px status control now has an 8px gap before Expand, Close remains unobstructed, and the opened 310px account panel stays fully within the viewport.
- Confirmed the compact status sits outside the 400px drawer at the default 1470px desktop viewport and captured no browser warnings or errors.

### Route Map guidance walkthrough

- Opened a populated nine-node route and confirmed circular lock badges render entirely inside the node boundary.
- Checked the live guide against all three rendered edge styles and verified their colors, dash patterns, arrowheads, and labels match.
- Selected a locked capability and confirmed its callout named `Run a listen–shadow–respond practice loop` as the missing prerequisite.
- Marked that prerequisite walked and confirmed the locked capability became glowing/reachable; toggled it back afterward to preserve the original test data.
- Selected the hollow check itself and confirmed it completed the node and unlocked its dependent capability; toggled it back afterward to preserve the test route.
- Zoomed the full Route Map from 100% to 80%, confirmed the route, legend, connectors, checks, and assumptions remained readable, then reset it to 100%.
- Repeated the 80% layout check after replacing finite scrolling with the root-style transform viewport; confirmed the route remains centered and the reset returns both zoom and pan to their origin.
- Dragged the Start node past the former maximum world coordinate (`x=1150` → `x=1220`) and confirmed it remained visible and connected, then restored it exactly to `x=1150`.
- Dragged empty map space 200px without a keyboard modifier and confirmed the entire route moved by exactly 200px; the reset control returned the viewport to its original position.
- Checked the browser console after both unbounded-movement tests; no warnings or errors were reported.

### Supabase local-first walkthrough

- Loaded the existing local canvas with no Supabase environment values and confirmed no interests, routes, or layout data were lost.
- Opened the compact `local only` account control and confirmed the setup state names the required project URL and publishable key without blocking canvas use.
- Checked captured browser logs after the walkthrough; no warnings or errors were reported.
- Repeated the walkthrough after configuration and confirmed the passwordless email form replaces the setup prompt, with no browser warnings or errors.
- Confirmed the applied table is reachable and denies both reads and writes to the anonymous role (`42501`).
- Completed a magic-link sign-in and confirmed authenticated startup read, initial upsert, update, reload/reconciliation, and a second update all reached `saved to cloud` without browser warnings or errors.
- Verified owner isolation structurally through the deployed owner-scoped RLS policies and behaviorally across the authenticated owner path plus rejected anonymous reads/writes.

### Mobile responsive walkthrough

- Checked the landing page at 390×844: navigation, hero, waitlist, live-canvas link, and canvas preview fit without horizontal clipping.
- Checked fresh-state onboarding at 390×844: headline, composer, microphone, Weave action, examples, and account status remain visible and touch-sized.
- Loaded the example canvas and confirmed content-fit reset presents the complete graph, while the bottom toolbar remains horizontally scrollable.
- Opened an interest and confirmed its direction, current position, Route Map, next moves, check-in, settings disclosure, account status, and close/expand controls fit in a full-screen mobile sheet.
- Opened Decide and Route Map at phone width; both stayed within the viewport, Route Map opened at a whole-map 27% fit with touch panning and zoom controls, and captured browser logs contained no warnings or errors.

---

## 6. Remaining work

These are intentionally not implemented or fully activated yet:

- [x] Apply the checked-in migration to the configured Supabase project and verify anonymous access is denied.
- [x] Configure local authentication redirect URLs and complete an authenticated upload/download/RLS smoke test.
- [x] Add `https://skein-phi.vercel.app/canvas` to the Supabase Auth redirect allow list and complete a production magic-link sync smoke test.
- [x] Make the landing page and core canvas workflows mobile friendly.
- [ ] Weekly Reweave ritual.
- [ ] Cross-interest typed edges and Braid sessions.
- [ ] Route branch expansion, alternate-route comparisons, and per-branch AI regeneration.
- [ ] Session closeout using voice to update current position and resume cue.
- [ ] Harvest/release ritual and chapter history.
- [ ] Multi-device realtime sync and collaboration.
