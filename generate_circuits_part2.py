#!/usr/bin/env python3
"""Generate high-quality circuit diagram PNGs - Part 2: AC/3-Phase, DC, Op-Amp circuits"""

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
# AC / 3-PHASE CIRCUITS
# ═══════════════════════════════════════════════════════════════

def pf_correction():
    """AC source → Line R → Load (P at pf lag) → Capacitor in parallel for correction"""
    d = Drawing(unit=2.5)
    # AC source
    d.add(elm.SourceSin().up().label('480V\n50Hz', ofst=(-1.0, 0.3)))
    # Line resistance
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R_line\n0.12Ω', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    # Junction
    j = d.here
    d.add(elm.Dot().color('red'))
    # Load branch
    d.push()
    d.add(elm.Inductor().right().label('L_load', ofst=0.3))
    d.add(elm.Resistor().down().label('Load\n88kW', ofst=0.3))
    d.add(elm.Line().left().length(2.5))
    d.add(elm.Dot().color('red'))
    d.pop()
    # Capacitor branch for PF correction
    d.add(elm.Line().right().at(j).length(0.3))
    d.add(elm.Capacitor().down().label('C\n(PF corr.)', ofst=0.3))
    d.add(elm.Line().left().length(0.3))
    # Bottom ground
    d.add(elm.Ground())
    # Labels
    d.add(elm.Annotate(th1=0).at((j[0] - 1.0, j[1] + 1.0)).label('pf₁=0.707 lag'))
    d.add(elm.Annotate(th1=0).at((j[0] + 1.0, j[1] + 1.0)).label('pf₂=0.90 lag'))
    save(d, 'pf_correction.png')

def pf_correction_rl():
    """Same as pf_correction but with explicit RL load"""
    d = Drawing(unit=2.5)
    d.add(elm.SourceSin().up().label('V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R_line', ofst=0.3))
    j = d.here
    d.add(elm.Dot().color('red'))
    d.add(elm.Line().right().length(0.5))
    d.push()
    d.add(elm.Resistor().down().label('R', ofst=0.3))
    d.add(elm.Inductor().left().label('L', ofst=0.3))
    d.pop()
    d.add(elm.Line().right().at(j).length(1.5))
    d.add(elm.Capacitor().down().label('C', ofst=0.3))
    d.add(elm.Line().left().length(3.0))
    d.add(elm.Ground())
    save(d, 'pf_correction_rl.png')

