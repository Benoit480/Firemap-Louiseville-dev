(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const core=window.fireMapInternal;
  if(!core)return;

  const CACHE="firemap-vehicle-usages-v1";
  const PENDING="firemap-vehicle-usages-pending-v1";
  const STATUS={
    station:"En caserne",
    enroute:"En route",
    onscene:"Arrivé sur les lieux",
    returning:"Retour vers caserne"
  };

  let usages=[];
  let cloudUnsub=null;

  const read=(key,fallback=[])=>{
    try{return JSON.parse(localStorage.getItem(key))||fallback}catch(_){return fallback}
  };
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const esc=v=>core.esc?core.esc(v):String(v??"");
  const uid=()=>crypto.randomUUID?crypto.randomUUID():`usage-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const vehicles=()=>window.fireMapVehicles?.getVehicles?.()||[];

  function canonical(x={}){
    return {
      id:String(x.id||uid()),
      vehicleId:String(x.vehicleId||""),
      vehicleName:String(x.vehicleName||""),
      vehicleNumber:String(x.vehicleNumber||""),
      status:STATUS[x.status]?x.status:"station",
      firefighters:Number(x.firefighters||0),
      supplied:String(x.supplied||"no"),
      outlets:Number(x.outlets||0),
      pressure:x.pressure===""||x.pressure==null?"":Number(x.pressure),
      residualStart:x.residualStart===""||x.residualStart==null?"":Number(x.residualStart),
      residualEnd:x.residualEnd===""||x.residualEnd==null?"":Number(x.residualEnd),
      notes:String(x.notes||""),
      createdAt:String(x.createdAt||new Date().toISOString()),
      updatedAtText:String(x.updatedAtText||new Date().toLocaleString("fr-CA"))
    };
  }

  function persist(){write(CACHE,usages)}
  function pending(){return read(PENDING,{})}
  function queue(item){const p=pending();p[item.id]=item;write(PENDING,p)}
  function clearPending(id){const p=pending();delete p[id];write(PENDING,p)}

  function suppliedLabel(v){
    return ({no:"Non alimenté",hydrant:"Borne",tanker:"Citerne",relay:"Relais",other:"Autre"})[v]||v;
  }

  function render(){
    const box=$("vehicleUsageList");
    if(!box)return;
    const sorted=[...usages].sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
    box.innerHTML=sorted.length?sorted.map(u=>`
      <article class="vehicle-usage-card">
        <div class="vehicle-usage-icon">🚒</div>
        <div class="vehicle-usage-main">
          <h4>${esc(u.vehicleName||u.vehicleNumber||"Véhicule")}</h4>
          <strong>${esc(STATUS[u.status])}</strong>
          <p>👨‍🚒 ${u.firefighters} pompier${u.firefighters>1?"s":""} · 💧 ${esc(suppliedLabel(u.supplied))}</p>
          <p>${u.outlets} sortie${u.outlets>1?"s":""} · ${u.pressure!==""?`${u.pressure} PSI`:"Pression non inscrite"}</p>
          <small>${esc(u.updatedAtText)}</small>
        </div>
        <button class="secondary small" data-usage-edit="${esc(u.id)}">Ouvrir</button>
      </article>`).join(""):'<div class="card-item"><strong>Aucune fiche véhicule</strong><p>Créez une fiche lors de l’utilisation d’un camion en intervention.</p></div>';
  }

  function fillVehicleOptions(){
    const select=$("vehicleUsageVehicle");
    const list=vehicles();
    select.innerHTML=list.map(v=>`<option value="${esc(v.id)}">${esc(v.name)}</option>`).join("");
  }

  function setStatus(status){
    $("vehicleUsageStatus").value=status;
    $("vehicleUsageStatusText").textContent=`État : ${STATUS[status]}`;
    document.querySelectorAll("[data-usage-status]").forEach(btn=>btn.classList.toggle("active",btn.dataset.usageStatus===status));
  }

  function openForm(item=null){
    fillVehicleOptions();
    const u=item?canonical(item):canonical({});
    $("vehicleUsageId").value=item?u.id:"";
    $("vehicleUsageVehicle").value=u.vehicleId||vehicles()[0]?.id||"";
    $("vehicleUsageFirefighters").value=u.firefighters;
    $("vehicleUsageSupplied").value=u.supplied;
    $("vehicleUsageOutlets").value=u.outlets;
    $("vehicleUsagePressure").value=u.pressure;
    $("vehicleUsageResidualStart").value=u.residualStart;
    $("vehicleUsageResidualEnd").value=u.residualEnd;
    $("vehicleUsageNotes").value=u.notes;
    $("vehicleUsageTitle").textContent=item?`Modifier — ${u.vehicleName}`:"Nouvelle fiche véhicule";
    $("deleteVehicleUsage").classList.toggle("hidden",!item);
    setStatus(u.status);
    $("vehicleUsageDialog").showModal();
  }

  function fromForm(){
    const id=$("vehicleUsageId").value||uid();
    const vehicle=vehicles().find(v=>String(v.id)===String($("vehicleUsageVehicle").value))||{};
    const old=usages.find(x=>x.id===id);
    return canonical({
      ...old,
      id,
      vehicleId:String(vehicle.id||""),
      vehicleName:vehicle.name||"",
      vehicleNumber:vehicle.number||"",
      status:$("vehicleUsageStatus").value,
      firefighters:$("vehicleUsageFirefighters").value,
      supplied:$("vehicleUsageSupplied").value,
      outlets:$("vehicleUsageOutlets").value,
      pressure:$("vehicleUsagePressure").value,
      residualStart:$("vehicleUsageResidualStart").value,
      residualEnd:$("vehicleUsageResidualEnd").value,
      notes:$("vehicleUsageNotes").value.trim(),
      createdAt:old?.createdAt||new Date().toISOString(),
      updatedAtText:new Date().toLocaleString("fr-CA")
    });
  }

  async function save(e){
    e.preventDefault();
    const u=fromForm();
    const i=usages.findIndex(x=>x.id===u.id);
    if(i>=0)usages[i]=u;else usages.push(u);
    persist();queue(u);render();$("vehicleUsageDialog").close();

    // Keep vehicle status synchronized with quick state.
    const vehicle=vehicles().find(v=>String(v.id)===u.vehicleId);
    if(vehicle){
      vehicle.status=u.status;
      vehicle.crew=`${u.firefighters} pompier${u.firefighters>1?"s":""}`;
      try{await window.fireMapCloud?.saveVehicle?.(vehicle)}catch(_){}
    }

    try{
      if(window.fireMapCloud?.configured&&window.fireMapCloud.saveVehicleUsage){
        await window.fireMapCloud.saveVehicleUsage(u);
        clearPending(u.id);
        core.toast("Fiche véhicule synchronisée.");
      }else throw new Error("Cloud indisponible");
    }catch(err){
      console.warn(err);
      core.toast("Fiche enregistrée localement; synchronisation en attente.");
    }
  }

  async function remove(){
    const id=$("vehicleUsageId").value;
    if(!id||!confirm("Supprimer cette fiche véhicule?"))return;
    usages=usages.filter(x=>x.id!==id);
    persist();render();$("vehicleUsageDialog").close();
    try{await window.fireMapCloud?.deleteVehicleUsage?.(id)}catch(err){console.warn(err)}
  }

  async function flush(){
    const cloud=window.fireMapCloud;
    if(!cloud?.configured||!cloud.saveVehicleUsage)return;
    for(const item of Object.values(pending())){
      try{await cloud.saveVehicleUsage(item);clearPending(item.id)}catch(_){}
    }
  }

  function connect(){
    const cloud=window.fireMapCloud;
    if(!cloud?.configured||!cloud.subscribeVehicleUsages){render();return}
    cloudUnsub?.();
    cloudUnsub=cloud.subscribeVehicleUsages(items=>{
      const p=pending();
      usages=items.map(canonical);
      Object.values(p).forEach(x=>{
        const u=canonical(x),i=usages.findIndex(y=>y.id===u.id);
        if(i>=0)usages[i]=u;else usages.push(u);
      });
      persist();render();flush();
    },err=>{console.error(err);core.toast("Fiches véhicules en mode local.")});
    flush();
  }

  document.addEventListener("click",e=>{
    const status=e.target.closest("[data-usage-status]");
    if(status)setStatus(status.dataset.usageStatus);
    const edit=e.target.closest("[data-usage-edit]");
    if(edit)openForm(usages.find(x=>x.id===edit.dataset.usageEdit));
  });

  $("newVehicleUsage").onclick=()=>openForm();
  $("closeVehicleUsageDialog").onclick=$("cancelVehicleUsageDialog").onclick=()=>$("vehicleUsageDialog").close();
  $("deleteVehicleUsage").onclick=remove;
  $("vehicleUsageForm").onsubmit=save;

  usages=read(CACHE,[]).map(canonical);
  render();
  if(window.fireMapCloud)connect();else window.addEventListener("firemap-cloud-ready",connect,{once:true});
})();