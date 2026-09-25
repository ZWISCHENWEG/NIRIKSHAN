import React from 'react';
import { useAppStore } from '../store/appState';

export const BottomScrubbers: React.FC = () => {
  const { 
    mode, 
    timeIndex, 
    depthIndex, 
    setTimeIndex, 
    setDepthIndex,
    sarStartPoint,
    sarSimulationActive,
    setSarSimulationActive
  } = useAppStore();

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeIndex(parseInt(e.target.value));
  };

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepthIndex(parseInt(e.target.value));
  };

  const toggleSimulation = () => {
    if (sarStartPoint) {
      setSarSimulationActive(!sarSimulationActive);
    }
  };

  // Convert index to display values for demo
  const displayTime = `2024-01-${(timeIndex + 1).toString().padStart(2, '0')}T12:00:00Z`;
  const displayDepth = `${depthIndex * 50}m`;

  return (
    <footer className="flex-none h-24 bg-surface-raised border-t border-border-subtle p-space-4 flex flex-col justify-center">
      <div className="flex gap-space-8 w-full max-w-5xl mx-auto">
         {/* TIME SCRUBBER */}
         <div className="flex-1 flex flex-col gap-space-2">
           <div className="flex justify-between text-[10px] text-text-secondary font-mono tracking-widest uppercase">
             <span>Time</span>
             <span>{displayTime}</span>
           </div>
           <div className="flex items-center relative h-6">
              <input 
                type="range" 
                min="0" max="9" 
                value={timeIndex}
                onChange={handleTimeChange}
                className="w-full h-1.5 bg-surface-overlay rounded-lg appearance-none cursor-pointer accent-accent-interactive"
              />
           </div>
         </div>
         
         {/* DEPTH SCRUBBER */}
         <div className="flex-1 flex flex-col gap-space-2">
           <div className="flex justify-between text-[10px] text-text-secondary font-mono tracking-widest uppercase">
             <span>Depth</span>
             <span>{displayDepth}</span>
           </div>
           <div className="flex items-center relative h-6">
              <input 
                type="range" 
                min="0" max="40" 
                value={depthIndex}
                onChange={handleDepthChange}
                className="w-full h-1.5 bg-surface-overlay rounded-lg appearance-none cursor-pointer accent-accent-interactive"
              />
           </div>
         </div>
         
         {/* SAR CONTROLS */}
         {mode === 'SAR_MODE' && (
           <div className="flex-1 flex flex-col justify-center items-end border-l border-border-subtle pl-space-4">
             <button
                onClick={toggleSimulation}
                disabled={!sarStartPoint}
                className={`px-4 py-2 font-bold rounded flex items-center gap-2 ${
                  !sarStartPoint 
                    ? 'bg-surface-overlay text-text-muted cursor-not-allowed' 
                    : sarSimulationActive 
                      ? 'bg-accent-warning text-surface-base' 
                      : 'bg-accent-interactive text-surface-base hover:bg-accent-interactive-hover'
                }`}
             >
               {sarSimulationActive ? (
                 <>
                   <div className="w-2 h-2 rounded-full bg-surface-base animate-ping"></div>
                   SIMULATING DRIFT
                 </>
               ) : 'START SIMULATION'}
             </button>
           </div>
         )}
      </div>
    </footer>
  );
};
