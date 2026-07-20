# Skein — Living Directions & Adaptive Next Steps

**Status:** Product direction proposal  
**Date:** July 20, 2026  
**Scope:** Experience audit, proposed product model, AI behavior, novel features, and sequencing

---

## 1. Executive recommendation

Skein should evolve from **a spatial collection of interest cards** into **a living map of directions**.

It should have two connected zoom levels:

1. a calm **Interest Canvas** containing long-lived pursuits;
2. an optional **Route Map** inside an interest, showing the path from START to a destination as branching prerequisites, milestones, experiments, and tasks.

The second level is inspired by the visual logic of the Dr. Stone roadmaps: a destination is motivating because the user can see what it depends on, which paths merge, and which concrete piece is reachable now. Ordinary tasks belong mainly at this deeper level rather than competing with “Learn Japanese” or “Make music” as equal objects on the main canvas.

The product is already good at holding many interests and reducing the momentary burden of choosing. Its next version should become exceptionally good at three harder things:

1. remembering where the user is trying to go;
2. remembering exactly where they left off;
3. producing the smallest meaningful move from here, without turning every interest into a project plan.

The proposed core loop is:

> **Capture → orient → choose → begin → leave a thread → reweave**

“Leave a thread” is important. Most productivity tools record that something happened. Skein should remember the handhold the user needs when they return: *what changed, what is unresolved, and where to resume*. This is more valuable for parallel interests than another streak, chart, or generated task list.

### Direct response to the initial ideas

- **Mic input:** yes, but it is a friction reducer rather than the product's novelty. The fresh-state mic is already implemented with the browser Speech Recognition API. The meaningful addition is to keep voice capture available after onboarding and let it create, update, connect, or log an interest—with an editable confirmation before the canvas changes.
- **Replace Notes with “where do you want to reach?”:** mostly yes. Make **Direction** the primary field, but do not require every interest to have an achievement goal. “Explore pottery until I know whether I enjoy it” is as legitimate as “Pass N3 by December.” Keep an optional secondary **Context / why this matters** field rather than deleting freeform notes entirely.
- **Generate a meaningful step when Decide has no user steps:** yes; this is a core product correction. A manual unfinished step is user-authored truth and wins. Otherwise Skein should generate a contextual step at decision time (or from a fresh cache), based on direction, current position, recent sessions, available time, current energy, and known blockers. The current label-to-canned-step fallback should not be the normal experience.
- **Show ordinary tasks:** yes, through progressive depth. A user may keep an interest as a simple card, or open its Route Map and see tasks as the reachable leaf nodes of a larger direction.
- **No-destination interests:** keep them and mark them explicitly as **Open-ended**. They generate experiments and invitations, not a fabricated finish line.
- **Cloud data:** use a real user database. Supabase is the recommended first choice for the current Next.js product; the rationale and schema are in §12.

---

## 2. What the current product actually does

The present experience is already coherent:

- first-run sentence or voice input is woven into interests, groups, energy, priority, and edges;
- the canvas supports spatial organization, custom groups, linking, and a brain dump;
- Decide offers a weighted shuffle or a time/energy/mood filter;
- a result includes an interest, a tiny next step, a why-now line, and sometimes a two-interest combo;
- starting opens a focus timer; finishing logs a session;
- expanded detail shows next steps, sessions, streaks, hours, and momentum.

The main issue is not missing surface area. It is that several surfaces imply intelligence or meaning that the data model does not yet contain.

### Product gaps found in the code

1. **The visible goal is not a real editable part of the main flow.** Expanded detail shows a goal, but new interests do not collect one and the drawer exposes only a general notes field.
2. **Progress is synthetic.** When no explicit progress exists, the progress ring is derived from distinct activity days and capped below completion. It looks precise without representing movement toward the user's outcome.
3. **Decide is contextual only at the interest-selection level.** If there is no user step, the shown action comes from a small label/regex table. It does not use the user's present state or decision filters.
4. **The unfiltered shuffle rewards high-energy interests.** Energy is multiplied into the selection weight, so more demanding interests become more likely even though “just pick for me” did not ask how much energy the user currently has.
5. **Time is inferred from energy rather than from an action estimate.** “Quick” sorts toward low-energy interests; those are related concepts, but not the same thing.
6. **The brain-dump drawer bypasses the richer weave behavior.** It splits lines locally and assigns every new thought medium energy and priority.
7. **Edges are visually meaningful but behaviorally shallow.** Combo actions are produced by a small hardcoded pair table; the connection itself has no declared meaning.
8. **Sessions lose the resumption context.** Focus completion logs “Focus session,” but not what moved or what the next handhold should be.
9. **Streaks and neglect language can conflict with the guilt-free promise.** A long-lived interest may be intentionally resting, not neglected.

