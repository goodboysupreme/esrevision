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
];
