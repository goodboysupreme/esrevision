export interface MethodStep {
  id: number;
  text: string;
  detail: string;
  isCheck?: boolean;
  isError?: boolean;
}

export interface MethodMap {
  id: string;
  title: string;
  topic: string;
  topicId: string;
  description: string;
  steps: MethodStep[];
  tips: string[];
}

export const METHODS: MethodMap[] = [
  {
    id: 'bjt-dc',
    title: 'BJT DC Analysis',
    topic: 'BJT',
    topicId: 'bjt',
    description: 'Systematic method to analyze BJT DC bias circuits',
    steps: [
      { id: 1, text: 'Identify BJT type (NPN or PNP)', detail: 'NPN: current flows INTO collector. PNP: current flows OUT OF collector. This determines KVL direction and VBE sign.' },
      { id: 2, text: 'Assume ACTIVE region', detail: 'This is your starting assumption. VBE = 0.7V (0.7 for Si). We will verify later.' },
      { id: 3, text: 'Find IB using KVL at base loop', detail: 'For VDB: Find Vth, Rth first. Then: Vth = IB·Rth + VBE + IE·RE. For fixed bias: VCC = IB·RB + VBE.' },
      { id: 4, text: 'Calculate IC = β·IB', detail: 'Only valid in active region! IC = βIB. IE = IC + IB = (β+1)IB.' },
      { id: 5, text: 'Find VCE using KVL at collector loop', detail: 'VCE = VCC - IC·RC - IE·RE. For pnp: VEC = VCC - IE·RE - IC·RC.' },
      { id: 6, text: 'VERIFY: VCE > 0.2V (NPN) or VEC > 0.2V (PNP)', detail: 'If VCE > 0.2V → Active region ✓. If VCE ≤ 0.2V → SATURATION! Recalculate with VCE(sat) = 0.2V.', isCheck: true },
      { id: 7, text: 'If saturation: IC = (VCC - 0.2)/(RC + RE)', detail: 'In saturation, IC ≠ βIB. Set VCE = 0.2V and recalculate IC from the collector KVL.', isError: true },
    ],
    tips: ['Always check VCE last — never skip verification!', 'For VDB circuits, Thevenin reduction is mandatory.', 'For pnp, remember VEB = 0.7V (not VBE).', 'In cascade, analyze one BJT at a time.'],
  },
  {
    id: 'mosfet-dc',
    title: 'MOSFET DC Analysis',
    topic: 'MOSFET/FET',
    topicId: 'mosfet',
    description: 'Step-by-step MOSFET DC operating point analysis',
    steps: [
      { id: 1, text: 'Identify MOSFET type', detail: 'Enhancement (E-MOSFET): Vt > 0 for n-ch. Depletion (D-MOSFET): Vt < 0 for n-ch. JFET: Vp < 0 for n-ch.' },
      { id: 2, text: 'Find VGS from bias circuit', detail: 'Voltage divider: VGS = VDD·R2/(R1+R2) - ID·RS (if self-bias). Fixed: VGS = VGG. For VGS=VDS circuits, express VGS in terms of ID.' },
      { id: 3, text: 'Check if VGS > Vt (E-MOSFET)', detail: 'If VGS ≤ Vt: device is in cutoff. ID = 0, VDS = VDD. Stop here.', isCheck: true },
      { id: 4, text: 'Assume SATURATION region', detail: 'ID = K(VGS - Vt)² for E-MOSFET. ID = IDSS(1 - VGS/Vt)² for D-MOSFET/JFET. This may give a quadratic equation.' },
      { id: 5, text: 'Solve for ID (may be quadratic)', detail: 'If VGS depends on ID (self-bias): substitute and solve quadratic. Take the physically meaningful root (check that ID > 0).' },
      { id: 6, text: 'Find VDS from output loop KVL', detail: 'VDS = VDD - ID(RD + RS). For dual MOSFET: write KVL for each drain-source path.' },
      { id: 7, text: 'VERIFY: VDS ≥ VGS - Vt (saturation)', detail: 'If VDS ≥ VGS - Vt → Saturation ✓. If VDS < VGS - Vt → Ohmic region! Use ohmic equation and recalculate.', isCheck: true },
      { id: 8, text: 'If ohmic: ID = K[2(VGS-Vt)VDS - VDS²]', detail: 'Much harder to solve. Substitute VDS = VDD - ID·RD and solve. May need iteration.', isError: true },
    ],
    tips: ['E-MOSFET: Vt is threshold voltage. D-MOSFET/JFET: Vt = Vp (pinch-off).', 'When VGS = VDS: device is at saturation boundary.', 'For dual MOSFET problems: both share the same ID (series).', 'Always verify region — wrong region = wrong answer!'],
  },
  {
    id: 'dc-method-selector',
    title: 'DC Method Selector',
    topic: 'DC / Network Theorems',
    topicId: 'dc',
    description: 'When to use which DC analysis method',
    steps: [
      { id: 1, text: 'Count nodes (n) and branches (b)', detail: 'n = number of nodes. b = number of branches. Mesh equations = b - n + 1. Nodal equations = n - 1.' },
      { id: 2, text: 'If many current sources → NODAL analysis', detail: 'Current sources directly give node voltages. Each current source eliminates one unknown.' },
      { id: 3, text: 'If many voltage sources → MESH analysis', detail: 'Voltage sources directly give mesh currents. Each voltage source eliminates one unknown.' },
      { id: 4, text: 'If finding ONE voltage → NODAL', detail: 'Nodal directly gives voltages. Mesh gives currents, then Ohm\'s law for voltage (extra step).' },
      { id: 5, text: 'If finding ONE current → MESH', detail: 'Mesh directly gives currents. Nodal gives voltages, then Ohm\'s law for current (extra step).' },
      { id: 6, text: 'For max power / single element → THEVENIN', detail: 'Find Vth and Rth. Then connect load. Max power when RL = Rth.' },
      { id: 7, text: 'Multiple independent sources → SUPERPOSITION', detail: 'Turn off all but one source. Find response. Repeat. Sum all responses. REMEMBER: NOT for power!', isError: true },
    ],
    tips: ['Supermesh: when a current source is shared between two meshes.', 'Supernode: when a voltage source connects two nodes.', 'Always choose the method with fewer equations!', 'For dependent sources: same method, just include the controlling variable.'],
  },
  {
    id: 'diode-analysis',
    title: 'Diode State Analysis',
    topic: 'Diodes',
    topicId: 'diodes',
    description: 'Systematic method to analyze circuits with diodes',
    steps: [
      { id: 1, text: 'Identify all diodes and their orientations', detail: 'Mark anode (+) and cathode (-). For Zener: note which direction is breakdown.' },
      { id: 2, text: 'For each diode: assume ON or OFF', detail: 'Start with the most likely state. For simple circuits: if voltage source pushes current in forward direction → assume ON.' },
      { id: 3, text: 'Replace ON diode with 0.7V source (Si)', detail: 'For ideal diode: replace with wire (0V). For Si: replace with 0.7V battery. For Zener in breakdown: replace with VZ battery.' },
      { id: 4, text: 'Replace OFF diode with open circuit', detail: 'Remove the diode completely from the circuit. No current flows through it.' },
      { id: 5, text: 'Solve the simplified circuit', detail: 'Use KVL/KCL or other methods. Find voltages and currents.' },
      { id: 6, text: 'VERIFY each diode state', detail: 'ON diode: current must flow anode→cathode (ID > 0). OFF diode: VAK < 0.7V (or VAK < 0 for ideal).', isCheck: true },
      { id: 7, text: 'If inconsistent: change assumption and repeat', detail: 'If verification fails, flip the assumption and resolve. For 2+ diodes: try all 4 combinations if needed.', isError: true },
    ],
    tips: ['For Zener: check if reverse voltage exceeds VZ. If yes → breakdown (regulation).', 'For VTC (voltage transfer characteristic): vary input from -∞ to +∞.', 'Clipper circuits: determine which diode conducts in each half.', 'Dual Zener: both directions clip at ±VZ.'],
  },
  {
    id: 'opamp-analysis',
    title: 'Op-Amp Circuit Analysis',
    topic: 'Op-Amps',
    topicId: 'opamps',
    description: 'Golden rules method for ideal op-amp circuits',
    steps: [
      { id: 1, text: 'Verify NEGATIVE feedback exists', detail: 'Look for a connection from output to inverting input. Without negative feedback, golden rules do NOT apply.', isCheck: true },
      { id: 2, text: 'Apply Golden Rule 1: V+ = V-', detail: 'Virtual short: the two inputs are at the same voltage. This is the MOST powerful rule.' },
      { id: 3, text: 'Apply Golden Rule 2: I+ = I- = 0', detail: 'No current flows into either input. Infinite input impedance.' },
      { id: 4, text: 'Write KCL at V- (inverting node)', detail: 'Sum of all currents entering V- = 0. Since I- = 0, currents through feedback and input resistors are equal.' },
      { id: 5, text: 'Express Vo from KCL equation', detail: 'For inverting: Vo = -Rf/Ri × Vin. For non-inverting: Vo = (1 + Rf/Ri) × Vin. For summing: Vo = -Rf(ΣVi/Ri).' },
      { id: 6, text: 'Check output isn\'t saturated', detail: 'If |Vo| > VCC (supply voltage), the op-amp saturates. Vo clips at ±VCC.', isCheck: true },
    ],
    tips: ['Multiple op-amps: analyze each stage independently (output of one = input of next).', 'For diff amp: Vo = (Rf/Ri)(V2 - V1).', 'Integrator: replace Rf with C → Vo = -1/(RiC) ∫Vin dt.', 'Differentiator: replace Ri with C → Vo = -RfC dVin/dt.'],
  },
  {
    id: 'ac-power-analysis',
    title: 'AC Power Analysis',
    topic: 'AC / 3-Phase',
    topicId: 'ac3phase',
    description: 'Systematic method to find P, Q, S, and power factor in AC circuits',
    steps: [
      { id: 1, text: 'Calculate impedance of each element', detail: 'Z_R = R, Z_L = jωL, Z_C = 1/(jωC) = -j/(ωC). ω = 2πf. Convert to polar if needed.' },
      { id: 2, text: 'Find total impedance Z_total', detail: 'Series: Z = Z1 + Z2 + ... Parallel: 1/Z = 1/Z1 + 1/Z2 + ...' },
      { id: 3, text: 'Calculate current I = V/Z', detail: 'Use phasor analysis. I = V∠0° / Z∠θ = (V/|Z|)∠(-θ). Current lags voltage if θ > 0 (inductive).' },
      { id: 4, text: 'Calculate Real Power P', detail: 'P = Vrms × Irms × cosφ = I²R. Only RESISTORS dissipate real power. Units: Watts (W).' },
      { id: 5, text: 'Calculate Reactive Power Q', detail: 'Q = Vrms × Irms × sinφ. Inductive Q > 0, Capacitive Q < 0. Units: VAR.' },
      { id: 6, text: 'Calculate Apparent Power S', detail: 'S = P + jQ. |S| = Vrms × Irms = √(P² + Q²). Units: VA.' },
      { id: 7, text: 'Calculate Power Factor', detail: 'PF = cosφ = P/|S|. Lagging (inductive) or Leading (capacitive).', isCheck: true },
    ],
    tips: ['P is ONLY dissipated in resistors. L and C only exchange reactive power.', 'Sign of Q: Inductive loads → positive Q (lagging PF). Capacitive → negative Q (leading PF).', 'For parallel loads: P_total = P1+P2, Q_total = Q1+Q2 (respect signs!).', 'Complex power: S = Vrms × I*rms (conjugate of current!).'],
  },
  {
    id: '3phase-analysis',
    title: '3-Phase System Analysis',
    topic: 'AC / 3-Phase',
    topicId: 'ac3phase',
    description: 'Step-by-step method for balanced 3-phase Y and Δ systems',
    steps: [
      { id: 1, text: 'Identify connection type: Y or Δ', detail: 'Y (Star): impedances share a common neutral point. Δ (Delta): impedances form a closed loop.' },
      { id: 2, text: 'For Y: Vφ = VL/√3, Iφ = IL', detail: 'Phase voltage = Line voltage / √3. Phase current = Line current. VL leads Vφ by 30°.' },
      { id: 3, text: 'For Δ: Vφ = VL, Iφ = IL/√3', detail: 'Phase voltage = Line voltage. Phase current = Line current / √3. IL lags Iφ by 30°.' },
      { id: 4, text: 'Calculate per-phase values', detail: 'Iφ = Vφ/|Zφ|. Zφ = R + jX. |Zφ| = √(R²+X²). Phase angle = arctan(X/R).' },
      { id: 5, text: 'Calculate total 3-phase power', detail: 'P = √3 × VL × IL × cosφ = 3 × Vφ × Iφ × cosφ. Q = √3 × VL × IL × sinφ.', isCheck: true },
      { id: 6, text: 'Y↔Δ conversion if needed', detail: 'Balanced: ZΔ = 3×ZY. This lets you convert between configurations easily.', isError: true },
    ],
    tips: ['Y: VL = √3·Vφ, IL = Iφ. Δ: VL = Vφ, IL = √3·Iφ. NEVER mix these up!', 'Always use P = √3·VL·IL·cosφ for 3-phase total power.', 'For unbalanced loads: analyze each phase separately.', 'Y-Δ conversion: ZΔ = 3×ZY (balanced only!).'],
  },
  {
    id: 'pf-correction',
    title: 'Power Factor Correction',
    topic: 'AC / 3-Phase',
    topicId: 'ac3phase',
    description: 'How to improve power factor by adding capacitors',
    steps: [
      { id: 1, text: 'Find original reactive power Q1', detail: 'Q1 = P × tan(cos⁻¹(PF₁)). Where P is the real power and PF₁ is the original power factor.' },
      { id: 2, text: 'Find desired reactive power Q2', detail: 'Q2 = P × tan(cos⁻¹(PF₂)). Where PF₂ is the target power factor (e.g., 0.9).' },
      { id: 3, text: 'Calculate reactive power compensation', detail: 'ΔQ = Q1 - Q2. This is the reactive power that the capacitor must provide.' },
      { id: 4, text: 'Find capacitance value', detail: 'C = ΔQ / (ω × V²). Where ω = 2πf and V is the supply voltage.', isCheck: true },
      { id: 5, text: 'Verify new PF', detail: 'PF_new = cos(arctan(Q2/P)). Should equal target PF₂.', isCheck: true },
    ],
    tips: ['Capacitor adds NEGATIVE Q (reduces lagging reactive power).', 'PF correction does NOT change real power P!', 'Typical target: PF = 0.85 to 0.95. Going to 1.0 is expensive and unnecessary.', 'After correction: line current decreases → less I²R loss in transmission.'],
  },
  {
    id: 'transient-analysis',
    title: 'RL/RC Transient Analysis',
    topic: 'Transients',
    topicId: 'transients',
    description: 'Systematic method for first-order transient circuits with switches',
    steps: [
      { id: 1, text: 'Find initial condition i(0⁻) or v(0⁻)', detail: 'Analyze the circuit BEFORE the switch changes. At DC steady state: L = short, C = open.' },
      { id: 2, text: 'Apply continuity condition', detail: 'Inductor: i(0⁺) = i(0⁻). Capacitor: v(0⁺) = v(0⁻). These CANNOT change instantaneously!', isCheck: true },
      { id: 3, text: 'Find final value i(∞) or v(∞)', detail: 'At DC steady state AFTER switch: L = short circuit, C = open circuit. Calculate the final value.' },
      { id: 4, text: 'Calculate time constant τ', detail: 'RL: τ = L/R. RC: τ = RC. Find R by looking into the inductor/capacitor terminals (kill sources).' },
      { id: 5, text: 'Write the general solution', detail: 'x(t) = x(∞) + [x(0⁺) - x(∞)] × e^(-t/τ) for t > 0.', isCheck: true },
      { id: 6, text: 'Find derivative if asked (vL or iC)', detail: 'vL(t) = L × di/dt. iC(t) = C × dv/dt. Take derivative of the general solution.', isError: true },
    ],
    tips: ['Inductor current is CONTINUOUS: i(0⁺) = i(0⁻). But vL CAN jump!', 'Capacitor voltage is CONTINUOUS: v(0⁺) = v(0⁻). But iC CAN jump!', 'At DC steady state: inductor = short, capacitor = open.', 'Time constant: 63.2% of change in 1τ, 98.2% in 4τ, 99.3% in 5τ.'],
  },
  {
    id: 'filter-analysis',
    title: 'Filter & Resonance Analysis',
    topic: 'Filters / Resonance',
    topicId: 'filters',
    description: 'How to find transfer function, cutoff frequency, and filter type',
    steps: [
      { id: 1, text: 'Find transfer function H(jω) = Vout/Vin', detail: 'Use voltage divider: H = Z2/(Z1+Z2) where Z1 is between Vin and Vout, Z2 is from Vout to ground.' },
      { id: 2, text: 'Find magnitude |H(jω)|', detail: 'Take the absolute value. |H|² = (numerator)² / (denominator)².' },
      { id: 3, text: 'Find maximum gain |H_max|', detail: 'LPF: at ω=0. HPF: at ω→∞. BPF: at ω₀. Notch: at ω=0 and ω→∞.' },
      { id: 4, text: 'Find half-power (cutoff) frequency', detail: 'Set |H|² = |H_max|²/2 and solve for ωc. This gives the -3dB point.', isCheck: true },
      { id: 5, text: 'Determine filter type', detail: 'LPF: gain drops at high ω. HPF: gain drops at low ω. BPF: passband in middle. Notch: rejects a band.' },
      { id: 6, text: 'For resonance: find ω₀ and Q', detail: 'ω₀ = 1/√(LC). Series Q = ω₀L/R. Parallel Q = R/(ω₀L). BW = ω₀/Q.', isCheck: true },
    ],
    tips: ['Series Q = ω₀L/R. Parallel Q = R/(ω₀L). They are INVERSES — don\'t mix up!', 'At resonance: VL = VC = Q×Vsource. Can exceed source voltage!', 'For LPF: H = 1/(1+jωRC), ωc = 1/RC.', 'For HPF: H = jωRC/(1+jωRC), ωc = 1/RC.'],
  },
];
