'use client';

import { FC } from 'react';
import type { CircuitParams } from '@/data/questions';

// ─── Constants ────────────────────────────────────────────────────────
const C = '#1a2a3a';          // dark navy for all strokes
const SW = 1.5;               // wire stroke width
const CSW = 1.8;              // component symbol stroke width
const FS = 8;                 // font size for labels
const FF = 'monospace';       // font family

// ─── Interfaces ───────────────────────────────────────────────────────
interface CircuitDiagramProps {
  circuit: CircuitParams;
  topicColor: string;
  topicBgColor: string;
}

interface CompProps {
  components: Record<string, string>;
  labels?: Record<string, string>;
}

// ─── Main Component ───────────────────────────────────────────────────
const CircuitDiagram: FC<CircuitDiagramProps> = ({ circuit, topicColor, topicBgColor }) => {
  const { type, components, labels } = circuit;

  const renderCircuit = () => {
    switch (type) {
      case 'two_npn_cascade':       return <TwoNPNCascade components={components} labels={labels} />;
      case 'two_npn_cascade_2':     return <TwoNPNCascade2 components={components} labels={labels} />;
      case 'two_npn_cascade_sat':   return <TwoNPNCascadeSat components={components} labels={labels} />;
      case 'pnp_npn_mixed':         return <PnpNpnMixed components={components} labels={labels} />;
      case 'darlington':            return <DarlingtonCircuit components={components} labels={labels} />;
      case 'vdb_circuit':           return <VDBCircuit components={components} labels={labels} />;
      case 'zener_regulator':       return <ZenerRegulator components={components} labels={labels} />;
      case 'two_zener_parallel':    return <TwoZenerParallel components={components} labels={labels} />;
      case 'two_diode_series':      return <TwoDiodeSeries components={components} labels={labels} />;
      case 'diode_zener_combo':     return <DiodeZenerCombo components={components} labels={labels} />;
      case 'zener_switch':          return <ZenerSwitch components={components} labels={labels} />;
      case 'pf_correction':
      case 'pf_correction_rl':      return <PFCorrection components={components} labels={labels} />;
      case 'parallel_loads':        return <ParallelLoads components={components} labels={labels} />;
      case 'y_delta':               return <YDeltaConversion components={components} labels={labels} />;
      case 'y_3phase':              return <Y3Phase components={components} labels={labels} />;
      case 'y_delta_3phase':        return <YDelta3Phase components={components} labels={labels} />;
      case 'simple_dc_loop':        return <SimpleDCLoop components={components} labels={labels} />;
      case 'mesh_4loop':            return <Mesh4Loop components={components} labels={labels} />;
      case 'superposition':         return <SuperpositionCircuit components={components} labels={labels} />;
      case 'rc_discharge':          return <RCDischarge components={components} labels={labels} />;
      case 'rl_switch':
      case 'rl_rc_switch':          return <RLSwitchCircuit components={components} labels={labels} />;
      case 'parallel_rlc':
      case 'series_rlc':            return <RLCCircuit components={components} labels={labels} type={type} />;
      case 'emosfet_simple':        return <EMOSFETSimple components={components} labels={labels} />;
      case 'two_dmosfet_series':
      case 'two_jfet_series':       return <TwoFETSeries components={components} labels={labels} />;
      case 'emosfet_dmosfet':       return <EMOSFETDMOSFET components={components} labels={labels} />;
      case 'two_dmosfet_bias':      return <TwoDMOSFETBias components={components} labels={labels} />;
      case 'single_diode':          return <SingleDiode components={components} labels={labels} />;
      case 'multi_opamp':
      case 'opamp_multi_input':
      case 'opamp_find_alpha':      return <OpAmpCircuit components={components} labels={labels} />;
      default:                      return <GenericCircuit components={components} labels={labels} />;
    }
  };

  return (
    <div
      className="rounded-lg p-3 border h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: topicBgColor, borderColor: topicColor + '40' }}
    >
      <div className="font-ui text-[10px] font-bold uppercase tracking-wider mb-2 text-center" style={{ color: topicColor }}>
        Circuit Diagram
      </div>
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <svg viewBox="0 0 300 220" className="w-full max-w-[300px]" style={{ maxHeight: '240px' }}>
          {renderCircuit()}
        </svg>
      </div>
      {labels?.title && (
        <div className="font-ui text-[9px] text-center mt-1" style={{ color: topicColor + '80' }}>
          {labels.title}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

// Junction dot at connection points
const Dot = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r={2.5} fill={C} />
);

// Wire segment
const W = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth={SW} />
);

// Label text
const Lbl = ({ x, y, text, anchor = 'start', size = FS }: { x: number; y: number; text: string; anchor?: string; size?: number }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={C} fontFamily={FF}>{text}</text>
);

// ─── Resistor (American zigzag) ───────────────────────────────────────
// Horizontal resistor from (x1,y) to (x2,y)
const HRes = ({ x1, y, x2, label, labelY }: { x1: number; y: number; x2: number; label?: string; labelY?: number }) => {
  const len = x2 - x1;
  const lead = len * 0.2;
  const bodyLen = len - 2 * lead;
  const peaks = 6;
  const step = bodyLen / peaks;
  const amp = 5;
  let pts = `${x1 + lead},${y}`;
  for (let i = 0; i < peaks; i++) {
    const px = x1 + lead + step * (i + 0.5);
    const py = y + (i % 2 === 0 ? -amp : amp);
    pts += ` ${px},${py}`;
  }
  pts += ` ${x2 - lead},${y}`;
  return (
    <g>
      <line x1={x1} y1={y} x2={x1 + lead} y2={y} stroke={C} strokeWidth={SW} />
      <polyline points={pts} fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={x2 - lead} y1={y} x2={x2} y2={y} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={(x1 + x2) / 2} y={labelY ?? y - 8} text={label} anchor="middle" />}
    </g>
  );
};

// Vertical resistor from (x,y1) to (x,y2)
const VRes = ({ x, y1, y2, label, labelX }: { x: number; y1: number; y2: number; label?: string; labelX?: number }) => {
  const len = y2 - y1;
  const lead = Math.abs(len) * 0.2;
  const top = Math.min(y1, y2);
  const bot = Math.max(y1, y2);
  const bodyStart = top + lead;
  const bodyEnd = bot - lead;
  const bodyLen = bodyEnd - bodyStart;
  const peaks = 6;
  const step = bodyLen / peaks;
  const amp = 5;
  let pts = `${x},${bodyStart}`;
  for (let i = 0; i < peaks; i++) {
    const py = bodyStart + step * (i + 0.5);
    const px = x + (i % 2 === 0 ? -amp : amp);
    pts += ` ${px},${py}`;
  }
  pts += ` ${x},${bodyEnd}`;
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={bodyStart} stroke={C} strokeWidth={SW} />
      <polyline points={pts} fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={x} y1={bodyEnd} x2={x} y2={bot} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x + 10} y={(y1 + y2) / 2 + 3} text={label} />}
    </g>
  );
};

