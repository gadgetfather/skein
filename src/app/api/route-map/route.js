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
  try{
    const {object}=await generateObject({
      model,
      schema,
      system:
        'You design honest, editable route maps for long-lived personal interests. Work backward from the destination and forward from the current position, then connect them with a small dependency graph. '+
        'This is not a generic task breakdown. Use milestones for meaningful intermediate outcomes, capabilities for learned abilities, resources only when genuinely required, experiments for uncertain paths, decisions for real forks, and tasks only for concrete actions. '+
        'Stage 1 is reachable from start; stage 4 is nearest goal. Include at least one immediately actionable task or experiment at stage 1. Use branching or merging only when it reflects a real dependency or alternative. '+
        'Every node needs an observable doneWhen. durationMinutes is only for concrete tasks/experiments; otherwise null. Do not add a node that merely repeats the destination verbatim. Do not invent paid tools, credentials, deadlines, achievements, or prior knowledge. '+
        'Assumptions must be short standalone prose sentences only; never place node, edge, schema, JSON, or field content inside assumptions. '+
        'Edges must reference provided node keys plus reserved start and goal. The flow is start -> prerequisites -> goal. For an open-ended interest, goal means a satisfying next chapter, not completion. For unclear direction, emphasize reversible experiments that help the user choose a direction.',
      prompt:JSON.stringify({interest:label,posture,directionState,direction:direction||'(not stated)',currentPosition:currentPosition||'(not stated)',notes:notes||'(none)'}),
    });
    return Response.json(object);
  }catch(e){console.error('route-map failed:',e&&e.message);return Response.json({error:'generation_failed'},{status:502});}
}
