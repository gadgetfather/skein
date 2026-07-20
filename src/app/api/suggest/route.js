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
  const group = body.group && typeof body.group === 'object' ? { label:String(body.group.label||'').slice(0,80) } : { label:'' };
  const interestEnergy = Number.isFinite(body.interestEnergy) ? Math.min(3,Math.max(1,Math.round(body.interestEnergy))) : 2;
  const privateContext = typeof body.privateContext === 'string' ? body.privateContext.slice(0,600) : '';
  const recentActivity = Array.isArray(body.recentActivity) ? body.recentActivity.slice(0,6).map(item=>({
    note:String(item?.note||'').slice(0,160),
    durationMinutes:Number.isFinite(item?.durationMinutes)?Math.min(480,Math.max(0,Math.round(item.durationMinutes))):null,
    mood:['up','ok','down'].includes(item?.mood)?item.mood:null,
    daysAgo:Number.isFinite(item?.daysAgo)?Math.min(3650,Math.max(0,Math.round(item.daysAgo))):null,
  })) : [];
  const savedMoves = Array.isArray(body.savedMoves) ? body.savedMoves.slice(0,8).map(item=>({text:String(item?.text||'').slice(0,140),done:!!item?.done})).filter(item=>item.text) : [];
  const rawRoute = body.routeContext && typeof body.routeContext === 'object' ? body.routeContext : null;
  const cleanRouteNodes=value=>Array.isArray(value)?value.slice(0,6).map(item=>({type:String(item?.type||'').slice(0,24),label:String(item?.label||'').slice(0,100),doneWhen:String(item?.doneWhen||'').slice(0,160),durationMinutes:Number.isFinite(item?.durationMinutes)?Math.min(480,Math.max(0,Math.round(item.durationMinutes))):null})).filter(item=>item.label):[];
  const routeContext = rawRoute ? {summary:String(rawRoute.summary||'').slice(0,180),assumptions:Array.isArray(rawRoute.assumptions)?rawRoute.assumptions.slice(0,4).map(value=>String(value||'').slice(0,140)).filter(Boolean):[],completed:cleanRouteNodes(rawRoute.completed),reachable:cleanRouteNodes(rawRoute.reachable)} : null;
  const time = ['quick','deep'].includes(body.time) ? body.time : null;
  const energy = ['low','med','high'].includes(body.energy) ? body.energy : null;
  const mood = ['learn','make','rest'].includes(body.mood) ? body.mood : null;
  try {
    const { object } = await generateObject({
      model,
      schema,
      system: 'You are a calm focus coach. Produce exactly one concrete next move that can begin without another decision. Prefer a still-relevant resume cue, then a reachable route node, then the current position, then a low-regret probe. Use recent activity to continue momentum or repair a repeated stall. Do not repeat an unfinished saved move, repeat completed work, or restate the interest or destination. Fit current time, energy, and mood when supplied; otherwise respect the interest’s usual energy. Private context may shape the action but must not be quoted or exposed in whyThis. Open-ended interests need invitations or experiments; unclear interests need reversible probes. action must start with a verb and stay under 18 words. doneWhen must be observable. whyThis must briefly name the relevant non-private signal. Do not invent resources, deadlines, prior progress, or unstated goals. Return structured data only.',
      prompt: JSON.stringify({interest:label,posture,directionState,direction:direction||'(not stated)',currentPosition:currentPosition||'(not stated)',resumeCue:resumeCue||'(none)',group:group.label||'(not stated)',usualEnergy:{level:interestEnergy,label:({1:'low',2:'medium',3:'high'})[interestEnergy]},privateContext:privateContext||'(none)',recentActivity,savedMoves,routeContext,currentConstraints:{time:time||'(not stated)',energy:energy||'(not stated)',mood:mood||'(not stated)'}}),
    });
    if (!object || !object.action) return Response.json({ error: 'generation_failed' }, { status: 502 });
    return Response.json(object);
  } catch (e) {
    console.error('suggest failed:', e && e.message);
    return Response.json({ error: 'generation_failed' }, { status: 502 });
  }
}
