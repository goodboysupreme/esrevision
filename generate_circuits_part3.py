#!/usr/bin/env python3
"""Generate high-quality circuit diagram PNGs - Part 3: MOSFET, FET, Transient, Filter circuits"""

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
# MOSFET / FET CIRCUITS
# ═══════════════════════════════════════════════════════════════

def emosfet_simple():
    """Enhancement MOSFET: VGS applied, drain→RD→VDD, source GND"""
    d = Drawing(unit=2.5)
    # MOSFET
    d.add(elm.NFet(circle=True).right().label('M₁(E)', ofst=(0.2, 0.3)))
    # Gate → VGS
    d.add(elm.Line().left().length(0.5))
    d.add(elm.Dot().label('V_{GS}=8V', ofst=(-0.3, 0.2)))
    # Drain → RD → VDD
    d.push()
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Resistor().up().label('R_D=250Ω', ofst=0.3))
    d.add(elm.Line().up().length(0.3))
    d.add(elm.Vdd().label('V_{DD}=10V'))
    d.pop()
    # Source → GND
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Ground())
    # Vt label
    d.add(elm.Annotate(th1=0).at((d.here[0] + 1.5, d.here[1])).label('V_t=2V, K=0.25mA/V²'))
    save(d, 'emosfet_simple.png')

