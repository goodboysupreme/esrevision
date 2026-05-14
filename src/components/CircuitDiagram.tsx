'use client';

import { FC } from 'react';
import type { CircuitParams } from '@/data/questions';

interface CircuitDiagramProps {
  circuit: CircuitParams;
  topicColor: string;
  topicBgColor: string;
}

const CircuitDiagram: FC<CircuitDiagramProps> = ({ circuit, topicColor, topicBgColor }) => {
  const { type, components, labels } = circuit;

  const renderCircuit = () => {
    switch (type) {
      case 'two_npn_cascade':
        return <TwoNPNCascade components={components} labels={labels} />;
      case 'two_npn_cascade_2':
        return <TwoNPNCascade2 components={components} labels={labels} />;
      case 'two_npn_cascade_sat':
        return <TwoNPNCascadeSat components={components} labels={labels} />;
      case 'pnp_npn_mixed':
        return <PnpNpnMixed components={components} labels={labels} />;
      case 'darlington':
        return <DarlingtonCircuit components={components} labels={labels} />;
      case 'vdb_circuit':
        return <VDBCircuit components={components} labels={labels} />;
      case 'zener_regulator':
        return <ZenerRegulator components={components} labels={labels} />;
      case 'two_zener_parallel':
        return <TwoZenerParallel components={components} labels={labels} />;
      case 'two_diode_series':
        return <TwoDiodeSeries components={components} labels={labels} />;
      case 'diode_zener_combo':
        return <DiodeZenerCombo components={components} labels={labels} />;
      case 'zener_switch':
        return <ZenerSwitch components={components} labels={labels} />;
      case 'pf_correction':
      case 'pf_correction_rl':
        return <PFCorrection components={components} labels={labels} />;
      case 'parallel_loads':
        return <ParallelLoads components={components} labels={labels} />;
      case 'y_delta':
        return <YDeltaConversion components={components} labels={labels} />;
      case 'y_3phase':
        return <Y3Phase components={components} labels={labels} />;
      case 'y_delta_3phase':
        return <YDelta3Phase components={components} labels={labels} />;
      case 'simple_dc_loop':
        return <SimpleDCLoop components={components} labels={labels} />;
      case 'mesh_4loop':
        return <Mesh4Loop components={components} labels={labels} />;
      case 'superposition':
        return <SuperpositionCircuit components={components} labels={labels} />;
      case 'rc_discharge':
        return <RCDischarge components={components} labels={labels} />;
      case 'rl_switch':
      case 'rl_rc_switch':
        return <RLSwitchCircuit components={components} labels={labels} />;
      case 'parallel_rlc':
      case 'series_rlc':
        return <RLCCircuit components={components} labels={labels} type={type} />;
      case 'emosfet_simple':
        return <EMOSFETSimple components={components} labels={labels} />;
      case 'two_dmosfet_series':
      case 'two_jfet_series':
        return <TwoFETSeries components={components} labels={labels} />;
      case 'emosfet_dmosfet':
        return <EMOSFETDMOSFET components={components} labels={labels} />;
      case 'two_dmosfet_bias':
        return <TwoDMOSFETBias components={components} labels={labels} />;
      case 'single_diode':
        return <SingleDiode components={components} labels={labels} />;
      case 'multi_opamp':
      case 'opamp_multi_input':
      case 'opamp_find_alpha':
        return <OpAmpCircuit components={components} labels={labels} />;
      default:
        return <GenericCircuit components={components} labels={labels} />;
    }
  };

  return (
    <div
      className="rounded-lg p-3 border h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: topicBgColor, borderColor: topicColor + '40' }}
    >
      <div className="font-ui text-[10px] font-bold uppercase tracking-wider mb-2 text-center" style={{ color: topicColor }}>
        🔌 Circuit Diagram
      </div>
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <svg viewBox="0 0 260 200" className="w-full max-w-[280px]" style={{ maxHeight: '220px' }}>
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

// Helper: resistor symbol
const Resistor = ({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const isHorizontal = Math.abs(dx) > Math.abs(dy);

  return (
    <g transform={`translate(${x1},${y1}) rotate(${angle})`}>
      <line x1={0} y1={0} x2={len * 0.2} y2={0} stroke="currentColor" strokeWidth={1.2} />
      <polyline
        points={`${len*0.2},0 ${len*0.25},${isHorizontal ? -5 : -5} ${len*0.35},${isHorizontal ? 5 : 5} ${len*0.45},${isHorizontal ? -5 : -5} ${len*0.55},${isHorizontal ? 5 : 5} ${len*0.65},${isHorizontal ? -5 : -5} ${len*0.75},${isHorizontal ? 5 : 5} ${len*0.8},0`}
        fill="none" stroke="currentColor" strokeWidth={1.2}
      />
      <line x1={len * 0.8} y1={0} x2={len} y2={0} stroke="currentColor" strokeWidth={1.2} />
      {label && (
        <text x={len / 2} y={-8} textAnchor="middle" fontSize="8" fill="#1A2A3A" fontFamily="monospace">
          {label}
        </text>
      )}
    </g>
  );
};

// Helper: NPN transistor symbol
const NPN = ({ x, y, label, scale = 1 }: { x: number; y: number; label?: string; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={12} fill="none" stroke="currentColor" strokeWidth={1.2} />
    <line x1={-12} y1={0} x2={-5} y2={0} stroke="currentColor" strokeWidth={1.5} />
    <line x1={-5} y1={-7} x2={-5} y2={7} stroke="currentColor" strokeWidth={2} />
    <line x1={-5} y1={-4} x2={7} y2={-9} stroke="currentColor" strokeWidth={1.3} />
    <line x1={-5} y1={4} x2={7} y2={9} stroke="currentColor" strokeWidth={1.3} />
    <polygon points="4,6 7,9 3,9" fill="currentColor" />
    <line x1={7} y1={-9} x2={7} y2={-16} stroke="currentColor" strokeWidth={1.2} />
    <line x1={7} y1={9} x2={7} y2={16} stroke="currentColor" strokeWidth={1.2} />
    {label && <text x={-2} y={3} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
  </g>
);

// Helper: pnp transistor symbol
const PNP = ({ x, y, label, scale = 1 }: { x: number; y: number; label?: string; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={12} fill="none" stroke="currentColor" strokeWidth={1.2} />
    <line x1={-12} y1={0} x2={-5} y2={0} stroke="currentColor" strokeWidth={1.5} />
    <line x1={-5} y1={-7} x2={-5} y2={7} stroke="currentColor" strokeWidth={2} />
    <line x1={-5} y1={-4} x2={7} y2={-9} stroke="currentColor" strokeWidth={1.3} />
    <line x1={-5} y1={4} x2={7} y2={9} stroke="currentColor" strokeWidth={1.3} />
    <polygon points="-3,-6 -5,-4 -1,-4" fill="currentColor" />
    <line x1={7} y1={-9} x2={7} y2={-16} stroke="currentColor" strokeWidth={1.2} />
    <line x1={7} y1={9} x2={7} y2={16} stroke="currentColor" strokeWidth={1.2} />
    {label && <text x={-2} y={3} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
  </g>
);

// Helper: Zener diode
const ZenerDiode = ({ x, y, label, direction = 'down' }: { x: number; y: number; label?: string; direction?: string }) => {
  if (direction === 'down') {
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1={0} y1={-15} x2={0} y2={-5} stroke="currentColor" strokeWidth={1.2} />
        <polygon points="-6,-5 6,-5 0,5" fill="none" stroke="currentColor" strokeWidth={1.2} />
        <line x1={-6} y1={5} x2={6} y2={5} stroke="currentColor" strokeWidth={1.5} />
        <line x1={6} y1={5} x2={6} y2={-1} stroke="currentColor" strokeWidth={1.2} />
        <line x1={0} y1={5} x2={0} y2={15} stroke="currentColor" strokeWidth={1.2} />
        {label && <text x={10} y={2} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={15} x2={0} y2={5} stroke="currentColor" strokeWidth={1.2} />
      <polygon points="-6,5 6,5 0,-5" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <line x1={-6} y1={-5} x2={6} y2={-5} stroke="currentColor" strokeWidth={1.5} />
      <line x1={6} y1={-5} x2={6} y2={1} stroke="currentColor" strokeWidth={1.2} />
      <line x1={0} y1={-5} x2={0} y2={-15} stroke="currentColor" strokeWidth={1.2} />
      {label && <text x={10} y={2} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
    </g>
  );
};

// Helper: Diode
const DiodeSymbol = ({ x, y, label, direction = 'down' }: { x: number; y: number; label?: string; direction?: string }) => {
  if (direction === 'down') {
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1={0} y1={-15} x2={0} y2={-5} stroke="currentColor" strokeWidth={1.2} />
        <polygon points="-6,-5 6,-5 0,5" fill="none" stroke="currentColor" strokeWidth={1.2} />
        <line x1={-6} y1={5} x2={6} y2={5} stroke="currentColor" strokeWidth={1.5} />
        <line x1={0} y1={5} x2={0} y2={15} stroke="currentColor" strokeWidth={1.2} />
        {label && <text x={10} y={2} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={-15} y1={0} x2={-5} y2={0} stroke="currentColor" strokeWidth={1.2} />
      <polygon points="-5,-6 -5,6 5,0" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <line x1={5} y1={-6} x2={5} y2={6} stroke="currentColor" strokeWidth={1.5} />
      <line x1={5} y1={0} x2={15} y2={0} stroke="currentColor" strokeWidth={1.2} />
      {label && <text x={0} y={-10} fontSize="7" fill="#1A2A3A" fontFamily="monospace" textAnchor="middle">{label}</text>}
    </g>
  );
};

// Helper: Ground symbol
const Ground = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x},${y})`}>
    <line x1={-8} y1={0} x2={8} y2={0} stroke="currentColor" strokeWidth={1.2} />
    <line x1={-5} y1={3} x2={5} y2={3} stroke="currentColor" strokeWidth={1.2} />
    <line x1={-2} y1={6} x2={2} y2={6} stroke="currentColor" strokeWidth={1.2} />
  </g>
);

// Helper: Voltage source
const VSource = ({ x, y, label, rotate = 0 }: { x: number; y: number; label?: string; rotate?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${rotate})`}>
    <circle cx={0} cy={0} r={10} fill="none" stroke="currentColor" strokeWidth={1.2} />
    <text x={0} y={1} textAnchor="middle" fontSize="7" fill="#1A2A3A" fontFamily="monospace">+</text>
    <line x1={0} y1={-10} x2={0} y2={-18} stroke="currentColor" strokeWidth={1.2} />
    <line x1={0} y1={10} x2={0} y2={18} stroke="currentColor" strokeWidth={1.2} />
    {label && <text x={-15} y={4} fontSize="7" fill="#1A2A3A" fontFamily="monospace" textAnchor="end">{label}</text>}
  </g>
);

// Helper: Capacitor
const Capacitor = ({ x, y, label, vertical = true }: { x: number; y: number; label?: string; vertical?: boolean }) => {
  if (vertical) {
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1={0} y1={-15} x2={0} y2={-3} stroke="currentColor" strokeWidth={1.2} />
        <line x1={-7} y1={-3} x2={7} y2={-3} stroke="currentColor" strokeWidth={1.5} />
        <line x1={-7} y1={3} x2={7} y2={3} stroke="currentColor" strokeWidth={1.5} />
        <line x1={0} y1={3} x2={0} y2={15} stroke="currentColor" strokeWidth={1.2} />
        {label && <text x={10} y={2} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={-15} y1={0} x2={-3} y2={0} stroke="currentColor" strokeWidth={1.2} />
      <line x1={-3} y1={-7} x2={-3} y2={7} stroke="currentColor" strokeWidth={1.5} />
      <line x1={3} y1={-7} x2={3} y2={7} stroke="currentColor" strokeWidth={1.5} />
      <line x1={3} y1={0} x2={15} y2={0} stroke="currentColor" strokeWidth={1.2} />
      {label && <text x={0} y={-12} fontSize="7" fill="#1A2A3A" fontFamily="monospace" textAnchor="middle">{label}</text>}
    </g>
  );
};

// Helper: Inductor
const Inductor = ({ x, y, label, vertical = true }: { x: number; y: number; label?: string; vertical?: boolean }) => {
  if (vertical) {
    return (
      <g transform={`translate(${x},${y})`}>
        <line x1={0} y1={-15} x2={0} y2={-10} stroke="currentColor" strokeWidth={1.2} />
        <path d="M0,-10 C-5,-7 -5,-3 0,0 C5,3 5,7 0,10" fill="none" stroke="currentColor" strokeWidth={1.2} />
        <line x1={0} y1={10} x2={0} y2={15} stroke="currentColor" strokeWidth={1.2} />
        {label && <text x={10} y={2} fontSize="7" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={-15} y1={0} x2={-10} y2={0} stroke="currentColor" strokeWidth={1.2} />
      <path d="M-10,0 C-7,-5 -3,-5 0,0 C3,5 7,5 10,0" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <line x1={10} y1={0} x2={15} y2={0} stroke="currentColor" strokeWidth={1.2} />
      {label && <text x={0} y={-10} fontSize="7" fill="#1A2A3A" fontFamily="monospace" textAnchor="middle">{label}</text>}
    </g>
  );
};

// Helper: MOSFET symbol
const MOSFET = ({ x, y, label, type = 'n' }: { x: number; y: number; label?: string; type?: string }) => (
  <g transform={`translate(${x},${y})`}>
    <circle cx={0} cy={0} r={12} fill="none" stroke="currentColor" strokeWidth={1} />
    <line x1={-12} y1={0} x2={-4} y2={0} stroke="currentColor" strokeWidth={1.5} />
    <line x1={-4} y1={-7} x2={-4} y2={7} stroke="currentColor" strokeWidth={2} />
    <line x1={0} y1={-8} x2={0} y2={-3} stroke="currentColor" strokeWidth={1.2} />
    <line x1={0} y1={3} x2={0} y2={8} stroke="currentColor" strokeWidth={1.2} />
    <line x1={0} y1={-3} x2={8} y2={-3} stroke="currentColor" strokeWidth={1.2} />
    <line x1={8} y1={-3} x2={8} y2={-14} stroke="currentColor" strokeWidth={1.2} />
    <line x1={0} y1={3} x2={8} y2={3} stroke="currentColor" strokeWidth={1.2} />
    <line x1={8} y1={3} x2={8} y2={14} stroke="currentColor" strokeWidth={1.2} />
    {label && <text x={-2} y={2} fontSize="6" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
  </g>
);

// Helper: Op-Amp triangle
const OpAmp = ({ x, y, label }: { x: number; y: number; label?: string }) => (
  <g transform={`translate(${x},${y})`}>
    <polygon points="0,-15 25,0 0,15" fill="none" stroke="currentColor" strokeWidth={1.3} />
    <text x={7} y={-4} fontSize="7" fill="#1A2A3A" fontFamily="monospace">+</text>
    <text x={7} y={7} fontSize="7" fill="#1A2A3A" fontFamily="monospace">−</text>
    <line x1={0} y1={-8} x2={-12} y2={-8} stroke="currentColor" strokeWidth={1.2} />
    <line x1={0} y1={8} x2={-12} y2={8} stroke="currentColor" strokeWidth={1.2} />
    <line x1={25} y1={0} x2={35} y2={0} stroke="currentColor" strokeWidth={1.2} />
    {label && <text x={5} y={2} fontSize="6" fill="#1A2A3A" fontFamily="monospace">{label}</text>}
  </g>
);

// ===== CIRCUIT IMPLEMENTATIONS =====

function TwoNPNCascade({ components, labels }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <NPN x={70} y={90} label={labels?.q1 || 'Q₁'} />
      <NPN x={180} y={90} label={labels?.q2 || 'Q₂'} />
      {/* Q1 base → RB → VBB */}
      <line x1={58} y1={90} x2={30} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={20} y={85} fontSize="7" fontFamily="monospace" textAnchor="end">{components.rb}</text>
      <line x1={30} y1={90} x2={15} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={15} y={78} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vbb}</text>
      {/* Q1 collector → RC1 → VCC */}
      <line x1={77} y1={74} x2={77} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={90} y={62} fontSize="7" fontFamily="monospace">{components.rc1}</text>
      <line x1={77} y1={50} x2={77} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <text x={77} y={30} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* Q1 collector → Q2 base */}
      <line x1={77} y1={55} x2={100} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <line x1={100} y1={55} x2={100} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={100} y1={90} x2={168} y2={90} stroke="currentColor" strokeWidth={1.2} />
      {/* Q2 collector → VCC */}
      <line x1={187} y1={74} x2={187} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <text x={187} y={30} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* Emitters → RE → GND */}
      <line x1={77} y1={106} x2={77} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={187} y1={106} x2={187} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={77} y1={130} x2={187} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={130} y1={130} x2={130} y2={145} stroke="currentColor" strokeWidth={1.2} />
      <text x={140} y={152} fontSize="7" fontFamily="monospace">{components.re}</text>
      <Ground x={130} y={170} />
      <text x={130} y={190} fontSize="7" fontFamily="monospace" textAnchor="middle">β={components.beta}</text>
    </g>
  );
}

function TwoNPNCascade2({ components, labels }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <NPN x={70} y={90} label={labels?.t1 || 'T₁'} scale={0.9} />
      <NPN x={180} y={90} label={labels?.t2 || 'T₂'} scale={0.9} />
      {/* T1 base → RB → VCC */}
      <line x1={58} y1={90} x2={25} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={15} y={85} fontSize="7" fontFamily="monospace" textAnchor="end">{components.rb}</text>
      <line x1={25} y1={90} x2={15} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={15} y={78} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* T1 collector → RC1 → VCC */}
      <line x1={77} y1={74} x2={77} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={90} y={62} fontSize="7" fontFamily="monospace">{components.rc1}</text>
      <line x1={77} y1={50} x2={77} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <text x={77} y={30} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* T1 collector → T2 base */}
      <line x1={77} y1={55} x2={100} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <line x1={100} y1={55} x2={100} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={100} y1={90} x2={168} y2={90} stroke="currentColor" strokeWidth={1.2} />
      {/* T2 collector → RC2 → VCC */}
      <line x1={187} y1={74} x2={187} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={200} y={62} fontSize="7" fontFamily="monospace">{components.rc2}</text>
      <line x1={187} y1={50} x2={187} y2={35} stroke="currentColor" strokeWidth={1.2} />
      {/* T1 emitter → RE1 → GND */}
      <line x1={77} y1={106} x2={77} y2={150} stroke="currentColor" strokeWidth={1.2} />
      <text x={90} y={140} fontSize="7" fontFamily="monospace">{components.re1}</text>
      <Ground x={77} y={165} />
      {/* T2 emitter → RE2 → GND */}
      <line x1={187} y1={106} x2={187} y2={150} stroke="currentColor" strokeWidth={1.2} />
      <text x={200} y={140} fontSize="7" fontFamily="monospace">{components.re2}</text>
      <Ground x={187} y={165} />
      <text x={130} y={190} fontSize="7" fontFamily="monospace" textAnchor="middle">β={components.beta}</text>
    </g>
  );
}

function TwoNPNCascadeSat({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return <TwoNPNCascade components={components} labels={{ q1: 'Q₁', q2: 'Q₂' }} />;
}

function PnpNpnMixed({ components, labels }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <PNP x={80} y={85} label={labels?.q1 || 'Q₁'} />
      <NPN x={180} y={90} label={labels?.q2 || 'Q₂'} scale={0.9} />
      {/* Q1 emitter → +15V */}
      <line x1={87} y1={69} x2={87} y2={30} stroke="currentColor" strokeWidth={1.2} />
      <text x={87} y={25} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc1}</text>
      {/* Q1 base → RB → GND */}
      <line x1={68} y1={85} x2={40} y2={85} stroke="currentColor" strokeWidth={1.2} />
      <text x={30} y={80} fontSize="7" fontFamily="monospace" textAnchor="end">{components.rb}</text>
      <line x1={40} y1={85} x2={25} y2={85} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={25} y={95} />
      {/* Q1 collector → R1 → GND */}
      <line x1={87} y1={101} x2={87} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <text x={100} y={125} fontSize="7" fontFamily="monospace">{components.r1}</text>
      <Ground x={87} y={165} />
      {/* Q1 collector → Q2 base */}
      <line x1={87} y1={120} x2={110} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={110} y1={120} x2={110} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={110} y1={90} x2={168} y2={90} stroke="currentColor" strokeWidth={1.2} />
      {/* Q2 collector → R2 → VCC2 */}
      <line x1={187} y1={74} x2={187} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <text x={200} y={55} fontSize="7" fontFamily="monospace">{components.r2}</text>
      <text x={187} y={28} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc2}</text>
      {/* Q2 emitter → GND */}
      <line x1={187} y1={106} x2={187} y2={150} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={187} y={155} />
      <text x={130} y={190} fontSize="7" fontFamily="monospace" textAnchor="middle">α={components.alpha} β={components.beta_npn}</text>
    </g>
  );
}

function DarlingtonCircuit({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <NPN x={100} y={60} label="Q₁" scale={0.8} />
      <NPN x={100} y={130} label="Q₂" scale={0.8} />
      {/* Q1 base → RB → VCC */}
      <line x1={88} y1={60} x2={40} y2={60} stroke="currentColor" strokeWidth={1.2} />
      <text x={30} y={55} fontSize="7" fontFamily="monospace" textAnchor="end">{components.rb}</text>
      <line x1={40} y1={60} x2={25} y2={60} stroke="currentColor" strokeWidth={1.2} />
      <text x={25} y={48} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* Q1 collector → VCC */}
      <line x1={107} y1={44} x2={107} y2={25} stroke="currentColor" strokeWidth={1.2} />
      <text x={107} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* Q1 emitter → Q2 base */}
      <line x1={107} y1={76} x2={107} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={107} y1={90} x2={88} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={88} y1={90} x2={88} y2={130} stroke="currentColor" strokeWidth={1.2} />
      {/* Q2 collector → VCC */}
      <line x1={107} y1={114} x2={130} y2={114} stroke="currentColor" strokeWidth={1.2} />
      <line x1={130} y1={114} x2={130} y2={44} stroke="currentColor" strokeWidth={1.2} />
      <line x1={130} y1={44} x2={107} y2={44} stroke="currentColor" strokeWidth={1.2} />
      {/* Q2 emitter → RE → GND */}
      <line x1={107} y1={146} x2={107} y2={165} stroke="currentColor" strokeWidth={1.2} />
      <text x={120} y={160} fontSize="7" fontFamily="monospace">{components.re}</text>
      <Ground x={107} y={180} />
      <text x={130} y={190} fontSize="7" fontFamily="monospace" textAnchor="middle">β₁={components.beta1} β₂={components.beta2}</text>
    </g>
  );
}