These gaps suggest a deeper model before more UI is added.

---

## 3. Product position: not another one-next-task planner

Brain dumps, AI task breakdown, energy-aware filtering, and “show me one thing” are valuable but increasingly common. Products such as [Help! What Now?](https://helpwhat.now/), [Serenity](https://www.tryserenity.app/), and [Reflectify](https://reflectify.app/) already make one-action decision relief central to their experience.

Skein's defensible territory is different:

> **A calm ecology for interests that live in parallel over months or years—not a smarter queue of tasks for today.**

The spatial canvas earns its existence only if relationships, seasons, drift, and return paths matter. Otherwise a list is simpler.

### Product principles

1. **Directions, not flat backlogs.** A Route Map may be deep, but it represents meaningful dependencies and alternative paths—not twenty AI tasks pretending to be a plan.
2. **Re-entry over streak protection.** Optimize for returning after interruption, not maintaining an unbroken chain.
3. **User intent outranks model inference.** Preserve user-written steps and directions. AI proposes; it does not silently rewrite.
4. **Rest can be intentional.** An interest may be active, warm, resting, complete, or released. Resting is not failure.
5. **One honest next move.** The result must be possible now and include a clear “done when.”
6. **The canvas should reveal relationships a list cannot.** Connections should produce useful choices, not merely visual decoration.
7. **No false precision.** Do not show a percentage unless the user supplied measurable milestones or a true quantity.
8. **Capture before structure.** Voice and text can be messy; structure should be suggested after capture, with a reversible preview.

### Two zoom levels: interests outside, route maps inside

#### Level 1 — Interest Canvas

The main canvas answers:

- What parts of life or craft do I care about?
- Which are Active, Warm, or Resting?
- How do these interests feed or compete with one another?
- What is calling me now?

Nodes here remain long-lived threads: Japanese, game development, fitness, music, writing, cooking.

#### Level 2 — Route Map

Opening an interest answers:

- Where am I starting?
- What destination or “enough for now” am I moving toward?
- What capabilities, resources, milestones, or decisions does it require?
- Which routes are alternatives and which must merge?
- Which nodes are reachable now?

The map should visually emphasize:

- a large **START / YOU ARE HERE** marker;
- one destination, chapter goal, or an **OPEN-ENDED** marker;
- bold directional paths;
- branch and merge points;
- large outcome/milestone nodes and smaller prerequisite/task nodes;
- full-color reachable nodes and quieter future/locked nodes;
- a highlighted frontier showing what can actually be acted on now.

The user can zoom from the calm canvas into complexity when they want the “deeper visual version.” The default experience should not expose all task-level detail at once.

---

## 4. The proposed interest model

Every interest becomes a **living thread** with the following minimal model.

### 4.1 Posture: what kind of relationship is this?

Ask the user only when helpful; otherwise infer and let them correct it.

- **Explore** — “I want to find out whether this pulls me.”
- **Practice** — “I want to become more capable through repetition.”
- **Build** — “I want something concrete to exist.”
- **Maintain** — “I want this part of life to stay healthy or alive.”

This prevents a single goal template from distorting every kind of interest.

### 4.2 Direction: where would you like this to take you?

The prompt adapts to posture:

- Explore: **“What would satisfy your curiosity for now?”**
- Practice: **“What would you like to be able to do?”**
- Build: **“What do you want to exist?”**
- Maintain: **“What rhythm or condition would feel like enough?”**

Examples:

- Explore pottery → “Try three classes and decide whether to continue.”
- Practice Japanese → “Hold a relaxed 15-minute conversation.”
- Build a game → “Publish a playable v1 that a friend can finish.”
- Maintain health → “Move four times a week without dreading it.”

Direction may be blank. If it is blank, Skein can suggest a low-regret exploration action, but must not invent a goal and present it as the user's.

The UI should distinguish three states rather than treating blank text as missing setup:

- **Directed** — has a destination or definition of enough;
- **Open-ended** — intentionally practiced or enjoyed without a destination;
- **Unclear** — the user has not decided yet.

Use a small compass/infinity-style marker for Open-ended. Decide can still select it, but suggested actions should be framed as invitations, practices, or experiments rather than progress toward completion.

### 4.3 Current position

A short, editable description of reality now:

> “Finished lesson 5; listening is much weaker than reading.”

This is more useful to action generation than a percentage.

### 4.4 Frontier

The **frontier** is the next meaningful edge of the thread. It may contain:

- one user-written next step;
- one “resume here” breadcrumb from the previous session;
- one model-proposed action;
- an explicit blocker.

Skein should show at most one primary frontier action in Decide. The drawer can hold additional user steps, but it should not encourage a large generated backlog.

### 4.5 Season

- **Active** — I want this to receive attention now.
- **Warm** — keep it visible; occasional movement is welcome.
- **Resting** — preserve it without nudging me.
- **Harvested** — I reached “enough” or completed this chapter.
- **Released** — I intentionally no longer want this.

Only Active and Warm threads participate in Decide by default. This replaces guilt-laden neglect with explicit capacity management.

### 4.6 Memory

Store:

- recent session outcomes;
- the last resumption cue;
- known blockers;
- generated actions accepted, rejected, skipped, or completed;
- observed duration and energy fit;
- the provenance of important fields (`user`, `ai_suggested`, `inferred`).

### 4.7 Route Map: the inner graph

A Route Map is an optional directed graph owned by one interest and, usually, one current chapter or destination.

#### Node types

- **Origin** — START / current position.
- **Destination** — the result or “enough for this chapter.”
- **Milestone** — a meaningful intermediate outcome.
- **Capability** — something the user needs to be able to do.
- **Resource** — a tool, reference, material, person, or access requirement.
- **Experiment** — a reversible way to learn what path is right.
- **Decision** — a choice that changes the route.
- **Task** — a concrete action, normally a leaf at the current frontier.
- **Blocker** — a known obstruction with one or more unblock routes.

#### Edge types

- **requires** — B cannot happen until A exists;
- **unlocks** — completing A makes B reachable;
- **alternative** — A or B can satisfy the same need;
- **produces** — an action creates a resource or outcome;
- **supports** — helpful but not mandatory.

Do not use an untyped visual line for inner-map dependencies. Reachability and Decide eligibility depend on edge meaning.

#### Map generation

The user may build the route manually or ask Skein to draft it from a direction. AI generation should work backward from the destination and forward from the current position, then attempt to connect the two.

The result is a **draft**, not truth. Before inserting it, show:

- assumptions the model made;
- unknowns it could not resolve;
- nodes inferred from the user's words versus general domain knowledge;
- an editable preview with accept/reject per branch.

Avoid false certainty. For a domain that depends on current external facts, ask for a source or mark the node “verify.” The map can be revised as the user learns.

#### Progressive disclosure

The full Route Map can be expansive, but normal action mode should emphasize only:

- the current position;
- reachable frontier nodes;
- the path those nodes unlock;
- the destination for orientation.

This preserves the exciting roadmap feeling without creating visual overwhelm.

#### Relationship to Decide

Decide first chooses an eligible interest, then chooses or generates a reachable frontier node inside its Route Map. If the user has no Route Map, the existing single frontier action is the implicit one-node map.

This unifies simple and advanced use instead of creating two different products.

---

## 5. Core flow changes

### 5.1 Capture anywhere: text and voice

#### Empty canvas

Keep the current central sentence input and mic. Improve it by showing the live editable transcript and clearly separating these states:

`listening → transcript ready → weaving → review proposed map`

Do not mutate the canvas before review if the model made consequential interpretations.

#### Existing canvas

Add a persistent **Capture** action to the toolbar and brain-dump drawer. Text and voice share the same composer.

An utterance may express more than “add a node”:

- “I want to get back into sketching.” → create a thread.
- “For Japanese, I want to pass N3 by December.” → update Direction.
- “I did twenty minutes of Anki; next time start lesson six.” → log a session and set the resumption cue.
- “Reading feeds my writing.” → propose a typed connection.

Show a compact confirmation sheet:

> **I heard:** Log 20 min to Japanese · set “Start lesson 6” as resume point  
> `[confirm] [edit] [just save transcript]`

This is more trustworthy than pretending voice is a command language or silently letting AI edit the graph.

#### Voice implementation note

The existing browser Speech Recognition integration is a reasonable prototype, but availability is browser-dependent. The product needs:

- an unsupported-browser state;
- permission/error recovery;
- visible transcript editing;
- no auto-submit on silence;
- a clear privacy note distinguishing browser speech transcription from text sent to the model.

### 5.2 Replace Notes with Direction—without losing context

In the drawer, reorder fields:

1. title and posture;
2. **Direction**;
3. **Current position / resume here**;
4. season;
5. energy profile and group;
6. next step;
7. collapsed **Context & notes**.

Replace generic Low / Medium / High “priority” with season plus an optional **calling strength**. Priority is task-manager language and asks users to rank interests against one another indefinitely. Seasons answer the more useful question: *what deserves to be alive right now?*

### 5.3 Leave a thread after every session

At focus completion, replace the automatic generic log with a 10-second closeout:

> **What moved?** `[short text or voice]`  
> **When you return, start with…** `[pre-filled suggestion]`  
> **How did the effort fit?** `too light · about right · too much`

The user can accept and close with one tap. The model may extract a current-position update and a resumption cue from free speech, but it must show the proposed update.

This closeout creates the memory needed for a genuinely intelligent next decision.

### 5.4 Honest progress

Remove the default computed percentage ring.

Use one of three progress displays:

- **Milestone progress** only when the user has explicit milestones.
- **Quantity progress** only when a real denominator exists (e.g. 7 of 12 chapters).
- **Trajectory** otherwise: “moving,” “quiet,” “blocked,” or “resting,” plus the current-position sentence.

Hours, session length, and consistency remain evidence, not proxies for outcome completion. A person can spend ten hours stuck and still be 0% closer.

---

## 6. Adaptive next-action engine

### 6.1 Source precedence

When Decide needs a next action, use this order:

1. an unfinished user-written step that fits the current constraints;
2. the latest accepted “resume here” cue;
3. a fresh contextual AI proposal;
4. an offline, context-composed fallback.

Never overwrite a user step. If it does not fit (“Draft the full chapter” with 10 minutes and low energy), offer a smaller entry action such as “Open the draft and outline the next paragraph,” labeled as an adaptation.

### 6.2 Generation context

Send only what is required:

- interest title and posture;
- direction;
- current position;
- most recent session summaries and resumption cue;
- blockers;
- available minutes, current energy, and desired mode/mood;
- rejected actions and reasons;
- connected threads only when requesting a braid action.

Do not send the entire canvas by default.

### 6.3 Structured response

The next-action route should return:

```json
{
  "action": "Open lesson 6 and shadow the first dialogue",
  "durationMinutes": 15,
  "doneWhen": "You have repeated the dialogue twice",
  "whyThis": "It resumes exactly where you stopped and fits low energy",
  "actionType": "resume",
  "confidence": "high",
  "assumptions": []
}
```

Rules:

- start with a verb;
- be concrete enough to begin without another decision;
- fit the stated time and energy;
- name a visible stopping condition;
- prefer resumption over novelty;
- do not invent resources, deadlines, progress, or prior work;
- when context is weak, propose a reversible probe, not a generic 25-minute block;
- do not generate a full task breakdown unless the user explicitly asks.

Research on implementation intentions supports linking a desired outcome to a concrete situational cue and response, especially for getting-started problems. Skein can optionally turn an accepted action into a light **when–then** commitment: “When I finish dinner, I’ll open lesson 6 for 15 minutes.” See [Gollwitzer & Sheeran’s implementation-intentions review](https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf).

### 6.4 Latency and caching

Do not make every Decide interaction wait on a cold generation.

- Generate or refresh a frontier suggestion when Direction, Current position, or the last session changes.
- Cache it with the exact context hash and creation time.
- At decision time, validate it against time/energy. Adapt only if it does not fit.
- Expire or invalidate after completion, rejection, a new session, or material interest edits.

---

## 7. Rebuild “Decide for me” as an explainable decision

The model should not randomly choose an interest from the entire canvas. Use deterministic product logic for eligibility and ranking; use the model primarily to form or adapt the action.

### 7.1 Eligibility

Exclude by default:

- Resting, Harvested, and Released threads;
- explicitly blocked threads unless an unblock action is available;
- actions that exceed a hard time limit and cannot be safely reduced;
- recently rejected suggestions with the same context.

### 7.2 Ranking

Rank candidates using:

- hard fit to available time;
- energy fit based on observed and user-set effort, not title keywords;
- presence of a ready manual or resume step;
- calling strength / active season;
- a capped “has been quiet” nudge;
- continuity bonus when the user recently touched it;
- rejection and blocker feedback;
- optional balance across active threads.

Neglect should be a gentle tiebreaker, not a moral debt that eventually dominates the score.

### 7.3 Decision result

Show:

- the selected thread;
- one action;
- estimated duration and energy;
- “done when”;
- a short, factual reason;
- provenance: `your step`, `resume point`, or `suggested`.

Primary actions:

- **Start**
- **Make it smaller**
- **Not today**

“Not today” may optionally ask one tap why: `too tired · no time · blocked · not feeling this · already did it`. This feedback should improve the current choice, not permanently lower the worth of the interest.

If there are no manual steps, the user should never see a hardcoded keyword sentence presented as if it knows their situation. If AI is unavailable, be honest: produce a locally composed resumption/probe action and label it **offline suggestion**.

---

## 8. Novel features that fit Skein specifically

### 8.1 Seasons: a portfolio of attention

Most tools treat every saved item as perpetually active. Skein should let the user consciously warm, rest, harvest, or release a thread.

Once a week—or only when the canvas feels crowded—offer a 60-second **Reweave**:

> “What do you want to keep alive this week?”

The user can pull 2–4 threads into Active, leave some Warm, and rest the rest without deleting them. Decide operates primarily on this attention portfolio.

Why it matters: this directly solves the emotional problem of many interests without pretending all of them can advance simultaneously.

### 8.2 Thread memory: the re-entry handhold

Every session leaves a visible little loose end on the card:

> **resume:** compare the two chorus versions

Returning to an interest after 19 days should feel like picking up a bookmarked book, not reconstructing a forgotten project. This should become a signature Skein behavior.

### 8.3 Braid sessions: make edges earn their place

Give connections a type:

- **feeds** — reading feeds writing;
- **shares a practice** — drawing and game design share visual composition;
- **competes for energy** — two deep-work interests;
- **supports** — sleep supports training.

When two connected Active/Warm threads genuinely combine, offer a **Braid session**:

> “Read one chapter, then capture one idea for your essay.”

The action must advance both stated directions and have one stopping condition. Do not force a combo for every edge. This turns the spatial graph into behavior that a list cannot reproduce.

### 8.4 Drift detection: let interests evolve

Over time, session notes may show that the real pull has changed. For example, “learn game development” becomes “design small narrative worlds.” Skein can occasionally ask:

> “This thread seems to be becoming more about narrative design. Rename or split it?”

Never auto-rename. The value is helping the map stay true without demanding manual taxonomy maintenance.

### 8.5 Enough and the harvest ritual

Infinite interests do not always need completion. Let the user define “enough for this chapter,” then mark it Harvested.

Show a small retrospective:

- where it started;
- what now exists or changed;
- favorite session note;
- whether to rest, deepen, split, or release it.

This provides closure without converting curiosity into productivity theater.

### 8.6 A loose-ends shelf, not more canvas nodes

The current weave prompt can turn taxes and one-off chores into interests. That risks making Skein another task manager.

When capture detects a transient obligation, offer:

> “This sounds like a one-off loose end, not a long-lived thread.”

Keep these in a small optional shelf outside the interest graph, or let the user promote one into a thread. The canvas remains a map of pursuits, not an inbox of errands.

---

## 9. What not to add

Avoid these despite their apparent completeness:

- automatically expanding every interest into a roadmap before the user asks;
- flat AI task lists that do not encode prerequisites, alternatives, or uncertainty;
- more dashboards, scores, or pseudo-precise progress analytics;
- competitive streaks, badges, leaderboards, or social feeds;
- calendar scheduling before the living-thread loop is validated;
- an autonomous AI that silently reorganizes the canvas;
- collaboration before the personal return-and-resume experience works;
- generic ambient sound or decorative AI chat;
- reminders that describe resting interests as neglected or overdue.

Each would pull Skein toward a crowded planner category or weaken its guilt-free premise.

---

## 10. Recommended delivery sequence

### P0 — Make the promise true

1. Add editable Posture, Direction, Current position, and Season.
2. Replace synthetic percentage progress with honest trajectory/milestones.
3. Add explicit Directed / Open-ended / Unclear marking.
4. Add the first Route Map drill-down: one START/current node, a destination or Open-ended marker, typed dependencies, and reachable task nodes.
5. Add AI drafting for the route backbone plus its first reachable layer, with per-branch confirmation.
6. Add a structured next-action endpoint and the source-precedence rules.
7. Rebuild Decide ranking around reachable route nodes, constraints, readiness, seasons, and capped quiet-time nudges.
8. Add the post-session closeout and resumption cue.
9. Track action provenance, acceptance, rejection, completion, and observed effort.

This is the smallest version that changes Skein from “smart-looking canvas” to “adaptive interest companion.”

### P1 — Differentiate

1. Progressive Route Map expansion, alternate branches, decisions, blockers, and chapter history.
2. Persistent text/voice Capture with previewed proposed changes.
3. Weekly/on-demand Reweave and Active/Warm/Resting canvas treatment.
4. Typed cross-interest edges and context-generated Braid sessions.
5. Make-it-smaller and unblock actions in Decide.

### P2 — Deepen long-term use

1. Drift detection and split/rename proposals.
2. Harvest/release ritual.
3. Loose-ends shelf.
4. Optional when–then commitments.
5. Export/import and encrypted sync if local-only persistence becomes limiting.

---

## 11. Success measures

Use behavior that reflects relief and continuity, not raw engagement.

- **Time to start:** median time from opening Decide to starting an action.
- **First-choice acceptance:** percent of Decide results started without rerolling.
- **Return recovery:** percent of threads resumed successfully after 7+ quiet days.
- **Resume-cue usefulness:** percent of accepted actions sourced from “resume here.”
- **Action fit:** percent marked “about right” for effort and completed near the estimate.
- **Direction coverage:** percent of Active threads with a user-confirmed direction.
- **Rest without deletion:** how often users intentionally rest an interest instead of deleting it.
- **Braid value:** acceptance and completion rate of braid actions versus single-thread actions.

Do not optimize for session count, longest streak, number of generated steps, or time inside the app.

---

## 12. Technical shape (high level)

### Backend recommendation: Supabase

Use **Supabase** for the first connected version.

Why it is the best fit here:

- the graph has real relationships, ordering, ownership, sessions, and history, which fit Postgres better than one large persisted canvas document;
- Supabase combines Postgres, Auth, Row Level Security, Realtime, Storage, and backups rather than requiring separate vendors for the first release;
- it has an official Next.js path and supports cookie-based auth;
- Row Level Security can enforce that users access only canvases they own or belong to;
- JSONB remains available for flexible AI proposal payloads and low-value presentation metadata without sacrificing relational integrity for core nodes and edges.

Supabase documents an official [Next.js integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs), [Auth-backed Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), and [Realtime updates](https://supabase.com/docs/guides/realtime/realtime-with-nextjs). Realtime is not required for the first personal version, but it leaves room for multi-device updates and later collaboration.

Alternatives:

- **Neon** is excellent serverless Postgres and particularly strong for database branching, but Skein would still need to assemble more of the auth, authorization, storage, and live-update product surface.
- **Firebase / Firestore** has strong client sync and offline persistence, but dependency graphs, ownership policies, history queries, and future analytics are a less natural fit than relational tables.
- A reactive backend such as Convex could reduce live-state plumbing, but would couple more application logic to a proprietary data/runtime model before Skein has proven that realtime collaboration is central.

Therefore: **Supabase now; keep graph/domain logic in application code so the database remains replaceable.**

### Proposed relational model

Use normalized rows for graph identity and relationships; do not save the entire canvas as one JSON blob.

```text
profiles
canvases
canvas_members
interests
interest_connections
route_maps
route_nodes
route_edges
sessions
session_notes
frontier_actions
action_feedback
ai_proposals
```

Important columns:

- `interests`: `canvas_id`, posture, direction_state, direction, current_position, season, calling, position_x/y;
- `route_maps`: `interest_id`, title, destination_node_id, status, version;
- `route_nodes`: `route_map_id`, type, label, status, source, confidence, position_x/y, metadata JSONB;
- `route_edges`: `route_map_id`, from_node_id, to_node_id, relationship, required;
- `sessions`: `interest_id`, optional `route_node_id`, duration, effort_fit, outcome, resume_cue;
- `ai_proposals`: proposed mutation payload, model, prompt/schema version, status, and confirmation timestamps.

Put `user_id` or an ownership path on all security-sensitive records and enable RLS on every exposed table. Prefer policies based on canvas membership so future sharing does not require a schema rewrite.

### Sync and migration behavior

- Keep the UI optimistic so dragging and editing do not wait on network round trips.
- Debounce position writes; persist semantic edits immediately.
- Retain a small IndexedDB/local cache for startup and transient offline use rather than treating the network as the canvas renderer's state loop.
- Migrate existing `skein.*` localStorage data only after sign-in and show a preview/count before upload.
- Generate stable UUIDs client-side so offline-created records can sync later.
- Store server timestamps and mutation IDs to make retries idempotent.
- Do not enable realtime subscriptions everywhere initially. Add them for multi-tab/multi-device coherence, then use Supabase's recommended Broadcast path if collaboration or write volume grows.

### Domain additions

Suggested node additions:

```js
{
  posture: 'explore' | 'practice' | 'build' | 'maintain',
  direction: { text, source, confirmedAt },
  currentPosition: { text, source, updatedAt },
  season: 'active' | 'warm' | 'resting' | 'harvested' | 'released',
  calling: 1 | 2 | 3,
  resumeCue: { text, source, sessionId, updatedAt },
  blockers: [{ id, text, active }],
  milestones: [{ id, text, done, order }],
  frontier: {
    action,
    durationMinutes,
    doneWhen,
    whyThis,
    actionType,
    source,
    contextHash,
    createdAt
  },
  actionFeedback: [{ actionId, outcome, reason, actualMinutes, effortFit, at }]
}
```

Suggested Route Map additions:

```js
{
  routeMap: {
    id,
    interestId,
    title,
    status: 'draft' | 'active' | 'archived',
    destinationNodeId,
    version
  },
  routeNode: {
    id,
    type: 'origin' | 'destination' | 'milestone' | 'capability' |
      'resource' | 'experiment' | 'decision' | 'task' | 'blocker',
    label,
    status: 'locked' | 'reachable' | 'active' | 'done' | 'skipped',
    source: 'user' | 'ai_suggested' | 'imported',
    confidence,
    x,
    y
  },
  routeEdge: {
    from,
    to,
    relationship: 'requires' | 'unlocks' | 'alternative' | 'produces' | 'supports'
  }
}
```

Suggested AI responsibilities:

- `/api/weave` — retain structured capture, add posture and distinguish threads from loose ends;
- `/api/orient` — interpret a capture as proposed creates/updates/logs/connections;
- `/api/next-action` — return the structured action object;
- `/api/close-thread` — summarize session input into a proposed current position and resume cue;
- `/api/braid` — generate an action only for a valid typed connection.
- `/api/draft-route` — propose a dependency map, assumptions, unknowns, and confidence without mutating saved state.

Selection scoring, seasons, source precedence, and user-data mutation should remain deterministic application logic. The model should generate language and proposals, not own state.

LocalStorage can support the anonymous prototype, but Supabase becomes the source of truth for signed-in users. Add a versioned migration before expanding the schema. Keep the old `note`, `priority`, and `steps` fields during migration and map them conservatively rather than rewriting user data.

---

## 13. Resolved decisions and remaining questions

### Resolved from product-owner feedback

1. **Primary identity:** the top level is long-lived interests; ordinary tasks are allowed when the user opens the deeper visual Route Map.
2. **Goal stance:** interests without a destination are first-class and receive an explicit Open-ended marker.
3. **Persistence stance:** local-only is not a hard promise; the product will connect to a database. Supabase is the recommended first implementation.
4. **Roadmap stance:** deep visual roadmaps are part of the intended product, inspired by branching START-to-GOAL dependency maps rather than ordinary task lists.

### Remaining product choices

1. **One destination or several?** Recommendation: one active “chapter destination” per Route Map. A long-lived interest can hold multiple archived or future chapters, avoiding an unreadable mega-map.
2. **How much should AI draft at once?** Recommendation: generate the meaningful backbone and the first reachable layer, with an explicit “expand this branch” action. Do not fabricate every future task up front.
3. **What happens to completed task nodes?** Recommendation: keep them visible but quiet in the Route Map as the path already traveled; offer a focus mode that hides them without deleting history.
4. **Cadence:** should Reweave be weekly, on demand, or both? Recommendation: on-demand first, then a gentle weekly prompt only after repeat use.

---

## 14. The one-sentence version

> **Skein turns each long-lived interest into a living route from where you are to where you want to go, then reveals the one reachable move that fits today.**
