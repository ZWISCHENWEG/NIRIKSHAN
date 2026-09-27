import { useState } from 'react';
import { useAppStore } from '../store/appState';
import { useSnapshotStore } from '../store/snapshotStore';
import type { ScientificSnapshot } from '../services/types';

export function SnapshotManager() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    mode, setMode, selectedObservation, selectedEvidenceCase, 
    analyticalCursor, responseScenario, timeIndex, depthIndex,
    selectFloat, setEvidenceCase, setAnalyticalCursor, setResponseScenario, setTimeIndex, setDepthIndex
  } = useAppStore();
  const { snapshots, saveSnapshot, deleteSnapshot, loadSnapshots } = useSnapshotStore();

  // Load snapshots on mount
  useState(() => {
    loadSnapshots();
  });

  const handleCapture = () => {
    const newSnapshot: ScientificSnapshot = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      application_mode: mode,
      observation: selectedObservation || undefined,
      evidence_case: selectedEvidenceCase || undefined,
      analytical_cursor: { ...analyticalCursor, timeIndex, depthIndex },
      derived_features: selectedEvidenceCase?.features || undefined,
      response_scenario: responseScenario || undefined,
      provenance: selectedEvidenceCase?.provenance, // capture from evidence case
      version: '1.0'
    };
    saveSnapshot(newSnapshot);
    setIsOpen(true);
  };

  const handleRestore = (snap: ScientificSnapshot) => {
    // Restore state from snapshot
    if (snap.observation) {
      selectFloat(snap.observation.id, snap.observation);
    }
    if (snap.evidence_case) {
      setEvidenceCase(snap.evidence_case);
    }
    if (snap.analytical_cursor) {
      setAnalyticalCursor({ depth: snap.analytical_cursor.depth, source: snap.analytical_cursor.source });
      if (snap.analytical_cursor.timeIndex !== undefined) setTimeIndex(snap.analytical_cursor.timeIndex);
      if (snap.analytical_cursor.depthIndex !== undefined) setDepthIndex(snap.analytical_cursor.depthIndex);
    }
    if (snap.response_scenario) {
      setResponseScenario(snap.response_scenario);
    }
    if (snap.application_mode) {
      setMode(snap.application_mode as any);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="absolute top-space-6 right-space-6 z-30 flex gap-space-2">
        <button 
          onClick={handleCapture}
          className="bg-surface-elevated text-xs font-semibold px-4 py-2 border border-border-subtle uppercase tracking-widest text-text-primary hover:bg-surface-raised transition-colors"
        >
          Capture Snapshot
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface-elevated text-xs font-semibold px-4 py-2 border border-border-subtle uppercase tracking-widest text-text-primary hover:bg-surface-raised transition-colors"
        >
          Snapshots ({snapshots.length})
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 right-space-6 z-30 w-80 bg-[#161718] border border-border-subtle shadow-2xl flex flex-col max-h-[70vh]">
          <div className="p-space-4 border-b border-border-subtle flex justify-between items-center bg-surface-elevated">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-primary">Scientific Snapshots</h3>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-space-4 flex flex-col gap-space-4">
            {snapshots.length === 0 ? (
              <div className="text-xs text-text-muted">No snapshots available.</div>
            ) : (
              snapshots.map(snap => (
                <div key={snap.id} className="border border-border-subtle p-space-3 bg-surface-base flex flex-col gap-space-2">
                  <div className="flex justify-between items-start">
                    <div className="text-xs font-semibold text-text-primary">{new Date(snap.created_at).toLocaleString()}</div>
                    <button 
                      onClick={() => deleteSnapshot(snap.id)}
                      className="text-[10px] uppercase tracking-wider text-accent-warning hover:text-red-400"
                    >
                      Del
                    </button>
                  </div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">
                    Mode: {snap.application_mode}
                  </div>
                  {snap.observation && (
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">
                      Obs: {snap.observation.id}
                    </div>
                  )}
                  {snap.response_scenario && (
                    <div className="text-[10px] text-text-muted uppercase tracking-wider text-accent-interactive">
                      SAR Scenario included
                    </div>
                  )}
                  <button 
                    onClick={() => handleRestore(snap)}
                    className="mt-space-2 bg-surface-elevated border border-border-subtle py-1 text-[10px] font-medium uppercase tracking-widest hover:bg-surface-raised"
                  >
                    Restore State
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
