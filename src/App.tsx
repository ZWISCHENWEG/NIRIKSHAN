import { useEffect } from 'react';
import { useAppStore } from './store/appState';
import { useShallow } from 'zustand/react/shallow';
import { Scene3D } from './components/Scene3D';
import { InspectionPanel } from './components/InspectionPanel';
import { ResponseWorkspace } from './components/ResponseWorkspace';
import { BottomScrubbers } from './components/BottomScrubbers';
import { SnapshotManager } from './components/SnapshotManager';

function App() {
  const { mode, setMode } = useAppStore(useShallow(state => ({ mode: state.mode, setMode: state.setMode })));

  useEffect(() => {
    // Force dark theme for the scientific interface
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-surface-base text-text-primary font-sans">
      {/* GLOBAL SYSTEM BAR */}
      <header className="flex-none h-12 bg-surface-base border-b border-border-subtle flex items-center justify-between px-space-6 z-20">
        <div className="flex items-center gap-space-4">
          <img src="/branding/NIRIKSHAN-mark.svg" alt="NIRIKSHAN Logo" className="h-6 w-6 text-accent-interactive" />
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-bold tracking-widest text-text-primary">NIRIKSHAN</h1>
            <span className="text-[9px] font-sans font-medium tracking-widest text-text-muted uppercase">3D Ocean Analysis / Response Workspace</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-primary font-medium tracking-wide uppercase">Global Ocean Physics</span>
          <span className="text-[10px] text-text-muted tracking-wide uppercase">GLORYS12V1 · REANALYSIS · JAN 2024</span>
        </div>

        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center gap-space-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-mono text-text-primary">12:00 UTC</span>
              <span className="text-[9px] font-semibold tracking-wide text-accent-interactive uppercase">Data Nominal</span>
            </div>
            <div className="w-[1px] h-6 bg-border-subtle"></div>
            <button
              onClick={() => setMode(mode === 'SAR_MODE' ? 'SURVEY_MODE' : 'SAR_MODE')}
              className={`text-[10px] font-semibold uppercase tracking-wide transition-colors flex items-center gap-2 ${
                mode === 'SAR_MODE' 
                  ? 'text-accent-warning hover:text-accent-warning/80' 
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {mode === 'SAR_MODE' ? '← EXIT RESPONSE' : 'SAR WORKSPACE →'}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* 3D SCENE (Dominant) */}
        <div className="flex-1 relative bg-[#0C0D0D]">
          <Scene3D />
          
          {/* Typography-only overlay (No cards) */}
          {mode !== 'SAR_MODE' && (
            <div className="absolute top-space-6 left-space-6 z-10 pointer-events-none">
              <div className="font-sans font-semibold text-[10px] text-text-muted uppercase tracking-wide mb-1">Active Field</div>
              <div className="flex items-center gap-space-2 text-xs text-text-primary font-sans font-medium tracking-wide">
                <div className="w-1.5 h-1.5 bg-accent-interactive rounded-full"></div>
                <span>POTENTIAL TEMPERATURE (°C)</span>
              </div>
            </div>
          )}

          {/* SAR Mode Typography Overlay */}
          {mode === 'SAR_MODE' && (
            <div className="absolute top-space-6 left-space-6 z-10 max-w-sm pointer-events-none">
              <h2 className="font-sans text-xs font-semibold tracking-wide text-accent-warning uppercase mb-space-1 flex items-center gap-space-2">
                <div className="w-1.5 h-1.5 bg-accent-warning rounded-full"></div>
                Search & Rescue
              </h2>
              <div className="font-sans text-xs font-medium tracking-wide text-text-primary opacity-90 uppercase">
                Drift Analysis
              </div>
              <div className="font-sans text-[10px] text-text-muted mt-space-2">
                Click map to set last known position (LKP).
              </div>
            </div>
          )}
        </div>

        {/* INSPECTION PANEL */}
        <InspectionPanel />
        
        {/* RESPONSE WORKSPACE */}
        <ResponseWorkspace />
        
        {/* SNAPSHOT MANAGER */}
        <SnapshotManager />
      </main>

      {/* BOTTOM SCRUBBERS */}
      <BottomScrubbers />
    </div>
  );
}

export default App;

