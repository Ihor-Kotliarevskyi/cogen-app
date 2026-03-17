// Global mutable state holder so that lib modules don't own P directly
import { DEF } from "./calc.js";

let P = { ...DEF };

export function getState() {
  return { P };
}

export function setState(next) {
  P = next;
}

export function updateState(patch) {
  P = { ...P, ...patch };
}

export function resetState() {
  P = { ...DEF };
}

export function getEl(id) {
  return document.getElementById(id);
}