function VDBCircuit({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <NPN x={140} y={95} label="Q" scale={0.9} />
      {/* VCC → R1 → base, R2 → GND */}
      <line x1={50} y1={25} x2={50} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={40} fontSize="7" fontFamily="monospace" textAnchor="end">{components.r1}</text>
      <line x1={50} y1={50} x2={50} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={95} fontSize="7" fontFamily="monospace" textAnchor="end">{components.r2}</text>
      <Ground x={50} y={145} />
      {/* Base connection */}
      <line x1={50} y1={85} x2={128} y2={85} stroke="currentColor" strokeWidth={1.2} />
      <line x1={128} y1={85} x2={128} y2={95} stroke="currentColor" strokeWidth={1.2} />
      {/* VCC → RC → collector */}
      <line x1={147} y1={79} x2={147} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={160} y={62} fontSize="7" fontFamily="monospace">{components.rc}</text>
      <line x1={147} y1={50} x2={147} y2={25} stroke="currentColor" strokeWidth={1.2} />
      {/* VCC labels */}
      <text x={50} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      <text x={147} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vcc}</text>
      {/* Emitter → RE → GND */}
      <line x1={147} y1={111} x2={147} y2={145} stroke="currentColor" strokeWidth={1.2} />
      <text x={160} y={138} fontSize="7" fontFamily="monospace">RE</text>
      <Ground x={147} y={160} />
    </g>
  );
}

