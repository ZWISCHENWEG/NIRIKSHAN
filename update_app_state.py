import re

with open('src/store/appState.ts', 'r') as f:
    code = f.read()

code = code.replace("import { create } from 'zustand'", "import { create } from 'zustand'\nimport { Observation, EvidenceCase } from '../services/types';")

code = code.replace("selectedFloatId: string | null;", "selectedFloatId: string | null;\n  selectedObservation: Observation | null;\n  selectedEvidenceCase: EvidenceCase | null;\n  isLoadingEvidence: boolean;\n  analyticalCursor: { depth: number | null, source: 'lens' | 'profile_chart' | null };")

code = code.replace("selectFloat: (id: string) => void;", "selectFloat: (id: string, obs?: Observation) => void;\n  setEvidenceCase: (evidenceCase: EvidenceCase | null) => void;\n  setIsLoadingEvidence: (isLoading: boolean) => void;\n  setAnalyticalCursor: (cursor: { depth: number | null, source: 'lens' | 'profile_chart' | null }) => void;")

code = code.replace("selectedFloatId: null,", "selectedFloatId: null,\n  selectedObservation: null,\n  selectedEvidenceCase: null,\n  isLoadingEvidence: false,\n  analyticalCursor: { depth: null, source: null },")

code = code.replace("selectFloat: (id) => set({ \n    selectedFloatId: id, \n    mode: 'TRANSITIONING' // Triggers camera flight \n  }),", "selectFloat: (id, obs) => set({ \n    selectedFloatId: id, \n    selectedObservation: obs || null,\n    selectedEvidenceCase: null,\n    mode: 'TRANSITIONING' // Triggers camera flight \n  }),\n\n  setEvidenceCase: (evidenceCase) => set({ selectedEvidenceCase: evidenceCase }),\n  setIsLoadingEvidence: (isLoading) => set({ isLoadingEvidence: isLoading }),\n  setAnalyticalCursor: (cursor) => set({ analyticalCursor: cursor }),")

code = code.replace("sarStartPoint: null,\n    sarSimulationActive: false,\n    sarElapsedTime: 0\n  }),", "sarStartPoint: null,\n    sarSimulationActive: false,\n    sarElapsedTime: 0,\n    selectedObservation: null,\n    selectedEvidenceCase: null,\n    analyticalCursor: { depth: null, source: null }\n  }),")

with open('src/store/appState.ts', 'w') as f:
    f.write(code)