// ─── NPN Transistor ───────────────────────────────────────────────────
// Center at (x,y). Base input at (x-14, y). Collector at (x+8, y-14). Emitter at (x+8, y+14).
const NPN = ({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={13} fill="none" stroke={C} strokeWidth={1.2} />
    {/* Base line */}
    <line x1={-13} y1={0} x2={-5} y2={0} stroke={C} strokeWidth={1.5} />
    {/* Vertical base bar */}
    <line x1={-5} y1={-7} x2={-5} y2={7} stroke={C} strokeWidth={2.2} />
    {/* Collector line */}
    <line x1={-5} y1={-4} x2={7} y2={-10} stroke={C} strokeWidth={1.4} />
    {/* Emitter line */}
    <line x1={-5} y1={4} x2={7} y2={10} stroke={C} strokeWidth={1.4} />
    {/* Emitter arrow (pointing outward - away from base) */}
    <polygon points="3,7 7,10 4,11" fill={C} />
    {/* Collector wire up */}
    <line x1={7} y1={-10} x2={7} y2={-17} stroke={C} strokeWidth={SW} />
    {/* Emitter wire down */}
    <line x1={7} y1={10} x2={7} y2={17} stroke={C} strokeWidth={SW} />
    {/* Base wire left */}
    <line x1={-13} y1={0} x2={-18} y2={0} stroke={C} strokeWidth={SW} />
    {label && <text x={-4} y={2} fontSize={6} fill={C} fontFamily={FF}>{label}</text>}
  </g>
);

// ─── PNP Transistor ───────────────────────────────────────────────────
// Same structure but emitter arrow points INWARD (toward base)
const PNP = ({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={13} fill="none" stroke={C} strokeWidth={1.2} />
    <line x1={-13} y1={0} x2={-5} y2={0} stroke={C} strokeWidth={1.5} />
    <line x1={-5} y1={-7} x2={-5} y2={7} stroke={C} strokeWidth={2.2} />
    <line x1={-5} y1={-4} x2={7} y2={-10} stroke={C} strokeWidth={1.4} />
    <line x1={-5} y1={4} x2={7} y2={10} stroke={C} strokeWidth={1.4} />
    {/* Emitter arrow pointing INWARD (toward base) */}
    <polygon points="-2,6 -5,4 -1,3" fill={C} />
    <line x1={7} y1={-10} x2={7} y2={-17} stroke={C} strokeWidth={SW} />
    <line x1={7} y1={10} x2={7} y2={17} stroke={C} strokeWidth={SW} />
    <line x1={-13} y1={0} x2={-18} y2={0} stroke={C} strokeWidth={SW} />
    {label && <text x={-4} y={2} fontSize={6} fill={C} fontFamily={FF}>{label}</text>}
  </g>
);

// ─── E-MOSFET (N-channel) ─────────────────────────────────────────────
// Gate at left, drain top, source bottom, circle, gap between gate and channel
const EMOSFET = ({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={13} fill="none" stroke={C} strokeWidth={1.0} />
    {/* Gate line */}
    <line x1={-18} y1={0} x2={-8} y2={0} stroke={C} strokeWidth={1.5} />
    {/* Gate plate (with gap = oxide) */}
    <line x1={-8} y1={-7} x2={-8} y2={7} stroke={C} strokeWidth={2} />
    {/* Channel segments (broken - for enhancement mode) */}
    <line x1={-4} y1={-8} x2={-4} y2={-3} stroke={C} strokeWidth={1.5} />
    <line x1={-4} y1={3} x2={-4} y2={8} stroke={C} strokeWidth={1.5} />
    {/* Drain connection */}
    <line x1={-4} y1={-5.5} x2={6} y2={-5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={-5.5} x2={6} y2={-15} stroke={C} strokeWidth={SW} />
    {/* Source connection */}
    <line x1={-4} y1={5.5} x2={6} y2={5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={5.5} x2={6} y2={15} stroke={C} strokeWidth={SW} />
    {/* Arrow on source pointing in (n-channel) */}
    <polygon points="-1,3 -4,5.5 0,5.5" fill={C} />
    {label && <text x={-3} y={1} fontSize={5} fill={C} fontFamily={FF}>{label}</text>}
  </g>
);

// ─── D-MOSFET (N-channel) ─────────────────────────────────────────────
// Same as E-MOSFET but channel is continuous (depletion mode)
const DMOSFET = ({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={13} fill="none" stroke={C} strokeWidth={1.0} />
    <line x1={-18} y1={0} x2={-8} y2={0} stroke={C} strokeWidth={1.5} />
    <line x1={-8} y1={-7} x2={-8} y2={7} stroke={C} strokeWidth={2} />
    {/* Continuous channel (depletion mode) */}
    <line x1={-4} y1={-8} x2={-4} y2={8} stroke={C} strokeWidth={1.5} />
    {/* Drain */}
    <line x1={-4} y1={-5.5} x2={6} y2={-5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={-5.5} x2={6} y2={-15} stroke={C} strokeWidth={SW} />
    {/* Source */}
    <line x1={-4} y1={5.5} x2={6} y2={5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={5.5} x2={6} y2={15} stroke={C} strokeWidth={SW} />
    <polygon points="-1,3 -4,5.5 0,5.5" fill={C} />
    {label && <text x={-3} y={1} fontSize={5} fill={C} fontFamily={FF}>{label}</text>}
  </g>
);

// ─── JFET (N-channel) ─────────────────────────────────────────────────
const JFET = ({ x, y, label, s = 1 }: { x: number; y: number; label?: string; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={13} fill="none" stroke={C} strokeWidth={1.0} />
    <line x1={-18} y1={0} x2={-6} y2={0} stroke={C} strokeWidth={1.5} />
    {/* Gate arrow pointing in */}
    <line x1={-6} y1={-7} x2={-6} y2={7} stroke={C} strokeWidth={2} />
    <polygon points="-9,0 -6,-2 -6,2" fill={C} />
    {/* Channel */}
    <line x1={-2} y1={-8} x2={-2} y2={8} stroke={C} strokeWidth={1.5} />
    {/* Drain */}
    <line x1={-2} y1={-5.5} x2={6} y2={-5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={-5.5} x2={6} y2={-15} stroke={C} strokeWidth={SW} />
    {/* Source */}
    <line x1={-2} y1={5.5} x2={6} y2={5.5} stroke={C} strokeWidth={1.2} />
    <line x1={6} y1={5.5} x2={6} y2={15} stroke={C} strokeWidth={SW} />
    {label && <text x={-2} y={1} fontSize={5} fill={C} fontFamily={FF}>{label}</text>}
  </g>
);

// ─── Diode (pointing down: anode at bottom, cathode at top) ───────────
// Current flows top-to-bottom through the diode
const DiodeD = ({ x, yTop, yBot, label, labelX }: { x: number; yTop: number; yBot: number; label?: string; labelX?: number }) => {
  const mid = (yTop + yBot) / 2;
  const h = 8;
  const w = 7;
  return (
    <g>
      <line x1={x} y1={yTop} x2={x} y2={mid - h} stroke={C} strokeWidth={SW} />
      {/* Triangle pointing down (anode bar at top = cathode) */}
      <polygon points={`${x - w},${mid - h} ${x + w},${mid - h} ${x},${mid + h}`} fill="none" stroke={C} strokeWidth={CSW} />
      {/* Cathode bar */}
      <line x1={x - w} y1={mid + h} x2={x + w} y2={mid + h} stroke={C} strokeWidth={CSW} />
      <line x1={x} y1={mid + h} x2={x} y2={yBot} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x + 10} y={mid + 3} text={label} />}
    </g>
  );
};

// ─── Zener Diode (pointing down: cathode at top with zener arms) ──────
const ZenerD = ({ x, yTop, yBot, label, labelX }: { x: number; yTop: number; yBot: number; label?: string; labelX?: number }) => {
  const mid = (yTop + yBot) / 2;
  const h = 8;
  const w = 7;
  return (
    <g>
      <line x1={x} y1={yTop} x2={x} y2={mid - h} stroke={C} strokeWidth={SW} />
      {/* Triangle pointing down */}
      <polygon points={`${x - w},${mid - h} ${x + w},${mid - h} ${x},${mid + h}`} fill="none" stroke={C} strokeWidth={CSW} />
      {/* Cathode bar */}
      <line x1={x - w} y1={mid + h} x2={x + w} y2={mid + h} stroke={C} strokeWidth={CSW} />
      {/* Zener arms on the bar */}
      <line x1={x - w} y1={mid + h} x2={x - w - 3} y2={mid + h - 4} stroke={C} strokeWidth={CSW} />
      <line x1={x + w} y1={mid + h} x2={x + w + 3} y2={mid + h + 4} stroke={C} strokeWidth={CSW} />
      <line x1={x} y1={mid + h} x2={x} y2={yBot} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x + 12} y={mid + 3} text={label} />}
    </g>
  );
};

// ─── Diode (horizontal, pointing right) ───────────────────────────────
const DiodeH = ({ x1, y, x2, label, labelY }: { x1: number; y: number; x2: number; label?: string; labelY?: number }) => {
  const mid = (x1 + x2) / 2;
  const w = 8;
  const h = 7;
  return (
    <g>
      <line x1={x1} y1={y} x2={mid - w} y2={y} stroke={C} strokeWidth={SW} />
      <polygon points={`${mid - w},${y - h} ${mid - w},${y + h} ${mid + w},${y}`} fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={mid + w} y1={y - h} x2={mid + w} y2={y + h} stroke={C} strokeWidth={CSW} />
      <line x1={mid + w} y1={y} x2={x2} y2={y} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={mid} y={labelY ?? y - 10} text={label} anchor="middle" />}
    </g>
  );
};

// ─── Ground Symbol ────────────────────────────────────────────────────
const Gnd = ({ x, y }: { x: number; y: number }) => (
  <g>
    <line x1={x} y1={y - 3} x2={x} y2={y} stroke={C} strokeWidth={SW} />
    <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke={C} strokeWidth={1.4} />
    <line x1={x - 5} y1={y + 3} x2={x + 5} y2={y + 3} stroke={C} strokeWidth={1.4} />
    <line x1={x - 2} y1={y + 6} x2={x + 2} y2={y + 6} stroke={C} strokeWidth={1.4} />
  </g>
);

// ─── VCC label ────────────────────────────────────────────────────────
const VCC = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y + 5} stroke={C} strokeWidth={SW} />
    <Lbl x={x} y={y - 1} text={label} anchor="middle" />
  </g>
);

// ─── Voltage Source (DC, circle with +/-) ─────────────────────────────
const VSrc = ({ x, y1, y2, label, labelX }: { x: number; y1: number; y2: number; label?: string; labelX?: number }) => {
  const mid = (y1 + y2) / 2;
  const r = Math.min(10, Math.abs(y2 - y1) * 0.25);
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - r} stroke={C} strokeWidth={SW} />
      <circle cx={x} cy={mid} r={r} fill="none" stroke={C} strokeWidth={CSW} />
      <text x={x} y={mid - 2} textAnchor="middle" fontSize={7} fill={C} fontFamily={FF}>+</text>
      <text x={x} y={mid + 6} textAnchor="middle" fontSize={7} fill={C} fontFamily={FF}>&#8722;</text>
      <line x1={x} y1={mid + r} x2={x} y2={y2} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x - 14} y={mid + 3} text={label} anchor="end" />}
    </g>
  );
};

