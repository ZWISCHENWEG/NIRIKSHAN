import React from 'react';
import { useAppStore } from '../store/appState';
import { useShallow } from 'zustand/react/shallow';

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
  } = useAppStore(useShallow(state => ({
    mode: state.mode,
    timeIndex: state.timeIndex,
    depthIndex: state.depthIndex,
    setTimeIndex: state.setTimeIndex,
    setDepthIndex: state.setDepthIndex,
    sarStartPoint: state.sarStartPoint,
    sarSimulationActive: state.sarSimulationActive,
    setSarSimulationActive: state.setSarSimulationActive
  })));

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
  const displayTime = `0${(timeIndex + 1)} JAN 2024 · 12:00 UTC`;
  const displayDepth = `${depthIndex * 50} m`;

  return (
    <footer className="flex-none h-24 bg-surface-base border-t border-border-subtle px-space-8 flex flex-col justify-center">
      <div className="flex gap-space-12 w-full max-w-6xl mx-auto items-center">
         {/* TIME SCRUBBER */}
         <div className="flex-1 flex flex-col gap-space-2">
           <div className="flex justify-between items-baseline mb-1">
             <span className="text-[10px] font-sans font-medium tracking-widest text-text-muted uppercase">Temporal Navigation</span>
             <span className="text-xs font-mono text-text-primary">{displayTime}</span>
           </div>
           
           <div className="flex items-center relative h-4">
              <input 
                type="range" 
                min="0" max="9" 
                value={timeIndex}
                onChange={handleTimeChange}
                className="w-full h-[1px] bg-border-strong appearance-none cursor-pointer accent-accent-interactive"
              />
           </div>
           <div className="flex justify-between text-[9px] font-mono text-text-muted px-1 mt-1">
             <span>01 JAN</span>
             <span>05 JAN</span>
             <span>10 JAN</span>
           </div>
         </div>
         
         {/* DEPTH SCRUBBER */}
         <div className="flex-1 flex flex-col gap-space-2">
           <div className="flex justify-between items-baseline mb-1">
             <span className="text-[10px] font-sans font-medium tracking-widest text-text-muted uppercase">Depth Navigation</span>
             <span className="text-xs font-mono text-text-primary">{displayDepth}</span>
           </div>
           
           <div className="flex items-center relative h-4">
              <input 
                type="range" 
                min="0" max="40" 
                value={depthIndex}
                onChange={handleDepthChange}
                className="w-full h-[1px] bg-border-strong appearance-none cursor-pointer accent-accent-interactive"
              />
           </div>
           <div className="flex justify-between text-[9px] font-mono text-text-muted px-1 mt-1">
             <span>SURFACE</span>
             <span>1000m</span>
             <span>2000m</span>
           </div>
         </div>

         {/* SAR CONTROLS */}
         {mode === 'SAR_MODE' && (
           <div className="flex-[0.5] flex flex-col justify-center border-l border-border-subtle pl-space-6 ml-space-6 h-12">
             <button
                onClick={toggleSimulation}
                disabled={!sarStartPoint}
                className={`w-full h-full border text-[10px] font-sans font-medium uppercase tracking-widest transition-colors flex justify-center items-center gap-2 ${
                  !sarStartPoint 
                    ? 'border-border-subtle text-text-muted cursor-not-allowed' 
                    : sarSimulationActive 
                      ? 'border-accent-warning bg-accent-warning/10 text-accent-warning' 
                      : 'border-accent-interactive text-accent-interactive hover:bg-accent-interactive/10'
                }`}
             >
               {sarSimulationActive ? (
                 <>
                   <div className="w-1.5 h-1.5 bg-accent-warning rounded-full animate-ping"></div>
                   COMPUTING
                 </>
               ) : 'INITIALIZE RUN'}
             </button>
           </div>
         )}
      </div>
    </footer>
  );
};
