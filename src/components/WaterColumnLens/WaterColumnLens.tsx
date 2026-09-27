import React, { useRef, useMemo } from 'react';
import { useAppStore } from '../../store/appState';
import type { EvidenceCase } from '../../services/types';

interface WaterColumnLensProps {
  evidenceCase: EvidenceCase;
}

import { useShallow } from 'zustand/react/shallow';

export const WaterColumnLens: React.FC<WaterColumnLensProps> = ({ evidenceCase }) => {
  const { analyticalCursor, setAnalyticalCursor } = useAppStore(useShallow(state => ({
    analyticalCursor: state.analyticalCursor,
    setAnalyticalCursor: state.setAnalyticalCursor
  })));
  const containerRef = useRef<HTMLDivElement>(null);

  const modelDepths = evidenceCase.model_profile.depths;
  const maxDepth = Math.max(...modelDepths, 1);
  const minDepth = Math.min(...modelDepths, 0);
  const depthRange = maxDepth - minDepth;

  const thermoclineFeature = evidenceCase.features?.find(f => f.feature_type === 'thermocline');
  const mldFeature = evidenceCase.features?.find(f => f.feature_type === 'mixed_layer_depth');

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientY = 0;
    
    if ('touches' in e) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = (e as React.MouseEvent).clientY;
    }

    const y = clientY - rect.top;
    const fraction = Math.max(0, Math.min(1, y / rect.height));
    const targetDepth = minDepth + fraction * depthRange;

    // Find nearest model depth
    let nearestDepth = modelDepths[0];
    let minDiff = Infinity;
    for (const d of modelDepths) {
      const diff = Math.abs(d - targetDepth);
      if (diff < minDiff) {
        minDiff = diff;
        nearestDepth = d;
      }
    }

    setAnalyticalCursor({
      depth: nearestDepth,
      source: 'lens'
    });
  };

  // Build a temperature gradient for the background
  const temps = evidenceCase.model_profile.values;
  const validTemps = temps.filter(t => t !== null) as number[];
  const minTemp = validTemps.length ? Math.min(...validTemps) : 0;
  const maxTemp = validTemps.length ? Math.max(...validTemps) : 30;
  const tempRange = maxTemp - minTemp || 1;

  // Generate CSS linear-gradient based on temperature
  // Blue (cold) to Red (hot)
  const stops = useMemo(() => {
    if (!modelDepths.length || !temps.length) return 'transparent';
    
    let gradient = 'linear-gradient(to bottom, ';
    const step = Math.max(1, Math.floor(modelDepths.length / 20)); // Max 20 stops for performance
    
    const colorStops: string[] = [];
    for (let i = 0; i < modelDepths.length; i += step) {
      const d = modelDepths[i];
      const t = temps[i];
      const percentage = ((d - minDepth) / depthRange) * 100;
      
      if (t !== null) {
        const normalized = (t - minTemp) / tempRange;
        // Simple color mapping: cold (blue) -> mid (cyan) -> warm (red/orange)
        // Adjusting HSL from 240 (blue) to 0 (red)
        const hue = 240 * (1 - normalized); 
        colorStops.push(`hsl(${hue}, 70%, 50%) ${percentage}%`);
      } else {
        colorStops.push(`transparent ${percentage}%`);
      }
    }
    
    return gradient + colorStops.join(', ') + ')';
  }, [modelDepths, temps, minDepth, depthRange, minTemp, tempRange]);

  const getTopPercentage = (d: number) => ((d - minDepth) / depthRange) * 100;

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* Label */}
      <div className="text-[9px] font-sans font-medium text-text-muted tracking-widest uppercase mb-2 h-[14px]">Column</div>
      
      <div 
        ref={containerRef}
        className="relative w-8 flex-1 rounded-sm overflow-hidden cursor-crosshair border border-border-subtle"
        style={{ background: stops }}
        onMouseDown={handleInteraction}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleInteraction(e);
        }}
        onTouchStart={handleInteraction}
        onTouchMove={handleInteraction}
      >
        {/* Surface Line */}
        <div className="absolute top-0 w-full h-px bg-text-primary/50" />
        
        {/* Bottom Line */}
        <div className="absolute bottom-0 w-full h-px bg-text-primary/50" />

        {/* MLD Marker */}
        {mldFeature?.depth != null && (
          <div 
            className="absolute w-full flex items-center justify-center pointer-events-none"
            style={{ top: `${getTopPercentage(mldFeature.depth)}%`, transform: 'translateY(-50%)' }}
            title="Mixed Layer Depth"
          >
            <div className="w-full border-t border-dashed border-text-primary/80 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          </div>
        )}

        {/* Thermocline Marker */}
        {thermoclineFeature?.depth != null && (
          <div 
            className="absolute w-full flex items-center justify-center pointer-events-none"
            style={{ top: `${getTopPercentage(thermoclineFeature.depth)}%`, transform: 'translateY(-50%)' }}
            title="Thermocline"
          >
            <div className="w-full border-t-[1.5px] border-text-primary/80 shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
          </div>
        )}

        {/* Analytical Cursor Marker */}
        {analyticalCursor.depth !== null && (
          <div 
            className="absolute w-[150%] -left-[25%] h-[2px] bg-accent-interactive pointer-events-none shadow-[0_0_4px_rgba(70,132,138,0.8)] z-10"
            style={{ top: `${getTopPercentage(analyticalCursor.depth)}%`, transform: 'translateY(-50%)' }}
          />
        )}
      </div>
    </div>
  );
};
