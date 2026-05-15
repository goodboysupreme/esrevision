'use client';

import { FC, useState } from 'react';
import { TOPICS } from '@/data/topics';

const FORMULAS: Record<string, { title: string; formulas: string[]; keyEquations: string[] }> = {
  bjt: {
    title: 'BJT — Bipolar Junction Transistor',
    formulas: [
      'IC = βIB (active region only)',
      'IE = IC + IB = (β+1)IB',
      'α = β/(β+1), β = α/(1-α)',
      'IC = αIE + ICO',
      'VBE = 0.7V (Si, active/saturation)',
      'VCE(sat) ≈ 0.2V',
      'IC(sat) = (VCC - VCE(sat))/(RC + RE)',
      'Darlington: β_total ≈ β₁·β₂, VBE = 1.4V',
    ],
    keyEquations: [
      'VDB: Vth = VCC·R2/(R1+R2), Rth = R1‖R2',
      'Vth = IB·Rth + VBE + IE·RE',
      'VCE = VCC - IC·RC - IE·RE',
      'pnp: VEB = 0.7V, IC flows OUT of collector',
    ],
  },
  diodes: {
    title: 'Diodes — PN Junction & Zener',
    formulas: [
      'I = IS(e^(V/nVT) - 1)',
      'IS doubles for every 10°C rise',
      'VT = kT/q ≈ 26mV at 300K',
      'n = ideality factor (1 for ideal, 1-2 real)',
      'VON = 0.7V (Si), 0.3V (Ge)',
      'Dynamic resistance: rd = nVT/ID',
      'Zener: VZ in reverse bias (cathode > anode)',
    ],
    keyEquations: [
      'Zener regulator: IZ = IS - IL = IS - VZ/RL',
      'For regulation: IZ(min) ≤ IZ ≤ IZ(max)',
      'RL(min) = VZ/(IS - IZ(min))',
      'RL(max) = VZ/(IS - IZ(max))',
    ],
  },
  mosfet: {
    title: 'MOSFET/FET — Field Effect Transistors',
    formulas: [
      'E-MOSFET Sat: iD = K(VGS - Vt)²',
      'E-MOSFET Ohmic: iD = K[2(VGS-Vt)VDS - VDS²]',
      'K = ½μnCox(W/L) = ID,on/[2(VGS-Vt)²]',
      'D-MOSFET/JFET Sat: iD = IDSS(1 - VGS/Vp)²',
      'D-MOSFET Ohmic: iD = IDSS[2(VGS/Vp-1)(VDS/Vp) - (VDS/Vp)²]',
      'rDS(on) ≈ 1/[2K(VGS-Vt)] (deep triode)',
    ],
    keyEquations: [
      'Saturation condition: VDS ≥ VGS - Vt',
      'Ohmic condition: VDS < VGS - Vt',
      'Cutoff: VGS < Vt (E-MOSFET)',
      'JFET: VGS ≤ 0 (n-ch), Vp < 0',
    ],
  },
  ac3phase: {
    title: 'AC Circuits & 3-Phase Systems',
    formulas: [
      'Z = R + jX, |Z| = √(R²+X²), ∠Z = tan⁻¹(X/R)',
      'P = VIcosφ = I²R (real power)',
      'Q = VIsinφ = I²X (reactive power)',
      'S = P + jQ, |S| = √(P²+Q²)',
      'PF = cosφ = P/|S|',
      'Y-conn: VL = √3·Vφ, IL = Iφ',
      'Δ-conn: VL = Vφ, IL = √3·Iφ',
    ],
    keyEquations: [
      'P_total = 3·Vφ·Iφ·cosφ = √3·VL·IL·cosφ',
      'Q_total = √3·VL·IL·sinφ',
      'Y→Δ: ZΔ = 3·ZY (balanced)',
      'PF correction: C = ΔQ/(ωV²)',
    ],
  },
  dc: {
    title: 'DC Circuits & Network Theorems',
    formulas: [
      'KVL: ΣV = 0 around any loop',
      'KCL: ΣI = 0 at any node',
      'V = IR (Ohm\'s Law)',
      'P = VI = I²R = V²/R',
      'Thevenin: Vth = Voc, Rth = Voc/Isc',
      'Norton: IN = Isc, RN = Rth',
      'Max Power: RL = Rth, Pmax = Vth²/(4Rth)',
    ],
    keyEquations: [
      'Superposition: V = V1 + V2 + ... (one source at a time)',
      '⚠️ Superposition does NOT work for power!',
      'With dependent sources: Rth = Vtest/Itest',
      'Mesh: ΣR·I = ΣV for each loop',
      'Nodal: Σ(Vi-Vref)/Ri = ΣIsources',
    ],
  },
  opamps: {
    title: 'Op-Amps — Operational Amplifiers',
    formulas: [
      'Golden Rule 1: V+ = V- (neg feedback)',
      'Golden Rule 2: I+ = I- = 0',
      'Inverting: Av = -Rf/Ri',
      'Non-inverting: Av = 1 + Rf/Ri',
      'Summing: Vo = -Rf(V1/R1 + V2/R2 + ...)',
      'Diff amp: Vo = (Rf/Ri)(V2 - V1)',
    ],
    keyEquations: [
      'Integrator: Vo = -(1/RiC)∫Vin dt',
      'Differentiator: Vo = -RfC dVin/dt',
      'Voltage follower: Vo = Vin (buffer)',
      'Slew rate: SR = dVo/dt max',
    ],
  },
  filters: {
    title: 'Filters & Resonance',
    formulas: [
      'Series RLC resonance: ω₀ = 1/√(LC)',
      'Series Q = ω₀L/R = 1/(ω₀CR)',
      'Parallel Q = R/(ω₀L) = ω₀CR',
      'BW = ω₀/Q = R/L (series) = 1/(RC) (parallel)',
      'Half-power: |H|² = |Hmax|²/2',
      'Transfer: H(jω) = Vout/Vin',
    ],
    keyEquations: [
      'At resonance: Z = R (series, minimum)',
      'VL = VC = Q·Vsource at resonance!',
      'f₁,₂ = f₀ ± BW/2 (half-power freq)',
      'LPF: H = 1/(1+jωRC), HPF: H = jωRC/(1+jωRC)',
    ],
  },
  transients: {
    title: 'Transients — RL & RC Circuits',
    formulas: [
      'RL: τ = L/R, RC: τ = RC',
      'i(t) = i(∞) + [i(0⁺) - i(∞)]e^(-t/τ)',
      'v(t) = v(∞) + [v(0⁺) - v(∞)]e^(-t/τ)',
      'iL(0⁺) = iL(0⁻) (inductor continuity)',
      'vC(0⁺) = vC(0⁻) (capacitor continuity)',
    ],
    keyEquations: [
      'DC steady state: L = short, C = open',
      'Energy: WL = ½Li², WC = ½Cv²',
      'Charging: vC(t) = V(1-e^(-t/τ))',
      'Discharging: vC(t) = V₀·e^(-t/τ)',
    ],
  },
};

