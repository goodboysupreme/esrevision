#!/usr/bin/env python3
"""Generate high-quality circuit diagram PNGs for EEE F111 study website - Part 1: BJT & Diode circuits"""

import schemdraw
import schemdraw.elements as elm
from schemdraw import Drawing
import os

OUT_DIR = '/home/z/my-project/public/circuits'
os.makedirs(OUT_DIR, exist_ok=True)

def save(d, name):
    d.save(os.path.join(OUT_DIR, name), dpi=200)
    print(f'Saved: {name}')

# ═══════════════════════════════════════════════════════════════
# BJT CIRCUITS
# ═══════════════════════════════════════════════════════════════

def two_npn_cascade():
    """Q1 base→RB→VBB, Q1 collector→RC1→VCC, Q1 collector→Q2 base, Q2 collector→VCC direct, shared RE→GND"""
    d = Drawing(unit=2.5)
    # Q1
    Q1 = d.add(elm.BjtNpn(circle=True).label('Q₁', ofst=(0.2, 0.3)).right())
    # RB from Q1 base to left
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Resistor().left().label('230kΩ', ofst=0.3))
    d.add(elm.Line().left().length(0.3))
    d.add(elm.Battery().down().label('V_{BB}=3V', ofst=(-1.0, 0.3)))
    d.add(elm.Ground())
    # RC1 from Q1 collector up
    d.push()
    d.add(elm.Line().up().at(Q1.collector).length(0.3))
    d.add(elm.Resistor().up().label('R_{C1}=1kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}=6V'))
    d.pop()
    # Junction dot at Q1 collector
    d.add(elm.Dot().at(Q1.collector).color('red'))
    # Wire from Q1 collector to Q2 base
    d.add(elm.Line().right().at(Q1.collector).length(1.5))
    d.add(elm.Line().down().length(0.8))
    # Q2
    Q2 = d.add(elm.BjtNpn(circle=True).label('Q₂', ofst=(0.2, 0.3)).right())
    # Q2 collector straight to VCC (no RC)
    d.push()
    d.add(elm.Line().up().at(Q2.collector).length(2.0))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Shared emitters
    d.add(elm.Line().down().at(Q1.emitter).length(0.5))
    d.add(elm.Line().right().length(3.0))
    d.add(elm.Line().down().at(Q2.emitter).length(0.5))
    # Junction at shared emitter wire
    mid_x = (Q1.emitter[0] + Q2.emitter[0]) / 2
    d.add(elm.Dot().at((mid_x, Q1.emitter[1] - 0.5)).color('red'))
    # RE from junction down to GND
    d.add(elm.Line().down().at((mid_x, Q1.emitter[1] - 0.5)).length(0.5))
    d.add(elm.Resistor().down().label('R_E=2kΩ', ofst=0.3))
    d.add(elm.Ground())
    # Beta label
    d.add(elm.Annotate(th1=0).at((mid_x + 1.5, Q1.emitter[1] - 0.5)).label('β=100'))
    save(d, 'two_npn_cascade.png')

