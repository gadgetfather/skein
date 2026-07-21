import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import CalmLoader from './CalmLoader';
import RouteMaterials from './RouteMaterials';
import { motionEase, popoverSurface } from './motion/tokens';

const TYPE_COLORS = {
  task:'#7a9a6f', milestone:'#6f8aa8', capability:'#927696', resource:'#b0975a',
  experiment:'#b07d67', decision:'#5f9a92', blocker:'#a56f8f', origin:'#2b3034', destination:'#7a9a6f',
};

function layoutNodes(nodes) {
  const W=1360,H=740,left=50,right=1145,top=100,bottom=640;
  const maxStage=Math.max(5,...nodes.map(n=>n.stage||0));
  const groups={};
  nodes.forEach(n=>{ const stage=n.type==='origin'?0:n.type==='destination'?maxStage:(n.stage||1); (groups[stage]||(groups[stage]=[])).push(n); });
  const out={};
  Object.entries(groups).forEach(([rawStage,list])=>{
    const stage=Number(rawStage); list.sort((a,b)=>(a.order||0)-(b.order||0));
    list.forEach((n,i)=>{
      const terminal=n.type==='origin'||n.type==='destination';
      const round=['resource','capability'].includes(n.type);
      const w=terminal?190:(round?128:164), h=terminal?150:(round?128:110);
      const x=right-(stage/maxStage)*(right-left);
      const centerY=terminal?H/2:top+(i+1)*((bottom-top)/(list.length+1));
      out[n.id]={x:Number.isFinite(n.x)?n.x:x,y:Number.isFinite(n.y)?n.y:centerY-h/2,w,h};
    });
  });
  return {positions:out,width:W,height:H};
}

