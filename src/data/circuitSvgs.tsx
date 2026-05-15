import React from 'react';

const C = '#1a2a3a';

// ── Atoms ──────────────────────────────────────────────────────────────
const L = (x1:number,y1:number,x2:number,y2:number,w='1.5') =>
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth={w}/>;

const Rv = (x:number,y:number,h=16) =>
  <rect x={x-4} y={y-h/2} width="8" height={h} stroke={C} strokeWidth="1.5" fill="white"/>;

const Rh = (x:number,y:number,w=18) =>
  <rect x={x-w/2} y={y-4} width={w} height="8" stroke={C} strokeWidth="1.5" fill="white"/>;

const Gnd = ({x,y}:{x:number;y:number}) => <>
  {L(x,y,x,y+4)}<line x1={x-6} y1={y+4} x2={x+6} y2={y+4} stroke={C} strokeWidth="1.5"/>
  <line x1={x-3} y1={y+7} x2={x+3} y2={y+7} stroke={C} strokeWidth="1.5"/>
</>;

const Vcc = ({x,y,lbl='VCC'}:{x:number;y:number;lbl?:string}) => <>
  <text x={x} y={y+5} textAnchor="middle" fontSize="7" fill={C} fontFamily="monospace" fontWeight="bold">{lbl}</text>
  {L(x,y+7,x,y+13)}
</>;

const CapV = (x:number,y:number) => <>
  <line x1={x-7} y1={y-2} x2={x+7} y2={y-2} stroke={C} strokeWidth="2"/>
  <line x1={x-7} y1={y+2} x2={x+7} y2={y+2} stroke={C} strokeWidth="2"/>
</>;

const IndH = (x:number,y:number) =>
  <path d={`M${x-14},${y} C${x-14},${y-7} ${x-8},${y-7} ${x-8},${y} C${x-8},${y-7} ${x-2},${y-7} ${x-2},${y} C${x-2},${y-7} ${x+4},${y-7} ${x+4},${y} C${x+4},${y-7} ${x+10},${y-7} ${x+10},${y} L${x+14},${y}`} stroke={C} strokeWidth="1.5" fill="none"/>;

// NPN BJT: bar at bx, centre at by, collector top-right, emitter bottom-right
const NPN = ({bx,by}:{bx:number;by:number}) => <>
  {L(bx,by-14,bx,by+14,'2')}
  {L(bx-16,by,bx,by)}
  {L(bx,by-7,bx+16,by-19)}
  {L(bx,by+7,bx+16,by+19)}
  <polygon points={`${bx+8},${by+14} ${bx+15},${by+18} ${bx+9},${by+21}`} fill={C}/>
</>;

// PNP BJT: same layout but arrow on collector (pointing in)
const PNP = ({bx,by}:{bx:number;by:number}) => <>
  {L(bx,by-14,bx,by+14,'2')}
  {L(bx-16,by,bx,by)}
  {L(bx,by-7,bx+16,by-19)}
  {L(bx,by+7,bx+16,by+19)}
  <polygon points={`${bx+9},${by-12} ${bx+15},${by-16} ${bx+8},${by-21}`} fill={C}/>
</>;

// N-ch MOSFET (dashed=E-MOSFET, solid=D-MOSFET)
const NMOS = ({x,y,dashed=false}:{x:number;y:number;dashed?:boolean}) => <>
  {L(x-18,y,x-10,y)}
  <line x1={x-10} y1={y-13} x2={x-10} y2={y+13} stroke={C} strokeWidth="2"/>
  <line x1={x-6} y1={y-13} x2={x-6} y2={y+13} stroke={C} strokeWidth={dashed ? '1' : '2'}
    strokeDasharray={dashed ? '3,2' : undefined}/>
  {L(x-6,y-9,x+12,y-9)}{L(x-6,y+9,x+12,y+9)}{L(x+12,y-9,x+12,y+9)}
  {L(x-6,y,x,y)}<polygon points={`${x},${y-4} ${x+6},${y} ${x},${y+4}`} fill={C}/>
  {L(x+12,y-9,x+12,y-20)}{L(x+12,y+9,x+12,y+20)}
</>;