def two_npn_cascade_2():
    """T1 base→RB→VCC, T1 collector→RC1→VCC, T1 collector→T2 base, T2 collector→RC2→VCC, separate RE1, RE2"""
    d = Drawing(unit=2.5)
    # T1
    T1 = d.add(elm.BjtNpn(circle=True).label('T₁', ofst=(0.2, 0.3)).right())
    # RB from T1 base to VCC
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Resistor().left().label('150kΩ', ofst=0.3))
    d.add(elm.Vdd().label('V_{CC}=12V'))
    # RC1 from T1 collector up
    d.push()
    d.add(elm.Line().up().at(T1.collector).length(0.3))
    d.add(elm.Resistor().up().label('R_{C1}=1kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Junction dot at T1 collector
    d.add(elm.Dot().at(T1.collector).color('red'))
    # Wire from T1 collector to T2 base
    d.add(elm.Line().right().at(T1.collector).length(1.5))
    d.add(elm.Line().down().length(0.8))
    # T2
    T2 = d.add(elm.BjtNpn(circle=True).label('T₂', ofst=(0.2, 0.3)).right())
    # RC2 from T2 collector up
    d.push()
    d.add(elm.Line().up().at(T2.collector).length(0.3))
    d.add(elm.Resistor().up().label('R_{C2}=1kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # RE1 from T1 emitter to GND
    d.add(elm.Line().down().at(T1.emitter).length(0.5))
    d.add(elm.Resistor().down().label('R_{E1}=330Ω', ofst=0.3))
    d.add(elm.Ground())
    # RE2 from T2 emitter to GND
    d.add(elm.Line().down().at(T2.emitter).length(0.5))
    d.add(elm.Resistor().down().label('R_{E2}=1kΩ', ofst=0.3))
    d.add(elm.Ground())
    # Beta label
    d.add(elm.Annotate(th1=0).at((T1.emitter[0] + 2.5, T1.emitter[1] - 0.5)).label('β=120'))
    save(d, 'two_npn_cascade_2.png')

def two_npn_cascade_sat():
    """Q1 base→RB→VCC, Q1 collector→RC1→VCC, Q1 collector→Q2 base, Q2 collector→RC2→VCC, shared RE→GND"""
    d = Drawing(unit=2.5)
    # Q1
    Q1 = d.add(elm.BjtNpn(circle=True).label('Q₁', ofst=(0.2, 0.3)).right())
    # RB from Q1 base to VCC
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Resistor().left().label('68kΩ', ofst=0.3))
    d.add(elm.Vdd().label('V_{CC}=5V'))
    # RC1 from Q1 collector up
    d.push()
    d.add(elm.Line().up().at(Q1.collector).length(0.3))
    d.add(elm.Resistor().up().label('R_{C1}=1kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Junction dot
    d.add(elm.Dot().at(Q1.collector).color('red'))
    # Wire to Q2 base
    d.add(elm.Line().right().at(Q1.collector).length(1.5))
    d.add(elm.Line().down().length(0.8))
    # Q2
    Q2 = d.add(elm.BjtNpn(circle=True).label('Q₂', ofst=(0.2, 0.3)).right())
    # RC2 from Q2 collector up
    d.push()
    d.add(elm.Line().up().at(Q2.collector).length(0.3))
    d.add(elm.Resistor().up().label('R_{C2}=500Ω', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Shared emitters
    d.add(elm.Line().down().at(Q1.emitter).length(0.5))
    d.add(elm.Line().right().length(3.0))
    d.add(elm.Line().down().at(Q2.emitter).length(0.5))
    mid_x = (Q1.emitter[0] + Q2.emitter[0]) / 2
    d.add(elm.Dot().at((mid_x, Q1.emitter[1] - 0.5)).color('red'))
    d.add(elm.Line().down().at((mid_x, Q1.emitter[1] - 0.5)).length(0.5))
    d.add(elm.Resistor().down().label('R_E=210Ω', ofst=0.3))
    d.add(elm.Ground())
    save(d, 'two_npn_cascade_sat.png')

def pnp_npn_mixed():
    """Q1(pnp): emitter→+15V, base→RB→GND, collector→R1→GND. Q1 collector→Q2(npn) base, Q2 collector→R2→+10V, Q2 emitter→GND"""
    d = Drawing(unit=2.5)
    # Q1 PNP
    Q1 = d.add(elm.BjtPnp(circle=True).label('Q₁(pnp)', ofst=(0.2, 0.3)).right())
    # Q1 emitter to +15V
    d.push()
    d.add(elm.Line().up().at(Q1.emitter).length(1.0))
    d.add(elm.Vdd().label('+15V'))
    d.pop()
    # Q1 base → RB → GND
    d.add(elm.Line().left().at(Q1.base).length(0.5))
    d.add(elm.Resistor().left().label('60kΩ', ofst=0.3))
    d.add(elm.Line().down().length(1.5))
    d.add(elm.Ground())
    # Q1 collector → R1 → GND
    d.add(elm.Line().down().at(Q1.collector).length(0.3))
    d.add(elm.Dot().at(Q1.collector).color('red'))
    d.add(elm.Resistor().down().label('1kΩ', ofst=0.3))
    d.add(elm.Ground())
    # Wire from Q1 collector to Q2 base
    d.add(elm.Line().right().at(Q1.collector).length(1.5))
    d.add(elm.Line().down().length(0.8))
    # Q2 NPN
    Q2 = d.add(elm.BjtNpn(circle=True).label('Q₂(npn)', ofst=(0.2, 0.3)).right())
    # Q2 collector → R2 → +10V
    d.push()
    d.add(elm.Line().up().at(Q2.collector).length(0.3))
    d.add(elm.Resistor().up().label('1kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('+10V'))
    d.pop()
    # Q2 emitter → GND
    d.add(elm.Line().down().at(Q2.emitter).length(0.5))
    d.add(elm.Ground())
    # Parameters
    d.add(elm.Annotate(th1=0).at((Q2.emitter[0] + 1.5, Q2.emitter[1] - 0.5)).label('α=0.98, β=100'))
    save(d, 'pnp_npn_mixed.png')

def darlington():
    """Q1 base→RB→VCC, Q1 collector→VCC direct, Q1 emitter→Q2 base, Q2 collector→VCC line, Q2 emitter→RE→GND"""
    d = Drawing(unit=2.5)
    # Q1 top
    Q1 = d.add(elm.BjtNpn(circle=True).label('Q₁', ofst=(0.2, 0.3)).right())
    # RB from Q1 base to VCC
    d.add(elm.Line().left().at(Q1.base).length(0.5))
    d.add(elm.Resistor().left().label('R_B', ofst=0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    # Q1 collector to VCC (direct)
    d.push()
    d.add(elm.Line().up().at(Q1.collector).length(1.0))
    d.add(elm.Dot().color('red'))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Q1 emitter → Q2 base (vertical Darlington connection)
    d.add(elm.Line().down().at(Q1.emitter).length(0.8))
    d.add(elm.Dot().color('red'))
    # Q2 below Q1
    Q2 = d.add(elm.BjtNpn(circle=True).label('Q₂', ofst=(0.2, 0.3)).right())
    # Q2 collector back up to VCC line
    d.push()
    d.add(elm.Line().up().at(Q2.collector).length(2.0))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # Q2 emitter → RE → GND
    d.add(elm.Line().down().at(Q2.emitter).length(0.5))
    d.add(elm.Resistor().down().label('R_E', ofst=0.3))
    d.add(elm.Ground())
    d.add(elm.Annotate(th1=0).at((Q2.emitter[0] + 1.5, Q2.emitter[1] - 0.5)).label('β₁, β₂'))
    save(d, 'darlington.png')

def vdb_circuit():
    """Voltage Divider Bias: VCC→R1→base→R2→GND, VCC→RC→collector, emitter→RE→GND"""
    d = Drawing(unit=2.5)
    # Transistor
    Q = d.add(elm.BjtNpn(circle=True).label('Q', ofst=(0.2, 0.3)).right())
    # VCC → R1 → base node
    d.add(elm.Line().left().at(Q.base).length(0.5))
    base_x = d.here
    d.add(elm.Dot().color('red'))
    d.add(elm.Line().up().length(0.5))
    d.add(elm.Resistor().up().label('30kΩ', ofst=(-0.5, 0.1)))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}=12V'))
    # base node → R2 → GND
    d.add(elm.Line().down().at(base_x).length(0.5))
    d.add(elm.Resistor().down().label('20kΩ', ofst=(-0.5, 0.1)))
    d.add(elm.Ground())
    # RC from collector up
    d.push()
    d.add(elm.Line().up().at(Q.collector).length(0.3))
    d.add(elm.Resistor().up().label('3kΩ', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{CC}'))
    d.pop()
    # RE from emitter down
    d.add(elm.Line().down().at(Q.emitter).length(0.5))
    d.add(elm.Resistor().down().label('3kΩ', ofst=0.3))
    d.add(elm.Ground())
    save(d, 'vdb_circuit.png')

# ═══════════════════════════════════════════════════════════════
# DIODE CIRCUITS
# ═══════════════════════════════════════════════════════════════

def zener_regulator():
    """VS→R→junction→Zener(cathode up)→GND, junction→RL→GND"""
    d = Drawing(unit=2.5)
    # VS battery
    d.add(elm.Battery().up().label('V_S', ofst=(-0.8, 0.3)))
    # Top rail
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R=300Ω', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    junction = d.here
    d.add(elm.Dot().color('red'))
    # Zener down (cathode up)
    d.add(elm.Zener().down().label('V_Z=7V', ofst=0.3).reverse())
    d.add(elm.Ground())
    # RL branch
    d.add(elm.Line().right().at(junction).length(1.0))
    d.add(elm.Resistor().down().label('R_L', ofst=0.3))
    d.add(elm.Ground())
    save(d, 'zener_regulator.png')

def two_zener_parallel():
    """10V source → top rail, D1 zener to GND, D2 zener to GND (parallel)"""
    d = Drawing(unit=2.5)
    # Source
    d.add(elm.Battery().up().label('10V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.5))
    # Top rail
    d.add(elm.Dot().color('red'))
    # D1 zener down
    d.push()
    d.add(elm.Zener().down().label('D₁\nV_Z=8V', ofst=0.3).reverse())
    d.add(elm.Ground())
    d.pop()
    # Wire across to D2
    d.add(elm.Line().right().length(2.0))
    d.add(elm.Dot().color('red'))
    # D2 zener down
    d.add(elm.Zener().down().label('D₂\nV_Z=8V', ofst=0.3).reverse())
    d.add(elm.Ground())
    save(d, 'two_zener_parallel.png')

def two_diode_series():
    """VS→R1→D1→D2→R2→GND (series path)"""
    d = Drawing(unit=2.5)
    # Source
    d.add(elm.Battery().up().label('V_S', ofst=(-0.8, 0.3)))
    # Top rail
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R₁', ofst=0.3))
    d.add(elm.Diode().right().label('D₁', ofst=0.3))
    d.add(elm.Diode().right().label('D₂', ofst=0.3))
    d.add(elm.Resistor().right().label('R₂', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    # Return path
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'two_diode_series.png')

def single_diode():
    """Simple diode I-V characteristic circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('V', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R', ofst=0.3))
    d.add(elm.Diode().right().label('Si Diode', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'single_diode.png')

def zener_switch():
    """Zener diode switching circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('V_S', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R', ofst=0.3))
    d.add(elm.Dot().color('red'))
    d.add(elm.Zener().down().label('V_Z', ofst=0.3).reverse())
    d.add(elm.Ground())
    # Output label
    d.add(elm.Line().right().length(1.0))
    d.add(elm.Dot().color('blue'))
    d.add(elm.Resistor().down().label('R_L', ofst=0.3))
    d.add(elm.Ground())
    save(d, 'zener_switch.png')

def half_wave_rectifier():
    """Half-wave rectifier: AC source → diode → RL load"""
    d = Drawing(unit=2.5)
    # AC source
    d.add(elm.SourceSin().up().label('V_s', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Diode().right().label('Si\nV_d=0.7V', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    # RL load
    d.add(elm.Resistor().down().label('R_L', ofst=0.3))
    # Return path
    d.add(elm.Line().left().length(3.5))
    d.add(elm.Ground())
    save(d, 'half_wave_rectifier.png')

if __name__ == '__main__':
    print("Generating BJT & Diode circuits...")
    two_npn_cascade()
    two_npn_cascade_2()
    two_npn_cascade_sat()
    pnp_npn_mixed()
    darlington()
    vdb_circuit()
    zener_regulator()
    two_zener_parallel()
    two_diode_series()
    single_diode()
    zener_switch()
    half_wave_rectifier()
    print("Part 1 complete!")
