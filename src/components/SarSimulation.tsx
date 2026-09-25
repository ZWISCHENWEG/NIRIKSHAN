import React, { useEffect, useState } from 'react';
import { Entity, PointGraphics, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import { Cartesian3, Cartesian2, Color, ScreenSpaceEventType, Viewer } from 'cesium';
import { useAppStore } from '../store/appState';

interface Particle {
  id: number;
  lat: number;
  lon: number;
}

export const SarSimulation: React.FC<{ viewer: Viewer | null }> = ({ viewer }) => {
  const { 
    mode, 
    sarStartPoint, 
    setSarStartPoint, 
    sarSimulationActive,
    sarElapsedTime,
    setSarElapsedTime
  } = useAppStore();

  const [particles, setParticles] = useState<Particle[]>([]);
  const [areaKm2, setAreaKm2] = useState<number>(0);

  // Handle clicks to set start point
  const handleMapClick = (action: { position: Cartesian2 } | { startPosition: Cartesian2; endPosition: Cartesian2 }) => {
    if (mode !== 'SAR_MODE' || !viewer || !('position' in action)) return;
    
    // Convert screen pixel to cartesian3 on the globe
    const cartesian = viewer.camera.pickEllipsoid(action.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      const lon = (cartographic.longitude * 180) / Math.PI;
      const lat = (cartographic.latitude * 180) / Math.PI;
      
      setSarStartPoint(lat, lon);
      
      // Reset simulation state
      setParticles([]);
      setSarElapsedTime(0);
      setAreaKm2(0);
    }
  };

  // Run simulation loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (mode === 'SAR_MODE' && sarSimulationActive && sarStartPoint) {
      // Initialize particles if empty
      if (particles.length === 0) {
        const initialParticles: Particle[] = [];
        for (let i = 0; i < 50; i++) {
          initialParticles.push({ id: i, lat: sarStartPoint.lat, lon: sarStartPoint.lon });
        }
        setParticles(initialParticles);
      }

      // Advection loop (mocking current_u and current_v)
      interval = setInterval(() => {
        setParticles(prev => {
          let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;

          const next = prev.map(p => {
            // Mock currents: mostly moving South-West in this region during winter, with uncertainty
            const u = -0.01 + (Math.random() - 0.5) * 0.015; // lon shift
            const v = -0.008 + (Math.random() - 0.5) * 0.015; // lat shift
            
            const newLat = p.lat + v;
            const newLon = p.lon + u;
            
            minLat = Math.min(minLat, newLat);
            maxLat = Math.max(maxLat, newLat);
            minLon = Math.min(minLon, newLon);
            maxLon = Math.max(maxLon, newLon);
            
            return { ...p, lat: newLat, lon: newLon };
          });

          // Extremely rough area calculation for demo (1 deg ~ 111km)
          const heightKm = (maxLat - minLat) * 111;
          const widthKm = (maxLon - minLon) * 111 * Math.cos((minLat * Math.PI) / 180);
          setAreaKm2(Math.round(heightKm * widthKm));

          return next;
        });

        setSarElapsedTime(prev => prev + 1); // 1 hour per tick
      }, 500); // Update every 500ms
    }

    return () => clearInterval(interval);
  }, [mode, sarSimulationActive, sarStartPoint, particles.length, setSarElapsedTime]);

  // Clear when not in SAR mode
  if (mode !== 'SAR_MODE') return null;

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
          <PointGraphics pixelSize={15} color={Color.RED} outlineColor={Color.WHITE} outlineWidth={2} />
        </Entity>
      )}

      {/* Simulation Particles */}
      {particles.map(p => (
        <Entity key={`sar-p-${p.id}`} position={Cartesian3.fromDegrees(p.lon, p.lat, 0)}>
          <PointGraphics pixelSize={8} color={Color.fromCssColorString('rgba(217, 119, 87, 0.4)')} />
        </Entity>
      ))}

      {/* Readout Overlay */}
      {sarStartPoint && (
        <div className="absolute top-36 right-space-4 bg-surface-overlay/95 backdrop-blur-sm border border-accent-warning p-space-4 rounded shadow-xl z-10 w-64">
          <h3 className="font-bold text-accent-warning mb-2 text-xs uppercase tracking-wider border-b border-border-subtle pb-1">Drift Analysis</h3>
          <dl className="grid grid-cols-2 gap-y-2 text-xs font-mono text-text-muted mt-2">
            <dt>Elapsed Time:</dt>
            <dd className="text-text-primary text-right">{sarElapsedTime} hrs</dd>
            
            <dt>Search Area:</dt>
            <dd className="text-text-primary text-right">{areaKm2.toLocaleString()} km²</dd>
            
            <dt>Intersecting Obs:</dt>
            <dd className="text-accent-interactive text-right">{areaKm2 > 500 ? '1 (Float 1902303)' : '0'}</dd>
          </dl>
        </div>
      )}
    </>
  );
};