function ZenerRegulator({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      {/* VS → R → node → Zener → GND, node → RL → GND */}
      <VSource x={30} y={100} label={components.vs} />
      <line x1={30} y1={82} x2={30} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={50} x2={100} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={65} y={45} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r}</text>
      <line x1={100} y1={50} x2={100} y2={65} stroke="currentColor" strokeWidth={1.2} />
      <ZenerDiode x={100} y={100} label={`${components.vz}`} direction="down" />
      <line x1={100} y1={115} x2={100} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={140} x2={100} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={118} x2={30} y2={140} stroke="currentColor" strokeWidth={1.2} />
      {/* RL */}
      <line x1={100} y1={50} x2={180} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={50} x2={180} y2={70} stroke="currentColor" strokeWidth={1.2} />
      <text x={193} y={95} fontSize="7" fontFamily="monospace">RL</text>
      <line x1={180} y1={115} x2={180} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <line x1={100} y1={140} x2={180} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={140} y={155} />
    </g>
  );
}

function TwoZenerParallel({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={30} y={100} label={components.vs} />
      <line x1={30} y1={82} x2={30} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={40} x2={130} y2={40} stroke="currentColor" strokeWidth={1.2} />
      {/* D1 */}
      <line x1={80} y1={40} x2={80} y2={65} stroke="currentColor" strokeWidth={1.2} />
      <ZenerDiode x={80} y={95} label="D₁" direction="down" />
      <line x1={80} y1={110} x2={80} y2={150} stroke="currentColor" strokeWidth={1.2} />
      {/* D2 */}
      <line x1={160} y1={40} x2={160} y2={65} stroke="currentColor" strokeWidth={1.2} />
      <ZenerDiode x={160} y={95} label="D₂" direction="down" />
      <line x1={160} y1={110} x2={160} y2={150} stroke="currentColor" strokeWidth={1.2} />
      {/* Ground connections */}
      <line x1={30} y1={118} x2={30} y2={150} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={150} x2={160} y2={150} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={100} y={160} />
      <text x={80} y={175} fontSize="6" fontFamily="monospace" textAnchor="middle">VZ={components.vz1}</text>
      <text x={160} y={175} fontSize="6" fontFamily="monospace" textAnchor="middle">VZ={components.vz2}</text>
    </g>
  );
}

