import { fN } from "./calc.js";
import { getState, getEl } from "./state.js";

export function renderBalance(r) {
  const { P } = getState();
  const g = getEl;

  g("heat-ib").innerHTML =
    `<div class="ib blue"><b>Тепло КГУ:</b> ГВП 0,15 МВт + мережа ${r.thG.toFixed(2)} МВт. Влітку мережа бере: <b>${P.sh === 0 ? "нічого" : P.sh === 0.5 ? "50%" : "повністю"}</b>. Річний продаж: <b>${fN(r.gcT, 0)} Гкал</b>.</div>`;
  g("heat-tbl").innerHTML = `
    <tr><td>Виробництво КГУ, МВт</td><td>1,10</td><td>1,10</td><td>1,10</td></tr>
    <tr><td>ГВП (внутр.), МВт</td><td>0,15</td><td>0,15</td><td>0,15</td></tr>
    <tr><td>В мережу, МВт</td><td style="color:var(--green)">${r.thG.toFixed(2)}</td><td style="color:var(--green)">${(r.thG * P.sh).toFixed(2)}</td><td style="color:var(--green)">${(((r.gcW + r.gcS) / r.h) * 1.163).toFixed(2)}</td></tr>
    <tr class="tot"><td>В мережу, тис. Гкал</td><td>${fN(r.gcW / 1000, 1)}</td><td>${fN(r.gcS / 1000, 1)}</td><td>${fN(r.gcT / 1000, 1)}</td></tr>`;
  g("b-gcal").textContent = fN(r.gcT, 0);
  g("b-hrev").textContent = fN(r.hRev / 1e6, 1);

  g("el-ib").innerHTML =
    `<div class="ib ${r.iW > 0 ? "amber" : "blue"}"><b>Зима:</b> ${r.lW.toFixed(2)} МВт ${r.iW > 0 ? `→ <b>дефіцит ${r.iW.toFixed(2)} МВт з мережі</b>` : "→ КГУ покриває повністю"}. <b>Літо:</b> ${r.lS.toFixed(2)} МВт ${r.iS > 0 ? `→ дефіцит ${r.iS.toFixed(2)} МВт` : `→ надлишок ${r.sS.toFixed(2)} МВт`}.</div>`;
  g("el-tbl").innerHTML = `
    <tr><td>Виробництво КГУ, МВт</td><td>1,00</td><td>1,00</td><td>1,00</td></tr>
    <tr><td>Навантаження (база+VRF)</td><td>${r.lW.toFixed(2)}</td><td>${r.lS.toFixed(2)}</td><td>${((r.lW * r.hW + r.lS * r.hS) / r.h).toFixed(2)}</td></tr>
    <tr><td>КГУ покриває, МВт</td><td style="color:var(--green)">${r.cW.toFixed(2)}</td><td style="color:var(--green)">${r.cS.toFixed(2)}</td><td style="color:var(--green)">${(r.ks / r.h / 1000).toFixed(2)}</td></tr>
    <tr><td>З мережі, МВт</td><td style="color:${r.iW > 0 ? "var(--red)" : "var(--text3)"}">${r.iW > 0 ? r.iW.toFixed(2) : "—"}</td><td style="color:${r.iS > 0 ? "var(--red)" : "var(--text3)"}">${r.iS > 0 ? r.iS.toFixed(2) : "—"}</td><td>—</td></tr>
    <tr class="tot"><td>Збережено, млн кВт·год</td><td>${fN((r.cW * r.hW) / 1000, 1)}</td><td>${fN((r.cS * r.hS) / 1000, 1)}</td><td style="color:var(--green)">${fN(r.ks / 1e6, 1)}</td></tr>`;
  g("b-kwh").textContent = fN(r.kGen / 1e6, 2);
  g("b-esav").textContent = fN(r.eSav / 1e6, 1);

