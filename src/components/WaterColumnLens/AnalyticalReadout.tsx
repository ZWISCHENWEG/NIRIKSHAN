import React from 'react';
import { useAppStore } from '../../store/appState';
import type { EvidenceCase } from '../../services/types';

interface AnalyticalReadoutProps {
  evidenceCase: EvidenceCase;
}

import { useShallow } from 'zustand/react/shallow';

export const AnalyticalReadout: React.FC<AnalyticalReadoutProps> = ({ evidenceCase }) => {
  const { analyticalCursor } = useAppStore(useShallow(state => ({
    analyticalCursor: state.analyticalCursor
  })));
  const depth = analyticalCursor.depth;

  if (depth === null) return null;

  // Find exact depth indices
  const modelIdx = evidenceCase.model_profile.depths.indexOf(depth);
  const obsIdx = evidenceCase.observation_profile.depths.indexOf(depth);
  const resIdx = evidenceCase.residual.depths.indexOf(depth);

  const modelTemp = modelIdx >= 0 ? evidenceCase.model_profile.values[modelIdx] : null;
  const obsTemp = obsIdx >= 0 ? evidenceCase.observation_profile.values[obsIdx] : null;
  const residual = resIdx >= 0 ? evidenceCase.residual.values[resIdx] : null;

  // Feature markers at this depth
  const activeFeatures = evidenceCase.features?.filter(f => f.depth === depth) || [];

  // Currents
  const currentSpeedFeat = activeFeatures.find(f => f.feature_type === 'current_speed');
  const currentDirFeat = activeFeatures.find(f => f.feature_type === 'current_direction');

  return (
    <div className="bg-surface-raised px-space-4 py-space-3 rounded-sm flex flex-col gap-2 mt-2">
      <div className="flex justify-between items-center border-b border-border-subtle pb-2">
        <span className="text-[10px] font-sans font-medium text-accent-interactive tracking-widest uppercase">Depth</span>
        <span className="text-xs font-mono text-text-primary">{depth.toFixed(1)} m</span>
      </div>

      <div className="grid grid-cols-2 gap-y-2">
        {modelTemp !== null && (
          <>
            <span className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase">Model Temp</span>
            <span className="text-xs font-mono text-text-primary text-right">{modelTemp.toFixed(2)} °C</span>
          </>
        )}
        
        {obsTemp !== null && (
          <>
            <span className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase">Obs Temp</span>
            <span className="text-xs font-mono text-text-primary text-right">{obsTemp.toFixed(2)} °C</span>
          </>
        )}

        {residual !== null && (
          <>
            <span className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase">Residual</span>
            <span className="text-xs font-mono text-text-primary text-right">{residual > 0 ? '+' : ''}{residual.toFixed(2)} °C</span>
          </>
        )}
      </div>

      {(currentSpeedFeat) && (
        <div className="pt-2 border-t border-border-subtle grid grid-cols-2 gap-y-2">
          {currentSpeedFeat && (
            <>
              <span className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase">Current</span>
              <span className="text-xs font-mono text-text-primary text-right">
                {currentSpeedFeat.value?.toFixed(2)} {currentSpeedFeat.unit}
                {currentDirFeat?.value !== null && currentDirFeat?.value !== undefined ? ` @ ${currentDirFeat.value.toFixed(0)}°` : ''}
              </span>
            </>
          )}
        </div>
      )}

      {activeFeatures.length > 0 && (
        <div className="pt-2 border-t border-border-subtle flex flex-col gap-1">
          {activeFeatures.filter(f => f.feature_type !== 'current_speed' && f.feature_type !== 'current_direction').map(f => (
            <div key={f.feature_type} className="flex justify-between items-center bg-accent-interactive/10 px-2 py-1 rounded">
              <span className="text-[10px] font-sans font-bold text-accent-interactive tracking-widest uppercase">{f.feature_type.replace(/_/g, ' ')}</span>
              <span className="text-[10px] font-mono text-text-primary">{f.value !== null ? `${f.value.toFixed(2)} ${f.unit}` : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