function TwoDiodeSeries({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={20} y={100} label={components.vs} />
      <line x1={20} y1={82} x2={20} y2={50} stroke="currentColor" strokeWidth={1.2} />
      {/* R1 */}
      <line x1={20} y1={50} x2={50} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={55} y={45} fontSize="7" fontFamily="monospace">R₁</text>
      <line x1={80} y1={50} x2={100} y2={50} stroke="currentColor" strokeWidth={1.2} />
      {/* D1 */}
      <DiodeSymbol x={120} y={50} label="D₁" direction="right" />
      {/* D2 */}
      <DiodeSymbol x={155} y={50} label="D₂" direction="right" />
      {/* R2 */}
      <line x1={175} y1={50} x2={195} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={200} y={45} fontSize="7" fontFamily="monospace">{components.r2 || 'R₂'}</text>
      <line x1={220} y1={50} x2={230} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <line x1={230} y1={50} x2={230} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <line x1={20} y1={118} x2={20} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <line x1={20} y1={140} x2={230} y2={140} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={125} y={155} />
    </g>
  );
}

function DiodeZenerCombo({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <text x={130} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vi}</text>
      <line x1={30} y1={40} x2={80} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={55} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">R₁</text>
      {/* Output node */}
      <line x1={110} y1={40} x2={130} y2={40} stroke="currentColor" strokeWidth={1.2} />
      {/* D1 ideal (down) */}
      <DiodeSymbol x={130} y={55} label="D₁" direction="down" />
      <line x1={130} y1={85} x2={130} y2={110} stroke="currentColor" strokeWidth={1.2} />
      {/* D2 Zener (down) */}
      <ZenerDiode x={180} y={70} label={`${components.vz}`} direction="down" />
      <line x1={130} y1={40} x2={180} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={40} x2={180} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={85} x2={180} y2={110} stroke="currentColor" strokeWidth={1.2} />
      {/* R2 */}
      <line x1={130} y1={40} x2={130} y2={130} stroke="currentColor" strokeWidth={0.8} />
      <text x={210} y={70} fontSize="7" fontFamily="monospace">R₂</text>
      <line x1={210} y1={40} x2={210} y2={110} stroke="currentColor" strokeWidth={1.2} />
      <line x1={130} y1={40} x2={210} y2={40} stroke="currentColor" strokeWidth={0.8} />
      <line x1={130} y1={110} x2={210} y2={110} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={155} y={120} />
    </g>
  );
}

