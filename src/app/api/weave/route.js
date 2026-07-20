import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../../../lib/ai';

const schema = z.object({
  interests: z
    .array(
      z.object({
        label: z.string().describe('Short title-cased name for the interest, 1–4 words, e.g. "Learn Japanese"'),
        cluster: z
          .enum(['learn', 'craft', 'body', 'other'])
          .describe('learn = learning & input (books, languages, courses); craft = making & shipping (projects, writing, music); body = health & wellbeing (fitness, cooking, sleep); other = anything else'),
        energy: z.number().int().min(1).max(3).describe('Energy the interest demands: 1 light, 2 medium, 3 heavy'),
        priority: z.number().int().min(1).max(3).describe('How much it seems to matter to them right now: 1 someday, 2 normal, 3 top of mind'),
        meta: z.string().describe('A 1–3 word lowercase whisper under the card, e.g. "language", "make", "upkeep"'),
      })
    )
    .min(1)
    .max(10)
    .describe('The distinct interests found in the text'),
  edges: z
    .array(
      z.object({
        a: z.number().int().describe('index into interests'),
        b: z.number().int().describe('index into interests'),
      })
    )
    .describe('Pairs of interests that naturally feed each other (e.g. reading → writing). Only clearly related pairs; empty array if none.'),
});

export async function POST(req) {
  const model = getModel();
  if (!model) return Response.json({ error: 'missing_api_key' }, { status: 503 });
  let text;
  try {
    ({ text } = await req.json());
  } catch (e) {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!text || typeof text !== 'string') return Response.json({ error: 'bad_request' }, { status: 400 });
  try {
    const { object } = await generateObject({
      model,
      schema,
      system:
        'You untangle a messy brain-dump of personal interests into a calm map. ' +
        'Extract each distinct interest or pursuit the person mentions — ignore filler, jokes and asides unless they hide a real interest ("also my taxes lol" → "Sort out taxes"). ' +
        'Never invent interests that are not in the text.\n' +
        'Field rules:\n' +
        '- label: a short title-cased phrase in the person’s own spirit, 1–4 words ("Pick guitar back up", "Sort out taxes") — not a bare lowercase noun.\n' +
        '- cluster: learn = learning/reading/languages/courses; craft = making/building/writing/music/shipping; body = fitness/cooking/sleep/health; other = only when none fit (chores, admin, taxes).\n' +
        '- energy: how demanding it is — 1 light, 2 medium, 3 heavy. Vary it per interest; do not default everything to the same value.\n' +
        '- priority: how urgent it sounds in their words — 1 someday, 2 normal, 3 top of mind.\n' +
        '- meta: a whisper of 1–3 lowercase words (e.g. "music", "admin", "fitness"). Never a sentence or explanation.\n' +
        '- edges: only pairs that genuinely feed each other (reading → writing). Unrelated interests get no edge; an empty list is fine.',
      prompt: text.slice(0, 600),
    });
    return Response.json(object);
  } catch (e) {
    console.error('weave failed:', e && e.message);
    return Response.json({ error: 'generation_failed' }, { status: 502 });
  }
}
