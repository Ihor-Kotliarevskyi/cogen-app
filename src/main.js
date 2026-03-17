import { calc } from "./lib/calc.js";
import { getState } from "./lib/state.js";
import { renderHdr, renderDash } from "./lib/render-dashboard.js";
import { renderBalance } from "./lib/render-balance.js";
import { renderCF } from "./lib/render-cf.js";
import { renderSc } from "./lib/render-scenarios.js";
import { initSliders, updateDerived, setSH, resetP } from "./lib/sliders.js";
import { showTab } from "./lib/tabs.js";

export function renderAll() {
  const { P } = getState();
  const r = calc(P);
  renderHdr(r);
  renderDash(r);
  renderBalance(r);
  renderCF(r);
  renderSc(r);
  updateDerived();
}

document.addEventListener("DOMContentLoaded", () => {
  initSliders();
  updateDerived();
  renderAll();
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("sw.js");
});

// expose functions used from HTML attributes
window.showTab = showTab;
window.resetP = resetP;
window.setSH = setSH;

