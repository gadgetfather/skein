import { generateText } from 'ai';
import { getModel } from '../../../lib/ai';

export async function POST(req) {
  const model = getModel();
  if (!model) return Response.json({ error: 'missing_api_key' }, { status: 503 });
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const label = typeof body.label === 'string' ? body.label.slice(0, 120) : '';
  if (!label) return Response.json({ error: 'bad_request' }, { status: 400 });
  const goal = typeof body.goal === 'string' && body.goal ? body.goal.slice(0, 200) : 'make steady progress';
  const recent = typeof body.recent === 'string' && body.recent ? body.recent.slice(0, 400) : 'none yet';
  try {
    const { text } = await generateText({
      model,
      system: 'You are a calm focus coach. Reply with ONE tiny, concrete next step — max 12 words, start with a verb, no preamble, no quotes. Return only the step text.',
      prompt: 'Interest: "' + label + '". Goal: "' + goal + '". Recent sessions: ' + recent + '.',
    });
    const step = (text || '').trim().replace(/^["'\s\-•]+/, '').replace(/["'\s]+$/, '').slice(0, 120);
    if (!step) return Response.json({ error: 'generation_failed' }, { status: 502 });
    return Response.json({ step });
  } catch (e) {
    console.error('suggest failed:', e && e.message);
    return Response.json({ error: 'generation_failed' }, { status: 502 });
  }
}