def two_dmosfet_series():
    """Two depletion MOSFETs in series: M1(ohmic) on top, M2(active) on bottom"""
    d = Drawing(unit=2.5)
    # VDD → M1 → M2 → GND
    d.add(elm.Vdd().label('V_{DD}'))
    d.add(elm.Line().down().length(0.3))
    d.add(elm.NFet2(circle=True).right().label('M₁(D-ohmic)', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    j = d.here
    d.add(elm.Dot().color('red'))
    d.add(elm.NFet2(circle=True).right().label('M₂(D-active)', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Ground())
    # Gate connections
    d.add(elm.Annotate(th1=0).at((j[0] + 2.0, j[1])).label('I_{DSS1}=4mA, V_{p1}=-4V'))
    d.add(elm.Annotate(th1=0).at((j[0] + 2.0, j[1] - 1.5)).label('I_{DSS2}=8mA, V_{p2}=-4V'))
    save(d, 'two_dmosfet_series.png')

def two_jfet_series():
    """Two JFETs in series"""
    d = Drawing(unit=2.5)
    d.add(elm.Vdd().label('V_{DD}'))
    d.add(elm.Line().down().length(0.3))
    d.add(elm.JFetN(circle=True).right().label('J₁', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Dot().color('red'))
    d.add(elm.JFetN(circle=True).right().label('J₂', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Ground())
    save(d, 'two_jfet_series.png')

def emosfet_dmosfet():
    """E-MOSFET and D-MOSFET combination"""
    d = Drawing(unit=2.5)
    # VDD
    d.add(elm.Vdd().label('V_{DD}'))
    d.add(elm.Line().down().length(0.3))
    d.add(elm.NFet(circle=True).right().label('M₁(E)', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Dot().color('red'))
    d.add(elm.NFet2(circle=True).right().label('M₂(D)', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Ground())
    save(d, 'emosfet_dmosfet.png')

def two_dmosfet_bias():
    """Two depletion MOSFETs with bias resistors"""
    d = Drawing(unit=2.5)
    # VDD
    d.add(elm.Vdd().label('V_{DD}'))
    d.add(elm.Line().down().length(0.3))
    d.add(elm.Resistor().down().label('R_D', ofst=0.3))
    d.add(elm.NFet2(circle=True).right().label('M₁(D)', ofst=(0.2, 0.3)))
    d.add(elm.Line().down().length(0.5))
    d.add(elm.Dot().color('red'))
    d.add(elm.NFet2(circle=True).right().label('M₂(D)', ofst=(0.2, 0.3)))
    d.add(elm.Resistor().down().label('R_S', ofst=0.3))
    d.add(elm.Ground())
    save(d, 'two_dmosfet_bias.png')

# ═══════════════════════════════════════════════════════════════
# TRANSIENT CIRCUITS
# ═══════════════════════════════════════════════════════════════

def rc_discharge():
    """RC discharge circuit: charged cap discharging through R"""
    d = Drawing(unit=2.5)
    d.add(elm.Capacitor().up().label('C=1μF', ofst=(-1.0, 0.3)).label('+', ofst=(-0.3, 0.2)).label('5V', ofst=(-1.3, 0.5)))
    d.add(elm.Line().right().length(0.3))
    # Switch
    d.add(elm.Switch().right().label('t=0', ofst=0.3))
    d.add(elm.Resistor().right().label('R=1MΩ', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'rc_discharge.png')

def rl_switch():
    """RL switching circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('V', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Switch().right().label('S', ofst=0.3))
    d.add(elm.Resistor().right().label('R', ofst=0.3))
    d.add(elm.Inductor().right().label('L', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'rl_switch.png')

def rlc_switch():
    """RLC switching circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.Battery().up().label('V', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Switch().right().label('S', ofst=0.3))
    d.add(elm.Resistor().right().label('R', ofst=0.3))
    j = d.here
    d.add(elm.Dot().color('red'))
    d.push()
    d.add(elm.Inductor().right().label('L', ofst=0.3))
    d.add(elm.Capacitor().down().label('C', ofst=0.3))
    d.add(elm.Line().left().length(2.5))
    d.pop()
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    save(d, 'rlc_switch.png')

# ═══════════════════════════════════════════════════════════════
# FILTER / RESONANCE CIRCUITS
# ═══════════════════════════════════════════════════════════════

def parallel_rlc():
    """Parallel RLC circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.SourceSin().up().label('V_s', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.3))
    j = d.here
    d.add(elm.Dot().color('red'))
    # R branch
    d.push()
    d.add(elm.Resistor().right().label('R=100Ω', ofst=0.3))
    # L branch
    d.add(elm.Line().down().at(j).length(0.5))
    d.add(elm.Inductor().right().label('L', ofst=0.3))
    # C branch
    d.add(elm.Line().down().at(j).length(1.0))
    d.add(elm.Capacitor().right().label('C=10μF', ofst=0.3))
    d.pop()
    # Close the circuit
    d.add(elm.Line().right().length(0.5))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    d.add(elm.Annotate(th1=0).at((j[0], j[1] + 1.0)).label('f₀=1200 Hz'))
    save(d, 'parallel_rlc.png')

def series_rlc():
    """Series RLC circuit"""
    d = Drawing(unit=2.5)
    d.add(elm.SourceSin().up().label('V_s', ofst=(-0.8, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R', ofst=0.3))
    d.add(elm.Inductor().right().label('L', ofst=0.3))
    d.add(elm.Capacitor().right().label('C', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Line().down().length(2.0))
    d.add(elm.Ground())
    d.add(elm.Annotate(th1=0).at((d.here[0] - 3.0, d.here[1] + 1.0)).label('Q=25.1'))
    save(d, 'series_rlc.png')

# ═══════════════════════════════════════════════════════════════
# SUPERPOSITION CIRCUIT
# ═══════════════════════════════════════════════════════════════

def superposition():
    """Circuit with multiple sources for superposition theorem"""
    d = Drawing(unit=2.5)
    # First source
    d.add(elm.Battery().up().label('V₁', ofst=(-0.6, 0.3)))
    d.add(elm.Line().right().length(0.3))
    d.add(elm.Resistor().right().label('R₁', ofst=0.3))
    j = d.here
    d.add(elm.Dot().color('red'))
    d.add(elm.Resistor().right().label('R₂', ofst=0.3))
    d.add(elm.Line().right().length(0.3))
    # Second source
    d.add(elm.Battery().down().label('V₂', ofst=(-0.6, 0.3)))
    d.add(elm.Line().left().length(3.0))
    d.add(elm.Ground())
    # R3 branch down
    d.add(elm.Line().down().at(j).length(1.0))
    d.add(elm.Resistor().down().label('R₃', ofst=0.3))
    d.add(elm.Line().left().length(0.5))
    save(d, 'superposition.png')

if __name__ == '__main__':
    print("Generating MOSFET, FET, Transient, and Filter circuits...")
    emosfet_simple()
    two_dmosfet_series()
    two_jfet_series()
    emosfet_dmosfet()
    two_dmosfet_bias()
    rc_discharge()
    rl_switch()
    rlc_switch()
    parallel_rlc()
    series_rlc()
    superposition()
    print("Part 3 complete!")
