import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { DEF, calc } from '../lib/calc.js';

const CalcContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PARAM':
      return { ...state, [action.key]: action.value };
    case 'SET_SH':
      return { ...state, sh: action.value };
    case 'RESET':
      return { ...DEF };
    default:
      return state;
  }
}

export function CalcProvider({ children }) {
  const [P, dispatch] = useReducer(reducer, { ...DEF });
  const result = useMemo(() => calc(P), [P]);

  return (
    <CalcContext.Provider value={{ P, result, dispatch }}>
      {children}
    </CalcContext.Provider>
  );
}

export function useCalc() {
  const ctx = useContext(CalcContext);
  if (!ctx) throw new Error('useCalc must be used within CalcProvider');
  return ctx;
}
