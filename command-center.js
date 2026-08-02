(()=>{"use strict";const $=id=>document.getElementById(id),I=window.fireMapInternal;if(!I)return;const EC="firemap-command-events-v1",AC="firemap-command-active-v1",UC="firemap-vehicle-usages-v2",ACTIVE_EVENT_DATA="firemap-command-active-event-data";let events=[],activeId=localStorage.getItem(AC)||"",timer;const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(_){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),uid=()=>crypto.randomUUID?crypto.randomUUID():`e-${Date.now()}`,esc=v=>I.esc?I.esc(v):String(v??"");function normAddress(v=""){return String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\b(rue|avenue|av|boulevard|boul|chemin|ch|route|rang)\b/g,"").replace(/[^a-z0-9]/g,"")}
function buildings(){return window.fireMapPreplans?.getBuildings?.()||window.fireMapInternal?.state?.buildings||[]}
function findBuilding(e){const target=normAddress(e?.address||"");if(!target)return null;const list=buildings();return list.find(b=>normAddress(b.address||b.adresse||"")===target)||list.find(b=>{const a=normAddress(b.address||b.adresse||"");return a&&(a.includes(target)||target.includes(a))})||null}
function preventionRecord(id){return window.fireMapPrevention?.getRecordForBuilding?.(id)||null}
function preventionPhotoUrls(r){const out=[],seen=new Set();Object.values(r?.photosByCategory||{}).forEach(list=>Array.isArray(list)&&list.forEach(p=>{const u=String(p?.url||p?.downloadURL||p?.src||"");if(u&&!seen.has(u)){seen.add(u);out.push(u)}}));String(r?.photoUrls||"").split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(u=>{if(!seen.has(u)){seen.add(u);out.push(u)}});return out}
function renderPrevention(e){const b=findBuilding(e),empty=$("commandPreventionEmpty"),content=$("commandPreventionContent");if(!b){empty?.classList.remove("hidden");content?.classList.add("hidden");return}const r=preventionRecord(b.id)||{};empty?.classList.add("hidden");content?.classList.remove("hidden");content.dataset.buildingId=String(b.id);$("commandPreventionTitle").textContent=b.name||"Bâtiment";$("commandPreventionAddress").textContent=b.address||b.adresse||e.address||"";$("commandPreventionRisks").textContent=r.risksNotes||r.hazmatNotes||b.risks||"Aucun risque inscrit";$("commandPreventionFdc").textContent=r.fdcNotes||b.fdc||"Non inscrit";$("commandPreventionElectrical").textContent=r.electricalNotes||b.electrical||"Non inscrit";$("commandPreventionGas").textContent=r.gasNotes||b.gas||"Non inscrit";$("commandPreventionHazmat").textContent=r.hazmatNotes||b.hazmat||"Non inscrit";$("commandPreventionAccess").textContent=r.accessNotes||b.access||"Non inscrit";const photos=preventionPhotoUrls(r);$("commandPreventionPhotos").innerHTML=photos.length?photos.slice(0,12).map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="Photo prévention" loading="lazy"></a>`).join(""):'<div class="card-item"><strong>Aucune photo</strong></div>'}
function active(){return events.find(e=>e.id===activeId&&e.status!=="closed")||null}function saveLocal(){
    write(EC,events);
    const e=active();
    if(e)write(ACTIVE_EVENT_DATA,{id:e.id,sourceCallId:e.sourceCallId||"",number:e.number,address:e.address});
    else localStorage.removeItem(ACTIVE_EVENT_DATA);
  }
  function usageList(){
    const e=active();
    if(!e)return[];
    return read(UC,[]).filter(u=>String(u.eventId||"")===String(e.id));
  }
  function newestByVehicle(){
    const m=new Map();
    [...usageList()].sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||""))).forEach(u=>{
      if(!m.has(String(u.vehicleId)))m.set(String(u.vehicleId),u)
    });
    return m
  }function outletRows(u){const a=[];Object.entries(u?.outlets||{}).forEach(([k,o])=>{if(o?.active)a.push({vehicle:u.vehicleName,name:Number(k)<=2?`Préconnect ${k}`:`Sortie ${k}`,type:o.type,psi:o.pressure,sector:o.sector,location:o.location})});if(u?.special?.fourInch?.active)a.push({vehicle:u.vehicleName,name:"Sortie 4 po",type:"4 po",psi:u.special.fourInch.pressure,sector:u.special.fourInch.sector,location:u.special.fourInch.location});if(u?.special?.deckGun?.active)a.push({vehicle:u.vehicleName,name:"Canon",type:"Canon",psi:u.special.deckGun.pressure,sector:u.special.deckGun.sector,location:u.special.deckGun.location});return a}function state(u){if(u?.supplied&&u.supplied!=="no")return["blue","🔵","Alimenté"];if(u?.status==="onscene")return["green","🟢","Sur les lieux"];if(u?.status==="enroute"||u?.status==="returning")return["yellow","🟡",u.status==="returning"?"Retour vers caserne":"En route"];return["gray","⚪","En caserne"]}function openForm(e=null){const n=new Date(),x=e||{id:"",number:`${n.getFullYear()}-${String(events.length+1).padStart(3,"0")}`,address:"",type:"",alarm:"1",chief:"",notes:""};$("commandEventId").value=x.id||"";$("commandEventNumberInput").value=x.number||"";$("commandEventAddressInput").value=x.address||"";$("commandEventTypeInput").value=x.type||"";$("commandEventAlarmInput").value=x.alarm||"1";$("commandEventChiefInput").value=x.chief||"";$("commandEventNotesInput").value=x.notes||"";$("commandEventDialogTitle").textContent=e?"Modifier l’événement":"Nouvel événement";$("commandEventDialog").showModal()}function addJournal(e,msg){e.journal=e.journal||[];e.journal.unshift({id:uid(),time:new Date().toLocaleTimeString("fr-CA",{hour:"2-digit",minute:"2-digit"}),message:msg})}async function submit(ev){ev.preventDefault();const id=$("commandEventId").value||uid(),old=events.find(x=>x.id===id),e={...old,id,number:$("commandEventNumberInput").value.trim(),address:$("commandEventAddressInput").value.trim(),type:$("commandEventTypeInput").value.trim(),alarm:$("commandEventAlarmInput").value,chief:$("commandEventChiefInput").value.trim(),notes:$("commandEventNotesInput").value.trim(),sourceCallId:old?.sourceCallId||"",status:"active",startedAt:old?.startedAt||new Date().toISOString(),journal:old?.journal||[]};if(!old)addJournal(e,"Événement créé");const i=events.findIndex(x=>x.id===id);if(i>=0)events[i]=e;else events.push(e);activeId=id;localStorage.setItem(AC,id);saveLocal();$("commandEventDialog").close();render();try{await window.fireMapCloud?.saveCommandEvent?.(e)}catch(_){}}async function createEventFromActiveCall(call={}){
    const address=String(call.adresse||call.address||"").trim();
    if(!address)return;
    const sourceCallId=String(call.callId||call.eventId||"").trim()||
      `call-${String(call.startedAt||new Date().toISOString()).replace(/\D/g,"").slice(0,14)}-${I.addressNorm(address).replace(/\s+/g,"-").slice(0,45)}`;

    let e=events.find(x=>String(x.sourceCallId||"")===sourceCallId&&x.status!=="closed")||active();
    const sameAddress=e&&String(e.address||"").trim().toLowerCase()===address.toLowerCase();

    if(!e){
      const now=new Date();
      e={
        id:uid(),
        sourceCallId,
        number:`${now.getFullYear()}-${String(events.length+1).padStart(3,"0")}`,
        address,
        type:String(call.callType||"Intervention"),
        alarm:String(call.alarmLevel||"1").match(/[1-5]/)?.[0]||"1",
        chief:"",
        notes:String(call.dispatchRaw||""),
        status:"active",
        startedAt:String(call.startedAt||now.toISOString()),
        journal:[]
      };
      addJournal(e,"Événement créé automatiquement à partir de l’appel actif");
      events.push(e);
      activeId=e.id;
      localStorage.setItem(AC,e.id);
    }else{
      let changed=false;
      if(!e.sourceCallId){e.sourceCallId=sourceCallId;changed=true}
      activeId=e.id;
      localStorage.setItem(AC,e.id);
      if(!sameAddress&&address){e.address=address;changed=true}
      if(call.callType&&(!e.type||e.type==="Intervention")){e.type=String(call.callType);changed=true}
      const alarm=String(call.alarmLevel||"").match(/[1-5]/)?.[0];
      if(alarm&&e.alarm!==alarm){e.alarm=alarm;changed=true}
      if(changed)addJournal(e,"Événement mis à jour depuis l’appel actif");
    }

    saveLocal();
    window.dispatchEvent(new CustomEvent("firemap:command-event-linked",{detail:{
      eventId:e.id,
      sourceCallId:e.sourceCallId||sourceCallId,
      number:e.number,
      address:e.address
    }}));
    render();
    try{
      await window.fireMapCloud?.saveCommandEvent?.(e);
      I.toast("Événement ajouté automatiquement au poste de commandement.");
    }catch(err){
      console.warn(err);
      I.toast("Événement créé localement dans le poste de commandement.");
    }
  }

  function render(){const e=active();$("commandEmpty").classList.toggle("hidden",!!e);$("commandDashboard").classList.toggle("hidden",!e);if(!e)return;const vehicles=window.fireMapVehicles?.getVehicles?.()||[],map=newestByVehicle(),rows=vehicles.map(v=>({v,u:map.get(String(v.id))})),eng=rows.filter(x=>x.u&&x.u.status!=="station"),out=rows.flatMap(x=>outletRows(x.u));$("commandEventNumber").textContent=`ÉVÉNEMENT ${e.number}`;$("commandEventAddress").textContent=e.address;$("commandEventType").textContent=e.type||"Type non inscrit";$("commandVehicleCount").textContent=eng.length;$("commandOnSceneCount").textContent=rows.filter(x=>state(x.u)[0]==="green").length;$("commandSuppliedCount").textContent=rows.filter(x=>state(x.u)[0]==="blue").length;$("commandFirefighterCount").textContent=rows.reduce((s,x)=>s+Number(x.u?.firefighters||0),0);$("commandOutletCount").textContent=out.length;$("commandVehicleList").innerHTML=rows.map(({v,u})=>{const s=state(u);return`<article class="command-vehicle-card ${s[0]}"><span>${s[1]}</span><div><h3>${esc(v.name)}</h3><strong>${s[2]}</strong><p>👨‍🚒 ${Number(u?.firefighters||0)} · 💧 ${outletRows(u).length}</p></div></article>`}).join("");$("commandOutletList").innerHTML=out.length?out.map(o=>`<article class="command-outlet-card"><strong>${esc(o.vehicle)} — ${esc(o.name)}</strong><span>${esc(o.type||"")} · ${o.psi!==""&&o.psi!=null?o.psi:"—"} PSI · ${o.sector?`Secteur ${esc(o.sector)}`:"Secteur non précisé"}</span><p>${esc(o.location||"Affectation non inscrite")}</p></article>`).join(""):'<div class="card-item"><strong>Aucune sortie active</strong></div>';renderPrevention(e);$("commandJournalList").innerHTML=(e.journal||[]).map(j=>`<article class="command-journal-item"><time>${esc(j.time)}</time><p>${esc(j.message)}</p></article>`).join("")||'<div class="card-item"><strong>Journal vide</strong></div>';$("commandEventMeta").textContent=`Alarme ${e.alarm} · Chef : ${e.chief||"—"} · Début : ${new Date(e.startedAt).toLocaleString("fr-CA")}`;tick()}function tick(){const e=active();if(!e)return;const s=Math.max(0,Math.floor((Date.now()-new Date(e.startedAt))/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;$("commandElapsed").textContent=h?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`}function tab(name){document.querySelectorAll("[data-command-tab]").forEach(b=>b.classList.toggle("active",b.dataset.commandTab===name));["Vehicles","Outlets","Prevention","Journal","Event"].forEach(n=>$("commandPanel"+n).classList.toggle("hidden",n.toLowerCase()!==name))}$("commandOpenPrevention").onclick=()=>{const id=$("commandPreventionContent")?.dataset?.buildingId;if(!id)return I.toast("Aucune fiche de prévention liée.");window.fireMapPrevention?.open?.(id)};
$("commandShowPreventionMap").onclick=()=>{const id=$("commandPreventionContent")?.dataset?.buildingId;if(!id)return I.toast("Aucun bâtiment lié.");window.fireMapPreplans?.showBuildingOnMap?.(id)};
window.addEventListener("firemap:prevention-updated",()=>renderPrevention(active()));
window.addEventListener("firemap:buildings-updated",()=>renderPrevention(active()));
document.addEventListener("click",e=>{const b=e.target.closest("[data-command-tab]");if(b)tab(b.dataset.commandTab)});$("newCommandEvent").onclick=()=>openForm();$("editCommandEvent").onclick=()=>openForm(active());$("closeCommandEventDialog").onclick=$("cancelCommandEventDialog").onclick=()=>$("commandEventDialog").close();$("commandEventForm").onsubmit=submit;$("commandJournalAdd").onclick=()=>{const e=active(),t=$("commandJournalText").value.trim();if(!e||!t)return;addJournal(e,t);$("commandJournalText").value="";saveLocal();render();window.fireMapCloud?.saveCommandEvent?.(e)};$("endCommandEvent").onclick=()=>{const e=active();if(!e||!confirm("Terminer cet événement?"))return;e.status="closed";addJournal(e,"Événement terminé");saveLocal();window.fireMapCloud?.saveCommandEvent?.(e);activeId="";localStorage.removeItem(AC);render()};window.addEventListener("firemap:call-active",e=>createEventFromActiveCall(e.detail||{}));
  window.fireMapCommandCenter={
    createFromActiveCall:createEventFromActiveCall,
    open:()=>I.showView("command"),
    getActiveEvent:active
  };
  events=read(EC,[]);
  render();
  timer=setInterval(tick,1000);
  window.addEventListener("storage",render);
  window.addEventListener("firemap:vehicle-usage-updated",render);
  window.addEventListener("firemap:command-event-linked",render);
})();