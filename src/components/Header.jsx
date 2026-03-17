import React from 'react';
import { useCalc } from '../context/CalcContext.jsx';
import { fN } from '../lib/calc.js';

export default function Header() {
  const { P, result } = useCalc();

  return (
    <div className="hdr">
      <div className="hdr-left">
        <h1>КГУ 1 МВт · Бізнес-центр</h1>
        <p>{fN(result.h)} год/рік · газ {fN(P.gp)} грн/тис.м³</p>
      </div>
      <div className="live">
        <div className="live-dot"></div>
        live
      </div>
    </div>
  );
}
