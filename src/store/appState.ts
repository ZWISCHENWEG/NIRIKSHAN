import { create } from 'zustand'

export type AppStateMode = 'SURVEY_MODE' | 'TRANSITIONING' | 'INSPECTION_MODE' | 'SAR_MODE';

interface AppState {
  mode: AppStateMode;
  selectedFloatId: string | null;
  timeIndex: number;
  depthIndex: number;
  
  // SAR Variables
  sarStartPoint: { lat: number; lon: number } | null;
  sarSimulationActive: boolean;
  sarElapsedTime: number;
  
  // Actions
  selectFloat: (id: string) => void;
  clearSelection: () => void;
  setMode: (mode: AppStateMode) => void;
  setTimeIndex: (index: number) => void;
  setDepthIndex: (index: number) => void;
  
  // SAR Actions
  setSarStartPoint: (lat: number, lon: number) => void;
  setSarSimulationActive: (active: boolean) => void;
  setSarElapsedTime: (time: number | ((prev: number) => number)) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'SURVEY_MODE',
  selectedFloatId: null,
  timeIndex: 5, // Default mid-way
  depthIndex: 0,
  
  sarStartPoint: null,
  sarSimulationActive: false,
  sarElapsedTime: 0,
  
  selectFloat: (id) => set({ 
    selectedFloatId: id, 
    mode: 'TRANSITIONING' // Triggers camera flight 
  }),
  
  clearSelection: () => set({ 
    selectedFloatId: null, 
    mode: 'SURVEY_MODE',
    sarStartPoint: null,
    sarSimulationActive: false,
    sarElapsedTime: 0
  }),
  
  setMode: (mode) => set({ 
    mode, 
    // Reset SAR state when switching out of SAR_MODE
    sarStartPoint: mode === 'SAR_MODE' ? useAppStore.getState().sarStartPoint : null,
    sarSimulationActive: mode === 'SAR_MODE' ? useAppStore.getState().sarSimulationActive : false,
    sarElapsedTime: mode === 'SAR_MODE' ? useAppStore.getState().sarElapsedTime : 0
  }),
  setTimeIndex: (index) => set({ timeIndex: index }),
  setDepthIndex: (index) => set({ depthIndex: index }),
  
  setSarStartPoint: (lat, lon) => set({ sarStartPoint: { lat, lon } }),
  setSarSimulationActive: (active) => set({ sarSimulationActive: active }),
  setSarElapsedTime: (updater) => set((state) => ({ 
    sarElapsedTime: typeof updater === 'function' ? updater(state.sarElapsedTime) : updater 
  }))
}));
