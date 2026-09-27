import React, { useEffect } from 'react';
import { Entity, PointGraphics, PolylineGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import { Cartesian3, Cartesian2, Color, ScreenSpaceEventType, Viewer } from 'cesium';
import { useAppStore } from '../store/appState';
import { useShallow } from 'zustand/react/shallow';
import { apiClient } from '../services/apiClient';

export const SarSimulation: React.FC<{ viewer: Viewer | null }> = ({ viewer }) => {
  const { 
    mode, 
    sarStartPoint, 
    setSarStartPoint, 
    sarSimulationActive,
    responseScenario,
    setResponseScenario,
    responseReplayTime,
    setSarSimulationActive,
    setResponseReplayPlaying
  } = useAppStore(useShallow(state => ({
    mode: state.mode,
    sarStartPoint: state.sarStartPoint,
    setSarStartPoint: state.setSarStartPoint,
    sarSimulationActive: state.sarSimulationActive,
    responseScenario: state.responseScenario,
    setResponseScenario: state.setResponseScenario,
    responseReplayTime: state.responseReplayTime,
    setSarSimulationActive: state.setSarSimulationActive,
    setResponseReplayPlaying: state.setResponseReplayPlaying
  })));

  // Handle clicks to set start point manually
  const handleMapClick = (action: { position: Cartesian2 } | { startPosition: Cartesian2; endPosition: Cartesian2 }) => {
    if (mode !== 'SAR_MODE' || !viewer || !('position' in action)) return;
    
    const cartesian = viewer.camera.pickEllipsoid(action.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      const lon = (cartographic.longitude * 180) / Math.PI;
      const lat = (cartographic.latitude * 180) / Math.PI;
      
      setSarStartPoint(lat, lon);
      setResponseScenario(null);
      setSarSimulationActive(false);
      setResponseReplayPlaying(false);
    }
  };

  // Fetch simulation
  useEffect(() => {
    let isActive = true;
    
    const fetchDrift = async () => {
      if (mode === 'SAR_MODE' && sarSimulationActive && sarStartPoint) {
        try {
          const response = await apiClient.getSarDrift(sarStartPoint.lat, sarStartPoint.lon, undefined, 72);
          if (!isActive) return;
          
          setResponseScenario(response);
          setSarSimulationActive(false); // turn off computing state
        } catch (e) {
          console.error("Failed to fetch SAR drift", e);
          setSarSimulationActive(false);
        }
      }
    };
    
    if (sarSimulationActive && !responseScenario) {
      fetchDrift();
    }
    
    return () => { isActive = false; };
  }, [mode, sarSimulationActive, sarStartPoint, responseScenario, setResponseScenario, setSarSimulationActive]);

  if (mode !== 'SAR_MODE') return null;

  const trajectory = responseScenario?.trajectory || [];
  const currentPoint = trajectory.length > 0 
    ? trajectory[Math.min(responseReplayTime, trajectory.length - 1)] 
    : null;

  const trajectoryPositions = trajectory.map(p => Cartesian3.fromDegrees(p.lon, p.lat, 0));
  const pastTrajectoryPositions = trajectory.slice(0, Math.min(responseReplayTime + 1, trajectory.length)).map(p => Cartesian3.fromDegrees(p.lon, p.lat, 0));

  return (
    <>
      <ScreenSpaceEventHandler>
        <ScreenSpaceEvent 
          action={handleMapClick} 
          type={ScreenSpaceEventType.LEFT_CLICK} 
        />
      </ScreenSpaceEventHandler>

      {/* Start Point Marker */}
      {sarStartPoint && (
        <Entity
          position={Cartesian3.fromDegrees(sarStartPoint.lon, sarStartPoint.lat, 0)}
          name="Last Known Position"
        >
          <PointGraphics pixelSize={8} color={Color.TRANSPARENT} outlineColor={Color.fromCssColorString('#C26344')} outlineWidth={2} />
        </Entity>
      )}

      {/* Full Trajectory Path (faded) */}
      {trajectoryPositions.length > 1 && (
        <Entity>
          <PolylineGraphics
            positions={trajectoryPositions}
            width={2}
            material={Color.fromCssColorString('#46848A').withAlpha(0.3)}
          />
        </Entity>
      )}

      {/* Past Trajectory Path (active) */}
      {pastTrajectoryPositions.length > 1 && (
        <Entity>
          <PolylineGraphics
            positions={pastTrajectoryPositions}
            width={2}
            material={Color.fromCssColorString('#C26344')}
          />
        </Entity>
      )}

      {/* Current Position Marker */}
      {currentPoint && (
        <Entity position={Cartesian3.fromDegrees(currentPoint.lon, currentPoint.lat, 0)}>
          <PointGraphics pixelSize={6} color={Color.fromCssColorString('#C26344')} />
        </Entity>
      )}
    </>
  );
};

