(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const safe = fn => { try { return fn(); } catch (e) { console.error("FireMap V21", e); return null; } };

  function buildings() {
    const list = window.fireMapPreplans && typeof window.fireMapPreplans.getBuildings === "function"
      ? window.fireMapPreplans.getBuildings() : [];
    return Array.isArray(list) ? list : [];
  }
  function findBuilding(id) { return buildings().find(b => String(b.id) === String(id)); }

  function fillGeneral(id) {
    const b = findBuilding(id); if (!b) return;
    const values = {
      ubName:b.name||"", ubCategory:b.category||"other", ubAddress:b.address||"",
      ubLat:Number.isFinite(Number(b.lat))?Number(b.lat):"", ubLng:Number.isFinite(Number(b.lng))?Number(b.lng):"",
      ubRisk:b.risk||"high", ubFloors:b.floors||"", ubBasement:b.basement||"unknown",
      ubContactName:b.contactName||"", ubContactPhone:b.contactPhone||"", ubContactEmail:b.contactEmail||""
    };
    Object.entries(values).forEach(([id2,v]) => { const el=$(id2); if(el) el.value=v; });
  }

  function readGeneral(id) {
    const old=findBuilding(id)||{};
    const val=(id2, fallback="") => $(id2)?.value ?? fallback;
    return {
      ...old, id:String(id), name:String(val("ubName",old.name||"Bâtiment sans nom")).trim(),
      category:val("ubCategory",old.category||"other"), address:String(val("ubAddress",old.address||"")).trim(),
      lat:Number(val("ubLat",old.lat)), lng:Number(val("ubLng",old.lng)), risk:val("ubRisk",old.risk||"high"),
      floors:Number(val("ubFloors",old.floors||0)||0), basement:val("ubBasement",old.basement||"unknown"),
      contactName:String(val("ubContactName",old.contactName||"")).trim(),
      contactPhone:String(val("ubContactPhone",old.contactPhone||"")).trim(),
      contactEmail:String(val("ubContactEmail",old.contactEmail||"")).trim()
    };
  }

  function openUnified(id) {
    id=String(id||""); if(!id) return;
    if (window.fireMapPrevention && typeof window.fireMapPrevention.open === "function") {
      window.fireMapPrevention.open(id);
      setTimeout(() => safe(() => fillGeneral(id)), 0);
      return;
    }
    if (window.__fireMapLegacyOpenPreplan) window.__fireMapLegacyOpenPreplan(id);
  }

  function install() {
    if (window.fireMapPreplans && !window.__fireMapLegacyOpenPreplan) {
      window.__fireMapLegacyOpenPreplan = window.fireMapPreplans.openPreplanById?.bind(window.fireMapPreplans);
      window.fireMapPreplans.openPreplanById = openUnified;
    }
  }

  document.addEventListener("click", e => {
    const t=e.target.closest?.("[data-open-preplan],[data-show-building],[data-edit-building],[data-prevention-preplan],[data-prevention-edit]");
    if(!t) return;
    const id=t.dataset.openPreplan||t.dataset.showBuilding||t.dataset.editBuilding||t.dataset.preventionPreplan||t.dataset.preventionEdit;
    if(!id) return;
    e.preventDefault(); e.stopImmediatePropagation(); openUnified(id);
  }, true);

  $("preventionForm")?.addEventListener("submit", async () => {
    const id=$("preventionBuildingId")?.value; if(!id) return;
    const b=readGeneral(id);
    try {
      if (window.fireMapCloud?.configured && window.fireMapCloud.saveBuilding) await window.fireMapCloud.saveBuilding(b);
      const key="firemap-batiments-v1";
      let list=[]; try { list=JSON.parse(localStorage.getItem(key)||"[]"); } catch(_) {}
      const i=list.findIndex(x=>String(x.id)===String(id)); if(i>=0) list[i]={...list[i],...b}; else list.push(b);
      localStorage.setItem(key,JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("firemap:buildings-updated",{detail:{buildings:list}}));
    } catch(e) { console.error("Sauvegarde bâtiment",e); }
  }, true);

  const relabel=()=>{
    document.querySelectorAll("[data-show-building]").forEach(b=>b.textContent="Ouvrir la fiche");
    document.querySelectorAll("[data-edit-building]").forEach(b=>b.textContent="Modifier la fiche");
    document.querySelectorAll("[data-open-preplan]").forEach(b=>b.textContent="Ouvrir la fiche Bâtiment");
  };
  new MutationObserver(relabel).observe(document.body,{childList:true,subtree:true});
  install(); relabel();
  window.addEventListener("firemap-preplans-ready",()=>{install();relabel();});
})();