// JFET N-channel
const JFET = ({x,y}:{x:number;y:number}) => <>
  <line x1={x-6} y1={y-16} x2={x-6} y2={y+16} stroke={C} strokeWidth="2"/>
  {L(x-18,y,x-6,y)}
  <polygon points={`${x-6},${y-3} ${x-6},${y+3} ${x},${y}`} fill={C}/>
  {L(x-6,y-10,x+12,y-10)}{L(x-6,y+10,x+12,y+10)}{L(x+12,y-10,x+12,y+10)}
  {L(x+12,y-10,x+12,y-22)}{L(x+12,y+10,x+12,y+22)}
</>;

// Op-amp triangle pointing right
const OA = ({x,y}:{x:number;y:number}) => <>
  <polygon points={`${x-18},${y-20} ${x-18},${y+20} ${x+18},${y}`} stroke={C} strokeWidth="1.5" fill="white"/>
  <text x={x-12} y={y-5} fontSize="9" fill={C} fontFamily="monospace">−</text>
  <text x={x-12} y={y+11} fontSize="9" fill={C} fontFamily="monospace">+</text>
</>;

// Diode horizontal (anode left)
const DiodeH = (x:number,y:number) => <>
  <polygon points={`${x-8},${y-7} ${x-8},${y+7} ${x+8},${y}`} stroke={C} strokeWidth="1.5" fill="white"/>
  {L(x+8,y-7,x+8,y+7)}
</>;

// Zener horizontal
const ZenerH = (x:number,y:number) => <>
  <polygon points={`${x-8},${y-7} ${x-8},${y+7} ${x+8},${y}`} stroke={C} strokeWidth="1.5" fill="white"/>
  {L(x+8,y-7,x+8,y+7)}{L(x+8,y-7,x+4,y-11)}{L(x+8,y+7,x+12,y+11)}
</>;

const Txt = (x:number,y:number,t:string,anchor='middle') =>
  <text x={x} y={y} textAnchor={anchor as any} fontSize="7" fill={C} fontFamily="monospace">{t}</text>;