function ZenerSwitch({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={30} y={90} label={components.vs} />
      <line x1={30} y1={72} x2={30} y2={45} stroke="currentColor" strokeWidth={1.2} />
      <text x={70} y={40} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r}</text>
      <line x1={100} y1={45} x2={130} y2={45} stroke="currentColor" strokeWidth={1.2} />
      {/* Switch */}
      <text x={130} y={65} fontSize="7" fontFamily="monospace">SW</text>
      <ZenerDiode x={180} y={80} label={`VZ=${components.vz}`} direction="down" />
      <line x1={130} y1={45} x2={180} y2={45} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={45} x2={180} y2={65} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={95} x2={180} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={108} x2={30} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={130} x2={180} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={105} y={145} />
    </g>
  );
}

function PFCorrection({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={30} y={80} label={components.source || components.vpeak?.substring(0, 10) || 'V'} />
      <line x1={30} y1={62} x2={30} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={40} x2={90} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={60} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.rline || 'R_line'}</text>
      <line x1={120} y1={40} x2={160} y2={40} stroke="currentColor" strokeWidth={1.2} />
      {/* Load box */}
      <rect x={150} y={30} width={60} height={35} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <text x={180} y={48} fontSize="7" fontFamily="monospace" textAnchor="middle">Load</text>
      <text x={180} y={58} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.pf1 || 'pf'}</text>
      <line x1={180} y1={65} x2={180} y2={100} stroke="currentColor" strokeWidth={1.2} />
      {/* Capacitor */}
      <Capacitor x={210} y={80} label="C" vertical={true} />
      <line x1={210} y1={65} x2={210} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={160} y1={40} x2={210} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={180} y1={100} x2={210} y2={100} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={98} x2={30} y2={100} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={100} x2={210} y2={100} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={120} y={115} />
    </g>
  );
}

function ParallelLoads({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <text x={130} y={20} fontSize="8" fontFamily="monospace" textAnchor="middle">Bus</text>
      <line x1={40} y1={35} x2={220} y2={35} stroke="currentColor" strokeWidth={1.5} />
      {/* Load 1 */}
      <line x1={80} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <rect x={60} y={55} width={40} height={30} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <text x={80} y={70} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.p1}</text>
      <text x={80} y={80} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.pf1}</text>
      <line x1={80} y1={85} x2={80} y2={120} stroke="currentColor" strokeWidth={1.2} />
      {/* Load 2 */}
      <line x1={180} y1={35} x2={180} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <rect x={160} y={55} width={40} height={30} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <text x={180} y={70} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.p2}</text>
      <text x={180} y={80} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.pf2}</text>
      <line x1={180} y1={85} x2={180} y2={120} stroke="currentColor" strokeWidth={1.2} />
      {/* Return path */}
      <line x1={80} y1={120} x2={180} y2={120} stroke="currentColor" strokeWidth={1.5} />
      <Ground x={130} y={135} />
    </g>
  );
}

function YDeltaConversion({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      {/* Y configuration */}
      <text x={65} y={25} fontSize="8" fontFamily="monospace" textAnchor="middle">Y</text>
      <line x1={65} y1={30} x2={65} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <text x={55} y={45} fontSize="7" fontFamily="monospace" textAnchor="end">{components.za}</text>
      <line x1={65} y1={55} x2={30} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={25} y={68} fontSize="7" fontFamily="monospace" textAnchor="end">{components.zb}</text>
      <line x1={65} y1={55} x2={100} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={105} y={68} fontSize="7" fontFamily="monospace">{components.zc}</text>
      {/* Arrow */}
      <text x={130} y={65} fontSize="10" fontFamily="monospace" textAnchor="middle">→</text>
      {/* Delta configuration */}
      <text x={195} y={25} fontSize="8" fontFamily="monospace" textAnchor="middle">Δ</text>
      <line x1={165} y1={40} x2={225} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={195} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">Zab</text>
      <line x1={165} y1={40} x2={165} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={225} y1={40} x2={225} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <line x1={165} y1={90} x2={225} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={195} y={100} fontSize="7" fontFamily="monospace" textAnchor="middle">Zca    Zbc</text>
    </g>
  );
}

