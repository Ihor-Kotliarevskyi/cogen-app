import { calc, fN } from "./calc.js";
import { getState, getEl } from "./state.js";

export function renderCF(r) {
  const { P } = getState();
  const g = getEl;

  const pbCls = r.pb ? (r.pb < 4 ? "cg" : r.pb < 7 ? "ca" : "cr") : "cr";
  g("cf-pb").className = "mv " + pbCls;
  g("cf-pb").textContent = r.pb ? r.pb.toFixed(1) + " р." : "∞";
  const be = r.cf.findIndex((v) => v >= 0);
  g("cf-pb-s").textContent = be > 0 ? "рік " + be : "не окупається";
  const npv = r.cf[15];
  g("cf-npv").className = "mv " + (npv > 0 ? "cg" : "cr");
  g("cf-npv").textContent = fN(npv, 1) + " млн";

  drawChart(r.cf);

  g("cf-tbl").innerHTML = r.cf
    .map(
      (v, i) => `
    <div class="cf-row">
      <span class="cf-yr">${i === 0 ? "Старт" : "Рік " + i}</span>
      <span class="cf-v" style="color:${v >= 0 ? "var(--green)" : "var(--red)"}">${v >= 0 ? "+" : ""}${fN(v, 1)} млн</span>
      <span class="cf-badge" style="background:${v >= 0 ? "var(--green-bg)" : "var(--red-bg)"};color:${v >= 0 ? "var(--green)" : "var(--red)"}">${v >= 0 ? "✓ окупився" : "· в мінусі"}</span>
    </div>`,
    )
    .join("");

  const elP = [6, 7, 8, 9, 10, 11, 12, 13, 14];
  const gS = [
    { g: 18000, c: "var(--green)", l: "Газ 18т." },
    { g: 21000, c: "var(--blue)", l: "Газ 21т." },
    { g: 24000, c: "var(--red)", l: "Газ 24т." },
  ];
  g("sens-tbl").innerHTML = `
    <thead><tr><th>Ціна ел.</th>${gS.map((s) => `<th style="color:${s.c}">${s.l}</th>`).join("")}</tr></thead>
    <tbody>${elP
      .map(
        (ep) =>
          `<tr><td>${ep} грн</td>${gS
            .map((s) => {
              const sc = calc({
                ...P,
                rdm: ep * 1000 - P.trans - P.distr,
                gp: s.g,
              });
              const pb = sc.pb;
              const c = pb
                ? pb < 4
                  ? "var(--green)"
                  : pb < 7
                    ? "var(--amber)"
                    : "var(--red)"
                : "var(--red)";
              return `<td style="color:${c}">${pb ? pb.toFixed(1) + " р." : "∞"}</td>`;
            })
            .join("")}</tr>`,
      )
      .join("")}</tbody>`;
}

export function drawChart(cf) {
  const g = getEl;
  const canvas = g("chart");
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth - 4;
  const H = 200;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 42, r: 10, t: 10, b: 26 };
  const cW = W - pad.l - pad.r;
  const cH = H - pad.t - pad.b;
  const n = cf.length;
  const minV = Math.min(...cf);
  const maxV = Math.max(...cf);
  const rng = maxV - minV || 1;

  const xOf = (i) => pad.l + (i / (n - 1)) * cW;
  const yOf = (v) => pad.t + cH - ((v - minV) / rng) * cH;

  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (i * cH) / 4;
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.stroke();
    const val = maxV - (i / 4) * rng;
    ctx.fillStyle = "#9ca3af";
    ctx.font = `10px Inter,sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(fN(val, 0), pad.l - 4, y + 3);
  }

  if (minV < 0 && maxV > 0) {
    const y0 = yOf(0);
    ctx.strokeStyle = "rgba(29,158,117,.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.l, y0);
    ctx.lineTo(W - pad.r, y0);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(cf[0]));
  cf.forEach((_, i) => {
    if (i > 0) ctx.lineTo(xOf(i), yOf(cf[i]));
  });
  ctx.lineTo(xOf(n - 1), H - pad.b);
  ctx.lineTo(xOf(0), H - pad.b);
  ctx.closePath();
  ctx.fillStyle = "rgba(24,95,165,0.08)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(cf[0]));
  cf.forEach((_, i) => {
    if (i > 0) ctx.lineTo(xOf(i), yOf(cf[i]));
  });
  ctx.strokeStyle = "#185FA5";
  ctx.lineWidth = 2;
  ctx.stroke();

  cf.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(xOf(i), yOf(v), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = v >= 0 ? "#1D9E75" : "#E24B4A";
    ctx.fill();
  });

  ctx.fillStyle = "#9ca3af";
  ctx.font = "9px Inter,sans-serif";
  ctx.textAlign = "center";
  [0, 3, 6, 9, 12, 15].forEach((i) =>
    ctx.fillText(i === 0 ? "Старт" : "р." + i, xOf(i), H - pad.b + 14),
  );
}

