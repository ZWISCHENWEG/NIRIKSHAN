import React, { useEffect, useState, useRef } from 'react';
import { Viewer, Entity, PointGraphics, CameraFlyTo, RectangleGraphics, ImageryLayer } from 'resium';
import { Cartesian3, Color, Rectangle, UrlTemplateImageryProvider } from 'cesium';
import { useAppStore } from '../store/appState';
import { SarSimulation } from './SarSimulation';
import { apiClient } from '../services/apiClient';
import type { Observation } from '../services/types';

const BAY_OF_BENGAL_RECT = Rectangle.fromDegrees(75, 5, 100, 25);

// Use a free, desaturated CartoDB basemap without needing an Ion Token
const baseImagery = new UrlTemplateImageryProvider({
  url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
  credit: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
});

export const Scene3D: React.FC = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const { mode, selectedFloatId, selectFloat } = useAppStore();
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
      
      // Optionally restrict panning/pitch
      ssc.enableTilt = false; // keep it top-down for the instrument feel
    }
  }, [viewerRef.current]);

  const handlePointClick = (id: string) => {
    selectFloat(id);
  };

  const getPointColor = (id: string) => {
    if (mode === 'SURVEY_MODE') return Color.CYAN;
    return selectedFloatId === id ? Color.YELLOW : Color.CYAN.withAlpha(0.2);
  };

  return (
    <Viewer
      ref={viewerRef}
      full
      timeline={false}
      animation={false}
      baseLayerPicker={false}
      baseLayer={false}
      geocoder={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      className="absolute inset-0 w-full h-full"
    >
      <ImageryLayer imageryProvider={baseImagery} />
      {/* Model Field Stub (Colored Rectangle over Bay of Bengal) */}
      <Entity>
        <RectangleGraphics
          coordinates={BAY_OF_BENGAL_RECT}
          material={Color.fromCssColorString('rgba(0, 50, 150, 0.4)')}
          height={0}
        />
      </Entity>

      {/* Observations */}
      {observations.map(obs => (
        <Entity
          key={obs.id}
          position={Cartesian3.fromDegrees(obs.lon, obs.lat, 0)}
          name={`Float ${obs.id}`}
          description={`Type: ${obs.type}\nTime: ${obs.time}`}
          onClick={() => handlePointClick(obs.id)}
        >
          <PointGraphics
            pixelSize={selectedFloatId === obs.id ? 15 : 10}
            color={getPointColor(obs.id)}
            outlineColor={Color.WHITE}
            outlineWidth={2}
          />
        </Entity>
      ))}

      {/* Camera logic */}
      {mode === 'SURVEY_MODE' && (
        <CameraFlyTo
          destination={Cartesian3.fromDegrees(87.5, 15.0, 4000000)}
          duration={2}
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
          duration={1.5}
          onComplete={() => useAppStore.getState().setMode('INSPECTION_MODE')}
        />
      )}

      {/* SAR Simulation Component */}
      <SarSimulation viewer={viewerRef.current?.cesiumElement || null} />
    </Viewer>
  );
};