// ─── AC Source (circle with sine wave) ────────────────────────────────
const ACSrc = ({ x, y1, y2, label, labelX }: { x: number; y1: number; y2: number; label?: string; labelX?: number }) => {
  const mid = (y1 + y2) / 2;
  const r = Math.min(10, Math.abs(y2 - y1) * 0.25);
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - r} stroke={C} strokeWidth={SW} />
      <circle cx={x} cy={mid} r={r} fill="none" stroke={C} strokeWidth={CSW} />
      <path d={`M${x - 5},${mid} Q${x - 2.5},${mid - 5} ${x},${mid} Q${x + 2.5},${mid + 5} ${x + 5},${mid}`} fill="none" stroke={C} strokeWidth={1.2} />
      <line x1={x} y1={mid + r} x2={x} y2={y2} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x - 14} y={mid + 3} text={label} anchor="end" />}
    </g>
  );
};

// ─── Capacitor (vertical) ─────────────────────────────────────────────
const CapV = ({ x, y1, y2, label, labelX }: { x: number; y1: number; y2: number; label?: string; labelX?: number }) => {
  const mid = (y1 + y2) / 2;
  const gap = 3;
  const w = 7;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - gap} stroke={C} strokeWidth={SW} />
      <line x1={x - w} y1={mid - gap} x2={x + w} y2={mid - gap} stroke={C} strokeWidth={CSW} />
      <line x1={x - w} y1={mid + gap} x2={x + w} y2={mid + gap} stroke={C} strokeWidth={CSW} />
      <line x1={x} y1={mid + gap} x2={x} y2={y2} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x + 10} y={mid + 3} text={label} />}
    </g>
  );
};

// ─── Capacitor (horizontal) ───────────────────────────────────────────
const CapH = ({ x1, y, x2, label, labelY }: { x1: number; y: number; x2: number; label?: string; labelY?: number }) => {
  const mid = (x1 + x2) / 2;
  const gap = 3;
  const h = 7;
  return (
    <g>
      <line x1={x1} y1={y} x2={mid - gap} y2={y} stroke={C} strokeWidth={SW} />
      <line x1={mid - gap} y1={y - h} x2={mid - gap} y2={y + h} stroke={C} strokeWidth={CSW} />
      <line x1={mid + gap} y1={y - h} x2={mid + gap} y2={y + h} stroke={C} strokeWidth={CSW} />
      <line x1={mid + gap} y1={y} x2={x2} y2={y} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={mid} y={labelY ?? y - 10} text={label} anchor="middle" />}
    </g>
  );
};

// ─── Inductor (vertical bumps) ────────────────────────────────────────
const IndV = ({ x, y1, y2, label, labelX }: { x: number; y1: number; y2: number; label?: string; labelX?: number }) => {
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - 12} stroke={C} strokeWidth={SW} />
      {/* Three bumps */}
      <path d={`M${x},${mid - 12} C${x + 6},${mid - 8} ${x + 6},${mid - 4} ${x},${mid} C${x - 6},${mid + 4} ${x - 6},${mid + 8} ${x},${mid + 12}`} fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={x} y1={mid + 12} x2={x} y2={y2} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={labelX ?? x + 10} y={mid + 3} text={label} />}
    </g>
  );
};

// ─── Inductor (horizontal bumps) ──────────────────────────────────────
const IndH = ({ x1, y, x2, label, labelY }: { x1: number; y: number; x2: number; label?: string; labelY?: number }) => {
  const mid = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y} x2={mid - 12} y2={y} stroke={C} strokeWidth={SW} />
      <path d={`M${mid - 12},${y} C${mid - 8},${y - 6} ${mid - 4},${y - 6} ${mid},${y} C${mid + 4},${y + 6} ${mid + 8},${y + 6} ${mid + 12},${y}`} fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={mid + 12} y1={y} x2={x2} y2={y} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={mid} y={labelY ?? y - 10} text={label} anchor="middle" />}
    </g>
  );
};

// ─── Op-Amp Triangle ──────────────────────────────────────────────────
const OpAmpSym = ({ x, y, label }: { x: number; y: number; label?: string }) => (
  <g>
    <polygon points={`${x},${y - 16} ${x + 28},${y} ${x},${y + 16}`} fill="none" stroke={C} strokeWidth={CSW} />
    <text x={x + 8} y={y - 5} fontSize={8} fill={C} fontFamily={FF}>+</text>
    <text x={x + 7} y={y + 8} fontSize={8} fill={C} fontFamily={FF}>&#8722;</text>
    {label && <Lbl x={x + 5} y={y + 2} text={label} size={6} />}
  </g>
);

// ─── Switch Symbol ────────────────────────────────────────────────────
const SwitchH = ({ x1, y, x2, closed = false, label }: { x1: number; y: number; x2: number; closed?: boolean; label?: string }) => {
  const mid = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y} x2={mid - 8} y2={y} stroke={C} strokeWidth={SW} />
      <circle cx={mid - 8} cy={y} r={2} fill={C} />
      <circle cx={mid + 8} cy={y} r={2} fill={C} />
      {closed
        ? <line x1={mid - 8} y1={y} x2={mid + 8} y2={y} stroke={C} strokeWidth={SW} />
        : <line x1={mid - 8} y1={y} x2={mid + 6} y2={y - 8} stroke={C} strokeWidth={SW} />
      }
      <line x1={mid + 8} y1={y} x2={x2} y2={y} stroke={C} strokeWidth={SW} />
      {label && <Lbl x={mid} y={y - 12} text={label} anchor="middle" size={7} />}
    </g>
  );
};


// ═══════════════════════════════════════════════════════════════════════
// CIRCUIT IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════

// ─── 1. two_npn_cascade ───────────────────────────────────────────────
// Q1 base → RB → VBB (with ground), Q1 collector → RC1 → VCC
// Q1 collector → Q2 base, Q2 collector → VCC (direct), both emitters → shared RE → GND
function TwoNPNCascade({ components, labels }: CompProps) {
  const rb = components.rb || 'RB';
  const rc1 = components.rc1 || 'RC1';
  const re = components.re || 'RE';
  const vbb = components.vbb || 'VBB';
  const vcc = components.vcc || 'VCC';
  const beta = components.beta || '100';
  const q1 = labels?.q1 || 'Q\u2081';
  const q2 = labels?.q2 || 'Q\u2082';

  return (
    <g>
      {/* Q1 at (80,95), Q2 at (200,95) */}
      <NPN x={80} y={95} label={q1} s={0.85} />
      <NPN x={200} y={95} label={q2} s={0.85} />

      {/* Q1 base → RB → VBB+GND */}
      <W x1={62} y1={95} x2={50} y2={95} />
      <HRes x1={50} y1={95} x2={22} y2={95} label={rb} />
      <W x1={22} y1={95} x2={14} y2={95} />
      <VSrc x={14} y1={95} y2={150} label={vbb} labelX={1} />
      <W x1={14} y1={150} x2={14} y2={155} />
      <Gnd x={14} y={155} />

      {/* Q1 collector → RC1 → VCC */}
      <W x1={86} y1={78} x2={86} y2={65} />
      <VRes x={86} y1={65} y2={40} label={rc1} labelX={96} />
      <W x1={86} y1={40} x2={86} y2={30} />
      <VCC x={86} y={30} label={vcc} />

      {/* Q1 collector junction → Q2 base */}
      <Dot x={86} y={55} />
      <W x1={86} y1={55} x2={108} y2={55} />
      <W x1={108} y1={55} x2={108} y2={95} />
      <W x1={108} y1={95} x2={182} y2={95} />

      {/* Q2 collector → VCC (direct, no RC) */}
      <W x1={206} y1={78} x2={206} y2={30} />
      <VCC x={206} y={30} label={vcc} />

      {/* Emitters → shared RE → GND */}
      <W x1={86} y1={112} x2={86} y2={135} />
      <W x1={206} y1={112} x2={206} y2={135} />
      <W x1={86} y1={135} x2={206} y2={135} />
      <Dot x={146} y={135} />
      <W x1={146} y1={135} x2={146} y2={145} />
      <VRes x={146} y1={145} y2={175} label={re} labelX={158} />
      <Gnd x={146} y={180} />

      <Lbl x={146} y={205} text={`\u03B2=${beta}`} anchor="middle" size={7} />
    </g>
  );
}

