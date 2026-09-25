import { useEffect, useState } from 'react';
import { useAppStore } from './store/appState';
import { Scene3D } from './components/Scene3D';
import { InspectionPanel } from './components/InspectionPanel';
import { BottomScrubbers } from './components/BottomScrubbers';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { mode, setMode } = useAppStore();

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-surface-base text-text-primary font-sans transition-colors duration-300">
      {/* TOP BAR */}
      <header className="flex-none h-12 bg-surface-raised border-b border-border-subtle flex items-center justify-between px-space-4 z-20">
        <div className="flex items-center gap-space-4">
          <h1 className="text-sm font-semibold tracking-wide text-text-primary">OCEAN 3D VISUALIZER</h1>
          <span className="text-xs text-border-strong">|</span>
          <span className="text-xs font-mono text-text-secondary">Demo dataset · HYCOM/Argo-compatible sample</span>
        </div>
        <div className="flex items-center gap-space-4 text-xs font-mono">
          <button
            onClick={() => setMode(mode === 'SAR_MODE' ? 'SURVEY_MODE' : 'SAR_MODE')}
            className={`px-3 py-1 rounded border transition-colors ${
              mode === 'SAR_MODE' 
                ? 'bg-accent-warning text-surface-base border-accent-warning' 
                : 'border-accent-warning text-accent-warning hover:bg-accent-warning/10'
            }`}
          >
            {mode === 'SAR_MODE' ? 'EXIT SAR MODE' : 'SAR MODE'}
          </button>
          <span className="text-text-secondary">UTC: 2026-09-22T14:00:00Z</span>
          <span className="flex items-center gap-space-2 text-accent-interactive">
            <div className="w-2 h-2 rounded-full bg-accent-interactive"></div>
            LIVE DEMO
          </span>
          <button 
            onClick={toggleTheme}
            className="ml-space-2 p-space-1 rounded hover:bg-surface-overlay text-text-secondary transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* 3D SCENE (Dominant) */}
        <div className="flex-1 relative border-r border-border-subtle bg-black">
          <Scene3D />
          
          {/* Floating Controls */}
          {mode !== 'SAR_MODE' && (
            <div className="absolute top-space-4 left-space-4 bg-surface-overlay/90 backdrop-blur-sm border border-border-subtle p-space-3 rounded flex flex-col gap-space-2 text-xs shadow-lg z-10 pointer-events-none">
              <div className="font-semibold text-text-secondary uppercase tracking-wider text-[10px]">Active Layer</div>
              <div className="flex items-center gap-space-2 text-text-primary">
                <div className="w-3 h-3 bg-accent-interactive rounded-[2px]"></div>
                <span>Temperature (°C)</span>
              </div>
            </div>
          )}

          {/* SAR Mode UI Overlay */}
          {mode === 'SAR_MODE' && (
            <>
              <div className="absolute top-space-4 left-space-4 right-space-4 bg-surface-overlay/95 backdrop-blur-sm border-2 border-accent-warning p-space-4 rounded shadow-xl z-10">
                <div className="flex items-start gap-space-4">
                  <div className="mt-1 text-accent-warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-accent-warning mb-1">WARNING: DEMONSTRATION ONLY</h3>
                    <p className="text-xs text-text-primary">
                      Simplified drift model for demonstration only — not validated for operational search-and-rescue use. 
                      Production version requires INCOIS's full ensemble methodology.
                    </p>
                    <p className="text-xs text-text-secondary mt-2">
                      Click anywhere on the globe to set the last known position.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* INSPECTION PANEL */}
        <InspectionPanel />
      </main>

      {/* BOTTOM SCRUBBERS */}
      <BottomScrubbers />
    </div>
  );
}

export default App;