function RouteNode({ node, pos, zoom }) {
  const color=TYPE_COLORS[node.type]||'#7a9a6f';
  const terminal=node.type==='origin'||node.type==='destination';
  const round=['resource','capability'].includes(node.type);
  const locked=!terminal&&!node.done&&!node.reachable;
  const canAdd=node.type!=='destination'&&!locked;
  const hasDetails=!terminal&&!locked&&!!(node.description||node.doneWhen||node.durationMinutes);
  const hasPopover=hasDetails||locked;
  const detailId=useId();
  const dragRef=useRef(null);
  const draggedRef=useRef(false);
  const [dragging,setDragging]=useState(false);
  const [detailOpen,setDetailOpen]=useState(false);
  const onPointerDown=(e)=>{
    if(e.button!==0||e.target.closest('[data-route-action]'))return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:pos.x,baseY:pos.y,started:false};
  };
  const onPointerMove=(e)=>{
    const d=dragRef.current;if(!d||d.pointerId!==e.pointerId)return;
    const dx=(e.clientX-d.startX)/zoom,dy=(e.clientY-d.startY)/zoom;
    if(!d.started&&Math.hypot(dx,dy)<4)return;
    if(!d.started){d.started=true;draggedRef.current=true;setDragging(true);node.onMoveStart();}
    e.preventDefault();
    node.onMove(d.baseX+dx,d.baseY+dy);
  };
  const finishDrag=(e)=>{
    const d=dragRef.current;if(!d||d.pointerId!==e.pointerId)return;
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current=null;setDragging(false);
    if(d.started)setTimeout(()=>{draggedRef.current=false;},0);
  };
  const onNodeClick=(e)=>{
    if(draggedRef.current){e.preventDefault();draggedRef.current=false;return;}
    if(hasPopover)setDetailOpen(open=>!open);
  };
  const badgePosition=round?'top-5 right-5':'top-2 right-2';
  const allBlockedLabels=node.blockedBy||[];
  const blockedLabels=allBlockedLabels.slice(0,2);
  const extraBlockers=Math.max(0,allBlockedLabels.length-blockedLabels.length);
  const quotedBlockers=blockedLabels.map(label=>'“'+label+'”');
  const namedBlockers=quotedBlockers.length===2?quotedBlockers.join(' and '):quotedBlockers[0];
  const blockedCopy=blockedLabels.length?`Complete ${namedBlockers}${extraBlockers?` and ${extraBlockers} more`:''} first.`:'Complete every required node with a solid arrow pointing here.';
  const nodeLabel=terminal
    ?`${node.type}: ${node.label}. Drag to rearrange.`
    :locked
      ?`${node.type}: ${node.label}. Locked. ${blockedCopy} Click for unlock requirements.`
      :`${node.type}: ${node.label}. ${node.done?'Complete.':node.reachable?'Available.':''} Click for step details.`;
  const popoverAbove=pos.y+pos.h>520;
  const detailCopy=node.description&&node.description.trim()!==node.label.trim()?node.description.trim():'';
  return (
    <div data-route-node onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} className={`group absolute touch-none hover:z-[12] focus-within:z-[12] ${dragging?'z-[14] cursor-grabbing':detailOpen?'z-[12] cursor-grab':'z-[4] cursor-grab'}`} style={{left:pos.x,top:pos.y,width:pos.w,height:pos.h}}>
      <button
        onClick={onNodeClick}
        aria-disabled={terminal}
        aria-expanded={hasPopover?detailOpen:undefined}
        aria-describedby={hasPopover?detailId:undefined}
        aria-label={nodeLabel}
        title={terminal?'Drag to rearrange':locked?blockedCopy:'View step details'}
        className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden border-[1.8px] border-ink-line px-3 text-center shadow-[3px_4px_0_rgba(58,64,69,.14)] transition-[transform,box-shadow] ${round?'rounded-full':'rounded-[15px_10px_16px_11px]'} ${dragging?'cursor-grabbing scale-[1.015]':node.reachable?'cursor-pointer hover:-translate-y-0.5':'cursor-grab'}`}
        style={{background:node.done?color:'#fbfbfa',color:node.done?'#fff':'#2b3034',opacity:locked?.64:1,boxShadow:dragging?`5px 7px 0 rgba(58,64,69,.18), 0 0 0 4px ${color}22`:node.reachable&&!node.done?`3px 4px 0 rgba(58,64,69,.14), 0 0 0 6px ${color}2b`:'3px 4px 0 rgba(58,64,69,.14)'}}
      >
        <span className="mb-1 text-[9px] font-bold uppercase tracking-[.09em]" style={{color:node.done?'rgba(255,255,255,.82)':color}}>{terminal?(node.type==='origin'?'start · you are here': 'destination'):node.type}{node.source==='ai_suggested'?' · ✦':''}</span>
        <span title={node.label} className={`${terminal?'line-clamp-4 font-hand text-[20px] leading-[1.05]':hasDetails?'line-clamp-3 text-[13px] leading-[1.16]':'line-clamp-5 text-[13px] leading-[1.16]'} max-w-full overflow-hidden font-bold`}>{node.label}</span>
        {hasDetails&&<span className="mt-1.5 text-[8px] font-bold uppercase tracking-[.06em]" style={{color:node.done?'rgba(255,255,255,.76)':color}}>{node.durationMinutes?`~${node.durationMinutes} min · `:''}details {detailOpen?'↑':'↓'}</span>}
        {!terminal&&node.sourceMaterialIds?.length>0&&<span title={node.sourceTitles?.join(', ')} className="mt-1 text-[8px] font-bold uppercase tracking-[.06em]" style={{color:node.done?'rgba(255,255,255,.76)':'#7a817f'}}>⌁ {node.sourceMaterialIds.length} source{node.sourceMaterialIds.length===1?'':'s'}</span>}
        {terminal&&node.done&&<span title="current position" aria-hidden="true" className={`absolute ${badgePosition} flex h-5 w-5 items-center justify-center rounded-full border border-white/50 bg-white/15 text-[11px] font-bold text-white`}>✓</span>}
        {locked&&<span aria-hidden="true" className={`absolute ${badgePosition} flex h-5 w-5 items-center justify-center rounded-full border border-[#aeb5b8] bg-paper text-muted`}><svg width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"><rect x="1.5" y="4.5" width="7" height="5" rx="1.2"/><path d="M3 4.5V3a2 2 0 0 1 4 0v1.5"/></svg></span>}
      </button>
      {!terminal&&(node.done||node.reachable)&&<button
        data-route-action
        onPointerDown={e=>e.stopPropagation()}
        onPointerUp={e=>e.stopPropagation()}
        onClick={e=>{e.stopPropagation();node.onToggle();}}
        aria-label={node.done?`Mark ${node.label} incomplete`:`Mark ${node.label} complete`}
        title={node.done?'mark incomplete':'mark complete'}
        className={`absolute ${badgePosition} z-[9] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-[1.4px] text-[12px] font-bold shadow-[1px_2px_0_rgba(58,64,69,.12)] transition-[transform,box-shadow] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${node.done?'border-white/55 text-white':'border-accent bg-paper text-accent-deep'}`}
        style={node.done?{background:color}:undefined}
      >✓</button>}
      {hasPopover&&<div id={detailId} role="tooltip" className={`pointer-events-none absolute left-1/2 z-[15] w-[250px] -translate-x-1/2 rounded-[11px_8px_12px_9px] border-[1.4px] border-ink-line bg-panel px-3.5 py-3 text-left shadow-[4px_5px_0_rgba(58,64,69,.14)] transition-[opacity,transform] duration-150 ${popoverAbove?'bottom-full mb-2':'top-full mt-2'} ${detailOpen?'translate-y-0 opacity-100':`${popoverAbove?'-translate-y-1':'translate-y-1'} opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100`}`}>
        {locked?<><span className="mb-0.5 block text-[9px] font-bold uppercase tracking-[.08em] text-[#9a6f45]">how to unlock</span><span className="block text-[10px] leading-[1.4] text-ink">{blockedCopy}</span></>:<>
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-[.09em]" style={{color}}>step details</span>
          {detailCopy&&<span className="block text-[11px] leading-[1.4] text-ink">{detailCopy}</span>}
          {(node.durationMinutes||node.doneWhen)&&<span className={`${detailCopy?'mt-2 border-t border-dashed border-[#d4d9da] pt-2':''} block text-[10px] leading-[1.4] text-muted-2`}>
            {node.durationMinutes&&<b className="mr-1.5 whitespace-nowrap text-accent-deep">~{node.durationMinutes} min</b>}
            {node.doneWhen&&<><b className="text-ink">done when:</b> {node.doneWhen}</>}
          </span>}
          {node.sourceTitles?.length>0&&<span className="mt-2 block text-[9px] leading-[1.35] text-muted">⌁ grounded by {node.sourceTitles.join(', ')}</span>}
        </>}
      </div>}
      {canAdd&&<button data-route-action onPointerDown={e=>e.stopPropagation()} onClick={node.onAdd} title="add what this unlocks" className="absolute -bottom-5 left-1/2 z-[6] flex h-7 -translate-x-1/2 cursor-pointer items-center gap-1 rounded-full border-[1.4px] border-ink-line bg-panel px-2 text-[10px] font-bold text-ink opacity-75 shadow-[1px_2px_0_rgba(58,64,69,.12)] transition-[opacity,transform] hover:-translate-y-0.5 group-hover:opacity-100">+ next</button>}
    </div>
  );
}