// ─── 2. two_npn_cascade_2 ─────────────────────────────────────────────
// T1 base → RB → VCC (NOT VBB!), T1 collector → RC1 → VCC
// T1 collector → T2 base, T2 collector → RC2 → VCC
// Separate RE1 and RE2 to ground
function TwoNPNCascade2({ components, labels }: CompProps) {
  const rb = components.rb || 'RB';
  const rc1 = components.rc1 || 'RC1';
  const rc2 = components.rc2 || 'RC2';
  const re1 = components.re1 || 'RE1';
  const re2 = components.re2 || 'RE2';
  const vcc = components.vcc || 'VCC';
  const beta = components.beta || '120';
  const t1 = labels?.t1 || 'T\u2081';
  const t2 = labels?.t2 || 'T\u2082';

  return (
    <g>
      <NPN x={80} y={85} label={t1} s={0.85} />
      <NPN x={205} y={85} label={t2} s={0.85} />

      {/* T1 base → RB → VCC */}
      <W x1={62} y1={85} x2={50} y2={85} />
      <HRes x1={50} y1={85} x2={22} y2={85} label={rb} />
      <W x1={22} y1={85} x2={14} y2={85} />
      <VCC x={14} y={85} label={vcc} />

      {/* T1 collector → RC1 → VCC */}
      <W x1={86} y1={68} x2={86} y2={55} />
      <VRes x={86} y1={55} y2={30} label={rc1} labelX={96} />
      <W x1={86} y1={30} x2={86} y2={20} />
      <VCC x={86} y={20} label={vcc} />

      {/* T1 collector → T2 base */}
      <Dot x={86} y={48} />
      <W x1={86} y1={48} x2={110} y2={48} />
      <W x1={110} y1={48} x2={110} y2={85} />
      <W x1={110} y1={85} x2={187} y2={85} />

      {/* T2 collector → RC2 → VCC */}
      <W x1={211} y1={68} x2={211} y2={55} />
      <VRes x={211} y1={55} y2={30} label={rc2} labelX={221} />
      <W x1={211} y1={30} x2={211} y2={20} />
      <VCC x={211} y={20} label={vcc} />

      {/* T1 emitter → RE1 → GND */}
      <W x1={86} y1={102} x2={86} y2={115} />
      <VRes x={86} y1={115} y2={150} label={re1} labelX={96} />
      <Gnd x={86} y={156} />

      {/* T2 emitter → RE2 → GND */}
      <W x1={211} y1={102} x2={211} y2={115} />
      <VRes x={211} y1={115} y2={150} label={re2} labelX={221} />
      <Gnd x={211} y={156} />

      <Lbl x={148} y={205} text={`\u03B2=${beta}`} anchor="middle" size={7} />
    </g>
  );
}

// ─── 3. two_npn_cascade_sat ───────────────────────────────────────────
// Q1 base → RB → VCC (not VBB), Q2 collector → RC2 → VCC, shared RE → GND
function TwoNPNCascadeSat({ components, labels }: CompProps) {
  const rb = components.rb || 'RB';
  const rc1 = components.rc1 || 'RC1';
  const rc2 = components.rc2 || 'RC2';
  const re = components.re || 'RE';
  const vcc = components.vcc || 'VCC';

  return (
    <g>
      <NPN x={80} y={90} label={labels?.q1 || 'Q\u2081'} s={0.85} />
      <NPN x={205} y={90} label={labels?.q2 || 'Q\u2082'} s={0.85} />

      {/* Q1 base → RB → VCC */}
      <W x1={62} y1={90} x2={50} y2={90} />
      <HRes x1={50} y1={90} x2={22} y2={90} label={rb} />
      <W x1={22} y1={90} x2={14} y2={90} />
      <VCC x={14} y={90} label={vcc} />

      {/* Q1 collector → RC1 → VCC */}
      <W x1={86} y1={73} x2={86} y2={55} />
      <VRes x={86} y1={55} y2={30} label={rc1} labelX={96} />
      <W x1={86} y1={30} x2={86} y2={20} />
      <VCC x={86} y={20} label={vcc} />

      {/* Q1 collector → Q2 base */}
      <Dot x={86} y={50} />
      <W x1={86} y1={50} x2={112} y2={50} />
      <W x1={112} y1={50} x2={112} y2={90} />
      <W x1={112} y1={90} x2={187} y2={90} />

      {/* Q2 collector → RC2 → VCC */}
      <W x1={211} y1={73} x2={211} y2={55} />
      <VRes x={211} y1={55} y2={30} label={rc2} labelX={221} />
      <W x1={211} y1={30} x2={211} y2={20} />
      <VCC x={211} y={20} label={vcc} />

      {/* Shared emitters → RE → GND */}
      <W x1={86} y1={107} x2={86} y2={130} />
      <W x1={211} y1={107} x2={211} y2={130} />
      <W x1={86} y1={130} x2={211} y2={130} />
      <Dot x={148} y={130} />
      <VRes x={148} y1={130} y2={165} label={re} labelX={160} />
      <Gnd x={148} y={172} />
    </g>
  );
}

// ─── 4. pnp_npn_mixed ─────────────────────────────────────────────────
// Q1 (pnp): emitter to +15V, base through RB to ground, collector through R1 to ground
// Q1 collector → Q2 base, Q2 (npn): collector through R2 to +10V, emitter to ground
function PnpNpnMixed({ components, labels }: CompProps) {
  const rb = components.rb || '60k';
  const r1 = components.r1 || '1k';
  const r2 = components.r2 || '1k';
  const vcc1 = components.vcc1 || '+15V';
  const vcc2 = components.vcc2 || '+10V';
  const alpha = components.alpha || '0.98';
  const beta_npn = components.beta_npn || '100';

  return (
    <g>
      {/* Q1 pnp at (85,80) - emitter top, base left, collector bottom */}
      <PNP x={85} y={80} label={labels?.q1 || 'Q\u2081'} s={0.85} />
      {/* Q2 npn at (210,100) */}
      <NPN x={210} y={100} label={labels?.q2 || 'Q\u2082'} s={0.85} />

      {/* Q1 emitter → +15V (top) */}
      <W x1={91} y1={63} x2={91} y2={25} />
      <VCC x={91} y={25} label={vcc1} />

      {/* Q1 base → RB → ground (left) */}
      <W x1={67} y1={80} x2={55} y2={80} />
      <HRes x1={55} y1={80} x2={25} y2={80} label={rb} />
      <W x1={25} y1={80} x2={20} y2={80} />
      <W x1={20} y1={80} x2={20} y2={120} />
      <Gnd x={20} y={120} />

      {/* Q1 collector → R1 → ground (bottom) */}
      <W x1={91} y1={97} x2={91} y2={110} />
      <VRes x={91} y1={110} y2={145} label={r1} labelX={102} />
      <Gnd x={91} y={152} />

      {/* Q1 collector → Q2 base (junction) */}
      <Dot x={91} y={105} />
      <W x1={91} y1={105} x2={115} y2={105} />
      <W x1={115} y1={105} x2={115} y2={100} />
      <W x1={115} y1={100} x2={192} y2={100} />

      {/* Q2 collector → R2 → VCC2 */}
      <W x1={216} y1={83} x2={216} y2={60} />
      <VRes x={216} y1={60} y2={35} label={r2} labelX={226} />
      <W x1={216} y1={35} x2={216} y2={25} />
      <VCC x={216} y={25} label={vcc2} />

      {/* Q2 emitter → GND */}
      <W x1={216} y1={117} x2={216} y2={155} />
      <Gnd x={216} y={158} />

      <Lbl x={140} y={205} text={`\u03B1=${alpha} \u03B2=${beta_npn}`} anchor="middle" size={7} />
    </g>
  );
}

