'use client';

import React from 'react';
import Toolbar from './ui/Toolbar';
import DecideFlow from './ui/DecideFlow';
import BrainDump from './ui/BrainDump';
import DetailDrawer from './ui/DetailDrawer';
import ExpandedDetail from './ui/ExpandedDetail';
import FocusOverlay from './ui/FocusOverlay';
import Onboarding from './ui/Onboarding';
import RouteMap from './ui/RouteMap';
import { canvasDocumentFromState, normalizeCanvasDocument } from './lib/canvas-document';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const ACCENT = '#7a9a6f';
    this.ACCENT = ACCENT;
    this.themes = [
      { key:'learn', label:'learning & input', kw:['japan','語','language','read','book','study','dsa','algorithm','system design','architecture','learn','course','math','theory'] },
      { key:'craft', label:'craft & ship',     kw:['build','game','devit','write','content','ship','make','project','launch','app','ui','blog','essay','draw','music','design'] },
      { key:'body',  label:'body & wellbeing', kw:['health','cook','meal','food','fitness','gym','walk','run','sleep','body','nutrition','yoga','stretch'] },
    ];
    this.groupLabels = { learn:'learning & input', craft:'craft & ship', body:'body & wellbeing', other:'still forming' };
    this.groupColors = { learn:'#7a9a6f', craft:'#6f8aa8', body:'#b07d67', other:'#927696' };
    this.palette = ['#b0975a','#5f9a92','#a56f8f','#7f86b0','#8a9a5f','#b0836a','#6f9aa8','#9a7fa8'];
    this.headlines = ['Where should we begin?','What\u2019s pulling at you lately?','What are you juggling right now?','Empty your head. We\u2019ll make sense of it.','What do you keep meaning to get to?'];
    this.examples = [
      { short:'Learn Japanese, get fit & ship my game', full:'I want to learn Japanese, get fit, and finally ship my game' },
      { short:'Read more, cook, keep up with DSA', full:'Reading more, cooking, and keeping up with DSA' },
      { short:'Side projects, health & writing online', full:'Side projects, staying healthy, and writing online' },
    ];
    const seed = [
      { id:'ja', label:'Learn Japanese', cluster:'mind', meta:'language', energy:3, x:150, y:150 },
      { id:'rd', label:'Read books',     cluster:'mind', meta:'input',    energy:1, x:140, y:340 },
      { id:'dv', label:'Build Devit game',cluster:'build',meta:'make',     energy:3, x:600, y:110 },
      { id:'sd', label:'System design',  cluster:'build', meta:'study',    energy:2, x:840, y:250 },
      { id:'ds', label:'Practice DSA',   cluster:'build', meta:'reps',     energy:2, x:640, y:320 },
      { id:'wr', label:'Write content',  cluster:'build', meta:'output',   energy:1, x:470, y:470 },
      { id:'ck', label:'Learn cooking',  cluster:'body',  meta:'craft',    energy:2, x:260, y:540 },
      { id:'ht', label:'Improve health', cluster:'body',  meta:'upkeep',   energy:1, x:520, y:630 },
    ];
    const cloudDocument = props.cloudDocument ? normalizeCanvasDocument(props.cloudDocument) : null;
    let saved = cloudDocument?.nodes || null;
    if (!cloudDocument) try { saved = JSON.parse(localStorage.getItem('skein.nodes.v1')); } catch(e){}
    const firstRun = !(Array.isArray(saved) && saved.length);
    let initial = firstRun ? [] : saved;
    const validClusters = new Set(['learn','craft','body','other']);
    initial = initial.map(n => this.normalizeNode(validClusters.has(n.cluster) ? n : { ...n, cluster: this.classify(n) }));
    this.seed = seed;
    const seedEdges = [['ja','rd'],['rd','wr'],['dv','sd'],['ds','sd'],['dv','ds'],['wr','ds'],['ck','ht']];
    this.seedEdges = seedEdges;
    let savedE=cloudDocument?.edges || null; if(!cloudDocument) try { savedE=JSON.parse(localStorage.getItem('skein.edges.v1')); } catch(e){}
    let savedG=cloudDocument?.groups || null; if(!cloudDocument) try { savedG=JSON.parse(localStorage.getItem('skein.groups.v1')); } catch(e){}
    savedG = savedG || {};
    this.state = {
      nodes: initial,
      edges: firstRun ? [] : (Array.isArray(savedE) ? savedE : seedEdges.map(([a,b])=>({a,b}))),
      showOnboarding: firstRun, onbFading:false, hIndex:Math.floor(Math.random()*5), hOpacity:1, inputVal:'', listening:false, weaving:false, micUnsupported:false,
      customGroups: Array.isArray(savedG.customGroups)? savedG.customGroups : [],
      emptyFrames: savedG.emptyFrames || {},
      labelOverrides: savedG.labelOverrides || {},
      editingGroup:null, groupName:'',
      connectMode:false, pendingConnect:null, rewire:null,
      tool:'select', panX:0, panY:0, zoom:1, spacePan:false, panning:false,
      selectedId:null, selectedIds:[],
      expandedId:null, logOpen:false, logDur:25, logNote:'', logMood:'ok', pomoSec:1500, pomoRunning:false,
      focusOpen:false, focusMinimized:false, focusNodeId:null, focusTotal:1800, focusLeft:1800, focusRunning:false, focusDone:false,
      stepDraft:'', aiBusy:false,
      routeMapOpenId:null, routeDraftBusy:false, routeDraftError:'', routeAddParent:null, routeAddLabel:'', routeAddType:'task',
      adding:false, addX:0, addY:0, newLabel:'', newPriority:2,
      dumpOpen:false, dumpText:'',
      phase:null,               // 'menu' | 'filter'
      spinning:false, spinId:null,
      chosenId:null, resultOpen:false, chosenReason:'', chosenStep:'', chosenDoneWhen:'', chosenDuration:null, chosenStepSource:'', chosenStepBusy:false, chosenRouteNodeId:null, chosenWhy:'', chosenCombo:'', chosenComboPartner:'', decideMode:null, excluded:[],
      filters:{ time:null, energy:null, mood:null },
      focusStepText:'', focusRouteNodeId:null,
    };
    this.clusterMeta = { mind:'mind & language', build:'build & ship', body:'body & fuel' };
    this.NW = 154; this.NHc = 48; // node width, half-height (fixed node height 96)
    this._decisionRequest = 0;
    this._cloudRevision = props.cloudRevision || null;
  }
  normalizeNode(n){
    const posture=['explore','practice','build','maintain'].includes(n.posture)?n.posture:'explore';
    const direction=typeof n.direction==='string'?n.direction:(typeof n.goal==='string'?n.goal:'');
    const directionState=['directed','open','unclear'].includes(n.directionState)?n.directionState:(direction?'directed':'unclear');
    const season=['active','warm','resting','harvested','released'].includes(n.season)?n.season:'active';
    return { ...n, posture, directionState, direction, currentPosition:typeof n.currentPosition==='string'?n.currentPosition:'', season, calling:Math.min(3,Math.max(1,n.calling||n.priority||2)), resumeCue:typeof n.resumeCue==='string'?n.resumeCue:'', routeMap:n.routeMap&&Array.isArray(n.routeMap.nodes)&&Array.isArray(n.routeMap.edges)?n.routeMap:null };
  }
  applyCloudDocument(document){
    const value=normalizeCanvasDocument(document);
    const validClusters=new Set(['learn','craft','body','other']);
    const nodes=value.nodes.map(n=>this.normalizeNode(validClusters.has(n.cluster)?n:{...n,cluster:this.classify(n)}));
    this._syncSnapshot=JSON.stringify(value);
    this.setState({
      nodes,
      edges:value.edges,
      customGroups:value.groups.customGroups,
      emptyFrames:value.groups.emptyFrames,
      labelOverrides:value.groups.labelOverrides,
      showOnboarding:nodes.length===0,
      selectedId:null,selectedIds:[],expandedId:null,routeMapOpenId:null,
      phase:null,resultOpen:false,logOpen:false,routeAddParent:null,
    },()=>this.applyRoute(this.props.pathname));
  }
  componentDidMount(){ this._onKey = (e)=>this.handleKey(e); window.addEventListener('keydown', this._onKey);
    this._onKeyUp = (e)=>this.handleKeyUp(e); window.addEventListener('keyup', this._onKeyUp);
    this._onBlur = ()=>{ if(this._spaceHeld){ this._spaceHeld=false; this.setState({ spacePan:false, panning:false }); } }; window.addEventListener('blur', this._onBlur);
    this._ht = setInterval(()=>{ if(!this.state.showOnboarding) return; this.setState({hOpacity:0}); setTimeout(()=>this.setState(st=>({hIndex:(st.hIndex+1)%this.headlines.length, hOpacity:1})),420); }, 4200);
    this.applyRoute(this.props.pathname);
  }
  componentWillUnmount(){ if(this._spin) clearInterval(this._spin); if(this._ht) clearInterval(this._ht); if(this._micNote) clearTimeout(this._micNote); if(this._rec){ try{ this._rec.stop(); }catch(e){} } if(this._pomo) clearInterval(this._pomo); if(this._focus) clearInterval(this._focus); if(this._onKey) window.removeEventListener('keydown', this._onKey); if(this._onKeyUp) window.removeEventListener('keyup', this._onKeyUp); if(this._onBlur) window.removeEventListener('blur', this._onBlur); }
  parseInterests(text){
    let t=(text||'').replace(/^\s*(i\s+want\s+to|i'd\s+like\s+to|i\s+wanna|help\s+me|i\s+need\s+to|i\s+keep\s+meaning\s+to)\s+/i,'');
    const parts=t.split(/\s*(?:,|;|\band\b|&|\+|\/|\n|\bplus\b)\s*/i).map(p=>p.trim()).filter(Boolean);
    return parts.map(p=>p.replace(/^(finally|also|maybe|really|to)\s+/i,'').replace(/[.!?]+$/,'').trim()).filter(p=>p.length>1).slice(0,10);
  }
  onbInput=(e)=>this.setState({inputVal:e.target.value});
  onbKey=(e)=>{ if(e.key==='Enter') this.weave(); };
  fillExample=(full)=>this.setState({inputVal:full});
  toggleMic=()=>{
    if(this.state.listening){ this.stopMic(); return; }
    const SR = typeof window!=='undefined' && (window.SpeechRecognition||window.webkitSpeechRecognition);
    if(!SR){ // Chrome/Edge only; note and bail on browsers without the API
      this.setState({micUnsupported:true}); if(this._micNote)clearTimeout(this._micNote);
      this._micNote=setTimeout(()=>this.setState({micUnsupported:false}),3200); return; }
    const rec=new SR(); rec.lang='en-US'; rec.interimResults=true; rec.continuous=false;
    this._micBase=this.state.inputVal?this.state.inputVal.replace(/\s+$/,'')+' ':'';
    rec.onresult=(e)=>{ let txt=''; for(let i=0;i<e.results.length;i++) txt+=e.results[i][0].transcript; this.setState({inputVal:this._micBase+txt}); };
    rec.onerror=()=>this.stopMic();
    rec.onend=()=>{ this._rec=null; this.setState({listening:false}); };
    this._rec=rec;
    try{ rec.start(); this.setState({listening:true, micUnsupported:false}); }catch(e){ this._rec=null; this.setState({listening:false}); }
  };
  stopMic=()=>{ if(this._rec){ try{ this._rec.stop(); }catch(e){} this._rec=null; } this.setState({listening:false}); };
  weave=async()=>{
    const raw=(this.state.inputVal||'').trim();
    if(!raw || this.state.weaving) return;
    this.stopMic();
    this.setState({weaving:true});
    let woven=null;
    try{
      const ctrl=new AbortController(); const tm=setTimeout(()=>ctrl.abort(),30000);
      const res=await fetch('/api/weave',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text:raw}), signal:ctrl.signal });
      clearTimeout(tm);
      if(res.ok){ const j=await res.json(); if(j && Array.isArray(j.interests) && j.interests.length) woven=j; }
    }catch(e){}
    if(!woven){
      // offline fallback: local parse + keyword grouping
      const labels=this.parseInterests(raw);
      if(!labels.length){ this.setState({weaving:false}); return; }
      woven={ interests:labels.map(lab=>{ const label=lab.charAt(0).toUpperCase()+lab.slice(1); return { label, cluster:this.classify({label}), energy:2, priority:2, meta:'new' }; }), edges:[] };
    }
    this.setState({onbFading:true});
    setTimeout(()=>{
      const valid=new Set(['learn','craft','body','other']);
      const items=woven.interests.slice(0,10).map(it=>({
        label:String(it.label||'').slice(0,60)||'New interest',
        cluster: valid.has(it.cluster)?it.cluster:this.classify({label:it.label}),
        energy: Math.min(3,Math.max(1,Math.round(it.energy)||2)),
        priority: Math.min(3,Math.max(1,Math.round(it.priority)||2)),
        meta: String(it.meta||'new').slice(0,24),
      }));
      // lay same-cluster nodes next to each other so the enclosures read cleanly
      const clusterOrder={learn:0, craft:1, body:2, other:3};
      const order=items.map((_,i)=>i).sort((a,b)=>(clusterOrder[items[a].cluster]??3)-(clusterOrder[items[b].cluster]??3));
      const posOf={}; order.forEach((orig,i)=>posOf[orig]=i);
      const r=this.canvasEl&&this.canvasEl.getBoundingClientRect();
      const W=r?r.width:1000, H=r?r.height:640;
      const n=items.length, cols=Math.min(4,Math.ceil(Math.sqrt(n))), rows=Math.ceil(n/cols);
      const gapX=200, gapY=150;
      const z=this.state.zoom; const startX=((W/2)-this.state.panX)/z-((cols-1)*gapX)/2-77;
      const startY=((H/2)-this.state.panY)/z-((rows-1)*gapY)/2-48;
      const now=Date.now();
      const nodes=order.map((orig,i)=>{ const it=items[orig]; const col=i%cols,row=Math.floor(i/cols); return this.normalizeNode({ id:'w'+now+i, ...it, x:Math.round(startX+col*gapX+(Math.random()*20-10)), y:Math.round(startY+row*gapY+(Math.random()*20-10)) }); });
      const seen=new Set();
      const edges=(woven.edges||[]).filter(e=>e && Number.isInteger(e.a) && Number.isInteger(e.b) && e.a!==e.b && items[e.a] && items[e.b]).map(e=>({ a:nodes[posOf[e.a]].id, b:nodes[posOf[e.b]].id })).filter(e=>{ const k=[e.a,e.b].sort().join('|'); if(seen.has(k)) return false; seen.add(k); return true; });
      this.setState({ nodes, edges, showOnboarding:false, onbFading:false, weaving:false, inputVal:'' });
    },420);
  };
  loadExample=()=>{
    this.setState({onbFading:true});
    setTimeout(()=>{
      const valid=new Set(['learn','craft','body','other']);
      const nodes=this.seed.map(n=>this.normalizeNode({ ...n, cluster: valid.has(n.cluster)?n.cluster:this.classify(n) }));
      this.setState({ nodes, edges:this.seedEdges.map(([a,b])=>({a,b})), showOnboarding:false, onbFading:false },()=>{
        if(typeof window!=='undefined'&&window.matchMedia('(max-width: 767px)').matches)this.zoomReset();
      });
    },420);
  };
  handleKey = (e) => {
    const tgt = e.target;
    if (tgt && (tgt.tagName==='INPUT' || tgt.tagName==='TEXTAREA' || tgt.isContentEditable)) return;
    const s = this.state;
    if (s.showOnboarding) return;
    if (e.key === ' ' || e.code === 'Space') { // hold space to pan the canvas (Figma-style)
      e.preventDefault();
      if (!this._spaceHeld) { this._spaceHeld = true; this.setState({ spacePan:true }); }
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    if (mod) {
      const mk = e.key.toLowerCase();
      if (mk==='z' && !e.shiftKey) { e.preventDefault(); this.undo(); return; }
      if ((mk==='z' && e.shiftKey) || mk==='y') { e.preventDefault(); this.redo(); return; }
      if (mk==='a') { e.preventDefault(); this.selectAll(); return; }
      if (mk==='c') { e.preventDefault(); this.copySel(); return; }
      if (mk==='x') { e.preventDefault(); this.cutSel(); return; }
      if (mk==='v') { e.preventDefault(); this.pasteSel(); return; }
      if (mk==='d') { e.preventDefault(); this.duplicateSel(); return; }
      return;
    }
    if (e.key === 'Escape') {
      if (s.routeMapOpenId) { this.closeRouteMap(); return; }
      if (s.logOpen) { this.closeLog(); return; }
      if (s.expandedId) { this.closeExpanded(); return; }
      if (s.adding) { this.setState({ adding:false, newLabel:'' }); return; }
      if (s.connectMode) { if (s.pendingConnect) this.setState({ pendingConnect:null }); else this.setState({ connectMode:false }); return; }
      if (s.resultOpen) { this.closeResult(); return; }
      if (s.phase) { this.closeDecide(); return; }
      if (s.dumpOpen) { this.setState({ dumpOpen:false }); return; }
      if (s.selectedId || (s.selectedIds&&s.selectedIds.length)) { this.closePopover(); return; }
      if (s.tool !== 'select') { this.setState({ tool:'select' }); return; }
      return;
    }
    if (e.key==='Delete' || e.key==='Backspace') { e.preventDefault(); this.deleteSel(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k==='v' || k==='1') this.selectTool();
    else if (k==='h' || k==='2') this.handTool();
    else if (k==='t') this.addThoughtCenter();
    else if (k==='b') this.toggleDump();
    else if (k==='c') this.toggleConnect();
    else if (k==='g') this.autoGroup();
    else if (k==='d') this.openDecide();
  };
  handleKeyUp = (e) => {
    if (e.key === ' ' || e.code === 'Space') { this._spaceHeld = false; if (this.state.spacePan || this.state.panning) this.setState({ spacePan:false, panning:false }); }
  };
  snapshot(){ const s=this.state; return JSON.stringify({nodes:s.nodes, edges:s.edges, customGroups:s.customGroups, emptyFrames:s.emptyFrames, labelOverrides:s.labelOverrides}); }
  pushHistory(){ if(!this._hist) this._hist=[]; this._hist.push(this.snapshot()); if(this._hist.length>60) this._hist.shift(); this._future=[]; }
  undo = () => { if(!this._hist||!this._hist.length) return; if(!this._future) this._future=[]; this._future.push(this.snapshot()); const snap=JSON.parse(this._hist.pop()); this.setState({ ...snap, selectedId:null, selectedIds:[] }); this.go('/canvas'); };
  redo = () => { if(!this._future||!this._future.length) return; this._hist.push(this.snapshot()); const snap=JSON.parse(this._future.pop()); this.setState({ ...snap, selectedId:null, selectedIds:[] }); this.go('/canvas'); };
  selectAll(){ this.setState(s=>({ selectedIds:s.nodes.map(n=>n.id), selectedId:null })); this.go('/canvas'); }
  selIds(){ const s=this.state; if(s.selectedIds&&s.selectedIds.length) return s.selectedIds; if(s.selectedId) return [s.selectedId]; return []; }
  copySel(){ const ids=this.selIds(); if(!ids.length) return; const set=new Set(ids); this._clip=this.state.nodes.filter(n=>set.has(n.id)).map(n=>({...n})); }
  deleteSel(){ const ids=this.selIds(); if(!ids.length) return; this.pushHistory(); const set=new Set(ids); this.setState(s=>({ nodes:s.nodes.filter(n=>!set.has(n.id)), edges:s.edges.filter(e=>!set.has(e.a)&&!set.has(e.b)), selectedId:null, selectedIds:[], chosenId: set.has(s.chosenId)?null:s.chosenId })); this.go('/canvas'); }
  cutSel(){ this.copySel(); this.deleteSel(); }
  pasteSel(){ if(!this._clip||!this._clip.length) return; this.pushHistory(); const now=Date.now(); const news=this._clip.map((n,i)=>({ ...n, id:'p'+now+i, x:(n.x||0)+34, y:(n.y||0)+34 })); this.setState(s=>({ nodes:[...s.nodes, ...news], selectedIds:news.map(n=>n.id), selectedId:null })); this._clip=news.map(n=>({...n})); this.go('/canvas'); }
  duplicateSel(){ this.copySel(); this.pasteSel(); }

  clusterBoundsFor(key, nodes){
    const ns = nodes.filter(n=>n.cluster===key);
    if(!ns.length) return null;
    const xs=ns.map(n=>n.x), ys=ns.map(n=>n.y);
    const x=Math.min(...xs)-32, y=Math.min(...ys)-40;
    const w=Math.max(...xs.map(v=>v+this.NW))-Math.min(...xs)+64;
    const h=Math.max(...ys.map(v=>v+96))-Math.min(...ys)+74;
    return {x,y,w,h};
  }
  routeView(pathname=this.props.pathname){
    const parts=(pathname||'/canvas').split('?')[0].split('/').filter(Boolean).map(part=>{ try{return decodeURIComponent(part);}catch(_){return part;} });
    if(parts[0]!=='canvas')return {kind:'canvas'};
    if(parts[1]==='interests'&&parts[2]){
      if(parts[3]==='details')return {kind:'details',id:parts[2]};
      if(parts[3]==='route')return {kind:'route',id:parts[2]};
      return {kind:'interest',id:parts[2]};
    }
    if(parts[1]==='decide'&&parts[2]==='filter')return {kind:'decide-filter'};
    if(parts[1]==='decide'&&parts[2]==='result'&&parts[3])return {kind:'decide-result',id:parts[3]};
    if(parts[1]==='decide')return {kind:'decide'};
    return {kind:'canvas'};
  }
  go=(path,replace=false)=>{
    if(!this.props.navigate||this.props.pathname===path)return;
    this.props.navigate(path,{replace});
  };
  interestPath=(id,suffix='')=>'/canvas/interests/'+encodeURIComponent(id)+(suffix?'/'+suffix:'');
  decisionPath=(id)=>'/canvas/decide/result/'+encodeURIComponent(id);
  applyRoute(pathname){
    const view=this.routeView(pathname);
    const node=view.id?this.state.nodes.find(n=>n.id===view.id):null;
    if(view.id&&!node){ this.go('/canvas',true); return; }
    if(this._spin){ clearInterval(this._spin); this._spin=null; }
    if(view.kind!=='decide-result')this._decisionRequest++;
    const cleared={selectedId:null,selectedIds:[],expandedId:null,routeMapOpenId:null,phase:null,logOpen:false,routeAddParent:null,routeAddLabel:'',routeDraftError:'',spinning:false,spinId:null};
    if(view.kind==='interest'){
      this.setState({...cleared,selectedId:view.id,selectedIds:[view.id],resultOpen:false});
      return;
    }
    if(view.kind==='details'){
      this.setState({...cleared,expandedId:view.id,resultOpen:false});
      return;
    }
    if(view.kind==='route'){
      let routeMap=node.routeMap||this.makeRouteShell(node);
      const nodes=(routeMap.nodes||[]).map(routeNode=>routeNode.type==='origin'?{...routeNode,label:node.currentPosition||routeNode.label||'Where you are today'}:routeNode.type==='destination'?{...routeNode,label:node.directionState==='open'?'Keep the road open':(node.direction||routeNode.label||'Choose a direction')}:routeNode);
      routeMap={...routeMap,nodes};
      this.setState(s=>({...cleared,nodes:s.nodes.map(n=>n.id===view.id?{...n,routeMap}:n),routeMapOpenId:view.id,resultOpen:false}));
      return;
    }
    if(view.kind==='decide-filter'){
      this.setState({...cleared,phase:'filter',resultOpen:false});
      return;
    }
    if(view.kind==='decide-result'){
      if(this.state.chosenId===view.id&&this.state.chosenStep){
        this.setState({...cleared,resultOpen:true});
        return;
      }
      this.setState({...cleared},()=>this.landOn(node,'the thread selected for this decision'));
      return;
    }
    if(view.kind==='decide'){
      this.setState({...cleared,phase:'menu',resultOpen:false});
      return;
    }
    this.setState({...cleared,resultOpen:false});
  }
  openInterest = (id)=>{ this.setState({selectedId:id,selectedIds:[id],adding:false}); this.go(this.interestPath(id)); };
  selectNode = (id)=> this.openInterest(id);
  closePopover = ()=>{ this.setState({selectedId:null,selectedIds:[]}); this.go('/canvas'); };
  onRenameInput = (e)=>{ const v=e.target.value; this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,label:v}:n)})); };
  setEnergy = (id,k)=> { this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,energy:k}:n)})); };
  deleteSelected = ()=> { this.pushHistory(); this.setState(s=>({nodes:s.nodes.filter(n=>n.id!==s.selectedId), edges:s.edges.filter(e=>e.a!==s.selectedId&&e.b!==s.selectedId), chosenId: s.chosenId===s.selectedId?null:s.chosenId, selectedId:null, selectedIds:[] })); this.go('/canvas'); };
  setCluster = (id,k)=> { this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,cluster:k}:n)})); };
  setPriority = (id,p)=> { this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,priority:p}:n)})); };
  setNewPriority = (p)=> this.setState({ newPriority:p });
  onMetaInput = (e)=>{ const v=e.target.value; this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,meta:v}:n)})); };
  onNoteInput = (e)=>{ const v=e.target.value; this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,note:v}:n)})); };
  setPosture = (id,posture)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,posture}:n)})); };
  setDirectionState = (id,directionState)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,directionState}:n)})); };
  onDirectionInput = (e)=>{ const direction=e.target.value; this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,direction,directionState:direction&&n.directionState==='unclear'?'directed':n.directionState}:n)})); };
  onCurrentPositionInput = (e)=>{ const currentPosition=e.target.value; this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,currentPosition}:n)})); };
  setSeason = (id,season)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,season}:n)})); };
  markTouched = ()=> { this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===s.selectedId?{...n,lastTouched:Date.now()}:n)})); };
  onStepDraft=(e)=>this.setState({stepDraft:e.target.value});
  addStep=(id)=>{ const t=(this.state.stepDraft||'').trim(); if(!t||!id)return; this.pushHistory(); this.setState(s=>({ nodes:s.nodes.map(n=>n.id===id?{...n,steps:[...(n.steps||[]),{id:'st'+Date.now(),text:t,done:false}]}:n), stepDraft:'' })); };
  toggleStep=(id,sid)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,steps:(n.steps||[]).map(st=>st.id===sid?{...st,done:!st.done}:st)}:n)})); };
  removeStep=(id,sid)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,steps:(n.steps||[]).filter(st=>st.id!==sid)}:n)})); };
  removeSession=(id,ts)=>{ this.pushHistory(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,sessions:(n.sessions||[]).filter(x=>x.ts!==ts)}:n)})); };
  makeRouteShell(n){
    const stamp=Date.now();
    return { id:'rm'+stamp, status:'active', version:1, assumptions:[], nodes:[
      {id:'rn'+stamp+'start',key:'start',type:'origin',label:n.currentPosition||'Where you are today',stage:0,order:0,done:true,source:'user'},
      {id:'rn'+stamp+'goal',key:'goal',type:'destination',label:n.directionState==='open'?'Keep the road open':(n.direction||'Choose a direction'),stage:5,order:0,done:false,source:'user'},
    ], edges:[] };
  }
  routeReachable(map,node){
    if(!map||!node||node.done||node.type==='origin'||node.type==='destination'||node.type==='blocker')return false;
    const required=(map.edges||[]).filter(e=>e.to===node.id&&['requires','unlocks','produces'].includes(e.relationship||'unlocks'));
    if(!required.length)return true;
    return required.every(e=>{ const p=map.nodes.find(x=>x.id===e.from); return p&&p.done; });
  }
  routeFrontierInfo(n){
    const map=n&&n.routeMap;
    if(!map)return null;
    const order={task:0,experiment:1,milestone:2,capability:3,resource:4,decision:5};
    const node=(map.nodes||[]).filter(x=>this.routeReachable(map,x)).sort((a,b)=>(order[a.type]??9)-(order[b.type]??9)||(a.stage||0)-(b.stage||0)||(a.order||0)-(b.order||0))[0];
    return node?{ text:node.label, doneWhen:node.doneWhen||'This route node is complete', duration:node.durationMinutes||null, source:'route frontier', routeNodeId:node.id }:null;
  }
  toggleRouteNodeForInterest=(interestId,nodeId)=>{
    const n=this.state.nodes.find(x=>x.id===interestId), node=n&&n.routeMap&&n.routeMap.nodes.find(x=>x.id===nodeId);
    if(!n||!node||(!node.done&&!this.routeReachable(n.routeMap,node)))return;
    this.pushHistory();
    this.setState(s=>({nodes:s.nodes.map(x=>x.id===interestId?{...x,routeMap:{...x.routeMap,version:(x.routeMap.version||1)+1,nodes:x.routeMap.nodes.map(r=>r.id===nodeId?{...r,done:!r.done}:r)}}:x)}));
  };
  openRouteMap=(id)=>{
    const n=this.state.nodes.find(x=>x.id===id); if(!n)return;
    let routeMap=n.routeMap;
    if(!routeMap){ this.pushHistory(); routeMap=this.makeRouteShell(n); }
    const nodes=(routeMap.nodes||[]).map(x=>x.type==='origin'?{...x,label:n.currentPosition||x.label||'Where you are today'}:x.type==='destination'?{...x,label:n.directionState==='open'?'Keep the road open':(n.direction||x.label||'Choose a direction')}:x);
    this.setState(s=>({nodes:s.nodes.map(x=>x.id===id?{...x,routeMap:{...routeMap,nodes}}:x),routeMapOpenId:id,selectedId:null,routeDraftError:'',routeAddParent:null,routeAddLabel:''}));
    this.go(this.interestPath(id,'route'));
  };
  openSelectedRoute=()=>{ const id=this.state.selectedId; if(id)this.openRouteMap(id); };
  closeRouteMap=()=>{ const id=this.state.routeMapOpenId; this.setState({routeMapOpenId:null,routeAddParent:null,routeAddLabel:'',routeDraftError:'',selectedId:id,selectedIds:id?[id]:[]}); this.go(id?this.interestPath(id):'/canvas'); };
  beginRouteAdd=(parentId)=>this.setState({routeAddParent:parentId,routeAddLabel:'',routeAddType:'task'});
  cancelRouteAdd=()=>this.setState({routeAddParent:null,routeAddLabel:''});
  onRouteAddLabel=(e)=>this.setState({routeAddLabel:e.target.value});
  setRouteAddType=(routeAddType)=>this.setState({routeAddType});
  addRouteNode=()=>{
    const interestId=this.state.routeMapOpenId, label=(this.state.routeAddLabel||'').trim(), parentId=this.state.routeAddParent;
    if(!interestId||!label||!parentId)return;
    this.pushHistory();
    const id='rn'+Date.now();
    this.setState(s=>({nodes:s.nodes.map(n=>{
      if(n.id!==interestId||!n.routeMap)return n;
      const parent=n.routeMap.nodes.find(x=>x.id===parentId); if(!parent)return n;
      const stage=Math.min(4,Math.max(1,(parent.stage||0)+1));
      const peers=n.routeMap.nodes.filter(x=>x.stage===stage).length;
      const node={id,key:'manual_'+Date.now(),type:s.routeAddType,label,stage,order:peers,done:false,source:'user'};
      return {...n,routeMap:{...n.routeMap,version:(n.routeMap.version||1)+1,nodes:[...n.routeMap.nodes,node],edges:[...n.routeMap.edges,{from:parentId,to:id,relationship:'unlocks'}]}};
    }),routeAddParent:null,routeAddLabel:''}));
  };
  toggleRouteNode=(nodeId)=>{
    const interestId=this.state.routeMapOpenId; if(!interestId)return;
    this.toggleRouteNodeForInterest(interestId,nodeId);
  };
  beginRouteNodeMove=()=>this.pushHistory();
  moveRouteNode=(nodeId,x,y)=>{
    const interestId=this.state.routeMapOpenId;if(!interestId)return;
    this.setState(s=>({nodes:s.nodes.map(n=>n.id===interestId&&n.routeMap?{...n,routeMap:{...n.routeMap,nodes:n.routeMap.nodes.map(r=>r.id===nodeId?{...r,x:Math.round(x),y:Math.round(y)}:r)}}:n)}));
  };
  autoArrangeRoute=()=>{
    const interestId=this.state.routeMapOpenId;if(!interestId)return;this.pushHistory();
    this.setState(s=>({nodes:s.nodes.map(n=>n.id===interestId&&n.routeMap?{...n,routeMap:{...n.routeMap,version:(n.routeMap.version||1)+1,nodes:n.routeMap.nodes.map(({x,y,...r})=>r)}}:n)}));
  };
  acceptRouteDraft=()=>{
    const id=this.state.routeMapOpenId;if(!id)return;this.pushHistory();
    this.setState(s=>({nodes:s.nodes.map(n=>n.id===id&&n.routeMap?{...n,routeMap:{...n.routeMap,status:'active'}}:n)}));
  };
  generateRouteDraft=async()=>{
    const id=this.state.routeMapOpenId, n=this.state.nodes.find(x=>x.id===id); if(!n||this.state.routeDraftBusy)return;
    this.setState({routeDraftBusy:true,routeDraftError:''});
    try{
      const recentActivity=(n.sessions||[]).slice(-6).map(x=>x.note).filter(Boolean);
      const savedMoves=(n.steps||[]).filter(x=>!x.done).map(x=>x.text).slice(0,6);
      const existingRoute=n.routeMap?{summary:n.routeMap.summary||'',nodes:(n.routeMap.nodes||[]).filter(x=>!['origin','destination'].includes(x.type)).map(x=>({type:x.type,label:x.label,done:!!x.done})).slice(0,10)}:null;
      const res=await fetch('/api/route-map',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({label:n.label,posture:n.posture,directionState:n.directionState,direction:n.direction,currentPosition:n.currentPosition,notes:n.note||'',resumeCue:n.resumeCue||'',recentActivity,savedMoves,existingRoute})});
      if(!res.ok)throw new Error('route_failed');
      const data=await res.json();
      const shell=this.makeRouteShell(n), stamp=Date.now(), keyToId={start:shell.nodes[0].id,goal:shell.nodes[1].id};
      const destinationLabel=(n.direction||'').trim().toLowerCase();
      const seenLabels=[];
      const normalizeRouteLabel=value=>String(value||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\b(a|an|the|to|and|or|of|for|with)\b/g,' ').replace(/\s+/g,' ').trim();
      const mids=(data.nodes||[]).slice(0,10).map((x,i)=>{ const key=String(x.key||('step_'+i)).replace(/[^a-z0-9_]/gi,'_').toLowerCase(); const rid='rn'+stamp+i; keyToId[key]=rid; return {id:rid,key,type:x.type||'milestone',label:String(x.label||'Untitled step').slice(0,90),description:String(x.description||'').slice(0,180),stage:Math.min(4,Math.max(1,Math.round(x.stage)||1)),order:Math.max(0,Math.round(x.order)||0),doneWhen:String(x.doneWhen||'').slice(0,140),durationMinutes:x.durationMinutes||null,done:false,source:'ai_suggested'}; }).filter(x=>{
        const normalized=normalizeRouteLabel(x.label);
        if(!normalized||normalizeRouteLabel(destinationLabel)===normalized||seenLabels.some(label=>label===normalized||(label.length>18&&normalized.length>18&&(label.includes(normalized)||normalized.includes(label)))))return false;
        seenLabels.push(normalized);return true;
      });
      const validRouteIds=new Set([shell.nodes[0].id,shell.nodes[1].id,...mids.map(x=>x.id)]);
      const edges=(data.edges||[]).map(e=>({from:keyToId[String(e.from||'').toLowerCase()],to:keyToId[String(e.to||'').toLowerCase()],relationship:e.relationship||'unlocks'})).filter(e=>e.from&&e.to&&e.from!==e.to&&validRouteIds.has(e.from)&&validRouteIds.has(e.to));
      if(mids.length){
        mids.filter(x=>x.stage===Math.min(...mids.map(y=>y.stage))).forEach(x=>{ if(!edges.some(e=>e.to===x.id))edges.push({from:shell.nodes[0].id,to:x.id,relationship:'unlocks'}); });
        mids.filter(x=>x.stage===Math.max(...mids.map(y=>y.stage))).forEach(x=>{ if(!edges.some(e=>e.from===x.id&&e.to===shell.nodes[1].id))edges.push({from:x.id,to:shell.nodes[1].id,relationship:'unlocks'}); });
      }
      this.pushHistory();
      const assumptions=(Array.isArray(data.assumptions)?data.assumptions:[]).map(x=>String(x||'').trim()).filter(x=>x&&x.length<=240&&!/[{}\[\]]|(?:nodes|doneWhen|description|durationMinutes)['":]/i.test(x)).slice(0,4);
      const routeMap={...shell,status:'draft',summary:String(data.summary||''),assumptions,nodes:[shell.nodes[0],...mids,shell.nodes[1]],edges};
      this.setState(s=>({routeDraftBusy:false,nodes:s.nodes.map(x=>x.id===id?{...x,routeMap}:x)}));
    }catch(e){ this.setState({routeDraftBusy:false,routeDraftError:'Could not draft the route. Keep shaping it by hand, or try again.'}); }
  };
  nextMoveRequest(n){
    const now=Date.now(),day=86400000,map=n&&n.routeMap;
    const recentActivity=(n.sessions||[]).slice(-6).map(session=>({
      note:String(session.note||'').slice(0,160),
      durationMinutes:Math.max(0,Math.round(session.dur||0)),
      mood:['up','ok','down'].includes(session.mood)?session.mood:null,
      daysAgo:session.ts?Math.max(0,Math.floor((now-session.ts)/day)):null,
    }));
    const savedMoves=(n.steps||[]).slice(-8).map(step=>({text:String(step.text||'').slice(0,140),done:!!step.done}));
    let routeContext=null;
    if(map){
      const middle=(map.nodes||[]).filter(node=>!['origin','destination'].includes(node.type));
      routeContext={
        summary:String(map.summary||'').slice(0,180),
        assumptions:(map.assumptions||[]).slice(0,4).map(value=>String(value||'').slice(0,140)),
        completed:middle.filter(node=>node.done).slice(-6).map(node=>({type:node.type,label:node.label})),
        reachable:middle.filter(node=>this.routeReachable(map,node)).slice(0,4).map(node=>({type:node.type,label:node.label,doneWhen:node.doneWhen||'',durationMinutes:node.durationMinutes||null})),
      };
    }
    return {
      label:n.label,posture:n.posture,directionState:n.directionState,direction:n.direction||'',currentPosition:n.currentPosition||'',resumeCue:n.resumeCue||'',
      group:{key:n.cluster||'other',label:this.groupLabel(n.cluster||'other')},
      interestEnergy:Math.min(3,Math.max(1,n.energy||2)),privateContext:n.note||'',recentActivity,savedMoves,routeContext,
    };
  }
  suggestStep=async(id)=>{ const n=this.state.nodes.find(x=>x.id===id); if(!n||this.state.aiBusy)return;
    this.setState({aiBusy:true});
    let suggestion=null;
    try{
      const res=await fetch('/api/suggest',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(this.nextMoveRequest(n)) });
      if(res.ok){ const j=await res.json(); const text=(j.action||j.step||'').trim().slice(0,140); if(text)suggestion={id:'ai'+Date.now(),text,done:false,source:'ai_suggested',durationMinutes:j.durationMinutes||null,doneWhen:String(j.doneWhen||'').slice(0,160),whyThis:String(j.whyThis||'').slice(0,180),actionType:j.actionType||null}; }
    }catch(e){}
    if(!suggestion){const fallback=this.offlineStep(n);suggestion={id:'ai'+Date.now(),text:fallback.text,done:false,source:fallback.source,durationMinutes:fallback.duration||null,doneWhen:fallback.doneWhen||'',whyThis:'',actionType:n.posture||'explore'};}
    this.pushHistory();
    this.setState(s=>({ aiBusy:false, nodes:s.nodes.map(x=>x.id===id?{...x,steps:[...(x.steps||[]),suggestion]}:x) }));
  };
  mapSteps(n){ return (n.steps||[]).map(st=>({ id:st.id, text:st.text, done:st.done, box: st.done?'#7a9a6f':'#fbfbfa', check: st.done?'✓':'', col: st.done?'#a4abae':'#2b3034', deco: st.done?'line-through':'none', onToggle:()=>this.toggleStep(n.id,st.id), onRemove:()=>this.removeStep(n.id,st.id) })); }
  firstStepInfo(n){
    const st=(n&&n.steps||[]).find(x=>!x.done);
    if(st)return {text:st.text,doneWhen:st.doneWhen||'You can mark this step complete',duration:st.durationMinutes||null,source:st.source==='ai_suggested'?'AI suggestion':'your step',routeNodeId:null,whyThis:st.whyThis||''};
    if(n&&n.resumeCue)return {text:n.resumeCue,doneWhen:'You have moved past your saved resume point',duration:null,source:'resume point',routeNodeId:null};
    return this.routeFrontierInfo(n);
  }
  offlineStep(n){
    const label=n&&n.label?n.label:'this interest', direction=n&&n.direction?(' toward '+n.direction):'';
    const posture=n&&n.posture||'explore';
    if(posture==='build')return {text:'Make the smallest visible change in '+label+direction+'.',doneWhen:'One visible piece is different',duration:20,source:'offline suggestion'};
    if(posture==='practice')return {text:'Practice one repeatable part of '+label+' for 15 minutes.',doneWhen:'You completed one deliberate repetition',duration:15,source:'offline suggestion'};
    if(posture==='maintain')return {text:'Do the lightest version of '+label+' that keeps it alive.',doneWhen:'You completed a sustainable minimum',duration:15,source:'offline suggestion'};
    return {text:'Try one small part of '+label+' and note what pulls you.',doneWhen:'You learned what you want to try next',duration:15,source:'offline suggestion'};
  }
  firstStepText(n){ const info=this.firstStepInfo(n)||this.offlineStep(n||{}); return info.text; }
  detailFor(n){
    if(!n) return null;
    const day=86400000, now=Date.now();
    const sess=(n.sessions||[]).slice().sort((a,b)=>b.ts-a.ts);
    const today=Math.floor(now/day);
    const dayIdx=[...new Set(sess.map(x=>Math.floor(x.ts/day)))].sort((a,b)=>b-a);
    let streak=0, cur=today;
    if(dayIdx.length && (dayIdx[0]===today||dayIdx[0]===today-1)){ cur=dayIdx[0]; streak=1; for(let i=1;i<dayIdx.length;i++){ if(dayIdx[i]===cur-1){streak++;cur--;} else break; } }
    let longest=0,run=0,prev=null; [...dayIdx].sort((a,b)=>a-b).forEach(d=>{ if(prev!==null&&d===prev+1) run++; else run=1; longest=Math.max(longest,run); prev=d; });
    const thisWeek=sess.filter(x=>x.ts>now-7*day).length;
    const weeksRaw=Array(8).fill(0);
    sess.forEach(x=>{ const wk=Math.floor((now-x.ts)/(7*day)); if(wk>=0&&wk<8) weeksRaw[7-wk]+=(x.dur||0)/60; });
    const maxW=Math.max(0.1,...weeksRaw);
    const weeks=weeksRaw.map((v,i)=>({ h2:Math.round(v/maxW*46)+4, bg:i===7?'#7a9a6f':'rgba(122,154,111,.5)' }));
    const circ=2*Math.PI*54;
    const routeNodes=n.routeMap?(n.routeMap.nodes||[]).filter(x=>!['origin','destination'].includes(x.type)):[];
    const progressKnown=routeNodes.length>0||typeof n.progress==='number';
    const prog=routeNodes.length?Math.round(routeNodes.filter(x=>x.done).length/routeNodes.length*100):(typeof n.progress==='number'?Math.max(0,Math.min(100,n.progress)):0);
    const ringDash=progressKnown?(circ*prog/100).toFixed(1)+' '+circ.toFixed(1):'0 '+circ.toFixed(1);
    const trajectory=n.directionState==='open'?'open road':(sess[0]&&sess[0].ts>now-7*day?'moving':(n.currentPosition?'forming':'quiet'));
    const weekAvg=Array(8).fill(0), weekCnt=Array(8).fill(0);
    sess.forEach(x=>{ const wk=Math.floor((now-x.ts)/(7*day)); if(wk>=0&&wk<8){ weekAvg[7-wk]+=(x.dur||0); weekCnt[7-wk]++; } });
    const avgLen=weekAvg.map((t,i)=> weekCnt[i]? t/weekCnt[i]:0);
    const maxAvg=Math.max(1,...avgLen);
    const pts=avgLen.map((v,i)=>{ const x=(i/7)*560; const y=64-(v/maxAvg)*56; return x.toFixed(1)+','+y.toFixed(1); });
    const rAvg=(avgLen[6]+avgLen[7])/2, eAvg=(avgLen[0]+avgLen[1])/2;
    const momentum= rAvg>eAvg*1.1?'longer sessions \u2191': rAvg<eAvg*0.9?'shorter sessions \u2193':'steady \u2192';
    const moodDot={up:'#7a9a6f',ok:'#b0975a',down:'#a56f8f'}, moodTxt={up:'\u2191 focused',ok:'\u2192 ok',down:'\u2193 tired'};
    const rel=(ts)=>{ const d=today-Math.floor(ts/day); return d<=0?'Today':d===1?'Yesterday':d+' days ago'; };
    const journal=sess.slice(0,6).map(x=>({ ts:x.ts, note:x.note||'Session', dur:(x.dur||0)+' min', date:rel(x.ts), mood:moodTxt[x.mood]||'', dot:moodDot[x.mood]||'#b6bec1', onRemove:()=>this.removeSession(n.id,x.ts) }));
    const steps=this.mapSteps(n);
    const frontier=this.routeFrontierInfo(n);
    const routeFrontier=frontier?{...frontier,onToggle:()=>this.toggleRouteNodeForInterest(n.id,frontier.routeNodeId),onOpen:()=>this.openRouteMap(n.id)}:null;
    return { id:n.id, label:n.label, color:this.groupColor(n.cluster), groupLabel:this.groupLabel(n.cluster),
      goal:n.directionState==='open'?(n.direction||'Open-ended — no finish line required'):(n.direction||'Direction still unclear'), directionState:n.directionState, progress:prog, progressKnown, progressTxt:progressKnown?Math.round(prog)+'%':trajectory, progressCaption:progressKnown?'through route':'trajectory', ringDash,
      streak, longest, thisWeek, cadence:n.cadence||4, weekTxt:(thisWeek)+' / '+(n.cadence||4)+' sessions this week',
      weeks, sparkPts:pts.join(' '), sparkFill:'0,70 '+pts.join(' ')+' 560,70', momentum,
      journal, empty:sess.length===0,
      steps, routeFrontier, noSteps:!(n.steps&&n.steps.length), onAddStep:()=>this.addStep(n.id), onStepKey:(e)=>{ if(e.key==='Enter') this.addStep(n.id); }, onSuggest:()=>this.suggestStep(n.id), onOpenRoute:()=>this.openRouteMap(n.id) };
  }
  openExpanded=(id)=>{ this.setState({ expandedId:id, selectedId:null, selectedIds:[], logOpen:false }); this.go(this.interestPath(id,'details')); };
  closeExpanded=()=>{ this.setState({ expandedId:null, logOpen:false }); this.go('/canvas'); };
  collapseDrawer=()=>{ const id=this.state.expandedId; this.setState({ expandedId:null, selectedId:id, selectedIds:id?[id]:[] }); this.go(id?this.interestPath(id):'/canvas'); };
  expandCurrent=()=>{ const id=this.state.selectedId; if(!id)return; this.setState({ expandedId:id, selectedId:null, selectedIds:[] }); this.go(this.interestPath(id,'details')); };
  logToday=()=>{ const tid=this.state.expandedId||this.state.selectedId; if(!tid)return; this.pushHistory(); const now=Date.now(); this.setState(s=>({ nodes:s.nodes.map(n=>n.id===tid?{...n,lastTouched:now,sessions:[...(n.sessions||[]),{ts:now,dur:25,note:'Quick check-in',mood:'ok'}]}:n) })); };
  openLog=()=>this.setState({ logOpen:true, logDur:25, logNote:'', logMood:'ok' });
  closeLog=()=>this.setState({ logOpen:false });
  onLogDur=(e)=>this.setState({ logDur:parseInt(e.target.value)||0 });
  onLogNote=(e)=>this.setState({ logNote:e.target.value });
  setLogMood=(m)=>this.setState({ logMood:m });
  submitLog=()=>{ const tid=this.state.expandedId; if(!tid)return; this.pushHistory(); const now=Date.now(); const dur=this.state.logDur||25, note=(this.state.logNote||'').trim()||'Session', mood=this.state.logMood||'ok'; this.setState(s=>({ nodes:s.nodes.map(n=>n.id===tid?{...n,lastTouched:now,sessions:[...(n.sessions||[]),{ts:now,dur,note,mood}]}:n), logOpen:false })); };
  startPomo=()=>{ if(this._pomo)return; this.setState(s=>({pomoRunning:true, pomoSec:s.pomoSec||1500})); this._pomo=setInterval(()=>{ this.setState(s=>{ const t=(s.pomoSec||0)-1; if(t<=0){ clearInterval(this._pomo); this._pomo=null; return {pomoSec:0,pomoRunning:false}; } return {pomoSec:t}; }); },1000); };
  pausePomo=()=>{ if(this._pomo){clearInterval(this._pomo);this._pomo=null;} this.setState({pomoRunning:false}); };
  resetPomo=()=>{ if(this._pomo){clearInterval(this._pomo);this._pomo=null;} this.setState({pomoSec:1500,pomoRunning:false}); };
  toggleConnect = ()=>{ this.setState(s=>({ connectMode:!s.connectMode, pendingConnect:null, selectedId:null, selectedIds:[] })); this.go('/canvas'); };
  handleConnectClick = (id)=> this.setState(s=>{
    if (s.pendingConnect==null) return { pendingConnect:id };
    if (s.pendingConnect===id) return { pendingConnect:null };
    const a=s.pendingConnect, b=id;
    const exists=s.edges.some(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a));
    return { edges: exists? s.edges : [...s.edges,{a,b}], pendingConnect:null };
  });
  removeEdge = (a,b)=> { this.pushHistory(); this.setState(s=>({ edges:s.edges.filter(e=>!((e.a===a&&e.b===b)||(e.a===b&&e.b===a))) })); };
  startConnectDrag = (e, id, px, py) => {
    e.stopPropagation();
    const r = this.canvasEl.getBoundingClientRect();
    const move=(ev)=>{ this._justDragged=true; const mx=(ev.clientX-r.left-this.state.panX)/this.state.zoom, my=(ev.clientY-r.top-this.state.panY)/this.state.zoom; this.setState({ rewire:{ x1:px, y1:py, x2:mx, y2:my } }); };
    const up=(ev)=>{
      window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up);
      const mx=(ev.clientX-r.left-this.state.panX)/this.state.zoom, my=(ev.clientY-r.top-this.state.panY)/this.state.zoom;
      const target=this.state.nodes.find(n=> mx>=n.x && mx<=n.x+this.NW && my>=n.y && my<=n.y+96);
      this.setState({ rewire:null });
      if (target && target.id!==id) { this.pushHistory(); this.setState(s=>{ const ex=s.edges.some(ed=>(ed.a===id&&ed.b===target.id)||(ed.a===target.id&&ed.b===id)); return ex? {} : { edges:[...s.edges,{a:id,b:target.id}] }; }); }
      setTimeout(()=>{ this._justDragged=false; },60);
    };
    window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up);
  };
  startRewire = (e, a, b, end) => {
    e.stopPropagation();
    const byId={}; this.state.nodes.forEach(n=>byId[n.id]=n);
    const otherId = end==='a' ? b : a;
    const o = byId[otherId]; if(!o){ return; }
    const ox = o.x + this.NW/2, oy = o.y + this.NHc;
    const r = this.canvasEl.getBoundingClientRect();
    const move=(ev)=>{ this._justDragged=true; const px=(ev.clientX-r.left-this.state.panX)/this.state.zoom, py=(ev.clientY-r.top-this.state.panY)/this.state.zoom; this.setState({ rewire:{ x1:ox, y1:oy, x2:px, y2:py } }); };
    const up=(ev)=>{
      window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up);
      const px=(ev.clientX-r.left-this.state.panX)/this.state.zoom, py=(ev.clientY-r.top-this.state.panY)/this.state.zoom;
      const target=this.state.nodes.find(n=> px>=n.x && px<=n.x+this.NW && py>=n.y && py<=n.y+66);
      this.setState({ rewire:null });
      if (target && target.id!==otherId) {
        this.pushHistory();
        this.setState(s=>{
          const next = s.edges.map(ed=>{
            if(!((ed.a===a&&ed.b===b)||(ed.a===b&&ed.b===a))) return ed;
            return end==='a' ? { a:target.id, b:otherId } : { a:otherId, b:target.id };
          });
          const dedup = next.filter((ed,i,arr)=> arr.findIndex(x=>(x.a===ed.a&&x.b===ed.b)||(x.a===ed.b&&x.b===ed.a))===i );
          return { edges: dedup };
        });
      }
      setTimeout(()=>{ this._justDragged=false; },60);
    };
    window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up);
  };
  since(ts){ const d=Math.floor((Date.now()-ts)/86400000); if(d<=0) return 'today'; if(d===1) return 'yesterday'; return d+' days ago'; }
  hexA(hex,a){ const h=(hex||'#8a9196').replace('#',''); const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16); return 'rgba('+r+','+g+','+b+','+a+')'; }
  groupColor(key){ if(this.groupColors[key]) return this.groupColors[key]; const cg=(this.state.customGroups||[]).find(g=>g.key===key); return cg?cg.color:'#8a9196'; }
  groupLabel(key){ const o=(this.state.labelOverrides||{})[key]; if(o) return o; if(this.groupLabels[key]) return this.groupLabels[key]; const cg=(this.state.customGroups||[]).find(g=>g.key===key); return cg?cg.label:key; }
  addGroup = () => {
    this.pushHistory();
    const key='grp'+Date.now();
    const color=this.palette[(this.state.customGroups.length)%this.palette.length];
    const r=this.canvasEl&&this.canvasEl.getBoundingClientRect();
    const z=this.state.zoom; const x=((r?r.width/2:500)-this.state.panX)/z-145, y=((r?r.height/2:340)-this.state.panY)/z-105;
    this.setState(s=>({ customGroups:[...s.customGroups,{key,label:'new group',color}], emptyFrames:{...s.emptyFrames,[key]:{x,y,w:290,h:210}}, labelOverrides:{...s.labelOverrides,[key]:'new group'}, editingGroup:key, groupName:'new group', tool:'select' }));
  };
  createGroupForInterest=(interestId,label)=>{
    const name=String(label||'').trim().slice(0,48);
    if(!interestId||!name)return;
    this.pushHistory();
    const key='grp'+Date.now();
    this.setState(s=>{
      const color=this.palette[s.customGroups.length%this.palette.length];
      return {customGroups:[...s.customGroups,{key,label:name,color}],labelOverrides:{...s.labelOverrides,[key]:name},nodes:s.nodes.map(n=>n.id===interestId?{...n,cluster:key}:n)};
    });
  };
  beginRenameGroup = (key) => this.setState({ editingGroup:key, groupName:this.groupLabel(key) });
  onGroupNameInput = (e) => { const v=e.target.value; this.setState(s=>({ groupName:v, labelOverrides:{...s.labelOverrides,[s.editingGroup]:v} })); };
  onGroupNameKey = (e) => { if(e.key==='Enter'||e.key==='Escape') this.setState({ editingGroup:null }); };
  removeGroup = (key) => { this.pushHistory(); return this.setState(s=>{ const ef={...s.emptyFrames}; delete ef[key]; const lo={...s.labelOverrides}; delete lo[key]; return { customGroups:s.customGroups.filter(g=>g.key!==key), emptyFrames:ef, labelOverrides:lo, nodes:s.nodes.map(n=>n.cluster===key?{...n,cluster:'other'}:n), editingGroup:s.editingGroup===key?null:s.editingGroup }; }); };
  classify(n){ const t=(((n&&n.label)||'')+' '+((n&&n.meta)||'')).toLowerCase(); for(const th of this.themes){ if(th.kw.some(k=>t.includes(k))) return th.key; } return 'other'; }
  addThoughtCenter = () => { const r=this.canvasEl && this.canvasEl.getBoundingClientRect(); const z=this.state.zoom; const x=((r? r.width/2:420)-this.state.panX)/z-95, y=((r? r.height/2:220)-this.state.panY)/z-30; this.setState({ adding:true, addX:x, addY:y, newLabel:'', tool:'select', selectedId:null, selectedIds:[] }); this.go('/canvas'); };
  autoGroup = () => {
    this.pushHistory();
    const r=this.canvasEl && this.canvasEl.getBoundingClientRect();
    const W=r? r.width:1200, H=r? r.height:760;
    const order=['learn','craft','body','other'];
    const groups={};
    this.state.nodes.forEach(n => { const k=this.classify(n); (groups[k]=groups[k]||[]).push(n.id); });
    const present=order.filter(k => groups[k] && groups[k].length);
    const pos={};
    const colGap=70, colW2=172;
    const totalW = present.length*colW2 + Math.max(0,present.length-1)*colGap;
    const z=this.state.zoom; const baseX = Math.round(((W-totalW)/2 - this.state.panX)/z);
    let maxRows=1; present.forEach(k=>{ maxRows=Math.max(maxRows, groups[k].length); });
    const blockH=(maxRows-1)*112 + 96;
    const vStart=Math.round(((H-blockH)/2 - this.state.panY)/z);
    present.forEach((k,gi) => {
      const ids=groups[k]; const x=baseX+gi*(colW2+colGap);
      ids.forEach((id,j) => { pos[id]={ x:Math.round(x), y:Math.round(vStart+j*112), cluster:k }; });
    });
    this.setState(s => ({ nodes:s.nodes.map(n => pos[n.id] ? { ...n, ...pos[n.id] } : { ...n, cluster:this.classify(n) }), selectedId:null, selectedIds:[] }));
    this.go('/canvas');
  };

  setCanvas = (el) => {
    if (this.canvasEl && this._wheelFn) this.canvasEl.removeEventListener('wheel', this._wheelFn);
    this.canvasEl = el;
    if (el) { this._wheelFn = (e) => this.onCanvasWheel(e); el.addEventListener('wheel', this._wheelFn, { passive: false }); }
  };
  setViewport = (el) => { this.viewportEl = el; };
  setTool = (t) => this.setState({ tool:t, pendingConnect:null });
  selectTool = () => this.setTool('select');
  handTool = () => this.setTool('hand');
  zoomBy = (fac) => {
    const r=this.canvasEl&&this.canvasEl.getBoundingClientRect();
    const cx=r?r.width/2:500, cy=r?r.height/2:340;
    this.setState(s=>{
      const nz=Math.min(2.2, Math.max(0.35, s.zoom*fac));
      const wx=(cx-s.panX)/s.zoom, wy=(cy-s.panY)/s.zoom;
      return { zoom:nz, panX:cx-wx*nz, panY:cy-wy*nz };
    });
  };
  zoomAt = (fac, sx, sy) => {
    this.setState(s=>{
      const nz=Math.min(2.2, Math.max(0.35, s.zoom*fac));
      const wx=(sx-s.panX)/s.zoom, wy=(sy-s.panY)/s.zoom;
      return { zoom:nz, panX:sx-wx*nz, panY:sy-wy*nz };
    });
  };
  onCanvasWheel = (e) => {
    e.preventDefault();
    const r=this.canvasEl.getBoundingClientRect();
    const fac=Math.exp(-e.deltaY*0.0015);
    this.zoomAt(fac, e.clientX-r.left, e.clientY-r.top);
  };
  zoomIn = () => this.zoomBy(1.2);
  zoomOut = () => this.zoomBy(1/1.2);
  zoomReset = () => {
    const r=this.canvasEl&&this.canvasEl.getBoundingClientRect();
    const nodes=this.state.nodes||[];
    if(!r||!nodes.length){ this.setState({zoom:1,panX:0,panY:0}); return; }
    const pad=r.width<768?28:72;
    const toolbarRoom=r.width<768?124:72;
    const minX=Math.min(...nodes.map(n=>n.x))-36;
    const minY=Math.min(...nodes.map(n=>n.y))-52;
    const maxX=Math.max(...nodes.map(n=>n.x+this.NW))+36;
    const maxY=Math.max(...nodes.map(n=>n.y+96))+52;
    const contentW=Math.max(1,maxX-minX),contentH=Math.max(1,maxY-minY);
    const zoom=Math.min(1,Math.max(.35,Math.min((r.width-pad*2)/contentW,(r.height-toolbarRoom-pad)/contentH)));
    const panX=(r.width-contentW*zoom)/2-minX*zoom;
    const panY=Math.max(58,(r.height-toolbarRoom-contentH*zoom)/2-minY*zoom);
    this.setState({zoom,panX,panY});
  };
  onCanvasPointerDown = (e) => {
    if (this.state.tool !== 'hand' && !this._spaceHeld) return;
    const sx=e.clientX, sy=e.clientY, bx=this.state.panX, by=this.state.panY;
    this.setState({ panning:true });
    const move=(ev)=>{ this._justDragged=true; this.setState({ panX:bx+(ev.clientX-sx), panY:by+(ev.clientY-sy) }); };
    const up=()=>{ window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up); this.setState({ panning:false }); setTimeout(()=>{ this._justDragged=false; },60); };
    window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up);
  };
  focusAdd = (el) => { if(el) setTimeout(()=>el.focus(),0); };

  // ---- add a thought by clicking canvas ----
  onCanvasClick = (e) => {
    if (this._justDragged || this._spaceHeld) return;
    if (e.target !== this.canvasEl && e.target !== this.viewportEl) return;
    if (this.state.connectMode) { this.setState({ pendingConnect:null }); return; }
    if (this.state.tool !== 'select') return;
    if (this.state.selectedId || (this.state.selectedIds&&this.state.selectedIds.length)) { this.closePopover(); return; }
    const r = this.canvasEl.getBoundingClientRect();
    this.setState({ adding:true, addX: (e.clientX - r.left - this.state.panX)/this.state.zoom - 12, addY: (e.clientY - r.top - this.state.panY)/this.state.zoom - 12, newLabel:'', selectedId:null });
  };
  onNewLabelInput = (e) => this.setState({ newLabel: e.target.value });
  onAddKey = (e) => {
    if (e.key === 'Enter') { this.commitAdd(); }
    else if (e.key === 'Escape') { this.setState({ adding:false, newLabel:'' }); }
  };
  commitAdd = () => {
    const t = this.state.newLabel.trim();
    if (!t) { this.setState({ adding:false, newLabel:'' }); return; }
    this.pushHistory();
    const id = 'u'+Date.now();
    const node = this.normalizeNode({ id, label:t, cluster:this.classify({label:t}), meta:'new thought', energy:2, priority:this.state.newPriority||2, x:this.state.addX, y:this.state.addY });
    this.setState(s => ({ nodes:[...s.nodes, node], adding:false, newLabel:'' }));
  };

  // ---- drag a single node (pointer events) ----
  startDrag = (e, id) => {
    if (this._spaceHeld) return; // space-pan: let the event bubble to the canvas
    if (this.state.connectMode) { e.stopPropagation(); this.handleConnectClick(id); return; }
    e.stopPropagation();
    if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch(_){} }
    const r = this.canvasEl.getBoundingClientRect();
    const node = this.state.nodes.find(n=>n.id===id);
    const px = this.state.panX, py = this.state.panY;
    const offX = (e.clientX - r.left - px)/this.state.zoom - node.x, offY = (e.clientY - r.top - py)/this.state.zoom - node.y;
    let moved = false;
    const move = (ev) => {
      const dx = ev.clientX - e.clientX, dy = ev.clientY - e.clientY;
      if (!moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      if (!moved) this.pushHistory();
      moved = true; this._justDragged = true;
      const nx = (ev.clientX - r.left - px)/this.state.zoom - offX, ny = (ev.clientY - r.top - py)/this.state.zoom - offY;
      this.setState(s => ({ nodes: s.nodes.map(n => n.id===id ? {...n, x:nx, y:ny} : n) }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!moved) { this.openInterest(id); return; }
      const nd = this.state.nodes.find(x=>x.id===id);
      const ncx = nd.x + this.NW/2, ncy = nd.y + this.NHc;
      let target = null;
      const dropKeys = [...new Set([ ...this.themes.map(t=>t.key), ...this.state.customGroups.map(g=>g.key), ...Object.keys(this.state.emptyFrames) ])];
      dropKeys.forEach(k=>{
        const b = this.clusterBoundsFor(k, this.state.nodes.filter(z=>z.id!==id)) || (this.state.emptyFrames[k] ? this.state.emptyFrames[k] : null);
        if (b && ncx>=b.x && ncx<=b.x+b.w && ncy>=b.y && ncy<=b.y+b.h) target = k;
      });
      if (target && target !== nd.cluster) this.setState(s=>({ nodes:s.nodes.map(z=>z.id===id?{...z,cluster:target}:z) }));
      setTimeout(()=>{ this._justDragged = false; }, 60);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // ---- drag an entire group by its label ----
  startGroupDrag = (e, key) => {
    if (this._spaceHeld) return; // space-pan: let the event bubble to the canvas
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const hasMembers = this.state.nodes.some(n=>n.cluster===key);
    const base = {}; this.state.nodes.forEach(n => { if (n.cluster===key) base[n.id] = { x:n.x, y:n.y }; });
    const baseFrame = this.state.emptyFrames[key] ? { ...this.state.emptyFrames[key] } : null;
    let moved = false;
    const move = (ev) => {
      const z=this.state.zoom; const ddx = (ev.clientX - startX)/z, ddy = (ev.clientY - startY)/z;
      if (!moved && Math.abs(ddx)<3 && Math.abs(ddy)<3) return;
      if (!moved) this.pushHistory();
      moved = true; this._justDragged = true;
      if (hasMembers) this.setState(s => ({ nodes: s.nodes.map(n => base[n.id] ? {...n, x:base[n.id].x+ddx, y:base[n.id].y+ddy} : n) }));
      else if (baseFrame) this.setState(s => ({ emptyFrames:{...s.emptyFrames, [key]:{...baseFrame, x:baseFrame.x+ddx, y:baseFrame.y+ddy}} }));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!moved) { this.beginRenameGroup(key); return; }
      setTimeout(()=>{ this._justDragged = false; }, 60);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // ---- brain dump ----
  toggleDump = () => this.setState(s => ({ dumpOpen: !s.dumpOpen }));
  onDumpInput = (e) => this.setState({ dumpText: e.target.value });
  scatterDump = () => {
    const items = this.state.dumpText.split(/[\n,]+/).map(t=>t.trim()).filter(Boolean);
    if (!items.length) { this.setState({ dumpOpen:false }); return; }
    this.pushHistory();
    const news = items.map((t,i)=>this.normalizeNode({
      id:'d'+Date.now()+i, label:t, cluster:this.classify({label:t}), meta:'new thought', energy:2, priority:2,
      x: 300 + (i%4)*210 + (Math.random()*24-12),
      y: 120 + Math.floor(i/4)*130 + (Math.random()*24-12),
    }));
    this.setState(s => ({ nodes:[...s.nodes, ...news], dumpOpen:false, dumpText:'' }));
  };

  // ---- decide ----
  openDecide = () => { this.setState({ phase:'menu', excluded:[] }); this.go('/canvas/decide'); };
  closeDecide = () => { this.setState({ phase:null }); this.go('/canvas'); };
  startFilter = () => { this.setState({ phase:'filter' }); this.go('/canvas/decide/filter'); };
  daysSince = (n) => (n && n.lastTouched) ? Math.floor((Date.now()-n.lastTouched)/86400000) : null;
  neglectFactor = (n) => { const d = (n && n.lastTouched) ? (Date.now()-n.lastTouched)/86400000 : 21; return 1 + Math.min(d,30)/12; };
  comboText(a,b){
    const A=(a||'').toLowerCase(), B=(b||'').toLowerCase(), has=(x,re)=>re.test(x);
    const pairs=[
      [/dsa|algorithm|leet/, /system design|architecture/, 'Solve one problem, then sketch how it would scale \u2014 both at once.'],
      [/cook|recipe|meal/, /health|fitness|gym|run|body|walk/, 'Meal-prep one genuinely healthy recipe \u2014 cooking and health in one go.'],
      [/japan|language|\u8a9e/, /read|book/, 'Read one page of a Japanese graded reader.'],
      [/writ|content|blog|essay/, /devit|game|build|code|ship|project/, 'Write a short devlog about this week\u2019s build.'],
      [/read|book/, /writ|content|blog|essay/, 'Read 20 pages, then jot three lines on what struck you.'],
      [/system design|architecture/, /devit|game|build|code|ship|project/, 'Design one system for your project before you build it.'],
    ];
    for(const [r1,r2,t] of pairs){ if((has(A,r1)&&has(B,r2))||(has(A,r2)&&has(B,r1))) return {text:t,specific:true}; }
    return { text:'Find one '+a+' task that also nudges '+b+' \u2014 one sitting, two wins.', specific:false };
  }
  comboFor(node){
    if(!node) return null;
    const ids=new Set(); this.state.edges.forEach(e=>{ if(e.a===node.id) ids.add(e.b); if(e.b===node.id) ids.add(e.a); });
    const partners=[...ids].map(id=>this.state.nodes.find(n=>n.id===id)).filter(Boolean);
    if(!partners.length) return null;
    let generic=null;
    for(const p of partners){ const r=this.comboText(node.label,p.label); if(r.specific) return {partner:p.label,text:r.text}; if(!generic) generic={partner:p.label,text:r.text}; }
    return generic;
  }
  whyNow = (n) => {
    const d = this.daysSince(n);
    if (d === null) return 'You haven\u2019t logged any time here yet — a fresh start.';
    if (d >= 10) return 'It\u2019s been ' + d + ' days. A gentle re-entry beats a big push.';
    if (d >= 3) return 'Last touched ' + d + ' days ago — keep the thread alive.';
    return d === 0 ? 'You\u2019re on a roll — you already touched this today.' : ('You\u2019re on a roll — touched ' + d + ' day' + (d>1?'s':'') + ' ago.');
  };
  startShuffle = () => {
    if (this._spin) clearInterval(this._spin);
    const ex = this.state.excluded || [];
    let pool = this.state.nodes.filter(n => !ex.includes(n.id) && !['resting','harvested','released'].includes(n.season));
    if (!pool.length) pool = this.state.nodes.filter(n=>!['harvested','released'].includes(n.season));
    if (!pool.length) { this.setState({ phase:null }); return; }
    this.setState({ phase:null, resultOpen:false, spinning:true, chosenId:null, decideMode:'shuffle' });
    let ticks = 0;
    const total = 16 + Math.floor(Math.random()*6);
    this._spin = setInterval(() => {
      ticks++;
      const rid = pool[Math.floor(Math.random()*pool.length)].id;
      this.setState({ spinId: rid });
      if (ticks >= total) {
        clearInterval(this._spin); this._spin = null;
        const pick = this.weightedPick(pool);
        this.landOn(pick, 'a nudge toward what you\u2019ve been circling');
      }
    }, 90);
  };
  weightedPick = (nodes) => {
    const pw = {1:0.65, 2:1, 3:1.55};
    const bag = [];
    nodes.forEach(n => { const continuity=n.lastTouched&&this.daysSince(n)<=2?1.25:1; const warm=n.season==='warm'?0.75:1; const w = Math.max(1, Math.round(this.neglectFactor(n) * (pw[n.calling||n.priority||2]||1) * continuity * warm)); for(let i=0;i<w;i++) bag.push(n); });
    return bag[Math.floor(Math.random()*bag.length)] || nodes[0];
  };
  landOn = (node, reason) => {
    const combo=this.comboFor(node);
    const info=this.firstStepInfo(node), req=++this._decisionRequest;
    this.setState({ spinning:false, spinId:null, chosenId:node.id, resultOpen:true,
      chosenReason: reason, chosenStep:info?info.text:'finding a meaningful next move…',chosenDoneWhen:info?info.doneWhen:'',chosenDuration:info?info.duration:null,chosenStepSource:info?info.source:'',chosenStepBusy:!info,chosenRouteNodeId:info?info.routeNodeId:null,chosenWhy: this.whyNow(node),
      chosenCombo: combo?combo.text:'', chosenComboPartner: combo?combo.partner:'' });
    this.go(this.decisionPath(node.id));
    if(!info)this.generateDecisionStep(node,req);
  };
  generateDecisionStep=async(node,requestId)=>{
    let info=null;
    try{
      const res=await fetch('/api/suggest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...this.nextMoveRequest(node),time:this.state.filters.time,energy:this.state.filters.energy,mood:this.state.filters.mood})});
      if(res.ok){const j=await res.json();if(j.action||j.step)info={text:String(j.action||j.step).slice(0,140),doneWhen:String(j.doneWhen||'You completed the proposed action').slice(0,160),duration:j.durationMinutes||null,source:'suggested',routeNodeId:null,whyThis:String(j.whyThis||'').slice(0,180),actionType:j.actionType||null};}
    }catch(e){}
    if(!info)info=this.offlineStep(node);
    if(requestId!==this._decisionRequest||this.state.chosenId!==node.id)return;
    this.setState(s=>({chosenStep:info.text,chosenDoneWhen:info.doneWhen,chosenDuration:info.duration,chosenStepSource:info.source,chosenStepBusy:false,chosenRouteNodeId:null,chosenWhy:info.whyThis||s.chosenWhy}));
  };
  notToday = () => {
    const id = this.state.chosenId;
    this.setState(s => ({ excluded:[...(s.excluded||[]), id].filter(Boolean), resultOpen:false }), () => {
      if (this.state.decideMode === 'filter') this.runFilter(); else this.startShuffle();
    });
  };
  startThis = () => {
    const id = this.state.chosenId;
    if(!id||this.state.chosenStepBusy){ if(!id)this.setState({resultOpen:false}); return; }
    const e = this.state.filters && this.state.filters.energy;
    const mins = this.state.chosenDuration || (e==='low'?18 : e==='high'?48 : 30);
    this.setState(s => ({ nodes: s.nodes.map(n => n.id===id ? { ...n, picks:(n.picks||0)+1, lastPicked:Date.now() } : n), resultOpen:false }));
    this.go('/canvas');
    this.startFocus(id, mins, this.state.chosenStep, this.state.chosenRouteNodeId);
  };
  startFocus=(nodeId,mins,stepText,routeNodeId)=>{ if(this._focus)clearInterval(this._focus); const total=mins*60; this.setState({ focusOpen:true, focusMinimized:false, focusDone:false, focusNodeId:nodeId, focusStepText:stepText||'', focusRouteNodeId:routeNodeId||null, focusTotal:total, focusLeft:total, focusRunning:true }); this._focus=setInterval(()=>this._focusTick(),1000); };
  _focusTick(){ this.setState(s=>{ if(!s.focusRunning) return {}; const l=(s.focusLeft||0)-1; if(l<=0){ clearInterval(this._focus); this._focus=null; setTimeout(()=>this.completeFocus(),0); return {focusLeft:0,focusRunning:false}; } return {focusLeft:l}; }); }
  pauseFocus=()=>this.setState({focusRunning:false});
  resumeFocus=()=>{ if(!this._focus){ this._focus=setInterval(()=>this._focusTick(),1000); } this.setState({focusRunning:true}); };
  togglePauseFocus=()=>{ if(this.state.focusRunning) this.pauseFocus(); else this.resumeFocus(); };
  extendFocus=()=>this.setState(s=>({focusTotal:(s.focusTotal||0)+300, focusLeft:(s.focusLeft||0)+300}));
  setFocusMins=(m)=>this.setState({focusTotal:m*60, focusLeft:m*60});
  minimizeFocus=()=>this.setState({focusMinimized:true});
  resumeFromPill=()=>this.setState({focusMinimized:false});
  _logFocus(dur,mood){ const id=this.state.focusNodeId; if(!id||dur<1)return; this.pushHistory(); const now=Date.now(); this.setState(s=>({nodes:s.nodes.map(n=>n.id===id?{...n,lastTouched:now,sessions:[...(n.sessions||[]),{ts:now,dur,note:'Focus session',mood}]}:n)})); }
  skipFocus=()=>{ const el=Math.round(((this.state.focusTotal||0)-(this.state.focusLeft||0))/60); if(el>=1)this._logFocus(el,'ok'); this.closeFocus(); };
  closeFocus=()=>{ if(this._focus){clearInterval(this._focus);this._focus=null;} this.setState({focusOpen:false,focusMinimized:false,focusRunning:false,focusDone:false,focusStepText:'',focusRouteNodeId:null}); };
  completeFocus=()=>{ const dur=Math.round((this.state.focusTotal||0)/60), routeNodeId=this.state.focusRouteNodeId, interestId=this.state.focusNodeId; this._logFocus(dur,'up'); this.setState(s=>({focusRunning:false,focusDone:true,nodes:routeNodeId?s.nodes.map(n=>n.id===interestId&&n.routeMap?{...n,routeMap:{...n.routeMap,nodes:n.routeMap.nodes.map(r=>r.id===routeNodeId?{...r,done:true}:r)}}:n):s.nodes})); setTimeout(()=>this.setState({focusOpen:false,focusMinimized:false,focusDone:false,focusRouteNodeId:null}),2800); };
  closeResult = () => { this.setState({ resultOpen:false }); this.go('/canvas'); };

  // filter selections
  pickFilter = (key, val) => this.setState(s => ({ filters:{ ...s.filters, [key]: val } }));
  runFilter = () => {
    const { time, energy, mood } = this.state.filters;
    const ex = this.state.excluded || [];
    let pool = this.state.nodes.filter(n => !ex.includes(n.id) && !['resting','harvested','released'].includes(n.season));
    if (!pool.length) pool = this.state.nodes.filter(n=>!['harvested','released'].includes(n.season));
    const moodCluster = { learn:'learn', make:'craft', rest:'body' };
    if (mood && moodCluster[mood]) {
      const m = pool.filter(n => n.cluster === moodCluster[mood]);
      if (m.length) pool = m;
    }
    const want = energy === 'low' ? 1 : energy === 'high' ? 3 : energy === 'med' ? 2 : null;
    if (want != null) pool.sort((a,b)=> Math.abs((a.energy||2)-want) - Math.abs((b.energy||2)-want));
    else pool.sort((a,b)=> (b.energy||0)-(a.energy||0));
    if (time === 'quick') pool.sort((a,b)=> (a.energy||2)-(b.energy||2));
    const pick = pool[0] || this.state.nodes[0];
    if (!pick) { this.setState({ phase:null }); return; }
    const bits = [time && (time==='quick'?'a quick win':'a deep block'), energy && energy+' energy', mood && mood].filter(Boolean);
    this.setState({ decideMode:'filter' });
    this.landOn(pick, bits.length ? 'best match for '+bits.join(' · ') : 'your best match right now');
    this.setState({ phase:null });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.cloudRevision!==this.props.cloudRevision&&this.props.cloudDocument){
      this._cloudRevision=this.props.cloudRevision;
      this.applyCloudDocument(this.props.cloudDocument);
      return;
    }
    if(prevProps.pathname!==this.props.pathname)this.applyRoute(this.props.pathname);
    const s = this.state;
    try { const j = JSON.stringify(s.nodes); if (j !== this._saved) { localStorage.setItem('skein.nodes.v1', j); this._saved = j; } } catch(e){}
    try { const je = JSON.stringify(s.edges); if (je !== this._savedE) { localStorage.setItem('skein.edges.v1', je); this._savedE = je; } } catch(e){}
    try { const jg = JSON.stringify({customGroups:s.customGroups, emptyFrames:s.emptyFrames, labelOverrides:s.labelOverrides}); if (jg !== this._savedG) { localStorage.setItem('skein.groups.v1', jg); this._savedG = jg; } } catch(e){}
    if(this.props.onDocumentChange){
      const document=canvasDocumentFromState(s), snapshot=JSON.stringify(document);
      if(snapshot!==this._syncSnapshot){this._syncSnapshot=snapshot;this.props.onDocumentChange(document);}
    }
  }

  // ---- derived render values ----
  derive() {
    const A = this.ACCENT;
    const s = this.state;
    const byId = {}; s.nodes.forEach(n => byId[n.id] = n);
    const cx = n => n.x + this.NW/2;
    const cy = n => n.y + this.NHc;

    const nodes = s.nodes.map(n => {
      const chosen = s.chosenId === n.id;
      const active = s.spinning && s.spinId === n.id;
      const selected = s.selectedId === n.id || (s.selectedIds && s.selectedIds.includes(n.id));
      const pending = s.pendingConnect === n.id;
      let shadow = '2px 3px 0 rgba(58,64,69,.14)';
      if (active) shadow = '2px 3px 0 rgba(58,64,69,.14), 0 0 0 8px rgba(122,154,111,.28)';
      else if (chosen) shadow = '2px 3px 0 rgba(58,64,69,.14), 0 0 0 6px rgba(122,154,111,.20)';
      else if (selected || pending) shadow = '2px 3px 0 rgba(58,64,69,.14), 0 0 0 4px rgba(122,154,111,.30)';
      const gcolor = this.groupColor(n.cluster);
      const directionBadge=n.directionState==='directed'?{icon:'↗',label:'directed'}:n.directionState==='open'?{icon:'∞',label:'open-ended'}:{icon:'?',label:'unclear'};
      return {
        ...n, chosen, color:gcolor, directionBadge, routeCount:n.routeMap?(n.routeMap.nodes||[]).filter(x=>!['origin','destination'].includes(x.type)).length:0,
        shadow,
        anim: chosen && !s.spinning ? 'callPulse 3s ease-in-out infinite' : 'none',
        opacity:n.season==='resting'?.62:1,
        onDown: (e)=>this.startDrag(e, n.id),
        onExpand: ()=>this.openExpanded(n.id),
        dots: [1,2,3].map(k => ({ bg: k <= (n.energy||0) ? gcolor : '#cbd0d2' })),
      };
    });

    const portOf=(n,tx,ty)=>{ const px=n.x+77, py=n.y+48, dx=tx-px, dy=ty-py; if(Math.abs(dx)>=Math.abs(dy)) return dx>=0?{x:n.x+154,y:py}:{x:n.x,y:py}; return dy>=0?{x:px,y:n.y+96}:{x:px,y:n.y}; };
    const edges = s.edges.filter(e=>byId[e.a]&&byId[e.b]).map((e,i)=>{
      const A1=byId[e.a], B1=byId[e.b];
      const acx=A1.x+77, acy=A1.y+48, bcx=B1.x+77, bcy=B1.y+48;
      const pA=portOf(A1,bcx,bcy), pB=portOf(B1,acx,acy);
      const x1=pA.x, y1=pA.y, x2=pB.x, y2=pB.y;
      const dx=x2-x1, dy=y2-y1, dist=Math.hypot(dx,dy)||1;
      const off=Math.max(18, Math.min(dist*0.13, 80)) * (i%2? 1:-1);
      const nx=-dy/dist, ny=dx/dist;
      const c1x=x1+dx/3+nx*off, c1y=y1+dy/3+ny*off;
      const c2x=x1+2*dx/3+nx*off, c2y=y1+2*dy/3+ny*off;
      return { key:e.a+'~'+e.b, d:`M${x1} ${y1} C${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`, onRemove:()=>this.removeEdge(e.a,e.b) };
    });
    const ports=[];
    s.nodes.forEach(n=>{
      const px=n.x+77, py=n.y+48;
      const pts=[[px,n.y],[n.x+154,py],[px,n.y+96],[n.x,py]];
      pts.forEach(([qx,qy])=>ports.push({ x:qx-5, y:qy-5, onDown:(e)=>this.startConnectDrag(e, n.id, qx, qy) }));
    });

    const allGroupKeys = [...new Set([ ...s.nodes.map(n=>n.cluster), ...s.customGroups.map(g=>g.key), ...Object.keys(s.emptyFrames) ])];
    const clusterBoxes = allGroupKeys.map(key => {
      const b = this.clusterBoundsFor(key, s.nodes) || (s.emptyFrames[key] ? s.emptyFrames[key] : null);
      if (!b) return null;
      const color = this.groupColor(key);
      const isCustom = s.customGroups.some(g=>g.key===key);
      const empty = !s.nodes.some(n=>n.cluster===key);
      return { key, x:b.x, y:b.y, w:b.w, h:b.h, lx:b.x+16, ly:b.y-16,
        label:this.groupLabel(key), color, wash:this.hexA(color,0.07), border:this.hexA(color,0.6), labelColor:this.hexA(color,0.95),
        onGroupDown:(e)=>this.startGroupDrag(e, key), onLabelClick:()=>this.beginRenameGroup(key),
        editing: s.editingGroup===key, notEditing: s.editingGroup!==key, isCustom, empty, canDelete:isCustom, onRemove:()=>this.removeGroup(key) };
    }).filter(Boolean);

    const mk = (key,val,label)=>{
      const sel = s.filters[key]===val;
      return { label, onSelect:()=>this.pickFilter(key,val),
        bg: sel? A : '#fbfbfa', color: sel? '#fff':'#2b3034', border: sel? A:'#b7bec1' };
    };
    const filterGroups = [
      { q:'how much time?', options:[ mk('time','quick','a quick win (<30m)'), mk('time','deep','a deep block (1h+)') ] },
      { q:'energy level?',  options:[ mk('energy','low','low'), mk('energy','med','medium'), mk('energy','high','high') ] },
      { q:'what mood?',     options:[ mk('mood','learn','learn / absorb'), mk('mood','make','make / ship'), mk('mood','rest','nourish / rest') ] },
    ];

    const sel = byId[s.selectedId];
    const clusterKeys = [ ...this.themes.map(t=>[t.key, this.groupLabel(t.key)]), ['other',this.groupLabel('other')], ...s.customGroups.map(g=>[g.key, this.groupLabel(g.key)]) ];
    let selData = null;
    if (sel) {
      const postureLabels={explore:'explore',practice:'practice',build:'build',maintain:'maintain'};
      const stateLabels={directed:'↗ directed',open:'∞ open-ended',unclear:'? unclear'};
      const seasonLabels={active:'active',warm:'warm',resting:'resting'};
      const frontier=this.routeFrontierInfo(sel);
      selData = {
        id:sel.id,label: sel.label, meta: sel.meta || '', note: sel.note || '', posture:sel.posture,directionState:sel.directionState,direction:sel.direction||'',currentPosition:sel.currentPosition||'',season:sel.season,
        dots: [1,2,3].map(k => ({ bg: k <= (sel.energy||0) ? A : '#cbd0d2', onClick:()=>this.setEnergy(sel.id,k) })),
        clusterChips: clusterKeys.map(([k,lab]) => { const on = sel.cluster===k; const col=this.groupColor(k); return { key:k,label:lab,active:on,tone:col,onSelect:()=>this.setCluster(sel.id,k),bg:on?col:'#fbfbfa',color:on?'#fff':'#2b3034',border:on?col:'#b7bec1' }; }),
        postureChips:Object.keys(postureLabels).map(k=>{const on=sel.posture===k;return{label:postureLabels[k],onSelect:()=>this.setPosture(sel.id,k),bg:on?A:'#fbfbfa',color:on?'#fff':'#2b3034',border:on?A:'#b7bec1'};}),
        directionStateChips:Object.keys(stateLabels).map(k=>{const on=sel.directionState===k;return{label:stateLabels[k],onSelect:()=>this.setDirectionState(sel.id,k),bg:on?(k==='open'?'#b0975a':A):'#fbfbfa',color:on?'#fff':'#2b3034',border:on?(k==='open'?'#b0975a':A):'#b7bec1'};}),
        seasonChips:Object.keys(seasonLabels).map(k=>{const on=sel.season===k;return{label:seasonLabels[k],onSelect:()=>this.setSeason(sel.id,k),bg:on?(k==='resting'?'#8a9196':A):'#fbfbfa',color:on?'#fff':'#2b3034',border:on?(k==='resting'?'#8a9196':A):'#b7bec1'};}),
        directionPrompt:sel.directionState==='open'?'what do you want this to keep giving you?':sel.posture==='explore'?'what would satisfy your curiosity for now?':sel.posture==='practice'?'what would you like to be able to do?':sel.posture==='build'?'what do you want to exist?':'what rhythm or condition would feel like enough?',
        step: this.firstStepText(sel),
        steps: this.mapSteps(sel), routeFrontier:frontier?{...frontier,onToggle:()=>this.toggleRouteNodeForInterest(sel.id,frontier.routeNodeId),onOpen:()=>this.openRouteMap(sel.id)}:null, noSteps: !(sel.steps&&sel.steps.length),
        onAddStep: ()=>this.addStep(sel.id), onStepKey: (e)=>{ if(e.key==='Enter') this.addStep(sel.id); }, onSuggest: ()=>this.suggestStep(sel.id),
        onOpenRoute:()=>this.openRouteMap(sel.id),onCreateGroup:(label)=>this.createGroupForInterest(sel.id,label),routeCount:sel.routeMap?(sel.routeMap.nodes||[]).filter(x=>!['origin','destination'].includes(x.type)).length:0,
        touched: sel.lastTouched ? this.since(sel.lastTouched) : 'not yet',
      };
    }
    const routeInterest=byId[s.routeMapOpenId];
    let route=null;
    if(routeInterest&&routeInterest.routeMap){
      const map=routeInterest.routeMap;
      const blockingRelationships=new Set(['requires','unlocks','produces']);
      const routeNodes=map.nodes.map(n=>{
        const blockedBy=(map.edges||[]).filter(e=>e.to===n.id&&blockingRelationships.has(e.relationship||'unlocks')).map(e=>map.nodes.find(x=>x.id===e.from)).filter(x=>x&&!x.done).map(x=>x.label);
        return {...n,blockedBy,reachable:this.routeReachable(map,n),onToggle:()=>this.toggleRouteNode(n.id),onAdd:()=>this.beginRouteAdd(n.id),onMoveStart:this.beginRouteNodeMove,onMove:(x,y)=>this.moveRouteNode(n.id,x,y)};
      });
      const parent=map.nodes.find(n=>n.id===s.routeAddParent);
      route={interest:routeInterest,map:{...map,nodes:routeNodes},busy:s.routeDraftBusy,error:s.routeDraftError,canTidy:map.nodes.some(n=>Number.isFinite(n.x)||Number.isFinite(n.y)),onClose:this.closeRouteMap,onGenerate:this.generateRouteDraft,onAccept:this.acceptRouteDraft,onAutoArrange:this.autoArrangeRoute,onBeginAdd:this.beginRouteAdd,addOpen:!!s.routeAddParent,addParentLabel:parent?parent.label:'',addLabel:s.routeAddLabel,onAddLabel:this.onRouteAddLabel,addType:s.routeAddType,typeChips:['task','milestone','capability','resource','experiment','decision'].map(type=>({type,label:type,onSelect:()=>this.setRouteAddType(type),active:s.routeAddType===type})),onAddNode:this.addRouteNode,onCancelAdd:this.cancelRouteAdd};
    }
    const chosen = byId[s.chosenId];
    const touchedNodes = s.nodes.filter(n=>n.lastTouched&&!['resting','harvested','released'].includes(n.season));
    let hasNeglect=false, neglectNote='';
    if (touchedNodes.length) {
      const nn = s.nodes.filter(n=>!['resting','harvested','released'].includes(n.season)).sort((a,b)=>(a.lastTouched||0)-(b.lastTouched||0))[0];
      if(nn){
        const d = this.daysSince(nn);
        if (d === null) { hasNeglect=true; neglectNote = '\u201c' + nn.label + '\u201d is still an open thread, if it feels alive today.'; }
        else if (d >= 7) { hasNeglect=true; neglectNote = '\u201c' + nn.label + '\u201d has been quiet for ' + d + ' days. Resume it only if it still calls.'; }
      }
    }
    return {
      selOpen: !!sel, sel: selData,
      onRenameInput:this.onRenameInput, onMetaInput:this.onMetaInput, onNoteInput:this.onNoteInput,onDirectionInput:this.onDirectionInput,onCurrentPositionInput:this.onCurrentPositionInput,
      markTouched:this.markTouched, deleteSelected:this.deleteSelected, closeDrawer:this.closePopover,
      nodes, edges, clusterBoxes, filterGroups,
      isEmpty: s.nodes.length === 0,
      adding: s.adding, addX: s.addX, addY: s.addY, newLabel: s.newLabel,
      addPrioChips: [[1,'low'],[2,'med'],[3,'high']].map(([p,lab]) => { const on=(s.newPriority||2)===p; return { label:lab, onSelect:()=>this.setNewPriority(p), bg:on?'#7a9a6f':'#fbfbfa', color:on?'#fff':'#2b3034', border:on?'#7a9a6f':'#b7bec1' }; }),
      commitAddBtn: this.commitAdd,
      setCanvas:this.setCanvas, focusAdd:this.focusAdd,
      onCanvasClick:this.onCanvasClick, onNewLabelInput:this.onNewLabelInput, onAddKey:this.onAddKey,
      dumpOpen: s.dumpOpen, dumpText: s.dumpText,
      toggleDump:this.toggleDump, onDumpInput:this.onDumpInput, scatterDump:this.scatterDump,
      addThoughtCenter:this.addThoughtCenter, autoGroup:this.autoGroup,
      addGroup:this.addGroup, editingGroup:s.editingGroup, groupName:s.groupName,
      onGroupNameInput:this.onGroupNameInput, onGroupNameKey:this.onGroupNameKey,
      connectMode:s.connectMode, toggleConnect:this.toggleConnect,
      connectBg: s.connectMode ? A : '#fbfbfa', connectColor: s.connectMode ? '#fff' : '#2b3034',
      panX:s.panX, panY:s.panY, zoom:s.zoom, zoomPct:Math.round(s.zoom*100), zoomIn:this.zoomIn, zoomOut:this.zoomOut, onCanvasWheel:this.onCanvasWheel, zoomReset:this.zoomReset, rewire:s.rewire, ports,
      canvasCursor: s.panning ? 'grabbing' : (s.connectMode ? 'pointer' : ((s.tool==='hand'||s.spacePan) ? 'grab' : 'crosshair')),
      setViewport:this.setViewport, onCanvasPointerDown:this.onCanvasPointerDown,
      selectTool:this.selectTool, handTool:this.handTool,
      toolSelBg: s.tool==='select' ? A : '#fbfbfa', toolSelColor: s.tool==='select' ? '#fff' : '#2b3034',
      toolHandBg: s.tool==='hand' ? A : '#fbfbfa', toolHandColor: s.tool==='hand' ? '#fff' : '#2b3034',
      modalOpen: s.phase != null, phaseMenu: s.phase==='menu', phaseFilter: s.phase==='filter',
      openDecide:this.openDecide, closeDecide:this.closeDecide, startFilter:this.startFilter,
      startShuffle:this.startShuffle, runFilter:this.runFilter,
      spinning: s.spinning,
      resultOpen: s.resultOpen,
      chosenLabel: chosen ? chosen.label : '', chosenReason: s.chosenReason, chosenStep: s.chosenStep, chosenDoneWhen:s.chosenDoneWhen,chosenDuration:s.chosenDuration,chosenStepSource:s.chosenStepSource,chosenStepBusy:s.chosenStepBusy, chosenWhy: s.chosenWhy,
      hasCombo: !!s.chosenCombo, chosenCombo: s.chosenCombo, chosenComboPartner: s.chosenComboPartner,
      notToday:this.notToday, startThis:this.startThis, closeResult:this.closeResult,
      hasNeglect, neglectNote,
      undo:this.undo, redo:this.redo,
      stepDraft:s.stepDraft, onStepDraft:this.onStepDraft, aiBusy:s.aiBusy,
      expandedId:s.expandedId, exp:this.detailFor(byId[s.expandedId]),
      expandCurrent:this.expandCurrent, closeExpanded:this.closeExpanded, collapseDrawer:this.collapseDrawer,
      logToday:this.logToday, openLog:this.openLog, closeLog:this.closeLog, submitLog:this.submitLog,
      onLogDur:this.onLogDur, onLogNote:this.onLogNote, setLogMoodUp:()=>this.setLogMood('up'), setLogMoodOk:()=>this.setLogMood('ok'), setLogMoodDown:()=>this.setLogMood('down'),
      logOpen:s.logOpen, logDur:s.logDur, logNote:s.logNote,
      logMoodUp: s.logMood==='up', logMoodOk: s.logMood==='ok', logMoodDown: s.logMood==='down',
      pomoTxt: Math.floor((s.pomoSec||0)/60)+':'+String((s.pomoSec||0)%60).padStart(2,'0'), pomoRunning:s.pomoRunning,
      focusVisible: s.focusOpen && !s.focusMinimized, focusPill: s.focusOpen && s.focusMinimized, focusRunning: s.focusRunning, focusDone: s.focusDone,
      focusTimeTxt: Math.floor((s.focusLeft||0)/60)+':'+String((s.focusLeft||0)%60).padStart(2,'0'),
      focusRingDash: (((s.focusLeft||0)/(s.focusTotal||1))*(2*Math.PI*120)).toFixed(1)+' '+(2*Math.PI*120).toFixed(1),
      focusColor: byId[s.focusNodeId]?this.groupColor(byId[s.focusNodeId].cluster):'#7a9a6f',
      focusLabel: byId[s.focusNodeId]?byId[s.focusNodeId].label:'', focusStep:s.focusStepText||(byId[s.focusNodeId]?this.firstStepText(byId[s.focusNodeId]):''),
      focusEnergyTxt: (s.filters&&s.filters.energy)? ({low:'matched to low energy',med:'matched to medium energy',high:'matched to high energy'}[s.filters.energy]||'focus') : 'a 30-minute focus',
      focusPauseTxt: s.focusRunning?'pause':'resume',
      togglePauseFocus:this.togglePauseFocus, extendFocus:this.extendFocus, skipFocus:this.skipFocus, minimizeFocus:this.minimizeFocus, resumeFromPill:this.resumeFromPill,
      focusPresets: [15,25,30,50].map(m=>({ m, bg:(s.focusTotal===m*60)?'#7a9a6f':'transparent', color:(s.focusTotal===m*60)?'#fff':'#4c5257', border:(s.focusTotal===m*60)?'#7a9a6f':'#b7bec1', onSel:()=>this.setFocusMins(m) })),
      startPomo:this.startPomo, pausePomo:this.pausePomo, resetPomo:this.resetPomo,
      pomoIdle: !s.pomoRunning,
      moodUpBg: s.logMood==='up'?'#7a9a6f':'#fbfbfa', moodUpColor: s.logMood==='up'?'#fff':'#2b3034', moodUpBorder: s.logMood==='up'?'#7a9a6f':'#b7bec1',
      moodOkBg: s.logMood==='ok'?'#7a9a6f':'#fbfbfa', moodOkColor: s.logMood==='ok'?'#fff':'#2b3034', moodOkBorder: s.logMood==='ok'?'#7a9a6f':'#b7bec1',
      moodDownBg: s.logMood==='down'?'#7a9a6f':'#fbfbfa', moodDownColor: s.logMood==='down'?'#fff':'#2b3034', moodDownBorder: s.logMood==='down'?'#7a9a6f':'#b7bec1',
      showOnboarding:s.showOnboarding, onbOpacity:s.onbFading?0:1,
      headline:this.headlines[s.hIndex], hOpacity:s.hOpacity, inputVal:s.inputVal, weaving:s.weaving,
      onbInput:this.onbInput, onbKey:this.onbKey, weave:this.weave, loadExample:this.loadExample, toggleMic:this.toggleMic,
      micBg:s.listening?'#7a9a6f':'#f7f8f8', micStroke:s.listening?'#ffffff':'#3a4045', micAnim:s.listening?'micPulse 1.4s ease-in-out infinite':'none', micNote:s.weaving?'untangling your thoughts\u2026':(s.micUnsupported?'voice input needs Chrome or Edge \u2014 just type instead':(s.listening?'listening\u2026 speak your tangle of thoughts':'')),
      onbChips:this.examples.map(ex=>({short:ex.short,onClick:()=>this.fillExample(ex.full)})),
      route,
    };
  }

  render() {
    const v = this.derive();
    return (
      <div className="flex h-dvh flex-col overflow-hidden font-sans">
        <svg width="0" height="0" className="pointer-events-none absolute">
          <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4"/></filter>
          <filter id="edge"><feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8"/></filter>
        </svg>

        {/* canvas */}
        <div ref={v.setCanvas} onClick={v.onCanvasClick} onPointerDown={v.onCanvasPointerDown} className="relative flex-auto touch-none overflow-hidden bg-[radial-gradient(#c8ced1_1px,transparent_1px)] bg-[size:26px_26px]" style={{ cursor: v.canvasCursor }}>
          <div ref={v.setViewport} className="absolute inset-0 origin-top-left" style={{ transform: `translate(${v.panX}px, ${v.panY}px) scale(${v.zoom})` }}>

            {/* cluster enclosures */}
            {v.clusterBoxes.map(c => (
              <React.Fragment key={c.key}>
                <div className="pointer-events-none absolute z-[1] rounded-[30px_24px_32px_26px] border-[1.4px] border-dashed [filter:url(#rough)]" style={{ left: c.x, top: c.y, width: c.w, height: c.h, background: c.wash, borderColor: c.border }}></div>
                <div className="absolute z-[4] flex select-none items-center gap-2 rounded-[9px_8px_10px_8px] border-[1.4px] bg-[#f4f6f7] pt-1 pr-[11px] pb-[5px] pl-[9px] shadow-[1px_2px_0_rgba(58,64,69,.08)]" style={{ left: c.lx, top: c.ly, borderColor: c.border }}>
                  <span onPointerDown={c.onGroupDown} title="drag to move · click to rename" className="h-[9px] w-[9px] flex-none cursor-grab touch-none rounded-full" style={{ background: c.color }}></span>
                  {c.editing ? (
                    <input value={v.groupName} onChange={v.onGroupNameInput} onKeyDown={v.onGroupNameKey} ref={v.focusAdd} className="w-[130px] border-none bg-transparent font-hand text-lg font-bold outline-none" style={{ color: c.labelColor }}/>
                  ) : (
                    <span onPointerDown={c.onGroupDown} title="drag to move · click to rename" className="cursor-grab touch-none font-hand text-lg font-bold leading-none" style={{ color: c.labelColor }}>{c.label}</span>
                  )}
                  {c.canDelete && (
                    <span onClick={c.onRemove} title="delete group" className="ml-0.5 cursor-pointer text-base leading-none text-[#a4abae]">×</span>
                  )}
                </div>
              </React.Fragment>
            ))}

            {/* connectors */}
            <svg className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible" fill="none" strokeLinecap="round">
              {v.edges.map(e => (
                <path key={e.key} d={e.d} stroke="#9aa1a5" strokeWidth="1.3" opacity="0.85" filter="url(#edge)"></path>
              ))}
            </svg>

            {/* connect-mode edge hit targets (tap to remove) */}
            {v.connectMode && (
              <svg className="absolute inset-0 z-[4] h-full w-full overflow-visible" fill="none">
                {v.edges.map(e => (
                  <path key={e.key} d={e.d} stroke="transparent" strokeWidth="16" className="cursor-pointer [pointer-events:stroke]" onClick={e.onRemove}></path>
                ))}
              </svg>
            )}

            {v.rewire && (
              <svg className="pointer-events-none absolute inset-0 z-[6] h-full w-full overflow-visible" fill="none">
                <line x1={v.rewire.x1} y1={v.rewire.y1} x2={v.rewire.x2} y2={v.rewire.y2} stroke="#7a9a6f" strokeWidth="1.8" strokeDasharray="5 5" strokeLinecap="round"></line>
              </svg>
            )}

            {v.connectMode && (
              <div className="pointer-events-none absolute inset-0 z-[7]">
                {v.ports.map((p, i) => (
                  <div key={i} onPointerDown={p.onDown} title="drag to connect" className="pointer-events-auto absolute h-2.5 w-2.5 cursor-crosshair touch-none rounded-full border-[1.6px] border-accent bg-panel shadow-[1px_1px_0_rgba(58,64,69,.12)]" style={{ left: p.x, top: p.y }}></div>
                ))}
              </div>
            )}

            {/* nodes */}
            {v.nodes.map(n => (
              <div key={n.id} onPointerDown={n.onDown} onDoubleClick={n.onExpand} className="absolute z-[5] flex h-24 w-[154px] cursor-grab touch-none flex-col rounded-[11px_8px_12px_7px] border-[1.6px] border-ink-line bg-paper-2 px-[13px] py-[11px]" style={{ left: n.x, top: n.y, boxShadow: n.shadow, animation: n.anim, opacity:n.opacity }}>
                {n.chosen && (
                  <div className="absolute -top-[11px] -right-2 rounded-[9px_7px_9px_6px] bg-accent px-2 py-0.5 text-[10px] font-semibold text-white shadow-[1px_2px_0_rgba(58,64,69,.15)]">start here</div>
                )}
                <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-[1.4px] border-[rgba(58,64,69,.3)]" style={{ background: n.color }}></div>
                <div title={n.label} className="line-clamp-2 max-h-10 overflow-hidden pr-4 text-[17px] leading-[1.15] font-semibold text-ink">{n.label}</div>
                <div className="mt-0.5 truncate pr-1 text-[11px] text-[#90999d]">{n.meta}</div>
                <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5">
                  <span className="flex shrink-0 items-center gap-1 text-[9px] font-semibold text-muted"><span>{n.directionBadge.icon}</span><span>{n.directionBadge.label}</span></span>
                  <span className="flex min-w-0 items-center gap-1">
                    <span className={n.routeCount>0?'sr-only':'mr-0.5 text-[10px] text-[#90999d]'}>energy</span>
                    {n.dots.map((d, i) => (<span key={i} className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: d.bg }}></span>))}
                    {n.routeCount>0&&<span className="ml-0.5 whitespace-nowrap text-[9px] font-semibold text-accent-deep">map · {n.routeCount}</span>}
                  </span>
                </div>
              </div>
            ))}

            {/* inline add-a-thought input */}
            {v.adding && (
              <div className="absolute z-[12] w-[190px] animate-[fadeUp_.16s_ease] rounded-[11px_8px_12px_7px] border-[1.8px] border-accent bg-paper-2 px-2.5 py-2 shadow-[2px_3px_0_rgba(58,64,69,.16)]" style={{ left: v.addX, top: v.addY }}>
                <input value={v.newLabel} onChange={v.onNewLabelInput} onKeyDown={v.onAddKey} ref={v.focusAdd} placeholder="a thought…" className="w-full border-none bg-transparent text-[15px] font-semibold text-ink outline-none"/>
                <div className="mt-2 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {v.addPrioChips.map(p => (
                      <button key={p.label} onClick={p.onSelect} className="cursor-pointer rounded-[7px] border-[1.3px] px-[7px] py-0.5 text-[10px] font-semibold" style={{ color: p.color, background: p.bg, borderColor: p.border }}>{p.label}</button>
                    ))}
                  </div>
                  <button onClick={v.commitAddBtn} className="cursor-pointer rounded-lg border-[1.4px] border-ink-line bg-accent px-2.5 py-1 text-[11px] font-bold text-white">add</button>
                </div>
                <div className="mt-1 text-[10px] text-[#a4abae]">enter to add · esc to cancel</div>
              </div>
            )}

          </div>{/* /viewport */}

          {/* empty hint */}
          {v.isEmpty && (
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-[3] w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="font-hand text-[30px] text-muted">a quiet, empty canvas</div>
              <div className="mt-1.5 text-sm text-[#a4abae]">click anywhere to drop a thought — or use brain&nbsp;dump</div>
            </div>
          )}

          {/* spinning toast */}
          {v.spinning && (
            <div className="pointer-events-none absolute bottom-[calc(max(12px,env(safe-area-inset-bottom))+76px)] left-1/2 z-[22] -translate-x-1/2 animate-[fadeUp_.2s_ease] whitespace-nowrap rounded-[13px] border border-white/15 bg-ink px-[22px] py-3 font-hand text-2xl font-bold text-white shadow-[3px_4px_0_rgba(0,0,0,.2)] sm:bottom-[104px]">choosing a thread…</div>
          )}
        </div>

        <DecideFlow v={v}/>
        <BrainDump v={v}/>
        <DetailDrawer v={v}/>
        <RouteMap v={v}/>

        {/* wordmark */}
        <div className="pointer-events-none fixed top-4 left-4 z-20 flex items-baseline gap-2.5 sm:top-5 sm:left-6">
          <span className="font-hand text-[26px] leading-none font-bold text-ink sm:text-[28px]">Skein</span>
          <span className="hidden text-xs text-[#a4abae] sm:inline">parallel interests, one calm canvas</span>
        </div>

        {/* connect hint */}
        {v.connectMode && (
          <div className="fixed top-14 left-1/2 z-[21] w-[calc(100%-24px)] -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-center text-[11px] font-semibold text-white shadow-[2px_3px_0_rgba(0,0,0,.18)] sm:top-5 sm:w-auto sm:whitespace-nowrap sm:text-[13px]">drag from a side dot to another card to link · tap a line to remove · esc to finish</div>
        )}

        <Toolbar v={v}/>
        <ExpandedDetail v={v}/>
        <FocusOverlay v={v}/>
        <Onboarding v={v}/>
      </div>
    );
  }
}
