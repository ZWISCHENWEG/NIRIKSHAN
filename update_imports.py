import re

files = [
    'src/components/WaterColumnLens/AnalyticalReadout.tsx',
    'src/components/WaterColumnLens/types.ts',
    'src/components/WaterColumnLens/WaterColumnLens.tsx',
    'src/store/appState.ts'
]

for file in files:
    with open(file, 'r') as f:
        code = f.read()
    
    code = re.sub(r'import { (Observation|EvidenceCase|DerivedFeature)(, (Observation|EvidenceCase|DerivedFeature))* } from', r'import type { \1\2 } from', code)
    
    with open(file, 'w') as f:
        f.write(code)