// ─── 5. darlington ────────────────────────────────────────────────────
// Q1 base → RB → VCC, Q1 collector → VCC (direct)
// Q1 emitter → Q2 base, Q2 collector → Q1 collector line
// Q2 emitter → RE → ground
function DarlingtonCircuit({ components, labels }: CompProps) {
  const rb = components.rb || 'RB';
  const re = components.re || 'RE';
  const vcc = components.vcc || 'VCC';
  const beta1 = components.beta1 || '\u03B2\u2081';
  const beta2 = components.beta2 || '\u03B2\u2082';

  return (
    <g>
      <NPN x={120} y={55} label="Q\u2081" s={0.8} />
      <NPN x={120} y={130} label="Q\u2082" s={0.8} />

      {/* Q1 base → RB → VCC */}
      <W x1={102} y1={55} x2={85} y2={55} />
      <HRes x1={85} y1={55} x2={40} y2={55} label={rb} />
      <W x1={40} y1={55} x2={30} y2={55} />
      <VCC x={30} y={55} label={vcc} />

      {/* Q1 collector → VCC (direct) */}
      <W x1={126} y1={38} x2={126} y2={18} />
      <VCC x={126} y={18} label={vcc} />

      {/* Q1 emitter → Q2 base */}
      <W x1={126} y1={72} x2={126} y2={82} />
      <W x1={126} y1={82} x2={102} y2={82} />
      <W x1={102} y1={82} x2={102} y2={130} />

      {/* Q2 collector → back up to Q1 collector line */}
      <W x1={126} y1={113} x2={145} y2={113} />
      <W x1={145} y1={113} x2={145} y2={38} />
      <W x1={145} y1={38} x2={126} y2={38} />
      <Dot x={126} y={38} />

      {/* Q2 emitter → RE → GND */}
      <W x1={126} y1={147} x2={126} y2={162} />
      <VRes x={126} y1={162} y2={192} label={re} labelX={138} />
      <Gnd x={126} y={198} />

      <Lbl x={150} y={205} text={`${beta1} ${beta2}`} anchor="start" size={7} />
    </g>
  );
}

// ─── 6. vdb_circuit (Voltage Divider Bias) ────────────────────────────
// VCC → R1 → base node → R2 → GND (divider)
// Base node → Q base, VCC → RC → Q collector, Q emitter → RE → GND
function VDBCircuit({ components, labels }: CompProps) {
  const r1 = components.r1 || '30k';
  const r2 = components.r2 || '20k';
  const rc = components.rc || '3k';
  const re = components.re || '3k';
  const vcc = components.vcc || '12V';

  return (
    <g>
      <NPN x={170} y={100} label="Q" s={0.85} />

      {/* VCC top rail */}
      <VCC x={70} y={18} label={vcc} />
      <VCC x={176} y={18} label={vcc} />
      <W x1={70} y1={18} x2={70} y2={25} />
      <W x1={176} y1={18} x2={176} y2={25} />

      {/* R1: VCC → base node */}
      <VRes x={70} y1={25} y2={70} label={r1} labelX={55} />

      {/* R2: base node → GND */}
      <VRes x={70} y1={70} y2={130} label={r2} labelX={55} />
      <Gnd x={70} y={136} />

      {/* Base connection: base node → Q base */}
      <Dot x={70} y={100} />
      <W x1={70} y1={100} x2={152} y2={100} />

      {/* RC: VCC → collector */}
      <VRes x={176} y1={25} y2={78} label={rc} labelX={190} />
      <W x1={176} y1={78} x2={176} y2={83} />

      {/* RE: emitter → GND */}
      <W x1={176} y1={117} x2={176} y2={140} />
      <VRes x={176} y1={140} y2={175} label={re} labelX={190} />
      <Gnd x={176} y={181} />
    </g>
  );
}

// ─── 7. zener_regulator ───────────────────────────────────────────────
// VS → R → junction → Zener(cathode up) → GND, junction → RL → GND
function ZenerRegulator({ components, labels }: CompProps) {
  const vs = components.vs || 'VS';
  const r = components.r || 'R';
  const vz = components.vz || 'VZ';
  const rl = components.rl || 'RL';

  return (
    <g>
      {/* VS battery on left */}
      <VSrc x={25} y1={40} y2={130} label={vs} labelX={8} />
      <W x1={25} y1={40} x2={25} y2={35} />

      {/* Top rail: VS → R → junction */}
      <W x1={25} y1={35} x2={60} y2={35} />
      <HRes x1={60} y1={35} x2={110} y2={35} label={r} />

      {/* Junction node */}
      <W x1={110} y1={35} x2={130} y2={35} />
      <Dot x={130} y={35} />

      {/* Zener diode: cathode up, anode down → GND */}
      <ZenerD x={130} yTop={35} yBot={130} label={vz} labelX={142} />

      {/* RL branch */}
      <W x1={130} y1={35} x2={210} y2={35} />
      <VRes x={210} y1={35} y2={130} label={rl} labelX={222} />

      {/* Bottom rail */}
      <W x1={25} y1={130} x2={210} y2={130} />
      <Gnd x={120} y={140} />
    </g>
  );
}

// ─── 8. two_zener_parallel ────────────────────────────────────────────
// 10V source → top rail, D1 zener to GND, D2 zener to GND (parallel)
function TwoZenerParallel({ components, labels }: CompProps) {
  const vs = components.vs || '10V';
  const vz1 = components.vz1 || '8V';
  const vz2 = components.vz2 || '8V';

  return (
    <g>
      {/* Source */}
      <VSrc x={30} y1={30} y2={140} label={vs} labelX={10} />
      <W x1={30} y1={30} x2={30} y2={25} />

      {/* Top rail */}
      <W x1={30} y1={25} x2={175} y2={25} />

      {/* D1: Zener cathode up */}
      <Dot x={95} y={25} />
      <ZenerD x={95} yTop={25} yBot={140} label={`D\u2081`} labelX={108} />

      {/* D2: Zener cathode up */}
      <Dot x={175} y={25} />
      <ZenerD x={175} yTop={25} yBot={140} label={`D\u2082`} labelX={188} />

      {/* Bottom rail */}
      <W x1={30} y1={140} x2={175} y2={140} />
      <Gnd x={100} y={150} />

      <Lbl x={95} y={175} text={`VZ=${vz1}`} anchor="middle" size={7} />
      <Lbl x={175} y={175} text={`VZ=${vz2}`} anchor="middle" size={7} />
    </g>
  );
}

// ─── 9. two_diode_series ──────────────────────────────────────────────
// VS → R1 → D1 → D2 → R2 → GND (series path)
function TwoDiodeSeries({ components, labels }: CompProps) {
  const vs = components.vs || 'VS';
  const r1 = components.r1 || 'R\u2081';
  const r2 = components.r2 || 'R\u2082';

  return (
    <g>
      {/* Source on left */}
      <VSrc x={20} y1={30} y2={150} label={vs} labelX={3} />
      <W x1={20} y1={30} x2={20} y2={25} />
      <W x1={20} y1={25} x2={45} y2={25} />

      {/* R1 */}
      <HRes x1={45} y1={25} x2={85} y2={25} label={r1} />

      {/* D1 horizontal */}
      <DiodeH x1={90} y1={25} x2={125} y2={25} label="D\u2081" />

      {/* D2 horizontal */}
      <DiodeH x1={130} y1={25} x2={165} y2={25} label="D\u2082" />

      {/* R2 */}
      <HRes x1={170} y1={25} x2={215} y2={25} label={r2} />

      {/* Down and return */}
      <W x1={215} y1={25} x2={240} y2={25} />
      <W x1={240} y1={25} x2={240} y2={150} />
      <W x1={20} y1={150} x2={240} y2={150} />
      <Gnd x={130} y={158} />
    </g>
  );
}

// ─── 10. diode_zener_combo ────────────────────────────────────────────
// vi → R1 → output node
// Output node → D1 (regular diode down) → GND
// Output node → D2 (Zener down) → GND
// Output node → R2 → GND
function DiodeZenerCombo({ components, labels }: CompProps) {
  const vi = components.vi || 'vi';
  const r1 = components.r1 || 'R\u2081';
  const r2 = components.r2 || 'R\u2082';
  const vz = components.vz || 'VZ';

  return (
    <g>
      {/* Input label */}
      <Lbl x={18} y={38} text={vi} anchor="middle" />

      {/* R1: vi → output node */}
      <W x1={30} y1={40} x2={45} y2={40} />
      <HRes x1={45} y1={40} x2={90} y2={40} label={r1} />

      {/* Output node */}
      <W x1={90} y1={40} x2={110} y2={40} />
      <Dot x={110} y={40} />

      {/* D1: regular diode down */}
      <W x1={110} y1={40} x2={110} y2={48} />
      <DiodeD x={110} yTop={48} yBot={115} label="D\u2081" labelX={122} />

      {/* D2: Zener down */}
      <W x1={110} y1={40} x2={165} y2={40} />
      <W x1={165} y1={40} x2={165} y2={48} />
      <ZenerD x={165} yTop={48} yBot={115} label={vz} labelX={178} />

      {/* R2: down to GND */}
      <W x1={110} y1={40} x2={225} y2={40} />
      <W x1={225} y1={40} x2={225} y2={50} />
      <VRes x={225} y1={50} y2={115} label={r2} labelX={237} />

      {/* Bottom rail */}
      <W x1={110} y1={115} x2={225} y2={115} />
      <Gnd x={165} y={122} />
    </g>
  );
}

