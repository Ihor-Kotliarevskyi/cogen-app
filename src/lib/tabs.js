import { calc } from "./calc.js";
import { getState, getEl } from "./state.js";
import { drawChart } from "./render-cf.js";

const TABS = ["dash", "params", "balance", "cf", "sc"];

export function showTab(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));

  getEl("tab-" + name).classList.add("active");
  document
    .querySelectorAll(".tab")
    [TABS.indexOf(name)].classList.add("active");

  if (name === "cf") {
    const { P } = getState();
    setTimeout(() => drawChart(calc(P).cf), 30);
  }
}

