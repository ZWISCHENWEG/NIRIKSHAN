import { create } from 'zustand';
import type { ScientificSnapshot } from '../services/types';

interface SnapshotState {
  snapshots: ScientificSnapshot[];
  saveSnapshot: (snapshot: ScientificSnapshot) => void;
  deleteSnapshot: (id: string) => void;
  loadSnapshots: () => void;
}

const STORAGE_KEY = 'nirikshan_snapshots';

export const useSnapshotStore = create<SnapshotState>((set) => ({
  snapshots: [],
  
  loadSnapshots: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ snapshots: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load snapshots:', e);
    }
  },
  
  saveSnapshot: (snapshot) => {
    set((state) => {
      const newSnapshots = [snapshot, ...state.snapshots];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshots));
      } catch (e) {
        console.error('Failed to save snapshot:', e);
      }
      return { snapshots: newSnapshots };
    });
  },
  
  deleteSnapshot: (id) => {
    set((state) => {
      const newSnapshots = state.snapshots.filter(s => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshots));
      } catch (e) {
        console.error('Failed to save snapshots:', e);
      }
      return { snapshots: newSnapshots };
    });
  }
}));