// ─── 11. zener_switch ─────────────────────────────────────────────────
// VS → R → switch → Zener → GND
function ZenerSwitch({ components, labels }: CompProps) {
  const vs = components.vs || 'VS';
  const r = components.r || 'R';
  const vz = components.vz || 'VZ';

  return (
    <g>
      <VSrc x={25} y1={35} y2={145} label={vs} labelX={8} />
      <W x1={25} y1={35} x2={25} y2={30} />

      {/* R */}
      <W x1={25} y1={30} x2={55} y2={30} />
      <HRes x1={55} y1={30} x2={100} y2={30} label={r} />

      {/* Switch */}
      <W x1={100} y1={30} x2={115} y2={30} />
      <SwitchH x1={115} y1={30} x2={155} y2={30} label="SW" />

      {/* Zener */}
      <W x1={155} y1={30} x2={200} y2={30} />
      <W x1={200} y1={30} x2={200} y2={48} />
      <ZenerD x={200} yTop={48} yBot={145} label={vz} labelX={212} />

      {/* Bottom rail */}
      <W x1={25} y1={145} x2={200} y2={145} />
      <Gnd x={112} y={153} />
    </g>
  );
}

// ─── 12. pf_correction ────────────────────────────────────────────────
// AC source → R_line → load box → GND, Capacitor in parallel with load
function PFCorrection({ components, labels }: CompProps) {
  const source = components.source || components.vpeak || 'V';
  const rline = components.rline || 'R_line';
  const pf1 = components.pf1 || 'pf';

  return (
    <g>
      <ACSrc x={25} y1={35} y2={145} label={String(source).substring(0, 10)} labelX={5} />
      <W x1={25} y1={35} x2={25} y2={30} />

      {/* R_line */}
      <W x1={25} y1={30} x2={55} y2={30} />
      <HRes x1={55} y1={30} x2={100} y2={30} label={rline} />
      <W x1={100} y1={30} x2={130} y2={30} />

      {/* Load box */}
      <rect x={130} y={18} width={55} height={30} fill="none" stroke={C} strokeWidth={1.2} rx={3} />
      <Lbl x={157} y={33} text="Load" anchor="middle" size={7} />
      <Lbl x={157} y={43} text={pf1} anchor="middle" size={6} />

      {/* Load to bottom */}
      <W x1={157} y1={48} x2={157} y2={145} />

      {/* Capacitor in parallel */}
      <W x1={130} y1={30} x2={130} y2={60} />
      <W x1={130} y1={60} x2={220} y2={60} />
      <CapV x={220} y1={60} y2={145} label="C" labelX={232} />
      <W x1={220} y1={60} x2={220} y2={60} />

      {/* Bottom rail */}
      <W x1={25} y1={145} x2={220} y2={145} />
      <Gnd x={120} y={153} />
    </g>
  );
}

// ─── 13. parallel_loads ───────────────────────────────────────────────
function ParallelLoads({ components, labels }: CompProps) {
  const p1 = components.p1 || 'P\u2081';
  const pf1 = components.pf1 || 'pf\u2081';
  const p2 = components.p2 || 'P\u2082';
  const pf2 = components.pf2 || 'pf\u2082';

  return (
    <g>
      {/* Bus bar top */}
      <Lbl x={130} y={18} text="Bus" anchor="middle" size={8} />
      <line x1={40} y1={28} x2={240} y2={28} stroke={C} strokeWidth={2} />

      {/* Load 1 */}
      <W x1={90} y1={28} x2={90} y2={45} />
      <rect x={65} y={45} width={50} height={35} fill="none" stroke={C} strokeWidth={1.2} rx={3} />
      <Lbl x={90} y={60} text={p1} anchor="middle" size={7} />
      <Lbl x={90} y={72} text={pf1} anchor="middle" size={6} />
      <W x1={90} y1={80} x2={90} y2={120} />

      {/* Load 2 */}
      <W x1={200} y1={28} x2={200} y2={45} />
      <rect x={175} y={45} width={50} height={35} fill="none" stroke={C} strokeWidth={1.2} rx={3} />
      <Lbl x={200} y={60} text={p2} anchor="middle" size={7} />
      <Lbl x={200} y={72} text={pf2} anchor="middle" size={6} />
      <W x1={200} y1={80} x2={200} y2={120} />

      {/* Return bus */}
      <line x1={40} y1={120} x2={240} y2={120} stroke={C} strokeWidth={2} />
      <Gnd x={145} y={130} />
    </g>
  );
}

// ─── 14. y_delta ──────────────────────────────────────────────────────
function YDeltaConversion({ components, labels }: CompProps) {
  const za = components.za || 'Za';
  const zb = components.zb || 'Zb';
  const zc = components.zc || 'Zc';

  return (
    <g>
      {/* Y configuration */}
      <Lbl x={65} y={22} text="Y" anchor="middle" size={9} />
      <circle cx={65} cy={50} r={3} fill={C} />
      {/* Top arm */}
      <W x1={65} y1={50} x2={65} y2={35} />
      <HRes x1={65} y1={35} x2={65} y2={30} label={za} />
      <W x1={65} y1={30} x2={65} y2={26} />
      {/* Bottom-left arm */}
      <VRes x={35} y1={50} y2={90} label={zb} labelX={22} />
      <W x1={65} y1={50} x2={35} y2={50} />
      <W x1={35} y1={90} x2={35} y2={95} />
      {/* Bottom-right arm */}
      <VRes x={95} y1={50} y2={90} label={zc} labelX={100} />
      <W x1={65} y1={50} x2={95} y2={50} />
      <W x1={95} y1={90} x2={95} y2={95} />

      {/* Arrow */}
      <text x={130} y={62} textAnchor="middle" fontSize={14} fill={C} fontFamily={FF}>&rarr;</text>

      {/* Delta configuration */}
      <Lbl x={200} y={22} text="\u0394" anchor="middle" size={9} />
      {/* Top side */}
      <HRes x1={175} y1={35} x2={225} y2={35} label="Zab" />
      {/* Left side */}
      <VRes x={175} y1={35} y2={95} label="Zca" labelX={160} />
      {/* Right side */}
      <VRes x={225} y1={35} y2={95} label="Zbc" labelX={232} />
      {/* Corner dots */}
      <Dot x={175} y={35} />
      <Dot x={225} y={35} />
      <Dot x={175} y={95} />
      <Dot x={225} y={95} />
      <W x1={175} y1={95} x2={225} y2={95} />
    </g>
  );
}

// ─── 15. y_3phase ─────────────────────────────────────────────────────
// Circle with 3φ → three branches (R, L, C) → neutral → ground
function Y3Phase({ components, labels }: CompProps) {
  const vph = components.vph || 'V\u03C6';
  const r = components.r || 'R';
  const l = components.l || 'L';
  const c = components.c || 'C';

  return (
    <g>
      <circle cx={35} cy={100} r={20} fill="none" stroke={C} strokeWidth={1.4} />
      <Lbl x={35} y={103} text="3\u03C6" anchor="middle" size={8} />
      <Lbl x={35} y={128} text={vph} anchor="middle" size={6} />

      {/* R branch (top) */}
      <W x1={55} y1={85} x2={90} y2={55} />
      <HRes x1={90} y1={55} x2={140} y2={55} label={r} />
      <W x1={140} y1={55} x2={175} y2={55} />

      {/* L branch (middle) */}
      <W x1={55} y1={100} x2={90} y2={100} />
      <IndH x1={90} y={100} x2={140} label={l} />
      <W x1={140} y1={100} x2={175} y2={100} />

      {/* C branch (bottom) */}
      <W x1={55} y1={115} x2={90} y2={145} />
      <CapH x1={90} y={145} x2={140} label={c} />
      <W x1={140} y1={145} x2={175} y2={145} />

      {/* Neutral line */}
      <W x1={175} y1={55} x2={175} y2={145} />
      <Gnd x={175} y={155} />
    </g>
  );
}

// ─── 16. y_delta_3phase ───────────────────────────────────────────────
// Y source → three lines → Delta load (triangle)
function YDelta3Phase({ components, labels }: CompProps) {
  const vl = components.vl || 'VL';
  const r = components.r || 'R';
  const xl = components.xl || 'X\u2097';

  return (
    <g>
      {/* Y source circle */}
      <circle cx={35} cy={85} r={18} fill="none" stroke={C} strokeWidth={1.4} />
      <Lbl x={35} y={88} text="Y" anchor="middle" size={8} />
      <Lbl x={35} y={112} text={`VL=${vl}`} anchor="middle" size={6} />

      {/* Three lines from Y to Delta */}
      <W x1={53} y1={72} x2={110} y2={45} />
      <W x1={53} y1={85} x2={110} y2={85} />
      <W x1={53} y1={98} x2={110} y2={125} />

      {/* Delta load triangle */}
      <Dot x={110} y={45} />
      <Dot x={110} y={125} />
      <Dot x={245} y={85} />
      {/* Top side: R + XL */}
      <HRes x1={115} y1={45} x2={175} y2={45} label={r} />
      <IndH x1={180} y1={45} x2={240} y2={45} label={xl} />
      <W x1={240} y1={45} x2={245} y2={45} />
      <W x1={245} y1={45} x2={245} y2={85} />
      {/* Left side */}
      <W x1={110} y1={45} x2={110} y2={125} />
      {/* Bottom side */}
      <W x1={110} y1={125} x2={245} y2={125} />
      <W x1={245} y1={85} x2={245} y2={125} />

      {/* Delta label */}
      <Lbl x={185} y={88} text="\u0394" anchor="middle" size={8} />
    </g>
  );
}

