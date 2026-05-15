export interface Trap {
  id: string;
  topic: string;
  topicId: string;
  title: string;
  front: string;
  back: string;
  severity: 'critical' | 'warning' | 'caution';
}

export const TRAPS: Trap[] = [
  // BJT Traps
  { id: 't1', topic: 'BJT', topicId: 'bjt', title: 'Active Region Assumption', front: 'Never assume BJT is in active region without verifying VCE > 0.2V!', back: 'Always check: VCE > VCE(sat) ≈ 0.2V. If VCE < 0.2V, BJT is in saturation and IC ≠ βIB. Recalculate with VCE = 0.2V.', severity: 'critical' },
  { id: 't2', topic: 'BJT', topicId: 'bjt', title: 'pnp Polarity', front: 'pnp uses VEB, not VBE!', back: 'For pnp: VEB = 0.7V (emitter higher than base). Current flows OUT of base and collector. IC flows INTO the collector for npn, OUT for pnp in normal active.', severity: 'critical' },
  { id: 't3', topic: 'BJT', topicId: 'bjt', title: 'Darlington VBE', front: 'Darlington pair has VBE = 1.4V, not 0.7V!', back: 'Two base-emitter junctions in series: VBE_total = VBE1 + VBE2 = 0.7 + 0.7 = 1.4V. β_total ≈ β₁·β₂. IE1 = IB2 (they are connected).', severity: 'critical' },
  { id: 't4', topic: 'BJT', topicId: 'bjt', title: 'VDB Thevenin', front: 'VDB: Always find Thevenin equivalent of base bias network first!', back: 'Vth = VCC × R2/(R1+R2). Rth = R1‖R2. Then KVL: Vth = IB×Rth + VBE + IE×RE. Do NOT skip Thevenin — direct KVL through VCC is wrong.', severity: 'warning' },
  { id: 't5', topic: 'BJT', topicId: 'bjt', title: 'IC = βIB Only in Active', front: 'IC = βIB is ONLY valid in active region!', back: 'In saturation: IC < βIB (forced β). In cutoff: IC = 0. Always verify region first, then apply correct equation.', severity: 'critical' },

  // Diode Traps
  { id: 't6', topic: 'Diodes', topicId: 'diodes', title: 'Zener Polarity', front: 'Zener diode polarity is reversed for regulation!', back: 'For regulation: Zener is REVERSE biased. Cathode is MORE positive than anode. V_out = V_Z when V_in > V_Z. Forward bias: just 0.7V drop like normal diode.', severity: 'critical' },
  { id: 't7', topic: 'Diodes', topicId: 'diodes', title: 'Diode State Analysis', front: 'Always VERIFY your diode state assumption!', back: 'Method: 1) Assume ON/OFF. 2) Solve circuit with assumption. 3) Check: If ON assumed → current must be positive (forward direction). If OFF assumed → voltage across must be < 0.7V. If inconsistent, change assumption.', severity: 'critical' },
  { id: 't8', topic: 'Diodes', topicId: 'diodes', title: 'Dynamic Resistance', front: 'Dynamic resistance r_d ≠ static resistance!', back: 'r_d = nV_T/I_D (small signal). Static R = V_D/I_D. r_d is for AC/small-signal analysis. V_T ≈ 26mV at room temperature. n ≈ 1 for Si.', severity: 'warning' },
  { id: 't9', topic: 'Diodes', topicId: 'diodes', title: 'Ideal vs Si Diode', front: 'Ideal diode: 0V drop. Si diode: 0.7V drop. Read the question carefully!', back: 'If "ideal diode" is specified → V_D = 0V when ON. If Si diode → V_D = 0.7V. For Germanium: V_D = 0.3V. Always check what type is specified.', severity: 'caution' },

  // MOSFET Traps
  { id: 't10', topic: 'MOSFET/FET', topicId: 'mosfet', title: 'MOSFET Region Verification', front: 'Always verify MOSFET operating region after solving!', back: 'Saturation: VDS ≥ VGS - Vt (and VGS > Vt for EMOSFET). Ohmic: VDS < VGS - Vt. If assumed saturation but VDS < VGS - Vt → recalculate in ohmic region.', severity: 'critical' },
  { id: 't11', topic: 'MOSFET/FET', topicId: 'mosfet', title: 'Depletion MOSFET VGS = 0', front: 'Depletion MOSFET can conduct at VGS = 0!', back: 'Unlike enhancement MOSFET, depletion type has a channel at VGS = 0. iD = IDSS when VGS = 0. Can have negative VGS to reduce current. Vt is negative for n-channel depletion.', severity: 'warning' },
  { id: 't12', topic: 'MOSFET/FET', topicId: 'mosfet', title: 'JFET VGS Always Reverse Biased', front: 'JFET gate-source is ALWAYS reverse biased (or zero)!', back: 'For n-channel JFET: VGS ≤ 0. For p-channel: VGS ≥ 0. If VGS would need to be forward biased, something is wrong with your calculation.', severity: 'critical' },

  // DC/Network Theorems Traps
  { id: 't13', topic: 'DC / Network Theorems', topicId: 'dc', title: 'Superposition ≠ Power', front: 'Superposition does NOT work for power!', back: 'P = I²R or P = VI is NONLINEAR. You CANNOT find power from each source and add. Find total V and I first using superposition, THEN calculate P = VI.', severity: 'critical' },
  { id: 't14', topic: 'DC / Network Theorems', topicId: 'dc', title: 'Thevenin: Dependent Sources', front: 'Dependent sources CANNOT be turned off for Thevenin!', back: 'To find Rth with dependent sources: 1) Turn off independent sources only. 2) Apply test voltage Vt at terminals. 3) Find It. 4) Rth = Vt/It. OR: Rth = Voc/Isc.', severity: 'critical' },
  { id: 't15', topic: 'DC / Network Theorems', topicId: 'dc', title: 'Nodal vs Mesh', front: 'Choose the right method for fewer equations!', back: 'Nodal: fewer equations when #nodes < #meshes. Mesh: fewer when #meshes < #nodes. Current sources → mesh is easier. Voltage sources → nodal is easier. Supermesh for shared current source.', severity: 'warning' },

  // Op-Amp Traps
  { id: 't16', topic: 'Op-Amps', topicId: 'opamps', title: 'Golden Rules Conditions', front: 'Op-amp golden rules ONLY apply with negative feedback!', back: 'V+ = V- and I_in = 0 ONLY when there is negative feedback. In open-loop or positive feedback, these rules DO NOT apply. Always check for negative feedback first.', severity: 'critical' },
  { id: 't17', topic: 'Op-Amps', topicId: 'opamps', title: 'Virtual Short ≠ Real Short', front: 'Virtual short: V+ = V-, but NO current flows between them!', back: 'V+ = V- is a voltage condition, not a wire. Current does NOT flow from V- to V+. The op-amp output adjusts to make them equal. I_+ = I_- = 0.', severity: 'warning' },

  // Transients Traps
  { id: 't18', topic: 'Transients', topicId: 'transients', title: 'Inductor Current Continuity', front: 'Inductor current is CONTINUOUS at t=0!', back: 'i_L(0⁺) = i_L(0⁻). Always! But v_L can jump instantaneously. Capacitor: v_C(0⁺) = v_C(0⁻), but i_C can jump. Use continuity to find initial conditions.', severity: 'critical' },
  { id: 't19', topic: 'Transients', topicId: 'transients', title: 'Steady State Conditions', front: 'Inductor = short, Capacitor = open at DC steady state!', back: 'At t = ∞ (DC): v_L = 0 (short circuit), i_C = 0 (open circuit). Use this to find final values i(∞) and v(∞) easily.', severity: 'warning' },

  // Filters/Resonance Traps
  { id: 't20', topic: 'Filters / Resonance', topicId: 'filters', title: 'Q Factor: Series vs Parallel', front: 'Q formula is DIFFERENT for series vs parallel RLC!', back: 'Series: Q = ω₀L/R = 1/(ω₀CR). Parallel: Q = R/(ω₀L) = ω₀CR. SAME resonance freq: ω₀ = 1/√(LC). But Q is inverted! Mixing them up is a common trap.', severity: 'critical' },
  { id: 't21', topic: 'Filters / Resonance', topicId: 'filters', title: 'VL at Resonance', front: 'At resonance, VL can EXCEED source voltage!', back: 'V_L = Q × V_source at resonance! Quality factor amplifies voltage across L and C individually, even though they cancel. V_C also = Q × V_source.', severity: 'warning' },

  // AC/3-Phase Traps
  { id: 't22', topic: 'AC / 3-Phase', topicId: 'ac3phase', title: 'Line vs Phase Values', front: 'V_line = √3 × V_phase (Y), I_line = √3 × I_phase (Δ)!', back: 'Y-connection: V_line = √3·V_phase, I_line = I_phase. Δ-connection: V_line = V_phase, I_line = √3·I_phase. Do NOT mix up which is which!', severity: 'critical' },
  { id: 't23', topic: 'AC / 3-Phase', topicId: 'ac3phase', title: 'Power Factor Sign', front: 'Leading vs Lagging power factor!', back: 'Lagging PF (inductive): current lags voltage, Q is positive. Leading PF (capacitive): current leads voltage, Q is negative. PF correction: add capacitance to reduce lagging.', severity: 'warning' },
];
