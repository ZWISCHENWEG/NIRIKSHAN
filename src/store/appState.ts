import { create } from 'zustand'
import type { Observation, EvidenceCase } from '../services/types';

export type AppStateMode = 'SURVEY_MODE' | 'TRANSITIONING' | 'INSPECTION_MODE' | 'SAR_MODE';

interface AppState {
  mode: AppStateMode;
  selectedFloatId: string | null;
  selectedObservation: Observation | null;
  selectedEvidenceCase: EvidenceCase | null;
  isLoadingEvidence: boolean;
  analyticalCursor: { depth: number | null, source: 'lens' | 'profile_chart' | null };
  timeIndex: number;
  depthIndex: number;
  
  // SAR Variables
  sarStartPoint: { lat: number; lon: number } | null;
  sarSimulationActive: boolean;
  sarElapsedTime: number;
  responseScenario: import('../services/types').SarResponse | null;
  responseReplayTime: number;
  responseReplayPlaying: boolean;
  
  // Actions
  selectFloat: (id: string, obs?: Observation) => void;
  setEvidenceCase: (evidenceCase: EvidenceCase | null) => void;
  setIsLoadingEvidence: (isLoading: boolean) => void;
  setAnalyticalCursor: (cursor: { depth: number | null, source: 'lens' | 'profile_chart' | null }) => void;
  clearSelection: () => void;
  setMode: (mode: AppStateMode) => void;
  setTimeIndex: (index: number) => void;
  setDepthIndex: (index: number) => void;
  
  // SAR Actions
  setSarStartPoint: (lat: number, lon: number) => void;
  setSarSimulationActive: (active: boolean) => void;
  setSarElapsedTime: (time: number | ((prev: number) => number)) => void;
  setResponseScenario: (scenario: import('../services/types').SarResponse | null) => void;
  setResponseReplayTime: (time: number) => void;
  setResponseReplayPlaying: (playing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'SURVEY_MODE',
  selectedFloatId: null,
  selectedObservation: null,
  selectedEvidenceCase: null,
  isLoadingEvidence: false,
  analyticalCursor: { depth: null, source: null },
  timeIndex: 5, // Default mid-way
  depthIndex: 0,
  
  sarStartPoint: null,
  sarSimulationActive: false,
  sarElapsedTime: 0,
  responseScenario: null,
  responseReplayTime: 0,
  responseReplayPlaying: false,
  
  selectFloat: (id, obs) => set({ 
    selectedFloatId: id, 
    selectedObservation: obs || null,
    selectedEvidenceCase: null,
    mode: 'TRANSITIONING' // Triggers camera flight 
  }),

  setEvidenceCase: (evidenceCase) => set({ selectedEvidenceCase: evidenceCase }),
  setIsLoadingEvidence: (isLoading) => set({ isLoadingEvidence: isLoading }),
  setAnalyticalCursor: (cursor) => set({ analyticalCursor: cursor }),
  
  clearSelection: () => set({ 
    selectedFloatId: null,
    selectedObservation: null,
    selectedEvidenceCase: null,
    isLoadingEvidence: false,
    analyticalCursor: { depth: null, source: null }, 
    mode: 'SURVEY_MODE',
    sarStartPoint: null,
    sarSimulationActive: false,
    sarElapsedTime: 0,
    responseScenario: null,
    responseReplayTime: 0,
    responseReplayPlaying: false
  }),
  
  setMode: (mode) => set((state) => {
    let newSarStartPoint = mode === 'SAR_MODE' ? state.sarStartPoint : null;
    if (mode === 'SAR_MODE' && !newSarStartPoint && state.selectedObservation) {
      newSarStartPoint = { 
        lat: state.selectedObservation.lat, 
        lon: state.selectedObservation.lon 
      };
    }

    return {
      mode, 
      sarStartPoint: newSarStartPoint,
      sarSimulationActive: mode === 'SAR_MODE' ? state.sarSimulationActive : false,
      sarElapsedTime: mode === 'SAR_MODE' ? state.sarElapsedTime : 0,
      responseScenario: mode === 'SAR_MODE' ? state.responseScenario : null,
      responseReplayTime: mode === 'SAR_MODE' ? state.responseReplayTime : 0,
      responseReplayPlaying: mode === 'SAR_MODE' ? state.responseReplayPlaying : false
    };
  }),
  setTimeIndex: (index) => set({ timeIndex: index }),
  setDepthIndex: (index) => set({ depthIndex: index }),
  
  setSarStartPoint: (lat, lon) => set({ sarStartPoint: { lat, lon } }),
  setSarSimulationActive: (active) => set({ sarSimulationActive: active }),
  setSarElapsedTime: (updater) => set((state) => ({ 
    sarElapsedTime: typeof updater === 'function' ? updater(state.sarElapsedTime) : updater 
  })),
  setResponseScenario: (scenario) => set({ responseScenario: scenario }),
  setResponseReplayTime: (time) => set({ responseReplayTime: time }),
  setResponseReplayPlaying: (playing) => set({ responseReplayPlaying: playing })
}));
