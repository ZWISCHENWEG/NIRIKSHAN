import React, { useEffect, useState, useRef } from 'react';
import { Viewer, Entity, PointGraphics, CameraFlyTo } from 'resium';
import { Cartesian3, Color, UrlTemplateImageryProvider, ImageryLayer, Ion } from 'cesium';
import { useAppStore } from '../store/appState';
import { SarSimulation } from './SarSimulation';
import { apiClient } from '../services/apiClient';
import type { Observation } from '../services/types';

// Configure Cesium Ion correctly before creating the Viewer
const ionToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || '';
if (ionToken) {
  Ion.defaultAccessToken = ionToken;
}

// Use a free, desaturated CartoDB basemap, applying the API key if present
const cartoKey = import.meta.env.VITE_CARTO_API_KEY || ionToken;
const cartoUrl = `https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png${cartoKey ? `?key=${cartoKey}` : ''}`;

const baseImagery = new UrlTemplateImageryProvider({
  url: cartoUrl,
  credit: 'Map tiles by Carto, under CC BY 3.0. Data by OSM, under ODbL.'
});

const cartoBaseLayer = new ImageryLayer(baseImagery);

import { useShallow } from 'zustand/react/shallow';

export const Scene3D: React.FC = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const { mode, selectedFloatId, selectFloat } = useAppStore(useShallow(state => ({
    mode: state.mode,
    selectedFloatId: state.selectedFloatId,
    selectFloat: state.selectFloat
  })));
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Fetch observations from backend via apiClient
    apiClient.getObservations()
      .then(data => {
        if (data) {
          setObservations(data);
        }
      })
      .catch(err => console.error("Failed to fetch observations", err));
  }, []);

  // Set camera constraints once the viewer is ready
  useEffect(() => {
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement;
      const ssc = viewer.scene.screenSpaceCameraController;
      // Constrain zoom distances
      ssc.minimumZoomDistance = 100000;  // 100km
      ssc.maximumZoomDistance = 5000000; // 5000km
      
      // Keep it top-down for the instrument feel
      ssc.enableTilt = false; 
    }
  }, [viewerRef.current]);

  const handlePointClick = (obs: Observation) => {
    selectFloat(obs.id, obs);
  };

  const getPointColor = (id: string) => {
    if (mode === 'SURVEY_MODE') return Color.fromCssColorString('#46848A'); // muted teal
    return selectedFloatId === id ? Color.fromCssColorString('#F2F0E9') : Color.fromCssColorString('#46848A').withAlpha(0.2);
  };

  return (
    <Viewer
      ref={viewerRef}
      full
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      baseLayer={cartoBaseLayer}
      geocoder={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      selectionIndicator={false}
      className="absolute inset-0 w-full h-full"
    >
      {/* Observations */}
      {observations.map(obs => (
        <Entity
          key={obs.id}
          position={Cartesian3.fromDegrees(obs.lon, obs.lat, 0)}
          name={`Float ${obs.id}`}
          onClick={() => handlePointClick(obs)}
        >
          <PointGraphics
            pixelSize={selectedFloatId === obs.id ? 8 : 4}
            color={getPointColor(obs.id)}
            outlineColor={selectedFloatId === obs.id ? Color.fromCssColorString('#111213') : Color.TRANSPARENT}
            outlineWidth={selectedFloatId === obs.id ? 3 : 0}
          />
        </Entity>
      ))}

      {/* Camera logic */}
      {mode === 'SURVEY_MODE' && (
        <CameraFlyTo
          destination={Cartesian3.fromDegrees(87.5, 15.0, 4000000)}
          duration={2.5}
        />
      )}
      
      {mode === 'TRANSITIONING' && selectedFloatId && (
        <CameraFlyTo
          destination={(() => {
            const obs = observations.find(o => o.id === selectedFloatId);
            // Fly closer and offset slightly to the left to account for the right-side Inspection Panel
            if (obs) return Cartesian3.fromDegrees(obs.lon - 2.0, obs.lat - 1.0, 1500000);
            return Cartesian3.fromDegrees(87.5, 15.0, 4000000); // Fallback
          })()}
          duration={1.8}
          onComplete={() => useAppStore.getState().setMode('INSPECTION_MODE')}
        />
      )}

      {/* SAR Simulation Component */}
      <SarSimulation viewer={viewerRef.current?.cesiumElement || null} />
    </Viewer>
  );
};

