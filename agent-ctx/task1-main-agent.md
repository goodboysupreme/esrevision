# Task: Rebuild PYQ Vault with Complete Solved Questions

## Summary
Rebuilt the PYQ Vault with comprehensive solved questions from all 6 comprehensive exams (Dec 2023, May 2024, Dec 2024, May 2025, Dec 2025). Each solution follows the LaTeX "circuit-left + steps-right" pattern.

## Files Modified/Created

### 1. `/src/data/questions.ts` - COMPLETE REWRITE
- Added `CircuitParams` type for SVG circuit descriptions
- Added `circuitSvg` field to `Question` interface
- **35+ fully solved questions** across all 6 exams with:
  - Complete question text with exact numerical values
  - Step-by-step numerical solutions with intermediate calculations
  - Final answers with exact values
  - Circuit descriptions and SVG type identifiers
  - Key traps and warnings
  - Verification steps marked

### 2. `/src/components/CircuitDiagram.tsx` - NEW COMPONENT
- Renders SVG circuit diagrams inline based on `CircuitParams.type`
- Supports 25+ circuit types:
  - Two NPN Cascade (multiple variants)
  - PNP+NPN Mixed
  - Darlington Pair
  - VDB (Voltage Divider Bias)
  - Zener Regulator
  - Two Zener Parallel
  - Two Diode Series
  - Diode+Zener Combo
  - PF Correction circuits
  - Parallel AC Loads
  - Y-Delta Conversion
  - Y-3Phase and Y-Delta-3Phase
  - Simple DC Loop, Mesh 4-Loop, Superposition
  - RC Discharge, RL Switch, RLC circuits
  - E-MOSFET, Two FET Series, E-MOSFET+D-MOSFET
  - Op-Amp circuits
  - Generic fallback
- Helper SVG components: Resistor, NPN, PNP, ZenerDiode, DiodeSymbol, Ground, VSource, Capacitor, Inductor, MOSFET, OpAmp

### 3. `/src/components/PyqVault.tsx` - COMPLETE REBUILD
- **Circuit-left (40%) + Steps-right (56%) layout** matching LaTeX template
- Color-coded boxes for each topic (BJT=Blue, Diodes=Amber, AC=Teal, DC=Emerald, MOSFET=Purple, Op-Amps=Indigo, Filters=Crimson, Transients=SlateGray)
- SVG circuit diagrams rendered inline in left panel
- Step numbers with verification marks (✓) and answer highlights (★)
- Trap warnings (⚠) in red boxes below circuit
- Final answers highlighted in green boxes
- Mathematical notation using unicode
- Pagination (6 per page for expanded view)
- All filters preserved (Year, Topic, Yield, Difficulty, Search)

## Topic Color System (from LaTeX)
| Topic | Main Color | BG Color |
|-------|-----------|----------|
| BJT | #2563eb (ElectricBlue) | #dbeafe (SkyBlueBG) |
| Diodes | #d97706 (Amber) | #fef3c7 (AmberBG) |
| AC/3-Phase | #0d9488 (Teal) | #ccfbf1 (TealBG) |
| DC Circuits | #059669 (Emerald) | #d1fae5 (EmeraldBG) |
| MOSFET | #7c3aed (Purple) | #ede9fe (PurpleBG) |
| Op-Amps | #4338ca (Indigo) | #eef2ff |
| Filters | #be185d (Crimson) | #fce7f3 |
| Transients | #64748b (SlateGray) | #f1f5f9 |

## Exam Coverage
- Dec 2023: PF Correction, Two Zener, Two NPN Cascade, Y-Delta, Parallel Loads, RC Discharge, Series/Parallel RLC, Op-Amp
- May 2024: Diode IS, Zener Regulator, Min hFE Cascade, Y-3Phase, D-MOSFET combo
- Dec 2024: MOSFET T/F, BJT Cutoff, RL Time Const, PF Correction (C), pnp+npn, Two JFETs, Mesh Analysis, Zener Switch
- May 2025: Superposition, Diode+Zener, Darlington Pair, E-MOSFET+D-MOSFET
- Dec 2025: Transients, Transfer Function, Two Diodes+Dynamic R, VDB+Leakage, Y-Delta 3Phase, Phase Diff, MOSFET/BJT/Diode shorts

## Existing Components - Verified Working
- page.tsx ✅
- TabNavigation.tsx ✅
- WarRoom.tsx ✅
- CheatSheet.tsx ✅
- MethodMaps.tsx ✅
- CircuitAtlas.tsx ✅
- TrapCards.tsx ✅
- TopicChart.tsx ✅
- globals.css ✅ (unchanged)
- topics.ts ✅ (unchanged)

## Lint Status: PASSING ✅