const CheatSheet: FC = () => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTopics(new Set(Object.keys(FORMULAS)));
  };

  const collapseAll = () => {
    setExpandedTopics(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-navy">
            📋 Cheat Sheet — All Formulas
          </h2>
          <p className="font-ui text-sm text-muted-text mt-1">
            Color-coded by topic · Equations provided in QP, but method matters
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="font-ui text-xs px-3 py-1.5 bg-cream border border-border-warm rounded text-navy hover:bg-secondary transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="font-ui text-xs px-3 py-1.5 bg-cream border border-border-warm rounded text-navy hover:bg-secondary transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(FORMULAS).map(([topicId, data]) => {
          const topicInfo = TOPICS.find(t => t.id === topicId);
          const isExpanded = expandedTopics.has(topicId);
          const color = topicInfo?.color || '#8B867D';

          return (
            <div
              key={topicId}
              className="bg-cream border-l-4 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              style={{ borderLeftColor: color }}
            >
              <button
                className="w-full text-left p-4 flex items-center justify-between"
                onClick={() => toggleTopic(topicId)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-ui text-xs font-bold px-2 py-1 rounded text-cream"
                    style={{ backgroundColor: color }}
                  >
                    {topicInfo?.shortName || topicId}
                  </span>
                  <span className="font-heading font-bold text-navy">{data.title}</span>
                  {topicInfo?.category === 'post-midsem' && (
                    <span className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Post-Midsem
                    </span>
                  )}
                  {topicInfo?.category === 'pre-midsem-extra' && (
                    <span className="font-ui text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Pre-Midsem (Not in Midsem)
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-muted-text transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-parchment rounded-lg p-4">
                      <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-3">
                        Core Formulas
                      </div>
                      <div className="space-y-2">
                        {data.formulas.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-ui text-xs text-muted-text mt-0.5">•</span>
                            <code className="font-mono text-sm text-navy leading-relaxed">{f}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-parchment rounded-lg p-4">
                      <div className="font-ui text-[10px] font-bold text-muted-text uppercase tracking-wider mb-3">
                        Key Equations & Methods
                      </div>
                      <div className="space-y-2">
                        {data.keyEquations.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="font-ui text-xs text-muted-text mt-0.5">→</span>
                            <code className="font-mono text-sm text-navy leading-relaxed">{f}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheatSheet;
