(function(){
const HIST_LEN = 60;
let cpu=35, mem=52, errRate=1.2, reqRate=420, lat=45;
let spiking=false, leaking=false, errSpiking=false;
let cpuHist=[], memHist=[], errHist=[], reqHist=[];

function rnd(base,spread){ return Math.max(0,Math.min(100,base+(Math.random()-.5)*spread)); }

function tick(){
  cpu    = spiking    ? Math.min(98,cpu+(Math.random()*4))         : Math.max(5,Math.min(95,cpu+(Math.random()-.52)*3));
  mem    = leaking    ? Math.min(99,mem+(Math.random()*1.5))       : Math.max(20,Math.min(92,mem+(Math.random()-.51)*2));
  errRate= errSpiking ? Math.min(35,errRate+(Math.random()*3))     : Math.max(0,Math.min(8,errRate+(Math.random()-.55)*0.8));
  reqRate= Math.max(50,Math.min(900,reqRate+(Math.random()-.5)*40));
  lat    = Math.max(10,Math.min(800,lat+(Math.random()-.5)*20+(spiking?15:0)));

  cpuHist.push(cpu); memHist.push(mem); errHist.push(errRate); reqHist.push(reqRate);
  if(cpuHist.length>HIST_LEN) cpuHist.shift();
  if(memHist.length>HIST_LEN) memHist.shift();
  if(errHist.length>HIST_LEN) errHist.shift();
  if(reqHist.length>HIST_LEN) reqHist.shift();
  render();
}

function sparkPoints(hist,maxVal){
  if(!hist.length) return '';
  return hist.map((v,i)=>{
    const x=(i/(HIST_LEN-1))*200;
    const y=48-(v/maxVal)*48;
    return x+','+Math.max(1,Math.min(47,y));
  }).join(' ');
}

function el(id){ return document.getElementById(id); }

function setCard(id,val,thresh){
  const card=el(id);
  if(!card) return false;
  const firing = val>thresh;
  card.className='card'+(firing?' alert':val>(thresh*.85)?' warn':'');
  return firing;
}

function render(){
  const cpuT = +(el('cpu-thresh')||{value:80}).value||80;
  const memT = +(el('mem-thresh')||{value:85}).value||85;
  const errT = +(el('err-thresh')||{value:5}).value||5;

  function set(id,val){ const e=el(id); if(e) e.textContent=val; }
  function setCol(id,col){ const e=el(id); if(e) e.style.color=col; }
  function setAttr(id,attr,val){ const e=el(id); if(e) e.setAttribute(attr,val); }

  set('cpu-val',cpu.toFixed(1)); set('mem-val',mem.toFixed(1));
  set('err-val',errRate.toFixed(1)); set('req-val',Math.round(reqRate)); set('lat-val',Math.round(lat));
  set('cpu-thresh-disp',cpuT); set('mem-thresh-disp',memT); set('err-thresh-disp',errT);

  const cpuCol = cpu>cpuT?'var(--red)':cpu>cpuT*.85?'var(--yellow)':'var(--green)';
  const memCol = mem>memT?'var(--red)':mem>memT*.85?'var(--yellow)':'var(--blue)';
  const errCol = errRate>errT?'var(--red)':errRate>errT*.85?'var(--yellow)':'var(--purple)';

  setCol('cpu-val',cpuCol); setCol('mem-val',memCol); setCol('err-val',errCol);
  setAttr('cpu-line','stroke',cpuCol); setAttr('mem-line','stroke',memCol); setAttr('err-line','stroke',errCol);
  setAttr('cpu-line','points',sparkPoints(cpuHist,100));
  setAttr('mem-line','points',sparkPoints(memHist,100));
  setAttr('err-line','points',sparkPoints(errHist,50));
  setAttr('req-line','points',sparkPoints(reqHist,1000));

  const cpuFiring = setCard('cpu-card',cpu,cpuT);
  const memFiring = setCard('mem-card',mem,memT);
  const errFiring = setCard('err-card',errRate,errT);

  const alerts=[];
  if(cpuFiring) alerts.push('[CRITICAL] HighCPUUsage: '+cpu.toFixed(1)+'% > '+cpuT+'%');
  if(memFiring) alerts.push('[CRITICAL] HighMemoryUsage: '+mem.toFixed(1)+'% > '+memT+'%');
  if(errFiring) alerts.push('[WARNING] HighErrorRate: '+errRate.toFixed(1)+'% > '+errT+'%');

  const alertBox=el('mon-alert');
  const alertRows=el('mon-alert-rows');
  if(alertBox&&alertRows){
    alertBox.className='alert-box'+(alerts.length?' show':'');
    alertRows.innerHTML=alerts.map(a=>'<div class="alert-row"><div class="alert-dot"></div><span style="color:var(--red)">'+a+'</span></div>').join('');
  }

  const timeEl=el('mon-time');
  if(timeEl) timeEl.textContent=new Date().toLocaleTimeString('en',{hour12:false});
}

window.monSpike     = function(){ spiking=true;    setTimeout(()=>{spiking=false;},8000); };
window.monMemLeak   = function(){ leaking=true;    setTimeout(()=>{leaking=false;},10000); };
window.monErrSpike  = function(){ errSpiking=true; setTimeout(()=>{errSpiking=false;},7000); };
window.monNormalise = function(){ spiking=false;leaking=false;errSpiking=false;cpu=35;mem=52;errRate=1.2;reqRate=420;lat=45; };

window.monUpdateThresh = function(){
  const e1=el('cpu-thresh-disp'),e2=el('mem-thresh-disp'),e3=el('err-thresh-disp');
  if(e1) e1.textContent=(el('cpu-thresh')||{value:80}).value;
  if(e2) e2.textContent=(el('mem-thresh')||{value:85}).value;
  if(e3) e3.textContent=(el('err-thresh')||{value:5}).value;
  render();
};

window.monSetQ = function(q){ const e=el('prom-q'); if(e) e.value=q; };

window.monRunQuery = function(){
  const q=(el('prom-q')||{value:''}).value.trim();
  const res=el('prom-result');
  if(!res) return;
  if(q.includes('cpu')){
    res.textContent='node_cpu_usage_percent{instance="localhost:9100",job="node_exporter"}  '+cpu.toFixed(4);
  } else if(q.includes('memory')){
    res.textContent='node_memory_usage_percent{instance="localhost:9100",job="node_exporter"}  '+mem.toFixed(4);
  } else if(q.includes('error_rate')){
    res.textContent='http_error_rate_percent{instance="localhost:9100",job="node_exporter"}  '+errRate.toFixed(4);
  } else if(q.includes('requests')){
    res.textContent='rate(http_requests_total{instance="localhost:9100"}[1m])  '+reqRate.toFixed(4);
  } else if(q.includes('up')){
    res.textContent='up{instance="localhost:9100",job="node_exporter"}  1';
  } else {
    res.style.color='var(--red)';
    res.textContent='Error: unknown metric "'+q+'"\nHint: try node_cpu_usage_percent';
    setTimeout(()=>{ res.style.color='var(--green)'; },1500);
  }
};

// Seed history
for(let i=0;i<HIST_LEN;i++){
  cpuHist.push(rnd(35,15)); memHist.push(rnd(52,10));
  errHist.push(rnd(1.2,1)); reqHist.push(rnd(420,80));
}
render();
setInterval(tick,2000);
})();
