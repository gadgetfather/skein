import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../../../lib/ai';

const schema=z.object({
  action:z.string().max(140),
  durationMinutes:z.number().int().min(5).max(120),
  doneWhen:z.string().max(160),
  whyThis:z.string().max(180),
  actionType:z.enum(['resume','practice','build','explore','maintain','unblock']),
});

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
  const posture = ['explore','practice','build','maintain'].includes(body.posture) ? body.posture : 'explore';
  const directionState = ['directed','open','unclear'].includes(body.directionState) ? body.directionState : 'unclear';
  const direction = typeof body.direction === 'string' && body.direction ? body.direction.slice(0, 280) : '';
  const currentPosition = typeof body.currentPosition === 'string' && body.currentPosition ? body.currentPosition.slice(0, 280) : '';
  const resumeCue = typeof body.resumeCue === 'string' && body.resumeCue ? body.resumeCue.slice(0, 180) : '';
  const recent = typeof body.recent === 'string' && body.recent ? body.recent.slice(0, 400) : 'none yet';
  const time = ['quick','deep'].includes(body.time) ? body.time : null;
  const energy = ['low','med','high'].includes(body.energy) ? body.energy : null;
  const mood = ['learn','make','rest'].includes(body.mood) ? body.mood : null;
  try {
    const { object } = await generateObject({
      model,
      schema,
      system: 'You are a calm focus coach for long-lived personal interests. Produce ONE concrete, meaningful action that can begin without another decision. Prefer an explicit resume cue, then the current position, then a low-regret probe. Fit the available time and energy. Start action with a verb and keep it under 18 words. doneWhen must be observable. Do not invent resources, deadlines, prior progress, or a destination the user did not state. Open-ended interests need invitations or experiments, not fake completion. Unclear interests need reversible probes. Return structured data only.',
      prompt: JSON.stringify({interest:label,posture,directionState,direction:direction||'(not stated)',currentPosition:currentPosition||'(not stated)',resumeCue:resumeCue||'(none)',recent,time:time||'(not stated)',energy:energy||'(not stated)',mood:mood||'(not stated)'}),
    });
    if (!object || !object.action) return Response.json({ error: 'generation_failed' }, { status: 502 });
    return Response.json(object);
  } catch (e) {
    console.error('suggest failed:', e && e.message);
    return Response.json({ error: 'generation_failed' }, { status: 502 });
  }
}