// ── 22 Circuit SVGs ────────────────────────────────────────────────────
export const CIRCUIT_SVGS: Record<string, React.ReactNode> = {

  // c1: Fixed Bias BJT
  c1: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={30} y={4}/><Vcc x={90} y={4}/>
    {/* VCC rail */}{L(30,17,90,17)}
    {/* RB: left rail → base */}
    {L(30,17,30,38)}{Rv(30,46)}{L(30,54,30,65)}{L(30,65,64,65)}
    {/* RC: right rail → collector */}
    {L(90,17,90,37)}{Rv(90,45)}{L(90,53,90,59)}
    {/* BJT */}<NPN bx={64} by={65}/>
    {/* collector wire */}{L(80,46,90,46)}{L(90,46,90,59)}
    {/* GND */}{L(80,84,80,95)}<Gnd x={80} y={95}/>
    {Txt(20,44,'RB','start')}{Txt(98,44,'RC','start')}
  </svg>,

  // c2: Voltage Divider Bias
  c2: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={100} y={4}/>
    {/* VCC rail */}{L(20,17,100,17)}
    {/* R1: VCC rail down */}{L(20,17,20,32)}{Rv(20,40)}{L(20,48,20,60)}
    {/* R2: base to GND */}{L(20,72,20,84)}{Rv(20,79)}{L(20,84,20,98)}<Gnd x={20} y={98}/>
    {/* base wire */}{L(20,60,62,60)}{L(20,60,20,72)}
    {/* RC: VCC → collector */}{L(100,17,100,37)}{Rv(100,45)}{L(100,53,100,58)}
    {/* RE: emitter → GND */}{L(78,79,78,88)}{Rv(78,96)}{L(78,104,78,108)}<Gnd x={78} y={108}/>
    {/* BJT */}<NPN bx={62} by={60}/>
    {/* collector */}{L(78,41,100,41)}{L(78,41,78,58)}{L(100,41,100,53)}
    {Txt(9,38,'R1','start')}{Txt(9,82,'R2','start')}{Txt(106,44,'RC','start')}{Txt(84,93,'RE','start')}
  </svg>,

  // c3: Emitter Follower (CC)
  c3: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={90} y={4}/>
    {L(20,17,90,17)}
    {/* RB */}{L(20,17,20,38)}{Rv(20,46)}{L(20,54,20,65)}{L(20,65,62,65)}
    {/* Collector direct to VCC */}{L(90,17,90,46)}{L(80,46,90,46)}
    {/* BJT */}<NPN bx={62} by={65}/>
    {/* RE: emitter → Vout → GND */}
    {L(78,84,78,94)}{Rv(78,101)}{L(78,108,78,112)}<Gnd x={78} y={108}/>
    {/* Vout label */}{Txt(95,90,'Vout','start')}
    {L(78,84,92,84)}
    {Txt(10,44,'RB','start')}{Txt(84,99,'RE','start')}
  </svg>,

  // c4: Darlington Pair
  c4: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={105} y={4}/>
    {/* RC */}{L(105,17,105,36)}{Rv(105,44)}{L(105,52,105,57)}
    {/* Q1 */}<NPN bx={62} by={42}/>
    {/* Q2 — lower */}<NPN bx={72} by={70}/>
    {/* Q1 emitter → Q2 base */}{L(78,61,72,61)}{L(72,61,56,70)}{L(56,70,56,70)}
    {/* Q1 collector + Q2 collector → RC */}{L(78,23,105,23)}{L(78,23,78,52)}{L(86,51,105,51)}{L(105,52,105,57)}
    {/* Base input Q1 */}{L(30,42,46,42)}<Gnd x={88} y={98}/>
    {L(88,89,88,98)}
    {Txt(25,40,'IB','end')}
    {Txt(112,43,'RC','start')}
  </svg>,

  // c5: Two NPN Cascade (CE-CE)
  c5: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={50} y={4}/><Vcc x={120} y={4}/>
    {/* RC1 */}{L(50,17,50,35)}{Rv(50,43)}{L(50,51,50,55)}
    {/* Q1 */}<NPN bx={34} by={55}/>
    {/* GND Q1 emitter */}{L(50,74,50,84)}<Gnd x={50} y={84}/>
    {/* RC1 → Q2 base */}{L(50,55,50,51)}{L(50,51,86,51)}{L(86,51,86,62)}
    {/* Actually connect collector of Q1 to base of Q2 via RC1 */}
    {/* RC2 */}{L(120,17,120,37)}{Rv(120,45)}{L(120,53,120,58)}
    {/* Q2 */}<NPN bx={100} by={62}/>
    {/* Q1 base input */}{L(14,55,18,55)}
    {/* collector Q1 to base Q2 */}{L(50,36,86,36)}{L(86,36,86,62)}
    {/* GND Q2 emitter */}{L(116,81,116,95)}<Gnd x={116} y={95}/>
    {Txt(56,42,'RC1','start')}{Txt(126,44,'RC2','start')}
  </svg>,

  // c6: PNP + NPN Mixed
  c6: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={80} y={4}/>
    {/* PNP on top — emitter up to VCC */}
    <PNP bx={62} by={38}/>
    {/* PNP emitter → VCC */}{L(78,19,80,19)}{L(80,17,80,19)}
    {/* NPN below */}<NPN bx={62} by={78}/>
    {/* Connect PNP collector to NPN collector */}{L(78,57,78,59)}{L(78,59,78,59)}
    {/* Actually they share a node */}{L(78,57,78,79)}
    {/* NPN GND */}{L(78,97,78,106)}<Gnd x={78} y={106}/>
    {/* Base inputs */}{L(20,38,46,38)}{L(20,78,46,78)}
    {Txt(14,36,'B1','end')}{Txt(14,76,'B2','end')}
    {Txt(84,57,'Vo','start')}
    {L(78,58,92,58)}
  </svg>,

  // c7: Enhancement MOSFET
  c7: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={100} y={4}/>
    {/* RD */}{L(100,17,100,36)}{Rv(100,44)}{L(100,52,100,61)}
    {/* MOSFET */}<NMOS x={85} y={60} dashed={true}/>
    {/* Gate bias */}{L(30,60,67,60)}{Rh(48,60,18)}
    {/* GND source */}{L(97,80,97,95)}<Gnd x={97} y={95}/>
    {/* VGS note */}
    <Vcc x={30} y={52} lbl="VGS"/>
    {Txt(106,44,'RD','start')}{Txt(38,55,'RG','end')}
  </svg>,

  // c8: Depletion MOSFET
  c8: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={100} y={4}/>
    {L(100,17,100,36)}{Rv(100,44)}{L(100,52,100,61)}
    <NMOS x={85} y={60} dashed={false}/>
    {/* Self-bias: source resistor RS */}
    {L(97,80,97,88)}{Rv(97,96)}{L(97,104,97,110)}<Gnd x={97} y={107}/>
    {/* Gate to source (self-bias) */}{L(30,60,67,60)}{L(30,60,30,97)}{L(30,97,97,97)}
    {Txt(106,44,'RD','start')}{Txt(103,95,'RS','start')}
    <Vcc x={100} y={4} lbl="VDD"/>
  </svg>,

  // c9: JFET
  c9: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={100} y={4} lbl="VDD"/>
    {L(100,17,100,36)}{Rv(100,44)}{L(100,52,100,59)}
    <JFET x={85} y={60}/>
    {/* Self-bias RS */}
    {L(97,82,97,90)}{Rv(97,98)}{L(97,106,97,112)}<Gnd x={97} y={108}/>
    {/* Gate ← source self-bias */}{L(30,60,67,60)}{L(30,60,30,98)}{L(30,98,97,98)}
    {Txt(106,44,'RD','start')}{Txt(103,97,'RS','start')}
  </svg>,

  // c10: Dual MOSFET stacked
  c10: <svg viewBox="0 0 160 110" className="w-full">
    <Vcc x={100} y={4} lbl="VDD"/>
    {/* M1 (top) */}
    <NMOS x={85} y={35} dashed={true}/>
    {/* M2 (bottom) */}
    <NMOS x={85} y={75} dashed={false}/>
    {/* Connect M1 source to M2 drain */}{L(97,55,97,65)}
    {/* Vo at junction */}{Txt(103,62,'Vo','start')}{L(97,60,108,60)}
    {/* VDD → M1 drain */}{L(100,17,100,25)}{L(97,25,97,25)}
    {/* M2 source → GND */}{L(97,95,97,104)}<Gnd x={97} y={104}/>
    {/* Gate biases */}{L(30,35,67,35)}{L(30,75,67,75)}
    {Txt(25,33,'VG1','end')}{Txt(25,73,'VG2','end')}
  </svg>,

  // c11: Half Wave Rectifier
  c11: <svg viewBox="0 0 160 110" className="w-full">
    {/* AC source */}
    <ellipse cx={30} cy={60} rx={14} ry={14} stroke={C} strokeWidth="1.5" fill="white"/>
    <path d={`M23,60 Q26,54 30,60 Q34,66 37,60`} stroke={C} strokeWidth="1.5" fill="none"/>
    {/* Diode */}{L(44,60,56,60)}{DiodeH(66,60)}{L(74,60,86,60)}
    {/* Load R */}{Rv(93,60,18)}{L(86,60,93,51)}{L(93,69,86,69)}
    {/* Return wire bottom */}{L(30,74,30,90)}{L(30,90,93,90)}{L(93,90,93,69)}
    {/* Vout */}{L(86,60,100,60)}{Txt(105,60,'Vout','start')}
    {Txt(64,48,'D','middle')}{Txt(99,56,'RL','start')}
  </svg>,

  // c12: Clipper Circuit
  c12: <svg viewBox="0 0 160 110" className="w-full">
    {/* Input */}{Txt(10,56,'Vin','start')}{L(22,55,40,55)}
    {/* Series R */}{Rh(55,55)}{L(65,55,80,55)}
    {/* Diode to ground */}
    <g transform="rotate(90,90,65)">{DiodeH(90,65)}</g>
    {L(90,55,90,57)}{L(90,73,90,80)}<Gnd x={90} y={80}/>
    {/* Output */}{L(90,55,120,55)}{Txt(122,56,'Vout','start')}
    {/* Bias */}{L(90,80,90,88)}{Txt(88,96,'V','end')}<text x={91} y={100} fontSize="6" fill={C} fontFamily="monospace">bias</text>
    {Txt(48,48,'RS','middle')}
  </svg>,

  // c13: Zener Regulator
  c13: <svg viewBox="0 0 160 110" className="w-full">
    {/* Vin */}{Txt(8,60,'Vin','start')}{L(18,59,30,59)}
    {/* RS series resistor */}{Rh(45,59)}{L(55,59,80,59)}
    {/* Rail */}{L(80,59,80,45)}{L(80,75,80,90)}{L(30,90,80,90)}{L(30,59,30,90)}
    {/* Zener in parallel with RL */}
    {ZenerH(100,59)}{L(80,59,92,59)}{L(108,59,120,59)}
    {/* RL */}{L(120,59,120,48)}{Rv(120,63,26)}{L(120,77,120,90)}{L(80,90,120,90)}
    {/* Vout */}{Txt(130,60,'Vout','start')}{L(120,59,138,59)}
    {Txt(38,52,'RS','middle')}{Txt(112,61,'RL','start')}
    {Txt(95,48,'VZ','middle')}
  </svg>,

  // c14: VTC (Voltage Transfer Characteristic — show the plot concept)
  c14: <svg viewBox="0 0 160 110" className="w-full">
    {/* Axes */}
    {L(20,90,20,15)}{L(20,90,140,90)}
    <polygon points="20,12 16,20 24,20" fill={C}/>
    <polygon points="143,90 135,86 135,94" fill={C}/>
    {Txt(18,12,'Vout','end')}{Txt(138,100,'Vin','middle')}
    {/* VTC shape: flat → rising → flat */}
    <path d="M25,80 L60,80 L90,30 L130,30" stroke={C} strokeWidth="1.5" fill="none"/>
    {/* Breakpoints */}
    <circle cx={60} cy={80} r={2.5} fill={C}/>
    <circle cx={90} cy={30} r={2.5} fill={C}/>
    {Txt(55,100,'V1','middle')}{Txt(90,100,'V2','middle')}
    {L(60,80,60,90,)}{L(90,30,90,90)}
  </svg>,

  // c15: Inverting Amplifier
  c15: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={90} y={55}/>
    {/* Vin → Ri → V- */}{Txt(8,46,'Vin','start')}{L(18,46,35,46)}{Rh(50,46)}{L(62,46,72,46)}
    {/* Rf feedback */}
    {L(72,46,72,25)}{L(72,25,120,25)}{L(120,25,120,55)}{Rh(96,25)}
    {/* V+ to GND */}<Gnd x={72} y={75}/>{L(72,68,72,75)}
    {/* output */}{L(108,55,130,55)}{Txt(132,56,'Vout','start')}
    {Txt(44,40,'Ri','middle')}{Txt(96,20,'Rf','middle')}
  </svg>,

  // c16: Non-Inverting Amplifier
  c16: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={90} y={55}/>
    {/* Vin → V+ */}{Txt(8,68,'Vin','start')}{L(18,68,72,68)}
    {/* Feedback: Vout → R2 → V- → R1 → GND */}
    {L(108,55,130,55)}{Txt(132,56,'Vout','start')}
    {L(120,55,120,30)}{L(120,30,72,30)}{Rh(96,30)}{L(72,30,72,46)}
    {L(72,46,72,56)}
    {Rv(72,74)}{L(72,82,72,92)}<Gnd x={72} y={92}/>
    {Txt(96,25,'R2','middle')}{Txt(60,72,'R1','end')}
  </svg>,

  // c17: Summing Amplifier
  c17: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={100} y={55}/>
    {/* 3 inputs */}
    {L(10,38,30,38)}{Rh(42,38)}{L(54,38,82,38)}{L(82,38,82,46)}
    {L(10,55,30,55)}{Rh(42,55)}{L(54,55,82,55)}
    {L(10,72,30,72)}{Rh(42,72)}{L(54,72,82,72)}{L(82,72,82,64)}
    {Txt(6,38,'V1','end')}{Txt(6,55,'V2','end')}{Txt(6,72,'V3','end')}
    {Txt(36,34,'R1','middle')}{Txt(36,51,'R2','middle')}{Txt(36,68,'R3','middle')}
    {/* Rf feedback */}
    {L(82,46,82,25)}{L(82,25,128,25)}{L(128,25,128,55)}{Rh(105,25)}
    {/* V+ GND */}<Gnd x={82} y={75}/>{L(82,68,82,75)}
    {/* output */}{L(118,55,140,55)}{Txt(142,56,'Vo','start')}
    {Txt(105,20,'Rf','middle')}
  </svg>,

  // c18: Difference Amplifier
  c18: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={100} y={55}/>
    {/* V1 → R1 → V- */}{Txt(6,44,'V1','start')}{L(16,44,34,44)}{Rh(46,44)}{L(58,44,82,44)}{L(82,44,82,46)}
    {/* V2 → R3 → V+ */}{Txt(6,70,'V2','start')}{L(16,70,34,70)}{Rh(46,70)}{L(58,70,82,70)}{L(82,70,82,64)}
    {/* Rf feedback */}{L(82,46,82,24)}{L(82,24,128,24)}{L(128,24,128,55)}{Rh(105,24)}
    {/* R4: V+ divider to GND */}{Rv(82,82)}{L(82,74,82,76)}{L(82,88,82,96)}<Gnd x={82} y={96}/>
    {/* output */}{L(118,55,140,55)}{Txt(142,56,'Vo','start')}
    {Txt(40,40,'R1','middle')}{Txt(40,66,'R3','middle')}{Txt(105,20,'Rf','middle')}{Txt(68,80,'R4','end')}
  </svg>,

  // c19: Integrator
  c19: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={95} y={55}/>
    {/* Vin → Ri → V- */}{Txt(8,46,'Vin','start')}{L(18,46,38,46)}{Rh(52,46)}{L(66,46,77,46)}
    {/* Capacitor feedback */}
    {L(77,46,77,24)}{L(77,24,122,24)}{L(122,24,122,55)}
    {CapV(99,24)}
    {/* V+ GND */}<Gnd x={77} y={76}/>{L(77,68,77,76)}
    {/* output */}{L(113,55,135,55)}{Txt(137,56,'Vout','start')}
    {Txt(45,40,'Ri','middle')}{Txt(99,16,'C','middle')}
  </svg>,

  // c20: Differentiator
  c20: <svg viewBox="0 0 160 110" className="w-full">
    <OA x={95} y={55}/>
    {/* Vin → C → V- */}{Txt(8,46,'Vin','start')}{L(18,46,38,46)}{CapV(46,46)}{L(54,46,77,46)}
    {/* Rf feedback */}
    {L(77,46,77,24)}{L(77,24,122,24)}{L(122,24,122,55)}{Rh(100,24)}
    {/* V+ GND */}<Gnd x={77} y={76}/>{L(77,68,77,76)}
    {/* output */}{L(113,55,135,55)}{Txt(137,56,'Vout','start')}
    {Txt(42,40,'C','middle')}{Txt(100,18,'Rf','middle')}
  </svg>,

  // c21: Y-Connected 3-Phase (star)
  c21: <svg viewBox="0 0 160 110" className="w-full">
    {/* Neutral center */}
    <circle cx={80} cy={60} r={3} fill={C}/>
    {/* Phase A — top */}{L(80,57,80,30)}{Rv(80,43,18)}{L(80,30,80,22)}{Txt(80,18,'A','middle')}
    {/* Phase B — bottom-right */}
    {L(83,62,103,80)}{Rv(93,72,18,)}<line x1={103} y1={80} x2={113} y2={88} stroke={C} strokeWidth="1.5"/>
    {Txt(118,92,'B','middle')}
    {/* Phase C — bottom-left */}
    {L(77,62,57,80)}<line x1={57} y1={80} x2={47} y2={88} stroke={C} strokeWidth="1.5"/>
    {Rv(67,72,18)}{Txt(42,92,'C','middle')}
    {/* Neutral */}{Txt(80,78,'N','middle')}
    {Txt(86,42,'ZA','start')}{Txt(74,72,'ZC','end')}{Txt(94,72,'ZB','start')}
  </svg>,

  // c22: Δ-Connected 3-Phase (delta/triangle)
  c22: <svg viewBox="0 0 160 110" className="w-full">
    {/* Triangle: A(top), B(bottom-right), C(bottom-left) */}
    {/* A(80,18) — B(125,88) — C(35,88) — back to A */}
    {/* A→B right side */}
    <line x1={80} y1={18} x2={125} y2={88} stroke={C} strokeWidth="1.5"/>
    <line x1={35} y1={88} x2={80} y2={18} stroke={C} strokeWidth="1.5"/>
    <line x1={35} y1={88} x2={125} y2={88} stroke={C} strokeWidth="1.5"/>
    {/* ZAB label midpoint of top-right */}{Txt(108,48,'ZAB','start')}
    {/* ZBC bottom */}{Txt(80,100,'ZBC','middle')}
    {/* ZCA left side */}{Txt(48,48,'ZCA','end')}
    {/* Terminals */}
    <circle cx={80} cy={18} r={3} fill={C}/><circle cx={125} cy={88} r={3} fill={C}/><circle cx={35} cy={88} r={3} fill={C}/>
    {Txt(80,13,'A','middle')}{Txt(131,88,'B','start')}{Txt(29,88,'C','end')}
    {/* Impedance boxes on each side */}
    {Rv(102,53,14)}{Rv(80,91,14)}{Rv(57,53,14)}
  </svg>,
};
