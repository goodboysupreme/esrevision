#!/usr/bin/env python3
"""Update questions.ts: replace all circuitSvg with circuitImage paths"""

import re

# Map from circuit type to image filename
TYPE_TO_IMAGE = {
    'two_npn_cascade': '/circuits/two_npn_cascade.png',
    'two_npn_cascade_2': '/circuits/two_npn_cascade_2.png',
    'two_npn_cascade_sat': '/circuits/two_npn_cascade_sat.png',
    'pnp_npn_mixed': '/circuits/pnp_npn_mixed.png',
    'darlington': '/circuits/darlington.png',
    'vdb_circuit': '/circuits/vdb_circuit.png',
    'zener_regulator': '/circuits/zener_regulator.png',
    'two_zener_parallel': '/circuits/two_zener_parallel.png',
    'two_diode_series': '/circuits/two_diode_series.png',
    'diode_zener_combo': '/circuits/zener_switch.png',
    'zener_switch': '/circuits/zener_switch.png',
    'pf_correction': '/circuits/pf_correction.png',
    'pf_correction_rl': '/circuits/pf_correction_rl.png',
    'parallel_loads': '/circuits/parallel_loads.png',
    'y_delta': '/circuits/y_delta.png',
    'y_3phase': '/circuits/y_3phase.png',
    'y_delta_3phase': '/circuits/y_delta_3phase.png',
    'simple_dc_loop': '/circuits/simple_dc_loop.png',
    'mesh_4loop': '/circuits/mesh_4loop.png',
    'superposition': '/circuits/superposition.png',
    'rc_discharge': '/circuits/rc_discharge.png',
    'rl_switch': '/circuits/rl_switch.png',
    'rl_rc_switch': '/circuits/rlc_switch.png',
    'parallel_rlc': '/circuits/parallel_rlc.png',
    'series_rlc': '/circuits/series_rlc.png',
    'emosfet_simple': '/circuits/emosfet_simple.png',
    'two_dmosfet_series': '/circuits/two_dmosfet_series.png',
    'two_jfet_series': '/circuits/two_jfet_series.png',
    'emosfet_dmosfet': '/circuits/emosfet_dmosfet.png',
    'two_dmosfet_bias': '/circuits/two_dmosfet_bias.png',
    'single_diode': '/circuits/single_diode.png',
    'half_wave_rectifier': '/circuits/half_wave_rectifier.png',
    'multi_opamp': '/circuits/multi_opamp.png',
    'opamp_multi_input': '/circuits/opamp_multi_input.png',
    'opamp_find_alpha': '/circuits/opamp_find_alpha.png',
    'dc_3node': '/circuits/dc_3node.png',
}

filepath = '/home/z/my-project/src/data/questions.ts'

with open(filepath, 'r') as f:
    content = f.read()

# Strategy:
# 1. For each circuitSvg block, extract the type
# 2. Replace the entire circuitSvg block with a circuitImage line
# 3. If the question already has a circuitImage that's different, keep the more specific one

# Pattern to match circuitSvg blocks
# circuitSvg: {
#   type: 'xxx',
#   components: {...},
#   labels: {...}
# },

# We need to replace circuitSvg: { ... } with circuitImage: '/circuits/xxx.png'
# But some questions already have circuitImage - in that case, just remove circuitSvg

lines = content.split('\n')
output_lines = []
in_circuit_svg = False
brace_count = 0
svg_type = None
skip_until_comma = False

i = 0
while i < len(lines):
    line = lines[i]

    # Check if this line starts a circuitSvg block
    if 'circuitSvg:' in line and '{' in line:
        # Extract type from next few lines
        in_circuit_svg = True
        brace_count = line.count('{') - line.count('}')
        svg_type = None

        # Look for type in this line or next lines
        type_match = re.search(r"type:\s*'([^']+)'", line)
        if type_match:
            svg_type = type_match.group(1)

        # If the block is on one line (unlikely but possible)
        if brace_count == 0:
            if svg_type and svg_type in TYPE_TO_IMAGE:
                # Check if question already has circuitImage
                # Look ahead for circuitImage
                has_image = False
                for j in range(i+1, min(i+20, len(lines))):
                    if 'circuitImage' in lines[j]:
                        has_image = True
                        break
                if not has_image:
                    output_lines.append(f"    circuitImage: '{TYPE_TO_IMAGE[svg_type]}',")
            in_circuit_svg = False
            i += 1
            continue

        i += 1
        continue

    if in_circuit_svg:
        brace_count += line.count('{') - line.count('}')

        # Try to find type if not found yet
        if svg_type is None:
            type_match = re.search(r"type:\s*'([^']+)'", line)
            if type_match:
                svg_type = type_match.group(1)

        if brace_count <= 0:
            # End of circuitSvg block
            in_circuit_svg = False
            # Check if question already has circuitImage
            has_image = False
            for j in range(len(output_lines)-1, max(len(output_lines)-30, 0), -1):
                if 'circuitImage' in output_lines[j]:
                    has_image = True
                    break
            for j in range(i+1, min(i+30, len(lines))):
                if 'circuitImage' in lines[j]:
                    has_image = True
                    break

            if svg_type and svg_type in TYPE_TO_IMAGE and not has_image:
                output_lines.append(f"    circuitImage: '{TYPE_TO_IMAGE[svg_type]}',")
            elif svg_type and svg_type in TYPE_TO_IMAGE and has_image:
                # Already has image, just skip the SVG
                pass
            else:
                # Unknown type, keep as comment
                output_lines.append(f"    // circuitSvg type '{svg_type}' - no image generated")

            # Skip the closing line (usually just },)
            if '},' in line or '}' in line:
                i += 1
                continue
        i += 1
        continue

    output_lines.append(line)
    i += 1

result = '\n'.join(output_lines)

# Also remove the CircuitParams import if it's no longer needed
# Actually keep it for now since the type is still defined

with open(filepath, 'w') as f:
    f.write(result)

print(f"Updated questions.ts")
print(f"Total lines: {len(output_lines)} (was {len(lines)})")

# Count remaining circuitSvg references
remaining_svg = result.count('circuitSvg')
print(f"Remaining circuitSvg references: {remaining_svg}")
