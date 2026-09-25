export interface Observation {
  id: string;
  type: string;
  lat: number;
  lon: number;
  time: string;
  depth?: number;
  variables?: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface ModelField {
  variable: string;
  units: string;
  time: string;
  depth: number;
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  grid?: { lats: number[]; lons: number[] };
  values?: number[][];
  min: number;
  max: number;
  metadata?: Record<string, any>;
}

export interface ProfileData {
  depths: number[];
  modelValues: number[];
  observationValues: number[];
}

export interface CurrentVector {
  lat: number;
  lon: number;
  depth: number;
  time: string;
  u: number;
  v: number;
}