function Y3Phase({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <circle cx={40} cy={100} r={18} fill="none" stroke="currentColor" strokeWidth={1.3} />
      <text x={40} y={103} fontSize="7" fontFamily="monospace" textAnchor="middle">3φ</text>
      <text x={40} y={125} fontSize="6" fontFamily="monospace" textAnchor="middle">{components.vph}</text>
      {/* R branch */}
      <line x1={58} y1={88} x2={110} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <text x={85} y={55} fontSize="7" fontFamily="monospace">R={components.r}</text>
      <line x1={130} y1={55} x2={160} y2={55} stroke="currentColor" strokeWidth={1.2} />
      {/* L branch */}
      <line x1={58} y1={100} x2={110} y2={100} stroke="currentColor" strokeWidth={1.2} />
      <text x={85} y={95} fontSize="7" fontFamily="monospace">L</text>
      <line x1={130} y1={100} x2={160} y2={100} stroke="currentColor" strokeWidth={1.2} />
      {/* C branch */}
      <line x1={58} y1={112} x2={110} y2={145} stroke="currentColor" strokeWidth={1.2} />
      <text x={85} y={145} fontSize="7" fontFamily="monospace">C</text>
      <line x1={130} y1={145} x2={160} y2={145} stroke="currentColor" strokeWidth={1.2} />
      {/* Neutral */}
      <line x1={160} y1={55} x2={160} y2={145} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={160} y={160} />
    </g>
  );
}

function YDelta3Phase({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      {/* Y source */}
      <circle cx={40} cy={80} r={15} fill="none" stroke="currentColor" strokeWidth={1.3} />
      <text x={40} y={83} fontSize="7" fontFamily="monospace" textAnchor="middle">Y</text>
      <text x={40} y={105} fontSize="6" fontFamily="monospace" textAnchor="middle">VL={components.vl}</text>
      {/* Lines */}
      <line x1={55} y1={68} x2={110} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <line x1={55} y1={80} x2={110} y2={80} stroke="currentColor" strokeWidth={1.2} />
      <line x1={55} y1={92} x2={110} y2={110} stroke="currentColor" strokeWidth={1.2} />
      {/* Delta load */}
      <line x1={110} y1={50} x2={200} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <line x1={110} y1={110} x2={200} y2={110} stroke="currentColor" strokeWidth={1.2} />
      <line x1={110} y1={50} x2={110} y2={110} stroke="currentColor" strokeWidth={1.2} />
      <line x1={200} y1={50} x2={200} y2={110} stroke="currentColor" strokeWidth={1.2} />
      {/* Load labels */}
      <text x={155} y={45} fontSize="7" fontFamily="monospace" textAnchor="middle">R+jXL</text>
      <text x={210} y={83} fontSize="7" fontFamily="monospace">R+jXL</text>
      <text x={100} y={83} fontSize="7" fontFamily="monospace" textAnchor="end">R+jXL</text>
      <text x={155} y={125} fontSize="6" fontFamily="monospace" textAnchor="middle">Δ: {components.sphi}, pf={components.pf}</text>
    </g>
  );
}

function SimpleDCLoop({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={40} y={110} label={components.v} />
      <line x1={40} y1={92} x2={40} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <line x1={40} y1={40} x2={120} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={80} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r1}</text>
      <line x1={150} y1={40} x2={210} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={180} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r2}</text>
      <line x1={210} y1={40} x2={210} y2={110} stroke="currentColor" strokeWidth={1.2} />
      <line x1={210} y1={110} x2={40} y2={110} stroke="currentColor" strokeWidth={1.2} />
      {/* Vab label */}
      <text x={210} y={80} fontSize="7" fontFamily="monospace" textAnchor="start"> +Vab−</text>
    </g>
  );
}

function Mesh4Loop({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <text x={130} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">4-Loop Mesh</text>
      {/* Simplified representation */}
      <rect x={20} y={35} width={90} height={70} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <rect x={110} y={35} width={90} height={70} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <rect x={20} y={105} width={90} height={70} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <rect x={110} y={105} width={90} height={70} fill="none" stroke="currentColor" strokeWidth={1.2} rx={3} />
      <text x={65} y={75} fontSize="8" fontFamily="monospace" textAnchor="middle">I₁</text>
      <text x={155} y={75} fontSize="8" fontFamily="monospace" textAnchor="middle">I₂</text>
      <text x={65} y={145} fontSize="8" fontFamily="monospace" textAnchor="middle">I₃</text>
      <text x={155} y={145} fontSize="8" fontFamily="monospace" textAnchor="middle">I₄</text>
      {/* Clockwise arrows */}
      <text x={65} y={65} fontSize="8" fontFamily="monospace" textAnchor="middle">↻</text>
      <text x={155} y={65} fontSize="8" fontFamily="monospace" textAnchor="middle">↻</text>
    </g>
  );
}

function SuperpositionCircuit({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={30} y={60} label="V" />
      <line x1={30} y1={42} x2={30} y2={25} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={25} x2={100} y2={25} stroke="currentColor" strokeWidth={1.2} />
      <text x={65} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r1}</text>
      <line x1={100} y1={25} x2={170} y2={25} stroke="currentColor" strokeWidth={1.2} />
      <text x={135} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r2}</text>
      <line x1={170} y1={25} x2={170} y2={60} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={78} x2={30} y2={130} stroke="currentColor" strokeWidth={1.2} />
      {/* Current source */}
      <circle cx={170} cy={90} r={10} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <line x1={170} y1={80} x2={170} y2={100} stroke="currentColor" strokeWidth={1.3} />
      <polygon points="170,78 167,84 173,84" fill="currentColor" />
      <text x={185} y={93} fontSize="7" fontFamily="monospace">{components.is}</text>
      <line x1={170} y1={100} x2={170} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={130} x2={170} y2={130} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={100} y={145} />
    </g>
  );
}