def parallel_loads():
    """Two parallel loads with different pf"""
    d = Drawing(unit=2.5)
    d.add(elm.SourceSin().up().label('V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.5))
    j = d.here
    d.add(elm.Dot().color('red'))
    # Load 1 (lagging)
    d.push()
    d.add(elm.Resistor().right().label('Load 1\n300kW', ofst=0.3))
    d.add(elm.Inductor().down().label('pf=0.6\nlagging', ofst=0.3))
    d.add(elm.Line().left().length(2.0))
    d.pop()
    # Load 2 (leading)
    d.add(elm.Line().right().at(j).length(0.5))
    d.add(elm.Resistor().right().label('Load 2\n400kW', ofst=0.3))
    d.add(elm.Capacitor().down().label('pf=0.8\nleading', ofst=0.3))
    d.add(elm.Line().left().length(2.0))
    d.add(elm.Ground())
    save(d, 'parallel_loads.png')

def y_delta():
    """Y to Delta conversion diagram"""
    d = Drawing(unit=2.5)
    # Y network
    d.add(elm.Line().right().length(0.5))
    center = d.here
    d.add(elm.Dot().color('red'))
    # Three arms
    d.push()
    d.add(elm.Resistor().up().label('Z_a=5Ω', ofst=(-0.8, 0.1)))
    d.add(elm.Dot().label('a', ofst=(-0.3, 0.2)))
    d.pop()
    d.push()
    d.add(elm.Resistor().down().label('Z_b=5Ω', ofst=(-0.8, 0.1)))
    d.add(elm.Dot().label('b', ofst=(-0.3, -0.3)))
    d.pop()
    d.push()
    d.add(elm.Resistor().right().label('Z_c=5Ω', ofst=0.3))
    d.add(elm.Dot().label('c', ofst=(0.3, 0.2)))
    d.pop()
    # Arrow
    d.add(elm.Line().right().length(1.0))
    d.add(elm.Arrow().right().length(0.5))
    # Delta network
    d.add(elm.Resistor().right().label('Z_Δ=15Ω', ofst=0.3))
    d.add(elm.Dot().label('a', ofst=(0.3, 0.2)))
    save(d, 'y_delta.png')

def y_3phase():
    """Y-connected 3-phase system with R, L, C loads"""
    d = Drawing(unit=2.5)
    # Neutral point
    d.add(elm.Dot().label('N', ofst=(-0.5, 0.2)))
    d.add(elm.Line().right().length(0.3))
    n = d.here
    # Phase A
    d.push()
    d.add(elm.SourceSin().up().label('V_a\n110V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().color('red'))
    d.add(elm.Resistor().right().label('R=50Ω', ofst=0.3))
    d.add(elm.Inductor().right().label('L=15H', ofst=0.3))
    d.add(elm.Capacitor().right().label('C', ofst=0.3))
    d.pop()
    # Phase B
    d.add(elm.Line().down().at(n).length(1.0))
    d.push()
    d.add(elm.SourceSin().up().label('V_b\n110V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().color('blue'))
    d.pop()
    # Phase C
    d.add(elm.Line().down().at(n).length(2.0))
    d.add(elm.SourceSin().up().label('V_c\n110V', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().color('green'))
    d.add(elm.Annotate(th1=0).at((n[0] + 3.0, n[1] - 0.5)).label('ω=3 rad/s'))
    save(d, 'y_3phase.png')

def y_delta_3phase():
    """Y-Δ 3-phase system"""
    d = Drawing(unit=2.5)
    # Y source
    d.add(elm.Dot().label('N', ofst=(-0.5, 0.2)))
    d.add(elm.Line().right().length(0.3))
    n = d.here
    d.push()
    d.add(elm.SourceSin().up().label('V_an', ofst=(-0.8, 0.3)))
    d.add(elm.Dot().label('A', ofst=(0.3, 0.2)))
    d.pop()
    d.add(elm.Line().down().at(n).length(1.0))
    d.push()
    d.add(elm.SourceSin().up().label('V_bn', ofst=(-0.8, 0.3)))
    d.add(elm.Dot().label('B', ofst=(0.3, 0.2)))
    d.pop()
    d.add(elm.Line().down().at(n).length(2.0))
    d.add(elm.SourceSin().up().label('V_cn', ofst=(-0.8, 0.3)))
    d.add(elm.Dot().label('C', ofst=(0.3, 0.2)))
    # Delta load (triangle)
    d.add(elm.Annotate(th1=0).at((n[0] + 2.5, n[1])).label('Δ Load\nZ=5Ω each'))
    save(d, 'y_delta_3phase.png')

# ═══════════════════════════════════════════════════════════════
# DC / NETWORK CIRCUITS
# ═══════════════════════════════════════════════════════════════

def dc_3node():
    """DC circuit with 50V source and three nodes"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('50V', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Dot().label('a', ofst=(0.3, 0.2)))
    d.add(elm.Resistor().right().label('15Ω', ofst=0.3))
    d.add(elm.Dot().label('b', ofst=(0.3, 0.2)))
    d.add(elm.Resistor().right().label('3Ω', ofst=0.3))
    d.add(elm.Dot().label('c', ofst=(0.3, 0.2)))
    d.add(elm.Resistor().right().label('5Ω', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'dc_3node.png')

def simple_dc_loop():
    """Simple DC loop with voltage source and resistors"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('V', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R₁', ofst=0.3))
    d.add(elm.Resistor().right().label('R₂', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'simple_dc_loop.png')

def mesh_4loop():
    """4-loop mesh analysis circuit"""
    d = Drawing(unit=2.5)
    # Left loop
    d.add(elm.Battery().up().label('V₁', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R₁', ofst=0.3))
    j1 = d.here
    d.add(elm.Dot().color('red'))
    d.push()
    d.add(elm.Resistor().right().label('R₂', ofst=0.3))
    j2 = d.here
    d.add(elm.Dot().color('red'))
    d.add(elm.Resistor().right().label('R₃', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Line().left().length(4.0))
    d.add(elm.Ground())
    d.pop()
    # Branch down from j1
    d.add(elm.Line().down().at(j1).length(1.0))
    d.add(elm.Resistor().down().label('R₄', ofst=0.3))
    d.add(elm.Line().left().length(0.5))
    # Branch down from j2
    d.add(elm.Line().down().at(j2).length(1.0))
    d.add(elm.Resistor().down().label('R₅', ofst=0.3))
    save(d, 'mesh_4loop.png')

# ═══════════════════════════════════════════════════════════════
# OP-AMP CIRCUITS
# ═══════════════════════════════════════════════════════════════

def opamp_multi_input():
    """Op-amp with multiple inputs (summing amplifier)"""
    d = Drawing(unit=2.5)
    # Op-amp
    d.add(elm.Opamp().right().label('A₁', ofst=(0.3, 0.2)))
    # Feedback resistor
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Resistor().left().label('R_f', ofst=0.3))
    d.add(elm.Line().down().length(0.3))
    # Input resistors
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Dot().color('red'))
    d.push()
    d.add(elm.Resistor().left().label('R₁', ofst=0.3))
    d.add(elm.Dot().label('V₁', ofst=(-0.3, 0.2)))
    d.pop()
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Resistor().left().label('R₂', ofst=0.3))
    d.add(elm.Dot().label('V₂', ofst=(-0.3, 0.2)))
    # Output
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().label('V_out', ofst=(0.3, 0.2)))
    # Ground for + input
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Ground())
    save(d, 'opamp_multi_input.png')

def opamp_find_alpha():
    """Op-amp circuit to find alpha gain"""
    d = Drawing(unit=2.5)
    d.add(elm.Opamp().right().label('A', ofst=(0.3, 0.2)))
    # Feedback
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Resistor().left().label('R_f', ofst=0.3))
    d.add(elm.Line().down().length(0.3))
    # Input
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Resistor().left().label('R₁', ofst=0.3))
    d.add(elm.Dot().label('V_in', ofst=(-0.3, 0.2)))
    # Output
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().label('V_out', ofst=(0.3, 0.2)))
    save(d, 'opamp_find_alpha.png')

def multi_opamp():
    """Multi-stage op-amp circuit"""
    d = Drawing(unit=2.5)
    # First op-amp
    A1 = d.add(elm.Opamp().right().label('A₁', ofst=(0.3, 0.2)))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Resistor().left().label('R_f1', ofst=0.3))
    d.add(elm.Line().down().length(0.3))
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Resistor().left().label('R₁', ofst=0.3))
    d.add(elm.Dot().label('V_in', ofst=(-0.3, 0.2)))
    # Wire A1 output to A2 input
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().color('red'))
    d.push()
    d.add(elm.Resistor().right().label('R₂', ofst=0.3))
    # Second op-amp
    d.add(elm.Opamp().right().label('A₂', ofst=(0.3, 0.2)))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Resistor().left().label('R_f2', ofst=0.3))
    d.add(elm.Line().down().length(0.3))
    # Final output
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Dot().label('V_out', ofst=(0.3, 0.2)))
    d.pop()
    save(d, 'multi_opamp.png')

if __name__ == '__main__':
    print("Generating AC/3-Phase, DC, and Op-Amp circuits...")
    pf_correction()
    pf_correction_rl()
    parallel_loads()
    y_delta()
    y_3phase()
    y_delta_3phase()
    dc_3node()
    simple_dc_loop()
    mesh_4loop()
    opamp_multi_input()
    opamp_find_alpha()
    multi_opamp()
    print("Part 2 complete!")
