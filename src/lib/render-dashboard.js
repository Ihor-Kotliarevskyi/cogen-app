import { fN, fM, fG } from "./calc.js";
import { getState, getEl } from "./state.js";

export function renderHdr(r) {
  const { P } = getState();
  getEl("hdr-sub").textContent =
    `${fN(r.h)} год/рік · газ ${fN(P.gp)} грн/тис.м³`;
}

export function renderDash(r) {
  const { P } = getState();
  const g = getEl;

  const ecCls = r.ecg < r.ep ? "cg" : "cr";
  const pbCls = r.pb ? (r.pb < 4 ? "cg" : r.pb < 7 ? "ca" : "cr") : "cr";
  g("k-ec").className = "mv " + ecCls;
  g("k-ec").textContent = fG(r.ecg);
  g("k-ec-s").textContent = "мережа: " + fG(r.ep);
  g("k-pb").className = "mv " + pbCls;
  g("k-pb").textContent = r.pb ? r.pb.toFixed(1) + " р." : "∞";
  g("k-pb-s").textContent = "CAPEX " + fM(P.capex, 0);
  g("k-rev").textContent = fM(r.tot);
  g("k-net").className = "mv " + (r.net > 0 ? "cg" : "cr");
  g("k-net").textContent = fM(r.net);
  g("k-net-s").textContent = r.net > 0 ? "після газу та OPEX" : "збиток";

  g("warn").innerHTML =
    r.ecg >= r.ep
      ? `<div class="ib amber">Собівартість генерації вища за ринкову ціну. Перевірте ціни газу або електрики.</div>`
      : "";

  const rows = [
    { n: "Економія на купівлі електрики", v: r.eSav, pos: true },
    { n: "Продаж тепла в мережу", v: r.hRev, pos: true },
    { n: "Економія ГВП", v: r.hIS, pos: true },
    { n: "РАЗОМ ДОХОДИ", v: r.tot, pos: true, tot: true },
    { n: "Витрати на газ", v: -r.gCost, pos: false },
    { n: "OPEX (ТО, персонал)", v: -r.opex, pos: false },
    { n: "ЧИСТИЙ ПРИБУТОК", v: r.net, pos: r.net > 0, tot: true },
  ];
  g("pnl").innerHTML = rows
    .map(
      (row) => `
    <div class="pnl-row${row.tot ? " tot" : ""}">
      <span class="pnl-n">${row.n}</span>
      <span class="pnl-v" style="color:${row.pos ? "var(--green)" : "var(--red)"}">${row.v >= 0 ? "+" : ""}${fM(row.v)}</span>
      ${!row.tot ? `<span class="pnl-pct">${fN((Math.abs(row.v) / r.tot) * 100, 0)}%</span>` : ""}
    </div>`,
    )
    .join("");

  g("gas-det").innerHTML = `
    <div class="det-row"><span class="det-k">Витрата газу</span><span class="det-v">${r.gm3.toFixed(1)} м³/год</span></div>
    <div class="det-row"><span class="det-k">Річна витрата</span><span class="det-v">${fN(r.gAnn / 1000, 1)} тис. м³</span></div>
    <div class="det-row"><span class="det-k">Вартість газу/рік</span><span class="det-v" style="color:var(--red)">${fM(r.gCost)}</span></div>
    <div class="det-row"><span class="det-k">Собівартість кВт·год</span><span class="det-v" style="color:${r.ecg < r.ep ? "var(--green)" : "var(--red)"}">${fG(r.ecg)}</span></div>`;

