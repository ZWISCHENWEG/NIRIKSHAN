import React, { useEffect } from 'react';
import { useAppStore } from '../store/appState';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

export const ResponseWorkspace: React.FC = () => {
  const { 
    mode, 
    clearSelection, 
    sarStartPoint, 
    responseScenario, 
    selectedEvidenceCase,
    responseReplayTime,
    setResponseReplayTime,
    responseReplayPlaying,
    setResponseReplayPlaying
  } = useAppStore(useShallow(state => ({
    mode: state.mode,
    clearSelection: state.clearSelection,
    sarStartPoint: state.sarStartPoint,
    responseScenario: state.responseScenario,
    selectedEvidenceCase: state.selectedEvidenceCase,
    responseReplayTime: state.responseReplayTime,
    setResponseReplayTime: state.setResponseReplayTime,
    responseReplayPlaying: state.responseReplayPlaying,
    setResponseReplayPlaying: state.setResponseReplayPlaying
  })));

  const isVisible = mode === 'SAR_MODE';
  
  const totalDuration = responseScenario ? parseInt(responseScenario.metadata.duration.replace('h', '')) : 72;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (responseReplayPlaying && responseReplayTime < totalDuration) {
      interval = setInterval(() => {
        setResponseReplayTime(responseReplayTime + 1);
      }, 100); // 100ms per hour tick
    } else if (responseReplayTime >= totalDuration) {
      setResponseReplayPlaying(false);
    }
    return () => clearInterval(interval);
  }, [responseReplayPlaying, responseReplayTime, totalDuration, setResponseReplayTime, setResponseReplayPlaying]);

  if (!isVisible) return null;
  const trajectory = responseScenario?.trajectory || [];
  
  const currentPoint = trajectory.length > 0 
    ? trajectory[Math.min(responseReplayTime, trajectory.length - 1)] 
    : null;

  // Calculate total displacement if trajectory is available
  let totalDisplacementKm = 0;
  if (trajectory.length > 0 && sarStartPoint) {
    const lastPoint = trajectory[trajectory.length - 1];
    // Rough haversine approximation for displacement (demo purposes, sufficient here)
    const latDiff = lastPoint.lat - sarStartPoint.lat;
    const lonDiff = lastPoint.lon - sarStartPoint.lon;
    totalDisplacementKm = Math.sqrt(Math.pow(latDiff * 111, 2) + Math.pow(lonDiff * 111 * Math.cos(sarStartPoint.lat * Math.PI / 180), 2));
  }

  const togglePlay = () => setResponseReplayPlaying(!responseReplayPlaying);
  const resetReplay = () => {
    setResponseReplayPlaying(false);
    setResponseReplayTime(0);
  };

  return (
    <aside className={`w-[440px] bg-surface-base/95 backdrop-blur-xl flex flex-col border-l border-border-subtle absolute right-0 top-0 h-full z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-0`}>
      
      {/* HEADER / IDENTITY */}
      <div className="pt-space-8 px-space-8 pb-space-6 flex justify-between items-start">
        <div className="flex flex-col gap-space-1">
          <div className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-accent-warning rounded-full"></div>
            Response Workspace
          </div>
          <h2 className="text-xl font-sans font-normal text-text-primary tracking-wide">Drift Simulation</h2>
        </div>
        <button 
          onClick={clearSelection}
          className="text-text-muted hover:text-text-primary transition-colors p-1"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>

      <div className="px-space-8 flex-1 flex flex-col overflow-y-auto pb-space-8">
        
        {/* EVIDENCE CONNECTION */}
        <div className="mb-space-8 p-space-4 bg-surface-raised rounded-sm border border-border-subtle">
           <h3 className="text-[10px] font-sans font-medium text-text-muted tracking-widest uppercase mb-space-2">Based on Evidence</h3>
           {selectedEvidenceCase ? (
             <div className="text-xs font-mono text-text-primary">
               <div>{selectedEvidenceCase.provenance.observation_dataset_id}</div>
               <div className="text-text-muted mt-1">{selectedEvidenceCase.provenance.model_dataset_id}</div>
             </div>
           ) : (
             <div className="text-xs font-mono text-text-muted">Manual LKP specified.</div>
           )}
        </div>

        {/* RESPONSE SUMMARY */}
        <div className="mb-space-8">
          <h3 className="text-xs font-sans font-medium text-text-primary tracking-widest uppercase mb-space-4">Response Summary</h3>
          <dl className="grid grid-cols-2 gap-y-4 text-[10px]">
            <dt className="font-sans font-medium text-text-muted uppercase tracking-widest">Start Position</dt>
            <dd className="font-mono text-text-primary text-right">
              {sarStartPoint ? `${sarStartPoint.lat.toFixed(2)}N ${sarStartPoint.lon.toFixed(2)}E` : 'Not Set'}
            </dd>
            
            <dt className="font-sans font-medium text-text-muted uppercase tracking-widest">Duration</dt>
            <dd className="font-mono text-text-primary text-right">
              {responseScenario?.metadata.duration || 'N/A'}
            </dd>
            
            <dt className="font-sans font-medium text-text-muted uppercase tracking-widest">Time Step</dt>
            <dd className="font-mono text-text-primary text-right">
              {responseScenario?.metadata.timestep || 'N/A'}
            </dd>
            
            <dt className="font-sans font-medium text-text-muted uppercase tracking-widest">Total Disp.</dt>
            <dd className="font-mono text-text-primary text-right">
              {totalDisplacementKm > 0 ? `${totalDisplacementKm.toFixed(1)} km` : 'N/A'}
            </dd>
          </dl>
        </div>

        <hr className="border-border-subtle mb-space-8" />

        {/* TRAJECTORY REPLAY */}
        <div className="mb-space-8">
          <h3 className="text-xs font-sans font-medium text-text-primary tracking-widest uppercase mb-space-4">Replay Controls</h3>
          
          {responseScenario ? (
            <div className="flex flex-col gap-space-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-medium text-text-muted uppercase tracking-widest">T+{responseReplayTime} HR</span>
                {currentPoint && (
                  <span className="text-[10px] font-mono text-text-primary">
                    {currentPoint.lat.toFixed(2)}N {currentPoint.lon.toFixed(2)}E
                  </span>
                )}
              </div>
              
              <input 
                type="range" 
                min="0" 
                max={totalDuration} 
                value={responseReplayTime}
                onChange={(e) => {
                  setResponseReplayTime(parseInt(e.target.value));
                  setResponseReplayPlaying(false);
                }}
                className="w-full h-1 bg-border-strong appearance-none cursor-pointer accent-accent-warning"
              />

              <div className="flex justify-center gap-space-4 mt-space-2">
                <button 
                  onClick={resetReplay}
                  className="p-2 text-text-muted hover:text-text-primary transition-colors bg-surface-raised rounded-sm"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="px-6 py-2 bg-accent-warning text-[#000000] font-bold text-xs uppercase tracking-widest hover:bg-[#D64E4E] transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  {responseReplayPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {responseReplayPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Initialize run to begin replay.
            </div>
          )}
        </div>

        <hr className="border-border-subtle mb-space-8" />

        {/* LIMITATIONS / PROVENANCE */}
        <div>
           <h3 className="text-xs font-sans font-medium text-text-primary tracking-widest uppercase mb-space-4">Limitations & Provenance</h3>
           <dl className="grid grid-cols-1 gap-y-4 text-[10px]">
              <div>
                <dt className="font-sans font-medium text-text-muted uppercase tracking-widest mb-1">Methodology</dt>
                <dd className="font-mono text-text-primary">
                  {responseScenario?.metadata.integration_method || 'Euler forward step'}
                </dd>
              </div>
              
              <div>
                <dt className="font-sans font-medium text-text-muted uppercase tracking-widest mb-1">Current Dataset</dt>
                <dd className="font-mono text-text-primary">
                  {responseScenario?.metadata.dataset_id || 'GLORYS12V1'} ({responseScenario?.metadata.u_variable}, {responseScenario?.metadata.v_variable})
                </dd>
              </div>

              <div className="bg-accent-warning/10 border border-accent-warning/20 p-space-3 rounded-sm mt-space-2">
                <dt className="font-sans font-medium text-accent-warning uppercase tracking-widest mb-1 flex items-center gap-1">
                  Scientific Drift Simulation
                </dt>
                <dd className="font-mono text-text-primary opacity-80 leading-relaxed">
                  {responseScenario?.metadata.known_limitations || 'Surface currents only. No windage or leeway physics. Not an operational prediction.'}
                </dd>
              </div>
           </dl>
        </div>

      </div>
    </aside>
  );
};