// ─── 17. simple_dc_loop ───────────────────────────────────────────────
function SimpleDCLoop({ components, labels }: CompProps) {
  const v = components.v || 'V';
  const r1 = components.r1 || 'R\u2081';
  const r2 = components.r2 || 'R\u2082';

  return (
    <g>
      <VSrc x={30} y1={35} y2={145} label={v} labelX={12} />
      <W x1={30} y1={35} x2={30} y2={30} />
      <W x1={30} y1={30} x2={150} y2={30} />
      <VRes x={150} y1={30} y2={90} label={r1} labelX={162} />
      <VRes x={150} y1={90} y2={145} label={r2} labelX={162} />
      <W x1={150} y1={145} x2={30} y2={145} />
      <Gnd x={90} y={153} />
    </g>
  );
}

// ─── 18. mesh_4loop ───────────────────────────────────────────────────
function Mesh4Loop({ components, labels }: CompProps) {
  const v1 = components.v1 || 'V\u2081';
  const v2 = components.v2 || 'V\u2082';
  const r1 = components.r1 || 'R\u2081';
  const r2 = components.r2 || 'R\u2082';
  const r3 = components.r3 || 'R\u2083';
  const r4 = components.r4 || 'R\u2084';

  return (
    <g>
      {/* 4-mesh grid */}
      {/* Top-left: V1 + R1 */}
      <VSrc x={30} y1={30} y2={80} label={v1} labelX={12} />
      <HRes x1={30} y1={30} x2={120} y2={30} label={r1} />
      <VRes x={120} y1={30} y2={80} label={r2} labelX={132} />
      <W x1={30} y1={80} x2={120} y2={80} />

      {/* Top-right: R3 + V2 */}
      <HRes x1={120} y1={30} x2={220} y2={30} label={r3} />
      <VSrc x={220} y1={30} y2={80} label={v2} labelX={232} />
      <W x1={120} y1={80} x2={220} y2={80} />

      {/* Bottom row */}
      <VRes x={30} y1={80} y2={140} label={r4} labelX={42} />
      <HRes x1={30} y1={140} x2={120} y2={140} />
      <VRes x={120} y1={80} y2={140} />
      <HRes x1={120} y1={140} x2={220} y2={140} />
      <VRes x={220} y1={80} y2={140} />
      <Gnd x={125} y={150} />
    </g>
  );
}

// ─── 19. superposition ────────────────────────────────────────────────
function SuperpositionCircuit({ components, labels }: CompProps) {
  const v1 = components.v1 || 'V\u2081';
  const v2 = components.v2 || 'V\u2082';
  const r1 = components.r1 || 'R\u2081';
  const r2 = components.r2 || 'R\u2082';
  const r3 = components.r3 || 'R\u2083';

  return (
    <g>
      {/* V1 on left */}
      <VSrc x={20} y1={30} y2={100} label={v1} labelX={2} />
      <W x1={20} y1={30} x2={20} y2={25} />

      {/* R1 from V1 to center node */}
      <HRes x1={20} y1={25} x2={90} y2={25} label={r1} />

      {/* Center node */}
      <Dot x={90} y={25} />

      {/* R2 from center down */}
      <VRes x={90} y1={25} y2={100} label={r2} labelX={102} />

      {/* R3 from center to right */}
      <HRes x1={90} y1={25} x2={170} y2={25} label={r3} />

      {/* V2 on right */}
      <VSrc x={190} y1={25} y2={100} label={v2} labelX={205} />
      <W x1={170} y1={25} x2={190} y2={25} />

      {/* Bottom rail */}
      <W x1={20} y1={100} x2={190} y2={100} />
      <Gnd x={105} y={108} />
    </g>
  );
}

// ─── 20. rc_discharge ─────────────────────────────────────────────────
// Capacitor (charged, V0) → R → loop back
function RCDischarge({ components, labels }: CompProps) {
  const v0 = components.v0 || 'V\u2080';
  const r = components.r || 'R';
  const c = components.c || 'C';

  return (
    <g>
      {/* Capacitor on left, vertical */}
      <CapV x={50} y1={30} y2={90} label={c} labelX={62} />
      <Lbl x={38} y={60} text={v0} anchor="end" size={7} />

      {/* Top wire → R */}
      <W x1={50} y1={30} x2={50} y2={25} />
      <HRes x1={50} y1={25} x2={170} y2={25} label={r} />

      {/* Right side down */}
      <W x1={170} y1={25} x2={170} y2={90} />

      {/* Bottom wire back */}
      <W x1={170} y1={90} x2={50} y2={90} />

      {/* Polarity on cap */}
      <text x={44} y={48} fontSize={8} fill={C} fontFamily={FF}>+</text>
      <text x={44} y={82} fontSize={8} fill={C} fontFamily={FF}>&#8722;</text>
    </g>
  );
}

// ─── 21. rl_switch / rl_rc_switch ─────────────────────────────────────
// V source → switch → R → L → ground, with capacitor across L
function RLSwitchCircuit({ components, labels }: CompProps) {
  const v = components.v || 'V';
  const r = components.r || 'R';
  const l = components.l || 'L';
  const c = components.c || 'C';

  return (
    <g>
      {/* V source */}
      <VSrc x={25} y1={30} y2={155} label={v} labelX={8} />
      <W x1={25} y1={30} x2={25} y2={25} />

      {/* Switch */}
      <W x1={25} y1={25} x2={40} y2={25} />
      <SwitchH x1={40} y1={25} x2={75} y2={25} label="S" />

      {/* R */}
      <HRes x1={75} y1={25} x2={120} y2={25} label={r} />

      {/* L */}
      <IndH x1={125} y1={25} x2={175} y2={25} label={l} />

      {/* Down to ground */}
      <W x1={175} y1={25} x2={175} y2={155} />
      <W x1={25} y1={155} x2={175} y2={155} />
      <Gnd x={100} y={163} />

      {/* Capacitor across L (if present) */}
      <Dot x={125} y={25} />
      <Dot x={175} y={25} />
      <W x1={125} y1={25} x2={125} y2={60} />
      <W x1={125} y1={60} x2={150} y2={60} />
      <CapV x={150} y1={60} y2={120} label={c} labelX={162} />
      <W x1={150} y1={120} x2={175} y2={120} />
      <W x1={175} y1={120} x2={175} y2={155} />
    </g>
  );
}

// ─── 22. parallel_rlc / series_rlc ────────────────────────────────────
function RLCCircuit({ components, labels, type }: CompProps & { type: string }) {
  const r = components.r || 'R';
  const l = components.l || 'L';
  const c = components.c || 'C';
  const v = components.v || 'V';

  if (type === 'series_rlc') {
    return (
      <g>
        <ACSrc x={20} y1={30} y2={140} label={v} labelX={3} />
        <W x1={20} y1={30} x2={20} y2={25} />
        <HRes x1={20} y1={25} x2={80} y2={25} label={r} />
        <IndH x1={85} y1={25} x2={145} y2={25} label={l} />
        <CapH x1={150} y1={25} x2={210} y2={25} label={c} />
        <W x1={210} y1={25} x2={230} y2={25} />
        <W x1={230} y1={25} x2={230} y2={140} />
        <W x1={20} y1={140} x2={230} y2={140} />
        <Gnd x={125} y={150} />
      </g>
    );
  }

  // Parallel RLC
  return (
    <g>
      <ACSrc x={25} y1={25} y2={155} label={v} labelX={8} />
      <W x1={25} y1={25} x2={25} y2={20} />
      <W x1={25} y1={20} x2={200} y2={20} />

      {/* R branch */}
      <Dot x={80} y={20} />
      <VRes x={80} y1={20} y2={155} label={r} labelX={92} />

      {/* L branch */}
      <Dot x={140} y={20} />
      <IndV x={140} y1={20} y2={155} label={l} labelX={152} />

      {/* C branch */}
      <Dot x={200} y={20} />
      <CapV x={200} y1={20} y2={155} label={c} labelX={212} />

      {/* Bottom rail */}
      <W x1={25} y1={155} x2={200} y2={155} />
      <Gnd x={112} y={163} />
    </g>
  );
}

