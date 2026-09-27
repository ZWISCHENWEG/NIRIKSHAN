import type { DerivedFeature } from '../../services/types';

export interface WaterColumnDepthLayer {
  depth: number;
  modelTemperature: number | null;
  observationTemperature: number | null;
  residualTemperature: number | null;
  u: number | null;
  v: number | null;
  currentSpeed: number | null;
  currentDirection: number | null;
  features: DerivedFeature[];
}

export interface WaterColumnData {
  layers: WaterColumnDepthLayer[];
  surfaceFeatures: DerivedFeature[];
  bottomFeatures: DerivedFeature[];
}