function RCDischarge({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      {/* Switch + R + C in loop */}
      <text x={130} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">t=0: switch closes</text>
      <line x1={30} y1={40} x2={80} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <text x={55} y={35} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r}</text>
      <line x1={110} y1={40} x2={170} y2={40} stroke="currentColor" strokeWidth={1.2} />
      <Capacitor x={170} y={70} label={components.c} vertical={true} />
      <line x1={170} y1={85} x2={170} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={40} x2={30} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={120} x2={170} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={100} y={135} />
      <text x={100} y={155} fontSize="7" fontFamily="monospace" textAnchor="middle">v(0) = {components.v0}</text>
    </g>
  );
}

function RLSwitchCircuit({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <VSource x={30} y={80} label={components.v || 'V'} />
      <line x1={30} y1={62} x2={30} y2={35} stroke="currentColor" strokeWidth={1.2} />
      {/* Switch */}
      <text x={65} y={30} fontSize="7" fontFamily="monospace" textAnchor="middle">SW (t=0)</text>
      <line x1={30} y1={35} x2={50} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <line x1={80} y1={35} x2={100} y2={35} stroke="currentColor" strokeWidth={1.2} />
      {/* R */}
      <text x={120} y={30} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.r}</text>
      <line x1={140} y1={35} x2={170} y2={35} stroke="currentColor" strokeWidth={1.2} />
      {/* L */}
      <Inductor x={195} y={60} label={components.l} vertical={true} />
      <line x1={170} y1={35} x2={195} y2={35} stroke="currentColor" strokeWidth={1.2} />
      <line x1={195} y1={35} x2={195} y2={45} stroke="currentColor" strokeWidth={1.2} />
      <line x1={195} y1={75} x2={195} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={98} x2={30} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={30} y1={120} x2={195} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={110} y={135} />
    </g>
  );
}

function RLCCircuit({ components, type }: { components: Record<string, string>; labels?: Record<string, string>; type: string }) {
  const isSeries = type === 'series_rlc';
  return (
    <g className="text-navy">
      <text x={130} y={18} fontSize="7" fontFamily="monospace" textAnchor="middle">{isSeries ? 'Series' : 'Parallel'} RLC</text>
      {isSeries ? (
        <>
          <VSource x={20} y={80} label="V" />
          <line x1={20} y1={62} x2={20} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <line x1={20} y1={35} x2={70} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <text x={55} y={30} fontSize="7" fontFamily="monospace">R</text>
          <line x1={90} y1={35} x2={130} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <Inductor x={150} y={35} label="L" vertical={false} />
          <line x1={170} y1={35} x2={210} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <Capacitor x={220} y={60} label="C" vertical={true} />
          <line x1={220} y1={45} x2={220} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <line x1={220} y1={75} x2={220} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <line x1={20} y1={98} x2={20} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <line x1={20} y1={130} x2={220} y2={130} stroke="currentColor" strokeWidth={1.2} />
        </>
      ) : (
        <>
          <VSource x={30} y={80} label="V" />
          <line x1={30} y1={62} x2={30} y2={35} stroke="currentColor" strokeWidth={1.2} />
          <line x1={30} y1={35} x2={200} y2={35} stroke="currentColor" strokeWidth={1.5} />
          <line x1={80} y1={35} x2={80} y2={55} stroke="currentColor" strokeWidth={1.2} />
          <text x={70} y={48} fontSize="7" fontFamily="monospace">R</text>
          <line x1={80} y1={75} x2={80} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <Inductor x={140} y={55} label="L" vertical={true} />
          <line x1={140} y1={35} x2={140} y2={45} stroke="currentColor" strokeWidth={1.2} />
          <line x1={140} y1={85} x2={140} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <Capacitor x={200} y={55} label="C" vertical={true} />
          <line x1={200} y1={35} x2={200} y2={45} stroke="currentColor" strokeWidth={1.2} />
          <line x1={200} y1={75} x2={200} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <line x1={30} y1={98} x2={30} y2={130} stroke="currentColor" strokeWidth={1.2} />
          <line x1={30} y1={130} x2={200} y2={130} stroke="currentColor" strokeWidth={1.2} />
        </>
      )}
      <Ground x={120} y={145} />
      <text x={130} y={170} fontSize="6" fontFamily="monospace" textAnchor="middle">Q={components.q || '?'} BW={components.bw || '?'}</text>
    </g>
  );
}

function EMOSFETSimple({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <MOSFET x={110} y={95} label="M" />
      {/* Gate → VGS */}
      <line x1={98} y1={95} x2={40} y2={95} stroke="currentColor" strokeWidth={1.2} />
      <text x={40} y={88} fontSize="7" fontFamily="monospace" textAnchor="end">VGS={components.vgs}</text>
      {/* Drain → RD → VDD */}
      <line x1={118} y1={81} x2={118} y2={50} stroke="currentColor" strokeWidth={1.2} />
      <text x={135} y={62} fontSize="7" fontFamily="monospace">{components.rd}</text>
      <line x1={118} y1={50} x2={118} y2={30} stroke="currentColor" strokeWidth={1.2} />
      <text x={118} y={25} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vdd}</text>
      {/* Source → GND */}
      <line x1={118} y1={109} x2={118} y2={145} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={118} y={150} />
      <text x={130} y={175} fontSize="6" fontFamily="monospace">Vt={components.vt}</text>
    </g>
  );
}

function TwoFETSeries({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <MOSFET x={110} y={55} label="M₁" />
      <MOSFET x={110} y={135} label="M₂" />
      {/* M1 drain → VDD */}
      <line x1={118} y1={41} x2={118} y2={20} stroke="currentColor" strokeWidth={1.2} />
      <text x={118} y={15} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vdd}</text>
      {/* M1 source = M2 drain */}
      <line x1={118} y1={69} x2={118} y2={121} stroke="currentColor" strokeWidth={1.2} />
      {/* M2 source → RS → GND */}
      <line x1={118} y1={149} x2={118} y2={170} stroke="currentColor" strokeWidth={1.2} />
      <text x={135} y={165} fontSize="7" fontFamily="monospace">{components.rs}</text>
      <Ground x={118} y={185} />
      {/* Gate connections */}
      <line x1={98} y1={55} x2={50} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <line x1={98} y1={135} x2={50} y2={135} stroke="currentColor" strokeWidth={1.2} />
      <text x={45} y={55} fontSize="6" fontFamily="monospace" textAnchor="end">G₁</text>
      <text x={45} y={135} fontSize="6" fontFamily="monospace" textAnchor="end">G₂</text>
      <text x={130} y={95} fontSize="6" fontFamily="monospace">IDSS={components.idss}</text>
      <text x={130} y={105} fontSize="6" fontFamily="monospace">Vp={components.vp}</text>
    </g>
  );
}

