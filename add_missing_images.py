#!/usr/bin/env python3
"""Add missing circuitImage references to questions.ts"""

filepath = '/home/z/my-project/src/data/questions.ts'

# Map: (question_id, circuit_image_path)
additions = {
    'd23f-q8': '/circuits/rc_discharge.png',
    'd23f-q11': '/circuits/series_rlc.png',
    'd23f-b4i': '/circuits/emosfet_simple.png',
    'm24-2b': '/circuits/y_3phase.png',
    'd25-q2a': '/circuits/two_diode_series.png',
    'd24-b1': '/circuits/mesh_4loop.png',
    'd23f-b5ii': '/circuits/multi_opamp.png',
    'm25-q1': '/circuits/superposition.png',
}

with open(filepath, 'r') as f:
    lines = f.readlines()

result = []
i = 0
while i < len(lines):
    line = lines[i]

    # Check if this line contains an id we need to add circuitImage to
    for qid, img in additions.items():
        if f"id: '{qid}'" in line:
            # Search forward for circuitDescription line
            j = i + 1
            while j < len(lines) and j < i + 30:
                if 'circuitDescription:' in lines[j]:
                    # Find the end of this property (ends with ',)
                    k = j
                    while k < len(lines) and not lines[k].rstrip().endswith("',"):
                        k += 1
                    # Add all lines up to and including the circuitDescription end
                    for m in range(i, k + 1):
                        result.append(lines[m])
                    # Now add circuitImage
                    indent = '    '
                    result.append(f"{indent}circuitImage: '{img}',\n")
                    i = k + 1
                    break
                j += 1
            else:
                result.append(line)
                i += 1
            break
    else:
        result.append(line)
        i += 1

with open(filepath, 'w') as f:
    f.writelines(result)

print(f"Added {len(additions)} circuitImage references")
print(f"Lines: {len(result)} (was {len(lines)})")
