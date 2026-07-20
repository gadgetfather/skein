import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../../../lib/ai';

const schema=z.object({
  summary:z.string().max(180),
  assumptions:z.array(z.string().max(140)).max(5),
  nodes:z.array(z.object({
    key:z.string().regex(/^[a-z0-9_]+$/).describe('Stable short key; never use start or goal'),
    type:z.enum(['milestone','capability','resource','experiment','decision','task','blocker']),
    label:z.string().max(90),
    description:z.string().max(180),
    doneWhen:z.string().max(140),
    durationMinutes:z.number().int().min(5).max(240).nullable(),
    stage:z.number().int().min(1).max(4),
    order:z.number().int().min(0).max(5),
  })).min(3).max(10),
  edges:z.array(z.object({
    from:z.string().describe('A node key, or start'),
    to:z.string().describe('A node key, or goal'),
    relationship:z.enum(['requires','unlocks','alternative','produces','supports']),
  })).min(2).max(18),
});

export async function POST(req){
  const model=getModel();
  if(!model)return Response.json({error:'missing_api_key'},{status:503});
  let body;try{body=await req.json();}catch(e){return Response.json({error:'bad_request'},{status:400});}
  const label=typeof body.label==='string'?body.label.slice(0,120):'';
  if(!label)return Response.json({error:'bad_request'},{status:400});
  const posture=['explore','practice','build','maintain'].includes(body.posture)?body.posture:'explore';
  const directionState=['directed','open','unclear'].includes(body.directionState)?body.directionState:'unclear';
  const direction=typeof body.direction==='string'?body.direction.slice(0,320):'';
  const currentPosition=typeof body.currentPosition==='string'?body.currentPosition.slice(0,320):'';
  const notes=typeof body.notes==='string'?body.notes.slice(0,400):'';
  const resumeCue=typeof body.resumeCue==='string'?body.resumeCue.slice(0,180):'';
  const cleanList=(value,limit,maxLength)=>Array.isArray(value)?value.map(x=>String(x||'').trim().slice(0,maxLength)).filter(Boolean).slice(0,limit):[];
  const recentActivity=cleanList(body.recentActivity,6,140);
  const savedMoves=cleanList(body.savedMoves,6,140);
  const existingRoute=body.existingRoute&&typeof body.existingRoute==='object'?{
    summary:typeof body.existingRoute.summary==='string'?body.existingRoute.summary.slice(0,180):'',
    nodes:Array.isArray(body.existingRoute.nodes)?body.existingRoute.nodes.slice(0,10).map(node=>({type:String(node?.type||'').slice(0,24),label:String(node?.label||'').slice(0,90),done:!!node?.done})):[],
  }:null;
  try{
    const {object}=await generateObject({
      model,
      schema,
      system:
        'You design honest, editable route maps for long-lived personal interests. The user needs a route tailored to their stated destination, current position, saved moves, and recent activity—not a generic curriculum. Work backward from the destination and forward from what they can do today, then connect the smallest useful dependency graph. '+
        'Treat the interest label as context, the direction as the desired outcome, and the current position as the starting evidence. If the direction is broad (for example, prepare for a company, become healthy, or learn a field), decompose the gap into concrete skill or evidence dimensions. Do not pretend the broad aspiration itself is measurable; state material interpretations in assumptions. '+
        'Aim for 5–8 middle nodes. Each node must add a distinct outcome. Never create a task, capability, and milestone that merely restate the same activity with synonyms. A task is one concrete action; a capability is an ability demonstrated across attempts; a milestone is a meaningful observable result. Resources are only genuinely required inputs, experiments reduce uncertainty, and decisions represent real forks. '+
        'Stage 1 must grow directly from the current position and include at least one immediately actionable task or experiment. Later stages should deepen or broaden based on evidence from earlier stages. Use branching or merging only for a real dependency, support, or alternative—not to make the map look complex. '+
        'Every node needs an observable doneWhen. durationMinutes is only for concrete tasks/experiments; otherwise null. Do not add a node that merely repeats the destination verbatim. Do not invent paid tools, credentials, deadlines, achievements, or prior knowledge. '+
        'When redrafting, improve on the existing route: remove repetition, preserve any genuinely useful completed context, and make the progression more specific to the user. Do not simply paraphrase the prior node labels. '+
        'Assumptions must be short standalone prose sentences only; never place node, edge, schema, JSON, or field content inside assumptions. '+
        'Edges must reference provided node keys plus reserved start and goal. The flow is start -> prerequisites -> goal. For an open-ended interest, goal means a satisfying next chapter, not completion. For unclear direction, emphasize reversible experiments that help the user choose a direction.',
      prompt:JSON.stringify({interest:label,posture,directionState,destination:direction||'(not stated)',currentPosition:currentPosition||'(not stated)',privateContext:notes||'(none)',resumeCue:resumeCue||'(none)',recentActivity,savedMoves,existingRoute}),
    });
    return Response.json(object);
  }catch(e){console.error('route-map failed:',e&&e.message);return Response.json({error:'generation_failed'},{status:502});}
}
