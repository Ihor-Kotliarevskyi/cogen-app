import { calc, fN, fM, fG } from "./calc.js";
import { getState, getEl } from "./state.js";

export function renderSc(r) {
  const { P } = getState();
  const g = getEl;

  const sc = (ov) => calc({ ...P, ...ov });
  const scenarios = [
    {
      title: "Консервативний",
      badge: "Мережа не бере влітку",
      bc: "var(--bg3)",
      tc: "var(--text2)",
      r: sc({ sh: 0, hp: 800 }),
      best: false,
    },
    {
      title: "Базовий (поточний)",
      badge: "Ваші параметри",
      bc: "var(--green-bg)",
      tc: "var(--green)",
      r,
      best: true,
    },
    {
      title: "Оптимістичний",
      badge: "РДН 8грн, газ -10%, тепло 2500",
      bc: "var(--blue-bg)",
      tc: "var(--blue)",
      r: sc({
        rdm: 8000,
        gp: Math.round(P.gp * 0.9),
        hp: 2500,
        sh: 1,
        av: 0.95,
      }),
      best: false,
    },
    {
      title: "Тільки електрика",
      badge: "Без продажу тепла",
      bc: "var(--amber-bg)",
      tc: "var(--amber)",
      r: sc({ hp: 0, sh: 0 }),
      best: false,
    },
  ];

  g("sc-cards").innerHTML = scenarios
    .map(
      (s) => `
    <div class="card${s.best ? " best" : ""}">
      <div class="sc-badge" style="background:${s.bc};color:${s.tc}">${s.badge}</div>
      <div class="sc-title">${s.title}</div>
      <div class="sc-row"><span class="sc-k">Собів. ел.</span><span class="sc-v" style="color:${s.r.ecg < s.r.ep ? "var(--green)" : "var(--red)"}">${fG(s.r.ecg)}</span></div>
      <div class="sc-row"><span class="sc-k">Тепло в мережу</span><span class="sc-v">${fN(s.r.gcT, 0)} Гкал</span></div>
      <div class="sc-row"><span class="sc-k">Прибуток / рік</span><span class="sc-v" style="color:${s.r.net > 0 ? "var(--green)" : "var(--red)"}">${fM(s.r.net)}</span></div>
      <div class="sc-row"><span class="sc-k">Окупність</span><span class="sc-v" style="color:${s.r.pb ? (s.r.pb < 5 ? "var(--green)" : "var(--amber)") : "var(--red)"}">${s.r.pb ? s.r.pb.toFixed(1) + " р." : "∞"}</span></div>
    </div>`,
    )
    .join("");

  const metrics = [
    { l: "Собів. ел.", f: (s) => fG(s.ecg, 2) },
    { l: "Дохід, млн", f: (s) => fM(s.tot, 1) },
    { l: "Прибуток, млн", f: (s) => fM(s.net, 1) },
    { l: "Окупність", f: (s) => (s.pb ? s.pb.toFixed(1) + " р." : "∞") },
    { l: "NPV 15р.", f: (s) => fN(s.cf[15], 1) + " млн" },
  ];

  g("comp-tbl").innerHTML = `
    <thead><tr><th></th>${scenarios.map((s) => `<th style="color:${s.tc};font-size:10px">${s.title.split(" ")[0]}</th>`).join("")}</tr></thead>
    <tbody>${metrics.map((m) => `<tr><td>${m.l}</td>${scenarios.map((s) => `<td>${m.f(s.r)}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