export default function RouteMap({ v }) {
  const r=v.route;
  const panRef=useRef(null);
  const spaceHeldRef=useRef(false);
  const [view,setView]=useState({zoom:1,panX:0,panY:0});
  const [spaceHeld,setSpaceHeld]=useState(false);
  const [panning,setPanning]=useState(false);
  const {zoom,panX,panY}=view;
  useEffect(()=>{
    if(!r)return;
    const isTyping=(target)=>target instanceof HTMLElement&&!!target.closest('input, textarea, select, [contenteditable="true"]');
    const onKeyDown=(e)=>{
      if(e.code!=='Space'||isTyping(e.target))return;
      e.preventDefault();
      spaceHeldRef.current=true;
      setSpaceHeld(true);
    };
    const onKeyUp=(e)=>{
      if(e.code!=='Space')return;
      e.preventDefault();
      spaceHeldRef.current=false;
      setSpaceHeld(false);
    };
    const onBlur=()=>{spaceHeldRef.current=false;setSpaceHeld(false);};
    window.addEventListener('keydown',onKeyDown);
    window.addEventListener('keyup',onKeyUp);
    window.addEventListener('blur',onBlur);
    return ()=>{
      window.removeEventListener('keydown',onKeyDown);
      window.removeEventListener('keyup',onKeyUp);
      window.removeEventListener('blur',onBlur);
    };
  },[Boolean(r)]);
  useEffect(()=>{
    if(!r||typeof window==='undefined'||window.innerWidth>=768)return;
    const nextZoom=Math.max(.25,Math.min(1,(window.innerWidth-24)/1360,(window.innerHeight-180)/740));
    setView({zoom:Math.round(nextZoom*100)/100,panX:0,panY:0});
  },[r?.interest?.id]);
  if(!r)return null;
  const {interest,map}=r;
  const {positions,width,height}=layoutNodes(map.nodes);
  const edgePaths=map.edges.map((edge,i)=>{
    const a=positions[edge.from],b=positions[edge.to]; if(!a||!b)return null;
    const x1=a.x,y1=a.y+a.h/2,x2=b.x+b.w,y2=b.y+b.h/2;
    const bend=Math.max(50,Math.abs(x1-x2)*.34);
    const dash=edge.relationship==='alternative'?'10 7':edge.relationship==='supports'?'2 7':undefined;
    const opacity=edge.relationship==='supports'?.55:edge.relationship==='alternative'?.72:.88;
    const stroke=edge.relationship==='supports'?'#6f9270':edge.relationship==='alternative'?'#6f8aa8':'#9b7d3f';
    const marker=edge.relationship==='supports'?'routeArrowSupport':edge.relationship==='alternative'?'routeArrowAlternative':'routeArrowRequired';
    return {...edge,key:(edge.from||'a')+'_'+(edge.to||'b')+'_'+i,d:`M ${x1} ${y1} C ${x1-bend} ${y1}, ${x2+bend} ${y2}, ${x2} ${y2}`,dash,opacity,stroke,marker};
  }).filter(Boolean);
  const hasRoute=map.nodes.some(n=>!['origin','destination'].includes(n.type));
  const onWheelZoom=(e)=>{
    e.preventDefault();
    const rect=e.currentTarget.getBoundingClientRect();
    const sx=e.clientX-rect.left-rect.width/2;
    const sy=e.clientY-rect.top-rect.height/2;
    const deltaY=e.deltaY;
    setView(current=>{
      const factor=Math.exp(-deltaY*.0012);
      const nextZoom=Math.max(.25,Math.min(1.35,Math.round(current.zoom*factor*100)/100));
      if(nextZoom===current.zoom)return current;
      const worldX=(sx-current.panX)/current.zoom;
      const worldY=(sy-current.panY)/current.zoom;
      return {zoom:nextZoom,panX:sx-worldX*nextZoom,panY:sy-worldY*nextZoom};
    });
  };
  const stepZoom=(amount)=>setView(current=>{
    const nextZoom=Math.max(.25,Math.min(1.35,Math.round((current.zoom+amount)*100)/100));
    const ratio=nextZoom/current.zoom;
    return {...current,zoom:nextZoom,panX:current.panX*ratio,panY:current.panY*ratio};
  });
  const resetView=()=>{
    const nextZoom=typeof window!=='undefined'&&window.innerWidth<768
      ? Math.max(.25,Math.min(1,(window.innerWidth-24)/1360,(window.innerHeight-180)/740))
      : 1;
    setView({zoom:Math.round(nextZoom*100)/100,panX:0,panY:0});
  };
  const onPanStart=(e)=>{
    const spacePan=spaceHeldRef.current&&e.button===0;
    const middlePan=e.button===1;
    const target=e.target instanceof Element?e.target:null;
    const backgroundPan=e.button===0&&!target?.closest('[data-route-node], [data-route-overlay], button, input, textarea, select, [contenteditable="true"]');
    if(!spacePan&&!middlePan&&!backgroundPan)return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    panRef.current={pointerId:e.pointerId,x:e.clientX,y:e.clientY,panX,panY};
    setPanning(true);
  };
  const onPanMove=(e)=>{
    const pan=panRef.current;
    if(!pan||pan.pointerId!==e.pointerId)return;
    e.preventDefault();
    e.stopPropagation();
    setView(current=>({...current,panX:pan.panX+(e.clientX-pan.x),panY:pan.panY+(e.clientY-pan.y)}));
  };
  const onPanEnd=(e)=>{
    const pan=panRef.current;
    if(!pan||pan.pointerId!==e.pointerId)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    panRef.current=null;
    setPanning(false);
  };
  return (
    <m.div initial={{opacity:0,scale:.995}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.995}} transition={{duration:.22,ease:motionEase.out}} className="fixed inset-0 z-[55] flex h-dvh flex-col overflow-hidden bg-paper">
      <div className="relative z-10 flex flex-none flex-col gap-2 border-b-[1.6px] border-ink-line bg-[rgba(247,248,248,.94)] px-3 py-3 shadow-[0_3px_0_rgba(58,64,69,.06)] backdrop-blur-[5px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={r.onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-paper-2 text-lg text-ink">←</button>
          <div className="min-w-0"><div className="flex min-w-0 items-baseline gap-2"><span className="truncate font-hand text-[24px] font-bold leading-none text-ink sm:text-[28px]">{interest.label}</span><span className="hidden rounded-[8px] border-[1.3px] border-[#b0975a] bg-[rgba(176,151,90,.12)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.07em] text-[#806b35] sm:inline">route map</span>{map.status==='draft'&&<span className="whitespace-nowrap text-[10px] font-semibold text-[#b07d67] sm:text-[11px]">AI draft</span>}</div><div className="mt-1 max-w-[620px] truncate text-[10px] text-muted-2 sm:text-xs">{interest.directionState==='open'?'∞ open-ended road':(interest.direction||'Direction still unclear')} · from {interest.currentPosition||'where you are today'}</div></div>
        </div>
        <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {map.status==='draft'&&<button onClick={r.onAccept} className="cursor-pointer rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-accent px-3.5 py-2 text-xs font-bold text-white shadow-[2px_2px_0_rgba(58,64,69,.16)]">use this route ✓</button>}
          <button onClick={r.onOpenMaterials} aria-expanded={r.materialsOpen} className="cursor-pointer whitespace-nowrap rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-paper-2 px-3 py-2 text-xs font-semibold text-ink shadow-[1px_2px_0_rgba(58,64,69,.1)] hover:-translate-y-px">⌁ context · {r.activeMaterialCount}</button>
          <button onClick={r.onAutoArrange} disabled={!r.canTidy||r.busy} title={r.canTidy?'return moved nodes to the staged layout':'Already tidy — drag a node to rearrange it'} className="cursor-pointer whitespace-nowrap rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-paper-2 px-3 py-2 text-xs font-semibold text-ink shadow-[1px_2px_0_rgba(58,64,69,.1)] transition-[transform,background,color] hover:-translate-y-px hover:bg-panel disabled:cursor-default disabled:border-[#cbd1d3] disabled:bg-transparent disabled:text-[#9aa2a6] disabled:shadow-none disabled:hover:translate-y-0">{r.canTidy?'↹ tidy map':'map is tidy ✓'}</button>
          <button onClick={r.onGenerate} disabled={r.busy} className="cursor-pointer rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-paper-2 px-3.5 py-2 text-xs font-bold text-ink shadow-[2px_2px_0_rgba(58,64,69,.1)] disabled:cursor-wait disabled:opacity-60">{r.busy?'✦ mapping the route…':hasRoute?'✦ redraft with AI':'✦ draft route with AI'}</button>
          <button onClick={r.onClose} title="close route map" className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-ink-line bg-paper-2 text-lg text-ink sm:flex">×</button>
        </div>
      </div>

      <div onWheel={onWheelZoom} onPointerDownCapture={onPanStart} onPointerMoveCapture={onPanMove} onPointerUpCapture={onPanEnd} onPointerCancelCapture={onPanEnd} className={`relative flex-1 touch-none overflow-hidden overscroll-contain bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:26px_26px] ${panning?'cursor-grabbing':'cursor-grab'}`}>
        {spaceHeld&&<div aria-hidden="true" className={`absolute inset-0 z-[20] ${panning?'cursor-grabbing':'cursor-grab'}`}></div>}
        {r.busy&&<div data-route-overlay className="absolute inset-0 z-[45] flex items-center justify-center bg-[rgba(237,240,241,.52)] px-4 backdrop-blur-[1.5px]"><CalmLoader label={hasRoute?'redrafting with care…':'mapping a path from here…'} detail={`reading your destination, recent moves${r.activeMaterialCount?`, and ${r.activeMaterialCount} source${r.activeMaterialCount===1?'':'s'}`:''}`}/></div>}
        <div data-route-overlay className="absolute top-3 left-3 z-[30] w-fit max-w-[calc(100%-24px)] sm:top-5 sm:left-6 sm:max-w-[calc(100%-48px)]">
        <div className="flex items-center gap-2 rounded-[10px_8px_11px_9px] border-[1.3px] border-[#c7ced0] bg-[rgba(251,251,250,.94)] px-2.5 py-2 text-[9px] text-muted-2 shadow-[1px_2px_0_rgba(58,64,69,.07)] backdrop-blur-[3px] sm:hidden"><span>drag canvas = pan</span><span className="flex overflow-hidden rounded-[5px] border border-[#c7ced0] bg-paper text-ink"><button onClick={()=>stepZoom(-.1)} aria-label="zoom Route Map out" className="w-6 border-r border-[#d9dddf]">−</button><button onClick={resetView} className="min-w-10 px-1 py-0.5 font-bold">{Math.round(zoom*100)}%</button><button onClick={()=>stepZoom(.1)} aria-label="zoom Route Map in" className="w-6 border-l border-[#d9dddf]">+</button></span></div>
        <div aria-label="Route map controls" className="hidden items-start gap-2 sm:flex">
          <details className="group/guide relative rounded-[10px_8px_11px_9px] border-[1.3px] border-[#c7ced0] bg-[rgba(251,251,250,.94)] text-[10px] text-muted-2 shadow-[1px_2px_0_rgba(58,64,69,.07)] backdrop-blur-[3px]">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 font-semibold text-ink [&::-webkit-details-marker]:hidden"><span className="text-accent">✦</span> map guide <span className="text-[9px] text-muted transition-transform group-open/guide:rotate-180">⌄</span></summary>
            <div className="absolute top-[calc(100%+7px)] left-0 grid w-[360px] grid-cols-2 gap-x-4 gap-y-2 rounded-[12px_9px_13px_10px] border-[1.3px] border-[#c7ced0] bg-[rgba(251,251,250,.97)] p-3 shadow-[3px_4px_0_rgba(58,64,69,.1)]">
              <span className="flex items-center gap-1.5 font-bold text-accent-deep"><i className="flex h-4 w-4 items-center justify-center rounded-full border-[1.3px] border-accent bg-paper text-[9px] not-italic">✓</i>available = complete</span>
              <span className="flex items-center gap-1.5"><i className="flex h-4 w-4 items-center justify-center rounded-full border border-[#aeb5b8] bg-paper text-muted"><svg width="8" height="9" viewBox="0 0 10 11" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"><rect x="1.5" y="4.5" width="7" height="5" rx="1.2"/><path d="M3 4.5V3a2 2 0 0 1 4 0v1.5"/></svg></i>locked = prerequisites</span>
              <span className="flex items-center gap-1"><svg width="28" height="7" viewBox="0 0 28 7"><path d="M1 3.5H25M21 1L25 3.5L21 6" fill="none" stroke="#9b7d3f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>required</span>
              <span className="flex items-center gap-1"><svg width="28" height="7" viewBox="0 0 28 7"><path d="M1 3.5H25M21 1L25 3.5L21 6" fill="none" stroke="#6f9270" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 4"/></svg>support</span>
              <span className="flex items-center gap-1"><svg width="28" height="7" viewBox="0 0 28 7"><path d="M1 3.5H25M21 1L25 3.5L21 6" fill="none" stroke="#6f8aa8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 4"/></svg>alternate</span>
              <span>drag a node = rearrange</span>
              <span className="col-span-2 border-t border-dashed border-[#d9dddf] pt-2">drag empty space to pan · hold <kbd className="rounded-[4px] border border-[#c7ced0] bg-paper px-1 font-bold text-ink">space</kbd> to pan from anywhere · scroll to zoom</span>
            </div>
          </details>
          <span className="flex h-[34px] overflow-hidden rounded-[10px_8px_11px_9px] border-[1.3px] border-[#c7ced0] bg-[rgba(251,251,250,.94)] text-[10px] text-ink shadow-[1px_2px_0_rgba(58,64,69,.07)] backdrop-blur-[3px]"><button onClick={()=>stepZoom(-.1)} aria-label="zoom Route Map out" className="w-8 cursor-pointer border-r border-[#d9dddf] hover:bg-paper-2">−</button><button onClick={resetView} title="reset Route Map zoom and position" className="min-w-12 cursor-pointer px-1 font-bold hover:bg-paper-2">{Math.round(zoom*100)}%</button><button onClick={()=>stepZoom(.1)} aria-label="zoom Route Map in" className="w-8 cursor-pointer border-l border-[#d9dddf] hover:bg-paper-2">+</button></span>
        </div>
        </div>
        <div className="absolute top-1/2 left-1/2 origin-top-left" style={{transform:`translate(${panX}px, ${panY}px) scale(${zoom})`}}>
          <div className="relative" style={{left:-width/2,top:-height/2,width,height}}>
          <svg className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} fill="none">
            <defs>
              <marker id="routeArrowRequired" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2L10 6L2 10" fill="none" stroke="#9b7d3f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></marker>
              <marker id="routeArrowSupport" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2L10 6L2 10" fill="none" stroke="#6f9270" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></marker>
              <marker id="routeArrowAlternative" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2L10 6L2 10" fill="none" stroke="#6f8aa8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></marker>
            </defs>
            {edgePaths.map(e=><path key={e.key+'_paper'} d={e.d} stroke="#edf0f1" strokeWidth="8" strokeLinecap="round" opacity=".92" strokeDasharray={e.dash}/>)}
            {edgePaths.map(e=><path key={e.key} d={e.d} stroke={e.stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity={e.opacity} strokeDasharray={e.dash} markerEnd={`url(#${e.marker})`} filter="url(#edge)"/>)}
          </svg>
          {map.nodes.map(node=><RouteNode key={node.id} node={node} pos={positions[node.id]} zoom={zoom}/>) }
          {!hasRoute&&<div className="absolute top-[430px] left-1/2 z-[5] w-[380px] -translate-x-1/2 rounded-[12px_9px_13px_10px] border-[1.5px] border-dashed border-[#b6bec1] bg-[rgba(251,251,250,.9)] px-4 py-3 text-center text-[12px] leading-[1.45] text-muted-2"><b className="text-ink">The road between is still blank.</b><br/>Use + next under START, or let AI sketch a route you can revise.</div>}
          </div>
        </div>

        {r.error&&<div className="absolute right-3 bottom-3 left-3 z-[8] rounded-[12px_9px_13px_10px] border-[1.5px] border-ink-line bg-panel p-3.5 text-xs leading-[1.4] text-[#a56f8f] shadow-[3px_4px_0_rgba(58,64,69,.12)] sm:right-5 sm:bottom-5 sm:left-auto sm:w-[300px]">{r.error}</div>}
        {map.assumptions?.length>0&&<details data-route-overlay className="absolute right-3 bottom-3 left-3 z-[8] rounded-[12px_9px_13px_10px] border-[1.5px] border-ink-line bg-panel p-3 shadow-[3px_4px_0_rgba(58,64,69,.12)] sm:right-5 sm:bottom-5 sm:left-auto sm:w-[310px]"><summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[.07em] text-muted">{map.assumptions.length} assumption{map.assumptions.length===1?'':'s'} to check</summary><ul className="mt-2 space-y-1.5 pl-4 text-[11px] leading-[1.4] text-muted-2">{map.assumptions.map((a,i)=><li key={i} className="list-disc">{a}</li>)}</ul></details>}
      </div>

      <AnimatePresence>{r.addOpen&&<div className="fixed bottom-5 left-1/2 z-[60] w-[min(620px,calc(100vw-32px))] -translate-x-1/2"><m.div {...popoverSurface} className="rounded-[16px_12px_17px_13px] border-[1.8px] border-ink-line bg-panel p-4 shadow-[5px_6px_0_rgba(58,64,69,.18)]"><div className="mb-2 flex items-center justify-between"><span className="font-hand text-[21px] font-bold text-ink">what does “{r.addParentLabel}” unlock?</span><button onClick={r.onCancelAdd} className="cursor-pointer border-none bg-transparent text-lg text-muted">×</button></div><input autoFocus value={r.addLabel} onChange={r.onAddLabel} onKeyDown={e=>{if(e.key==='Enter')r.onAddNode();if(e.key==='Escape')r.onCancelAdd();}} placeholder="a concrete task, capability, resource, or milestone…" className="w-full rounded-[10px_8px_11px_8px] border-[1.5px] border-ink-line bg-paper-2 px-3 py-2.5 text-[13px] text-ink outline-none"/><div className="mt-2.5 flex flex-wrap items-center gap-1.5">{r.typeChips.map(t=><button key={t.type} onClick={t.onSelect} className="cursor-pointer rounded-[8px] border-[1.3px] px-2 py-1 text-[10px] font-semibold" style={{background:t.active?(TYPE_COLORS[t.type]||'#7a9a6f'):'#fbfbfa',borderColor:t.active?(TYPE_COLORS[t.type]||'#7a9a6f'):'#b7bec1',color:t.active?'#fff':'#2b3034'}}>{t.label}</button>)}<span className="flex-1"></span><button onClick={r.onAddNode} className="cursor-pointer rounded-[9px_7px_10px_8px] border-[1.5px] border-ink-line bg-accent px-3 py-1.5 text-xs font-bold text-white">add to route →</button></div></m.div></div>}</AnimatePresence>
      <RouteMaterials r={r}/>
    </m.div>
  );
}
