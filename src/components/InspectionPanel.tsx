import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useAppStore } from '../store/appState';
import { X } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { ProfileData } from '../services/types';

export const InspectionPanel: React.FC = () => {
  const { mode, selectedFloatId, clearSelection } = useAppStore();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (selectedFloatId && (mode === 'INSPECTION_MODE' || mode === 'TRANSITIONING')) {
      // Fetch profile data via apiClient
      apiClient.getProfile(15.0, 85.0) // Stub coords for demo
        .then(d => setData(d))
        .catch(e => console.error(e));
    } else {
      setData(null);
    }
  }, [selectedFloatId, mode]);

  // Handle panel animation
  const isVisible = mode === 'INSPECTION_MODE' || mode === 'TRANSITIONING';
  
  if (!isVisible) return null;

  return (
    <aside className={`w-[400px] bg-surface-raised flex flex-col border-l border-border-subtle absolute right-0 top-0 h-full z-10 transition-transform duration-500 ease-out ${mode === 'INSPECTION_MODE' ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
      <div className="p-space-4 border-b border-border-subtle flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold mb-space-1 text-text-primary">Float {selectedFloatId}</h2>
          <p className="text-xs text-text-muted font-mono">Argo • Real-time QC • BAY OF BENGAL</p>
        </div>
        <button 
          onClick={clearSelection}
          className="text-text-muted hover:text-text-primary transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-space-4 flex-1 flex flex-col overflow-y-auto">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-space-4">Vertical Profile: Temperature</h3>
        
        <div className="flex-1 min-h-[400px]">
          {data ? (
            <Plot
              data={[
                {
                  x: data.modelValues,
                  y: data.depths,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'HYCOM Model',
                  line: { color: '#3D7A85', width: 2 } // Use accent-interactive roughly
                },
                {
                  x: data.observationValues,
                  y: data.depths,
                  type: 'scatter',
                  mode: 'markers+lines',
                  name: 'Observation',
                  marker: { color: '#B85C3E', size: 6 }, // Use accent-warning
                  line: { color: '#B85C3E', width: 1, dash: 'dot' }
                }
              ]}
              layout={{
                autosize: true,
                margin: { l: 40, r: 10, t: 10, b: 40 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'IBM Plex Mono, monospace', size: 10, color: '#7E848A' },
                xaxis: { 
                  title: 'Temperature (°C)',
                  gridcolor: '#3A3E42',
                  zerolinecolor: '#4F555A'
                },
                yaxis: { 
                  title: 'Depth (m)', 
                  autorange: 'reversed',
                  gridcolor: '#3A3E42',
                  zerolinecolor: '#4F555A'
                },
                legend: {
                  orientation: 'h',
                  y: -0.15
                },
                hovermode: 'y unified'
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={{ displayModeBar: false }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-mono">
              Loading profile data...
            </div>
          )}
        </div>
        
        <div className="mt-space-6 border-t border-border-subtle pt-space-4">
           <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-space-2">Metadata</h3>
           <dl className="grid grid-cols-2 gap-y-2 text-[10px] font-mono text-text-muted">
              <dt>Platform Type:</dt><dd className="text-text-primary text-right">APEX Float</dd>
              <dt>Data Center:</dt><dd className="text-text-primary text-right">INCOIS</dd>
              <dt>WMO ID:</dt><dd className="text-text-primary text-right">{selectedFloatId}</dd>
              <dt>Cycle:</dt><dd className="text-text-primary text-right">142</dd>
           </dl>
        </div>
      </div>
    </aside>
  );
};
