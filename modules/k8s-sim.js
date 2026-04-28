(function(){
const NODES = [
  {id:'node-1', label:'worker-node-1', pods:[], maxPods:6, failed:false},
  {id:'node-2', label:'worker-node-2', pods:[], maxPods:6, failed:false},
  {id:'node-3', label:'worker-node-3', pods:[], maxPods:6, failed:false},
];
const DEPLOYMENTS = {};
let podCounter = 0;
const EMOJIS = {nginx:'🌐',node:'💚',redis:'❤️',postgres:'🐘',python:'🐍'};

function log(msg, type='info'){
  const box = document.getElementById('k8s-log');
  if(!box) return;
  const t = new Date().toLocaleTimeString('en',{hour12:false});
  const el = document.createElement('div');
  el.className = 'log-' + type;
  el.textContent = t + '  ' + msg;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function getAvailableNode(){
  const available = NODES.filter(n => !n.failed && n.pods.length < n.maxPods);
  if(!available.length) return null;
  return available.sort((a,b) => a.pods.length - b.pods.length)[0];
}

function createPod(depName, image){
  return {
    id: 'pod-' + (++podCounter),
    name: depName + '-' + Math.random().toString(36).slice(2,7),
    image, dep: depName, status:'pending'
  };
}

function schedulePod(pod){
  const node = getAvailableNode();
  if(!node){ log('No available nodes — pod stuck in Pending','warn'); return null; }
  log('scheduler → assigned ' + pod.name + ' to ' + node.label, 'info');
  node.pods.push(pod);
  setTimeout(()=>{ pod.status = 'running'; log('kubelet → ' + pod.name + ' running on ' + node.label,'ok'); render(); }, 800 + Math.random()*600);
  return node;
}

window.k8sDeploy = function(){
  const name = document.getElementById('k8s-dep-name').value.trim() || 'my-app';
  const image = document.getElementById('k8s-dep-image').value;
  const replicas = Math.min(9, Math.max(1, parseInt(document.getElementById('k8s-dep-replicas').value)||3));
  log('apiserver → Deployment/' + name + ' applied (replicas: ' + replicas + ')', 'info');
  if(DEPLOYMENTS[name]){
    const dep = DEPLOYMENTS[name];
    const current = dep.replicas;
    dep.replicas = replicas; dep.image = image;
    if(replicas > current){
      for(let i=0; i<replicas-current; i++){
        const pod = createPod(name, image);
        dep.pods.push(pod); schedulePod(pod);
      }
    } else if(replicas < current){
      let toRemove = current - replicas;
      dep.pods.filter(p=>p.status==='running').slice(0,toRemove).forEach(p=>{
        p.status='terminating';
        log('controller-manager → terminating ' + p.name,'warn');
        setTimeout(()=>{ dep.pods = dep.pods.filter(x=>x.id!==p.id); NODES.forEach(n=>{n.pods=n.pods.filter(x=>x.id!==p.id);}); render(); },800);
      });
    }
  } else {
    DEPLOYMENTS[name] = {name, image, replicas, pods:[]};
    for(let i=0; i<replicas; i++){
      const pod = createPod(name, image);
      DEPLOYMENTS[name].pods.push(pod);
      setTimeout(()=>{ schedulePod(pod); render(); }, i*120);
    }
  }
  render();
};

window.k8sKillRandom = function(){
  const allRunning = NODES.flatMap(n=>n.pods.filter(p=>p.status==='running'));
  if(!allRunning.length){ log('No running pods to kill','warn'); return; }
  const pod = allRunning[Math.floor(Math.random()*allRunning.length)];
  pod.status='terminating';
  log('Pod ' + pod.name + ' killed (simulated crash)','err');
  render();
  setTimeout(()=>{
    NODES.forEach(n=>{ n.pods=n.pods.filter(p=>p.id!==pod.id); });
    const dep = DEPLOYMENTS[pod.dep];
    if(dep){
      dep.pods = dep.pods.filter(p=>p.id!==pod.id);
      log('controller-manager → desired='+dep.replicas+', creating replacement','warn');
      const newPod = createPod(dep.name, dep.image);
      dep.pods.push(newPod); schedulePod(newPod);
    }
    render();
  },800);
};

window.k8sNodeFailure = function(){
  const healthy = NODES.filter(n=>!n.failed);
  if(healthy.length <= 1){ log('Cannot fail last healthy node','warn'); return; }
  const node = healthy[Math.floor(Math.random()*healthy.length)];
  node.failed = true;
  log(node.label + ' went offline!','err');
  const evicted = [...node.pods];
  node.pods = [];
  evicted.forEach(pod=>{
    log('evicting ' + pod.name + ' from failed node','warn');
    const dep = DEPLOYMENTS[pod.dep];
    if(dep) dep.pods = dep.pods.filter(p=>p.id!==pod.id);
  });
  render();
  setTimeout(()=>{
    evicted.forEach((pod,i)=>{
      setTimeout(()=>{
        if(DEPLOYMENTS[pod.dep]){
          const newPod = createPod(pod.dep, pod.image);
          DEPLOYMENTS[pod.dep].pods.push(newPod);
          log('scheduler → rescheduling ' + newPod.name,'info');
          schedulePod(newPod); render();
        }
      }, i*200);
    });
    setTimeout(()=>{ node.failed=false; log(node.label+' recovered','ok'); render(); },4000);
  },1500);
};

window.k8sRollingUpdate = function(){
  const deps = Object.values(DEPLOYMENTS);
  if(!deps.length){ log('No deployments to update','warn'); return; }
  const dep = deps[0];
  const images = ['nginx','node','redis','postgres','python'];
  const newImage = images[(images.indexOf(dep.image)+1)%images.length];
  log('Rolling update: ' + dep.name + ' to ' + newImage,'info');
  let i=0;
  const running = dep.pods.filter(p=>p.status==='running');
  function updateNext(){
    if(i>=running.length) return;
    const old = running[i++];
    old.status='terminating';
    render();
    setTimeout(()=>{
      dep.pods = dep.pods.filter(p=>p.id!==old.id);
      NODES.forEach(n=>{ n.pods=n.pods.filter(p=>p.id!==old.id); });
      const newPod = createPod(dep.name, newImage);
      dep.pods.push(newPod); dep.image=newImage;
      schedulePod(newPod); render();
      setTimeout(updateNext,900);
    },600);
  }
  updateNext();
};

window.k8sHPASpike = function(){
  const deps = Object.values(DEPLOYMENTS);
  if(!deps.length){ log('Deploy something first','warn'); return; }
  const dep = deps[0];
  const orig = dep.replicas;
  log('HPA: CPU spike — scaling from '+orig+' to '+Math.min(orig+3,9),'warn');
  document.getElementById('k8s-dep-name').value = dep.name;
  document.getElementById('k8s-dep-replicas').value = Math.min(orig+3,9);
  window.k8sDeploy();
  setTimeout(()=>{
    log('HPA: CPU normalised — scaling back to '+orig,'info');
    document.getElementById('k8s-dep-replicas').value = orig;
    window.k8sDeploy();
  },5000);
};

window.k8sKillPod = function(podId){
  NODES.forEach(n=>{
    const pod = n.pods.find(p=>p.id===podId);
    if(pod && pod.status==='running'){
      pod.status='terminating';
      log('Manually killed ' + pod.name,'err');
      render();
      setTimeout(()=>{
        n.pods = n.pods.filter(p=>p.id!==podId);
        const dep = DEPLOYMENTS[pod.dep];
        if(dep){
          dep.pods = dep.pods.filter(p=>p.id!==podId);
          const newPod = createPod(dep.name,dep.image);
          dep.pods.push(newPod); schedulePod(newPod);
        }
        render();
      },700);
    }
  });
};

window.k8sScaleDep = function(name, delta){
  const dep = DEPLOYMENTS[name];
  if(!dep) return;
  document.getElementById('k8s-dep-name').value = name;
  document.getElementById('k8s-dep-replicas').value = Math.max(0,Math.min(9,dep.replicas+delta));
  window.k8sDeploy();
};

window.k8sReset = function(){
  NODES.forEach(n=>{ n.pods=[]; n.failed=false; });
  Object.keys(DEPLOYMENTS).forEach(k=>delete DEPLOYMENTS[k]);
  podCounter=0;
  const box=document.getElementById('k8s-log');
  if(box) box.innerHTML='';
  log('Cluster reset','info');
  render();
};

function render(){
  const nodesEl = document.getElementById('k8s-nodes');
  if(!nodesEl) return;
  nodesEl.innerHTML = NODES.map(node=>{
    const usedPct = Math.round((node.pods.length/node.maxPods)*100);
    const barColor = node.failed ? 'var(--red)' : usedPct>80 ? 'var(--yellow)' : 'var(--green)';
    const cardCls = node.failed ? 'node-card' : usedPct>80 ? 'node-card pressure' : 'node-card';
    const podsHtml = node.pods.map(pod=>{
      const emoji = EMOJIS[pod.image]||'📦';
      return '<div class="pod '+pod.status+'" onclick="k8sKillPod(\''+pod.id+'\')" title="'+pod.name+'">'+emoji+'<div class="pod-tooltip">'+pod.name+'<br>'+pod.status+'</div></div>';
    }).join('');
    return '<div class="'+cardCls+'">'+
      '<div class="node-name"><span>'+node.label+(node.failed?' 💀':'')+'</span><span style="font-size:9px;color:'+barColor+'">'+node.pods.length+'/'+node.maxPods+'</span></div>'+
      '<div class="node-stats">'+(node.failed?'NotReady':'Ready · kubelet active')+'</div>'+
      '<div class="node-bar-wrap"><div class="node-bar" style="width:'+usedPct+'%;background:'+barColor+'"></div></div>'+
      '<div class="pods-wrap">'+podsHtml+(node.pods.length===0?'<span style="font-size:10px;color:var(--muted)">no pods</span>':'')+'</div>'+
    '</div>';
  }).join('');

  const depsEl = document.getElementById('k8s-deps');
  if(depsEl){
    const depList = Object.values(DEPLOYMENTS);
    if(!depList.length){
      depsEl.innerHTML='<div style="font-size:11px;color:var(--muted);padding:8px 0;">No deployments yet</div>';
    } else {
      depsEl.innerHTML = depList.map(dep=>{
        const running = dep.pods.filter(p=>p.status==='running').length;
        return '<div class="dep-row">'+
          '<span class="dep-name">'+dep.name+'</span>'+
          '<span style="font-size:10px;color:var(--muted)">'+EMOJIS[dep.image]+' '+dep.image+'</span>'+
          '<span class="dep-count">'+running+'/'+dep.replicas+'</span>'+
          '<div class="dep-scale">'+
            '<div class="scale-btn" onclick="k8sScaleDep(\''+dep.name+'\',-1)">−</div>'+
            '<div class="scale-btn" onclick="k8sScaleDep(\''+dep.name+'\',1)">+</div>'+
          '</div>'+
        '</div>';
      }).join('');
    }
  }

  const allPods = NODES.flatMap(n=>n.pods);
  const r=document.getElementById('k8s-stat-running');
  const pe=document.getElementById('k8s-stat-pending');
  const te=document.getElementById('k8s-stat-term');
  const ne=document.getElementById('k8s-stat-nodes');
  if(r) r.textContent=allPods.filter(p=>p.status==='running').length+' running';
  if(pe) pe.textContent=allPods.filter(p=>p.status==='pending'||p.status==='healing').length+' pending';
  if(te) te.textContent=allPods.filter(p=>p.status==='terminating').length+' terminating';
  if(ne) ne.textContent=NODES.filter(n=>!n.failed).length+'/'+NODES.length+' nodes ready';
}

log('Cluster initialised — 3 worker nodes ready','ok');
log('Deploy an app, then kill a pod and watch self-healing','info');
render();
})();
