import React, { useEffect, Suspense } from 'react';
const Plot = React.lazy(() => import('react-plotly.js'));
import { useAppStore } from '../store/appState';
import { X } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { WaterColumnLens } from './WaterColumnLens/WaterColumnLens';
import { AnalyticalReadout } from './WaterColumnLens/AnalyticalReadout';

import { useShallow } from 'zustand/react/shallow';

export const InspectionPanel: React.FC = () => {
  const { 
    mode, 
    selectedFloatId, 
    selectedObservation, 
    selectedEvidenceCase, 
    isLoadingEvidence, 
    setEvidenceCase, 
    setIsLoadingEvidence, 
    clearSelection, 
    analyticalCursor, 
    setAnalyticalCursor 
  } = useAppStore(useShallow(state => ({
    mode: state.mode,
    selectedFloatId: state.selectedFloatId,
    selectedObservation: state.selectedObservation,
    selectedEvidenceCase: state.selectedEvidenceCase,
    isLoadingEvidence: state.isLoadingEvidence,
    setEvidenceCase: state.setEvidenceCase,
    setIsLoadingEvidence: state.setIsLoadingEvidence,
    clearSelection: state.clearSelection,
    analyticalCursor: state.analyticalCursor,
    setAnalyticalCursor: state.setAnalyticalCursor
  })));

  useEffect(() => {
    if (selectedObservation && (mode === 'INSPECTION_MODE' || mode === 'TRANSITIONING')) {
      setIsLoadingEvidence(true);
      apiClient.getEvidence(selectedObservation.id)
        .then(d => {
          setEvidenceCase(d);
          setIsLoadingEvidence(false);
        })
        .catch(e => {
          console.error(e);
          setEvidenceCase(null);
          setIsLoadingEvidence(false);
        });
    } else {
      setEvidenceCase(null);
      setIsLoadingEvidence(false);
    }
  }, [selectedObservation, mode, setEvidenceCase, setIsLoadingEvidence]);

  // Handle panel animation
  const isVisible = mode === 'INSPECTION_MODE' || mode === 'TRANSITIONING';
  
  if (!isVisible) return null;

  return (
    <aside className={`w-[440px] bg-surface-base/95 backdrop-blur-xl flex flex-col border-l border-border-subtle absolute right-0 top-0 h-full z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'INSPECTION_MODE' ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* HEADER / IDENTITY */}
      <div className="pt-space-8 px-space-8 pb-space-6 flex justify-between items-start">
        <div className="flex flex-col gap-space-1">
          <div className="text-[10px] font-sans font-semibold text-text-muted tracking-wide uppercase">Observation</div>
          <h2 className="text-lg font-sans font-medium text-text-primary tracking-wide">ARGO {selectedFloatId}</h2>
        </div>
        <button 
          onClick={clearSelection}
          className="text-text-muted hover:text-text-primary transition-colors p-1"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>

      <div className="px-space-8 flex-1 flex flex-col overflow-y-auto pb-space-8">
        
        {/* METADATA */}
        <div className="mb-space-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="text-[9px] font-sans font-semibold text-text-muted tracking-wide uppercase mb-1">Position</div>
            <div className="text-[11px] font-mono text-text-primary">
              {selectedObservation ? `${Math.abs(selectedObservation.lat).toFixed(2)}° ${selectedObservation.lat >= 0 ? 'N' : 'S'} / ${Math.abs(selectedObservation.lon).toFixed(2)}° ${selectedObservation.lon >= 0 ? 'E' : 'W'}` : 'Unknown'}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-sans font-semibold text-text-muted tracking-wide uppercase mb-1">Time</div>
            <div className="text-[11px] font-mono text-text-primary">
              {selectedObservation ? new Date(selectedObservation.time).toUTCString().replace(' GMT', ' UTC') : 'Unknown'}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-sans font-semibold text-text-muted tracking-wide uppercase mb-1">Depth Range</div>
            <div className="text-[11px] font-mono text-text-primary">
              {selectedEvidenceCase?.observation_profile?.depths?.length ? `${Math.min(...selectedEvidenceCase.observation_profile.depths).toFixed(1)} – ${Math.max(...selectedEvidenceCase.observation_profile.depths).toFixed(1)} m` : 'Unknown'}
            </div>
          </div>
        </div>

        <hr className="border-border-subtle mb-space-6" />

        {/* PROFILE CHART SECTION */}
        <div className="mb-space-2 flex justify-between items-end">
          <h3 className="text-[11px] font-sans font-semibold text-text-primary tracking-wide uppercase">Temperature Profile</h3>
          <span className="text-[9px] font-sans text-text-muted/70 tracking-wide uppercase">Click to inspect depth</span>
        </div>
        
        <div className="mb-space-2 text-[9px] font-sans text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-space-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[1.5px] bg-accent-interactive block"></span> Model
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-text-primary rounded-full block"></span> Observation
            </span>
          </div>
        </div>
        
        <div className="flex flex-row gap-4 flex-1 min-h-[350px] -mx-4 px-4">
          
          {selectedEvidenceCase && !isLoadingEvidence && (
            <div className="w-8 h-full shrink-0 flex flex-col pt-10 pb-[40px]">
              <WaterColumnLens evidenceCase={selectedEvidenceCase} />
            </div>
          )}

          <div className="flex-1">
          {isLoadingEvidence ? (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">
              Compiling evidence case...
            </div>
          ) : selectedEvidenceCase ? (
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">Loading chart...</div>}>
              <Plot
                data={[
                  {
                    x: selectedEvidenceCase.model_profile.values,
                    y: selectedEvidenceCase.model_profile.depths,
                    type: 'scatter',
                    mode: 'lines',
                    name: selectedEvidenceCase.provenance.model_dataset_id,
                    line: { color: '#46848A', width: 1.5 }, // accent-interactive
                    showlegend: false
                  },
                  {
                    x: selectedEvidenceCase.observation_profile.values,
                    y: selectedEvidenceCase.observation_profile.depths,
                    type: 'scatter',
                    mode: 'markers',
                    name: 'OBSERVATION',
                    marker: { color: '#F2F0E9', size: 3 }, // text-primary
                    showlegend: false
                  }
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 20, t: 10, b: 40 },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { family: 'IBM Plex Mono, Courier New, monospace', size: 10, color: '#9FA4A9' },
                  xaxis: { 
                    title: 'Temperature (°C)',
                    gridcolor: '#292C30',
                    zerolinecolor: '#3F444A',
                    tickcolor: '#292C30',
                    gridwidth: 1,
                    zerolinewidth: 1,
                  },
                  yaxis: { 
                    title: 'Depth (m)', 
                    autorange: 'reversed',
                    gridcolor: '#292C30',
                    zerolinecolor: '#3F444A',
                    tickcolor: '#292C30',
                    gridwidth: 1,
                    zerolinewidth: 1,
                  },
                  shapes: analyticalCursor.depth !== null ? [{
                    type: 'line',
                    y0: analyticalCursor.depth,
                    y1: analyticalCursor.depth,
                    x0: 0,
                    x1: 1,
                    xref: 'paper',
                    line: { color: '#46848A', width: 2, dash: 'dot' }
                  }] : [],
                  hovermode: 'y unified'
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false }}
                onClick={(e) => {
                  if (e.points && e.points.length > 0) {
                    const depth = e.points[0].y as number;
                    setAnalyticalCursor({ depth, source: 'profile_chart' });
                  }
                }}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">
              Evidence unavailable
            </div>
          )}
          </div>
        </div>

          <div className="grid grid-cols-2 gap-4 mt-space-2 mb-space-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-sans font-semibold text-text-muted tracking-wide uppercase mb-0.5">Mean Bias (Obs − Model)</span>
              <span className="text-[11px] font-mono text-text-primary">
                {selectedEvidenceCase?.statistics?.bias !== undefined ? `${selectedEvidenceCase.statistics.bias > 0 ? '+' : ''}${selectedEvidenceCase.statistics.bias.toFixed(2)} °C` : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-sans font-semibold text-text-muted tracking-wide uppercase mb-0.5">RMSE</span>
              <span className="text-[11px] font-mono text-text-primary">
                {selectedEvidenceCase?.statistics?.rmse !== undefined ? `${selectedEvidenceCase.statistics.rmse.toFixed(2)} °C` : 'N/A'}
              </span>
            </div>
          </div>

        <hr className="border-border-subtle my-space-6" />

        {/* RESIDUAL PROFILE */}
        <div className="mb-space-2 flex justify-between items-end">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-sans font-semibold text-text-primary tracking-wide uppercase mb-0.5">Residual</h3>
            <span className="text-[9px] font-mono text-text-muted">Observation − Model</span>
          </div>
          <span className="text-[9px] font-sans text-text-muted/70 tracking-wide uppercase">Click to inspect depth</span>
        </div>
        
        <div className="flex-1 min-h-[200px] -mx-4 mb-space-6">
          {isLoadingEvidence ? (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">
              Compiling evidence case...
            </div>
          ) : selectedEvidenceCase && selectedEvidenceCase.residual.values.length > 0 ? (
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">Loading chart...</div>}>
              <Plot
                data={[
                  {
                    x: selectedEvidenceCase.residual.values,
                    y: selectedEvidenceCase.residual.depths,
                    type: 'bar',
                    orientation: 'h',
                    name: 'Residual',
                    marker: { 
                      color: selectedEvidenceCase.residual.values.map(v => v >= 0 ? '#D64E4E' : '#46848A') 
                    },
                    showlegend: false
                  }
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 20, t: 10, b: 40 },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { family: 'IBM Plex Mono, Courier New, monospace', size: 10, color: '#9FA4A9' },
                  xaxis: { 
                    title: 'Residual (°C)',
                    gridcolor: '#292C30',
                    zerolinecolor: '#3F444A',
                    tickcolor: '#292C30',
                    gridwidth: 1,
                    zerolinewidth: 1,
                  },
                  yaxis: { 
                    title: 'Depth (m)', 
                    autorange: 'reversed',
                    gridcolor: '#292C30',
                    zerolinecolor: '#3F444A',
                    tickcolor: '#292C30',
                    gridwidth: 1,
                    zerolinewidth: 1,
                  },
                  shapes: analyticalCursor.depth !== null ? [{
                    type: 'line',
                    y0: analyticalCursor.depth,
                    y1: analyticalCursor.depth,
                    x0: 0,
                    x1: 1,
                    xref: 'paper',
                    line: { color: '#46848A', width: 2, dash: 'dot' }
                  }] : [],
                  hovermode: 'y unified'
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false }}
                onClick={(e) => {
                  if (e.points && e.points.length > 0) {
                    const depth = e.points[0].y as number;
                    setAnalyticalCursor({ depth, source: 'profile_chart' });
                  }
                }}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] font-mono uppercase tracking-widest">
              Evidence unavailable
            </div>
          )}
        </div>

        <hr className="border-border-subtle my-space-6" />

        {/* ANALYTICAL READOUT */}
        {selectedEvidenceCase && analyticalCursor.depth !== null && (
          <div className="mb-space-6">
            <h3 className="text-[11px] font-sans font-semibold text-text-primary tracking-wide uppercase mb-space-3">Analytical Cursor</h3>
            <AnalyticalReadout evidenceCase={selectedEvidenceCase} />
          </div>
        )}

        {selectedEvidenceCase && analyticalCursor.depth !== null && (
          <hr className="border-border-subtle my-space-6" />
        )}

        {/* DERIVED FEATURES */}
        {selectedEvidenceCase?.features && selectedEvidenceCase.features.length > 0 && (
          <div className="mb-space-6">
            <h3 className="text-[11px] font-sans font-semibold text-text-primary tracking-wide uppercase mb-space-4">
              Derived Features
            </h3>
            <div className="space-y-4 relative border-l border-border-subtle pl-4 ml-1">
              {selectedEvidenceCase.features.map(feature => (
                <div key={feature.feature_id} className="flex flex-col relative group">
                  {/* Depth Marker on the timeline-like border */}
                  <div className="absolute top-1 -left-[21px] w-2 h-2 rounded-full border-2 border-border-subtle bg-surface-base group-hover:border-accent-interactive transition-colors"></div>
                  
                  <div className="mb-0.5">
                    <span className="text-[10px] font-sans font-semibold text-text-primary tracking-wide uppercase">
                      {feature.feature_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-text-primary mb-1">
                    {feature.value !== null ? `${feature.value.toFixed(2)} ${feature.unit}` : 'N/A'}
                    {feature.depth !== null && (
                      <span className="text-[10px] text-accent-interactive ml-2">@ {feature.depth.toFixed(1)}m</span>
                    )}
                  </div>
                  <div className="text-[9px] font-sans text-text-muted/80">
                    {feature.method}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="border-border-subtle mb-space-6" />

        {/* PROVENANCE */}
        <div className="mb-space-6">
           <h3 className="text-[11px] font-sans font-semibold text-text-primary tracking-wide uppercase mb-space-3">Provenance</h3>
           <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-[10px]">
              <dt className="font-sans font-semibold text-text-muted uppercase tracking-wide">Dataset</dt>
              <dd className="font-mono text-text-primary">{selectedEvidenceCase?.provenance?.model_dataset || 'N/A'}</dd>
              
              <dt className="font-sans font-semibold text-text-muted uppercase tracking-wide">Temporal Sep.</dt>
              <dd className="font-mono text-text-primary">
                {selectedEvidenceCase?.model_match?.temporal_separation !== undefined ? `${selectedEvidenceCase.model_match.temporal_separation.toFixed(1)} h` : 'N/A'}
              </dd>
              
              <dt className="font-sans font-semibold text-text-muted uppercase tracking-wide">Spatial Sep.</dt>
              <dd className="font-mono text-text-primary">
                {selectedEvidenceCase?.model_match?.spatial_separation !== undefined ? `${(selectedEvidenceCase.model_match.spatial_separation * 111).toFixed(1)} km` : 'N/A'}
              </dd>
              
              <dt className="font-sans font-semibold text-text-muted uppercase tracking-wide">Match Method</dt>
              <dd className="font-mono text-text-primary">
                {selectedEvidenceCase?.provenance?.profile_alignment_method || 'N/A'}
              </dd>
              
              <dt className="font-sans font-semibold text-text-muted uppercase tracking-wide">Points Matched</dt>
              <dd className="font-mono text-text-primary">
                {selectedEvidenceCase?.statistics?.valid_count ?? 'N/A'}
              </dd>
           </dl>
        </div>

      </div>
    </aside>
  );
};

