(() => {
  "use strict";
  const I = window.fireMapInternal;
  if (!I) return;
  const $ = id => document.getElementById(id);

  const getBuilding = id =>
    window.fireMapPreplans?.getBuildings?.().find(b => String(b.id) === String(id));

  function fillGeneral(id) {
    const b = getBuilding(id);
    if (!b) return;
    $("ubName").value = b.name || "";
    $("ubCategory").value = b.category || "other";
    $("ubAddress").value = b.address || "";
    $("ubLat").value = Number.isFinite(Number(b.lat)) ? Number(b.lat) : "";
    $("ubLng").value = Number.isFinite(Number(b.lng)) ? Number(b.lng) : "";
    $("ubRisk").value = b.risk || "high";
    $("ubFloors").value = b.floors || "";
    $("ubBasement").value = b.basement || "unknown";
    $("ubContactName").value = b.contactName || "";
    $("ubContactPhone").value = b.contactPhone || "";
    $("ubContactEmail").value = b.contactEmail || "";
  }

  function generalFromForm(id) {
    const old = getBuilding(id) || {};
    return {
      ...old,
      id: String(id),
      name: $("ubName").value.trim() || old.name || "Bâtiment sans nom",
      category: $("ubCategory").value,
      address: $("ubAddress").value.trim(),
      lat: Number($("ubLat").value),
      lng: Number($("ubLng").value),
      risk: $("ubRisk").value,
      floors: Number($("ubFloors").value || 0),
      basement: $("ubBasement").value,
      contactName: $("ubContactName").value.trim(),
      contactPhone: $("ubContactPhone").value.trim(),
      contactEmail: $("ubContactEmail").value.trim()
    };
  }

  function openUnified(id) {
    window.fireMapPrevention?.open?.(String(id));
    setTimeout(() => fillGeneral(String(id)), 0);
  }

  // Replace the old public preplan opener with the unique building sheet.
  const installOverride = () => {
    if (window.fireMapPreplans) {
      window.fireMapPreplans.openPreplanById = openUnified;
    }
  };
  installOverride();
  window.addEventListener("firemap-preplans-ready", installOverride);

  // Capture old preplan/list actions before their former handlers run.
  document.addEventListener("click", e => {
    const target = e.target.closest(
      "[data-open-preplan],[data-show-building],[data-edit-building],[data-prevention-preplan],[data-prevention-edit]"
    );
    if (!target) return;
    const id =
      target.dataset.openPreplan ||
      target.dataset.showBuilding ||
      target.dataset.editBuilding ||
      target.dataset.preventionPreplan ||
      target.dataset.preventionEdit;
    if (!id) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openUnified(id);
  }, true);

  // When a building form is created/edited through the legacy minimal dialog,
  // open the unique sheet as soon as Firestore/local state has refreshed.
  document.getElementById("buildingForm")?.addEventListener("submit", () => {
    const before = new Set(window.fireMapPreplans?.getBuildings?.().map(b => String(b.id)) || []);
    setTimeout(() => {
      const all = window.fireMapPreplans?.getBuildings?.() || [];
      const id = $("buildingId").value || all.find(b => !before.has(String(b.id)))?.id;
      if (id) openUnified(id);
    }, 900);
  });

  // Save the general building information into the same Firestore document.
  document.getElementById("preventionForm")?.addEventListener("submit", async () => {
    const id = $("preventionBuildingId").value;
    if (!id) return;
    const building = generalFromForm(id);
    try {
      const cloud = window.fireMapCloud;
      if (cloud?.configured && cloud.saveBuilding) {
        await cloud.saveBuilding(building);
      }
      // Update the local building cache used by the existing module.
      const key = "firemap-batiments-v1";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      const idx = list.findIndex(x => String(x.id) === String(id));
      if (idx >= 0) list[idx] = { ...list[idx], ...building };
      else list.push(building);
      localStorage.setItem(key, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("firemap:buildings-updated", {
        detail: { buildings: list }
      }));
    } catch (err) {
      console.error("Sauvegarde de la fiche Bâtiment", err);
    }
  }, true);

  // Update labels generated dynamically by the legacy building list.
  const relabel = () => {
    document.querySelectorAll("[data-show-building]").forEach(b => b.textContent = "Ouvrir la fiche");
    document.querySelectorAll("[data-edit-building]").forEach(b => b.textContent = "Modifier la fiche");
    document.querySelectorAll("[data-open-preplan]").forEach(b => b.textContent = "Ouvrir la fiche Bâtiment");
  };
  new MutationObserver(relabel).observe(document.body, { childList: true, subtree: true });
  relabel();

  // The legacy prevention view stays available only as a technical compatibility layer.
  document.querySelectorAll('[data-view="prevention"]').forEach(el => el.remove());
})();