function EMOSFETDMOSFET({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <MOSFET x={110} y={55} label="M₁(E)" />
      <MOSFET x={110} y={135} label="M₂(D)" />
      {/* M1 drain → VDD */}
      <line x1={118} y1={41} x2={118} y2={20} stroke="currentColor" strokeWidth={1.2} />
      <text x={118} y={15} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vdd}</text>
      {/* M1 source = M2 drain */}
      <line x1={118} y1={69} x2={118} y2={121} stroke="currentColor" strokeWidth={1.2} />
      {/* M2 source → GND */}
      <line x1={118} y1={149} x2={118} y2={175} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={118} y={180} />
      {/* Gate: V1 to M1 */}
      <line x1={98} y1={55} x2={40} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={55} fontSize="7" fontFamily="monospace" textAnchor="end">V₁={components.v1}</text>
      {/* M2 gate */}
      <line x1={98} y1={135} x2={40} y2={135} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={135} fontSize="6" fontFamily="monospace" textAnchor="end">G₂</text>
      <text x={130} y={90} fontSize="6" fontFamily="monospace">K={components.k}</text>
      <text x={130} y={100} fontSize="6" fontFamily="monospace">Vt={components.vt}</text>
    </g>
  );
}

function TwoDMOSFETBias({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <MOSFET x={110} y={70} label="M₁" />
      <MOSFET x={110} y={140} label="M₂" />
      {/* VDD → R1 → gates */}
      <line x1={118} y1={56} x2={118} y2={20} stroke="currentColor" strokeWidth={1.2} />
      <text x={118} y={15} fontSize="7" fontFamily="monospace" textAnchor="middle">{components.vdd}</text>
      {/* R1 and R2 bias network */}
      <line x1={60} y1={20} x2={118} y2={20} stroke="currentColor" strokeWidth={1.2} />
      <text x={40} y={18} fontSize="6" fontFamily="monospace">{components.r1}</text>
      <line x1={60} y1={20} x2={60} y2={70} stroke="currentColor" strokeWidth={1.2} />
      <line x1={60} y1={70} x2={98} y2={70} stroke="currentColor" strokeWidth={1.2} />
      <text x={40} y={95} fontSize="6" fontFamily="monospace">{components.r2}</text>
      <line x1={60} y1={70} x2={60} y2={120} stroke="currentColor" strokeWidth={1.2} />
      <line x1={60} y1={120} x2={98} y2={120} stroke="currentColor" strokeWidth={0.8} />
      <line x1={98} y1={120} x2={98} y2={140} stroke="currentColor" strokeWidth={0.8} />
      {/* M1 source = M2 drain */}
      <line x1={118} y1={84} x2={118} y2={126} stroke="currentColor" strokeWidth={1.2} />
      {/* M2 source → GND */}
      <line x1={118} y1={154} x2={118} y2={180} stroke="currentColor" strokeWidth={1.2} />
      <Ground x={118} y={185} />
      <text x={140} y={100} fontSize="6" fontFamily="monospace">IDSS={components.idss}</text>
      <text x={140} y={110} fontSize="6" fontFamily="monospace">Vp={components.vp}</text>
    </g>
  );
}

function SingleDiode({ components }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <text x={130} y={20} fontSize="7" fontFamily="monospace" textAnchor="middle">Si Diode I-V</text>
      {/* Simple diode symbol */}
      <DiodeSymbol x={130} y={90} label="D" direction="down" />
      <line x1={130} y1={60} x2={130} y2={75} stroke="currentColor" strokeWidth={1.2} />
      <line x1={130} y1={105} x2={130} y2={120} stroke="currentColor" strokeWidth={1.2} />
      {/* I and V labels */}
      <text x={150} y={85} fontSize="7" fontFamily="monospace">I={components.i}</text>
      <text x={150} y={95} fontSize="7" fontFamily="monospace">V={components.v}</text>
      <text x={150} y={105} fontSize="7" fontFamily="monospace">n={components.n}</text>
      {/* Arrow for current direction */}
      <line x1={130} y1={55} x2={130} y2={45} stroke="currentColor" strokeWidth={1.2} />
      <polygon points="130,45 127,51 133,51" fill="currentColor" />
      <text x={130} y={40} fontSize="7" fontFamily="monospace" textAnchor="middle">I</text>
    </g>
  );
}

function OpAmpCircuit({ components, labels }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <OpAmp x={90} y={90} label="" />
      {/* Input lines */}
      <line x1={40} y1={82} x2={78} y2={82} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={82} fontSize="7" fontFamily="monospace" textAnchor="end">V+</text>
      <line x1={40} y1={98} x2={78} y2={98} stroke="currentColor" strokeWidth={1.2} />
      <text x={35} y={98} fontSize="7" fontFamily="monospace" textAnchor="end">V−</text>
      {/* Output */}
      <line x1={125} y1={90} x2={170} y2={90} stroke="currentColor" strokeWidth={1.2} />
      <text x={175} y={90} fontSize="7" fontFamily="monospace">Vo</text>
      {/* Feedback path */}
      <line x1={155} y1={90} x2={155} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <text x={165} y={68} fontSize="7" fontFamily="monospace">Rf</text>
      <line x1={155} y1={55} x2={70} y2={55} stroke="currentColor" strokeWidth={1.2} />
      <line x1={70} y1={55} x2={70} y2={98} stroke="currentColor" strokeWidth={1.2} />
      <line x1={70} y1={98} x2={78} y2={98} stroke="currentColor" strokeWidth={1.2} />
      {/* VDD/VSS */}
      <text x={105} y={72} fontSize="6" fontFamily="monospace">+V</text>
      <text x={105} y={112} fontSize="6" fontFamily="monospace">−V</text>
    </g>
  );
}

function GenericCircuit({ components, labels }: { components: Record<string, string>; labels?: Record<string, string> }) {
  return (
    <g className="text-navy">
      <rect x={40} y={40} width={180} height={120} fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="4 2" rx={8} />
      <text x={130} y={80} fontSize="9" fontFamily="monospace" textAnchor="middle" fill="#8B867D">
        {labels?.title || 'Circuit Diagram'}
      </text>
      <text x={130} y={100} fontSize="7" fontFamily="monospace" textAnchor="middle" fill="#8B867D">
        {Object.entries(components).slice(0, 3).map(([k, v]) => `${k}=${v}`).join(', ')}
      </text>
      <text x={130} y={115} fontSize="7" fontFamily="monospace" textAnchor="middle" fill="#8B867D">
        {Object.entries(components).slice(3).map(([k, v]) => `${k}=${v}`).join(', ')}
      </text>
    </g>
  );
}

export default CircuitDiagram;