// ─── 23. emosfet_simple ───────────────────────────────────────────────
// VGS at gate → E-MOSFET → drain through RD → VDD → source grounded
function EMOSFETSimple({ components, labels }: CompProps) {
  const rd = components.rd || 'RD';
  const vdd = components.vdd || 'VDD';
  const vgs = components.vgs || 'VGS';

  return (
    <g>
      <EMOSFET x={130} y={110} label="M" s={1.1} />

      {/* Gate → VGS */}
      <W x1={112} y1={110} x2={75} y2={110} />
      <HRes x1={75} y1={110} x2={40} y2={110} label={vgs} />
      <W x1={40} y1={110} x2={25} y2={110} />

      {/* Drain → RD → VDD */}
      <W x1={137} y1={87} x2={137} y2={70} />
      <VRes x={137} y1={70} y2={35} label={rd} labelX={150} />
      <W x1={137} y1={35} x2={137} y2={25} />
      <VCC x={137} y={25} label={vdd} />

      {/* Source → GND */}
      <W x1={137} y1={132} x2={137} y2={155} />
      <Gnd x={137} y={160} />
    </g>
  );
}

// ─── 24. two_dmosfet_series / two_jfet_series ─────────────────────────
// VDD → M1 (upper) → M2 (lower) → RS → ground
function TwoFETSeries({ components, labels }: CompProps) {
  const vdd = components.vdd || 'VDD';
  const rs = components.rs || 'RS';
  const m1 = labels?.m1 || 'M\u2081';
  const m2 = labels?.m2 || 'M\u2082';

  return (
    <g>
      {/* M1 upper (D-MOSFET or JFET) */}
      <DMOSFET x={130} y={65} label={m1} s={1.0} />
      {/* M2 lower */}
      <DMOSFET x={130} y={130} label={m2} s={1.0} />

      {/* VDD → M1 drain */}
      <W x1={137} y1={43} x2={137} y2={25} />
      <VCC x={137} y={25} label={vdd} />

      {/* M1 source → M2 drain (series connection) */}
      <W x1={137} y1={87} x2={137} y2={108} />

      {/* M2 source → RS → GND */}
      <W x1={137} y1={152} x2={137} y2={165} />
      <VRes x={137} y1={165} y2={192} label={rs} labelX={150} />
      <Gnd x={137} y={198} />

      {/* Gate connections (can be labeled) */}
      <W x1={112} y1={65} x2={90} y2={65} />
      <Lbl x={75} y={68} text="G\u2081" anchor="end" size={7} />
      <W x1={112} y1={130} x2={90} y2={130} />
      <Lbl x={75} y={133} text="G\u2082" anchor="end" size={7} />
    </g>
  );
}

// ─── 25. emosfet_dmosfet ──────────────────────────────────────────────
function EMOSFETDMOSFET({ components, labels }: CompProps) {
  const vdd = components.vdd || 'VDD';
  const rd = components.rd || 'RD';

  return (
    <g>
      <EMOSFET x={100} y={75} label="E" s={0.9} />
      <DMOSFET x={210} y={75} label="D" s={0.9} />

      {/* E-MOSFET: drain → RD → VDD */}
      <W x1={107} y1={55} x2={107} y2={40} />
      <VRes x={107} y1={40} y2={20} label={rd} labelX={118} />
      <VCC x={107} y={20} label={vdd} />

      {/* E-MOSFET: source → GND */}
      <W x1={107} y1={95} x2={107} y2={110} />
      <Gnd x={107} y={115} />

      {/* D-MOSFET: drain → VDD */}
      <W x1={217} y1={55} x2={217} y2={20} />
      <VCC x={217} y={20} label={vdd} />

      {/* D-MOSFET: source → GND */}
      <W x1={217} y1={95} x2={217} y2={110} />
      <Gnd x={217} y={115} />
    </g>
  );
}

// ─── 26. two_dmosfet_bias ─────────────────────────────────────────────
function TwoDMOSFETBias({ components, labels }: CompProps) {
  const vdd = components.vdd || 'VDD';
  const rd1 = components.rd1 || 'RD1';
  const rd2 = components.rd2 || 'RD2';

  return (
    <g>
      <DMOSFET x={100} y={70} label="M\u2081" s={0.9} />
      <DMOSFET x={210} y={70} label="M\u2082" s={0.9} />

      {/* M1: drain → RD1 → VDD */}
      <W x1={107} y1={50} x2={107} y2={38} />
      <VRes x={107} y1={38} y2={18} label={rd1} labelX={118} />
      <VCC x={107} y={18} label={vdd} />

      {/* M1: source → GND */}
      <W x1={107} y1={90} x2={107} y2={110} />
      <Gnd x={107} y={115} />

      {/* M1: gate bias */}
      <W x1={82} y1={70} x2={60} y2={70} />
      <Lbl x={50} y={73} text="VG1" anchor="end" size={7} />

      {/* M2: drain → RD2 → VDD */}
      <W x1={217} y1={50} x2={217} y2={38} />
      <VRes x={217} y1={38} y2={18} label={rd2} labelX={228} />
      <VCC x={217} y={18} label={vdd} />

      {/* M2: source → GND */}
      <W x1={217} y1={90} x2={217} y2={110} />
      <Gnd x={217} y={115} />

      {/* M2: gate bias */}
      <W x1={192} y1={70} x2={170} y2={70} />
      <Lbl x={160} y={73} text="VG2" anchor="end" size={7} />
    </g>
  );
}

// ─── 27. single_diode ─────────────────────────────────────────────────
function SingleDiode({ components, labels }: CompProps) {
  const vf = components.vf || '0.7V';
  const is_ = components.is || 'IS';

  return (
    <g>
      {/* Diode with I-V annotation */}
      <DiodeH x1={60} y1={70} x2={160} y2={70} label="D" />
      <W x1={30} y1={70} x2={60} y2={70} />
      <W x1={160} y1={70} x2={190} y2={70} />
      <VSrc x={30} y1={70} y2={140} label="V" labelX={14} />
      <W x1={190} y1={70} x2={190} y2={140} />
      <W x1={30} y1={140} x2={190} y2={140} />
      <Gnd x={110} y={148} />

      {/* I-V annotation */}
      <Lbl x={110} y={55} text={`Vf=${vf}`} anchor="middle" size={7} />
      <Lbl x={110} y={170} text={`${is_}`} anchor="middle" size={7} />
    </g>
  );
}

// ─── 28. opamp_circuit ────────────────────────────────────────────────
function OpAmpCircuit({ components, labels }: CompProps) {
  const rf = components.rf || 'Rf';
  const rin = components.rin || 'Rin';
  const vin = components.vin || 'Vin';

  return (
    <g>
      <OpAmpSym x={120} y={100} />

      {/* Non-inverting input (+) → ground */}
      <W x1={120} y1={92} x2={100} y2={92} />
      <Gnd x={100} y={100} />

      {/* Inverting input (−) → Rin → Vin */}
      <W x1={120} y1={108} x2={105} y2={108} />
      <Dot x={105} y={108} />
      <HRes x1={105} y1={108} x2={55} y2={108} label={rin} />
      <W x1={55} y1={108} x2={35} y2={108} />
      <Lbl x={28} y={112} text={vin} anchor="end" size={7} />

      {/* Feedback: Rin from output to inverting input */}
      <W x1={105} y1={108} x2={105} y2={60} />
      <HRes x1={105} y1={60} x2={175} y2={60} label={rf} labelY={52} />
      <W x1={175} y1={60} x2={175} y2={100} />

      {/* Output */}
      <W x1={148} y1={100} x2={175} y2={100} />
      <Dot x={175} y={100} />
      <W x1={175} y1={100} x2={210} y2={100} />
      <Lbl x={215} y={103} text="Vout" size={7} />

      {/* Power rails */}
      <VCC x={134} y={75} label="+V" />
      <Gnd x={134} y={125} />
    </g>
  );
}

// ─── 29. generic_circuit ──────────────────────────────────────────────
function GenericCircuit({ components, labels }: CompProps) {
  const title = labels?.title || components.type || 'Circuit';

  return (
    <g>
      <rect x={30} y={40} width={240} height={120} fill="none" stroke={C} strokeWidth={1.2} rx={5} strokeDasharray="4 2" />
      <Lbl x={150} y={95} text={title} anchor="middle" size={10} />
      <Lbl x={150} y={115} text="(See problem statement)" anchor="middle" size={7} />

      {/* Small decorative circuit elements */}
      <line x1={50} y1={55} x2={80} y2={55} stroke={C} strokeWidth={SW} />
      <polyline points="80,55 83,48 89,62 95,48 101,62 107,48 110,55" fill="none" stroke={C} strokeWidth={CSW} />
      <line x1={110} y1={55} x2={140} y2={55} stroke={C} strokeWidth={SW} />
    </g>
  );
}

export default CircuitDiagram;
