import { fN } from "./calc.js";
import { getState, setState, getEl } from "./state.js";
import { renderAll } from "../main.js";

export const SLIDERS = {
  "p-prices": [
    {
      key: "gp",
      label: "Ціна газу, грн/тис.м³",
      min: 5000,
      max: 50000,
      step: 500,
      fmt: (v) => fN(v) + " грн",
      tag: "ринок",
      tc: "var(--red)",
    },
    {
      key: "rdm",
      label: "РДН, грн/МВт·год",
      min: 1000,
      max: 20000,
      step: 100,
      fmt: (v) => fN(v) + " грн",
      tag: "волат.",
      tc: "var(--red)",
    },
    {
      key: "trans",
      label: "Передача Укренерго, грн/МВт·год",
      min: 500,
      max: 5000,
      step: 100,
      fmt: (v) => fN(v) + " грн",
      tag: "НКРЕКП",
      tc: "var(--text3)",
    },
    {
      key: "distr",
      label: "Розподіл Львівобленерго 2кл, грн/МВт·год",
      min: 1500,
      max: 4500,
      step: 100,
      fmt: (v) => fN(v) + " грн",
      tag: "НКРЕКП",
      tc: "var(--text3)",
    },
  ],
  "p-heat": [
    {
      key: "hp",
      label: "Ціна тепла в мережу, грн/Гкал",
      min: 500,
      max: 5000,
      step: 100,
      fmt: (v) => fN(v) + " грн",
      tag: "ЛТЕ",
      tc: "var(--green)",
    },
  ],
  "p-el": [
    {
      key: "elB",
      label: "Базове ел. навантаження (без VRF), МВт",
      min: 0.2,
      max: 1.2,
      step: 0.05,
      fmt: (v) => v.toFixed(2) + " МВт",
    },
    {
      key: "vrfW",
      label: "VRF опалення взимку, МВт",
      min: 0.1,
      max: 1,
      step: 0.05,
      fmt: (v) => v.toFixed(2) + " МВт",
    },
    {
      key: "vrfS",
      label: "VRF охолодження влітку, МВт",
      min: 0.1,
      max: 1.2,
      step: 0.05,
      fmt: (v) => v.toFixed(2) + " МВт",
    },
  ],
  "p-inv": [
    {
      key: "capex",
      label: "CAPEX «під ключ», млн грн",
      min: 20e6,
      max: 100e6,
      step: 1e6,
      fmt: (v) => fN(v / 1e6, 0) + " млн",
      tag: "орієнтир",
      tc: "var(--amber)",
    },
    {
      key: "opex",
      label: "OPEX (ТО + персонал), % від CAPEX/рік",
      min: 5,
      max: 30,
      step: 1,
      fmt: (v) => v.toFixed(1) + "%",
    },
    {
      key: "av",
      label: "Коефіцієнт доступності КГУ",
      min: 0.5,
      max: 1,
      step: 0.01,
      fmt: (v) => `${v.toFixed(2)} → ${fN(Math.round(8760 * v))} год`,
    },
  ],
};

export function initSliders() {
  const { P } = getState();
  const g = getEl;

  Object.entries(SLIDERS).forEach(([cardId, sliders]) => {
    const card = g(cardId);
    if (!card) return;

    let extra = "";
    if (cardId === "p-heat") {
      extra = `<div style="margin-top:14px">
        <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Мережа бере тепло влітку? <span class="tag" style="background:var(--green-bg);color:var(--green)">ЛТЕ</span></div>
        <div class="segs">
          <div class="seg" id="seg0" data-sh="0">Ні</div>
          <div class="seg" id="seg5" data-sh="0.5">50%</div>
          <div class="seg active" id="seg1" data-sh="1">Так</div>
        </div>
      </div>`;
    }
    if (cardId === "p-el") {
      extra = `<div class="derived"><span class="d-label">Зима: база + VRF</span><span class="d-val" id="d-lw">—</span></div>
             <div class="derived" style="margin-top:6px"><span class="d-label">Літо: база + VRF</span><span class="d-val" id="d-ls">—</span></div>`;
    }
    if (cardId === "p-prices") {
      extra = `<div class="derived"><span class="d-label">Кінцева ціна для БЦ</span><span class="d-val" id="d-ep">—</span></div>`;
    }

    card.innerHTML =
      sliders
        .map(
          (s) => `
      <div class="sr">
        <div class="sr-head">
          <span class="sr-label">${s.label}${s.tag ? `<span class="tag" style="background:${s.tc}22;color:${s.tc}">${s.tag}</span>` : ""}</span>
          <span class="sr-val" id="sv-${s.key}">${s.fmt(P[s.key])}</span>
        </div>
        <input type="range" id="sl-${s.key}" min="${s.min}" max="${s.max}" step="${s.step}" value="${P[s.key]}">
      </div>`,
        )
        .join("") + extra;

    sliders.forEach((s) => {
      g("sl-" + s.key).addEventListener("input", function () {
        const { P: cur } = getState();
        const next = { ...cur, [s.key]: parseFloat(this.value) };
        setState(next);
        g("sv-" + s.key).textContent = s.fmt(next[s.key]);
        updateDerived();
        renderAll();
      });
    });
  });

  // heat segment buttons
  const segContainerEls = document.querySelectorAll(".segs .seg");
  segContainerEls.forEach((seg) => {
    seg.addEventListener("click", () => {
      const value = parseFloat(seg.dataset.sh || "0");
      setSH(value);
    });
  });
}

export function updateDerived() {
  const { P } = getState();
  const g = getEl;

  const epEl = g("d-ep");
  if (epEl)
    epEl.textContent =
      ((P.rdm + P.trans + P.distr) / 1000).toFixed(2) + " грн/кВт·год";

  const lw = g("d-lw");
  if (lw) lw.textContent = (P.elB + P.vrfW).toFixed(2) + " МВт";

  const ls = g("d-ls");
  if (ls) ls.textContent = (P.elB + P.vrfS).toFixed(2) + " МВт";
}

export function setSH(v) {
  const { P } = getState();
  setState({ ...P, sh: v });

  ["seg0", "seg5", "seg1"].forEach((id) =>
    getEl(id)?.classList.remove("active"),
  );
  getEl({ 0: "seg0", 0.5: "seg5", 1: "seg1" }[v])?.classList.add("active");
  renderAll();
}

export function resetP() {
  // delegate to state reset by reusing DEF via calc/state – simplest is reload state from DEF:
  const { P } = getState();
  const base = Object.keys(P).reduce((acc, key) => {
    acc[key] = P[key];
    return acc;
  }, {});
  setState(base);

  Object.values(SLIDERS)
    .flat()
    .forEach((s) => {
      const sl = getEl("sl-" + s.key);
      if (sl) {
        sl.value = P[s.key];
      }
      const sv = getEl("sv-" + s.key);
      if (sv) {
        sv.textContent = s.fmt(P[s.key]);
      }
    });

  setSH(1);
  updateDerived();
  renderAll();
}

