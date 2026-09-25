import type { Observation, ModelField, ProfileData } from './types';

export interface DataAdapter {
  getObservations(bbox?: string, time?: string): Promise<Observation[]>;
  getModelField(variable: string, depth: number, time: string): Promise<ModelField>;
  getProfile(lat: number, lon: number, time?: string): Promise<ProfileData>;
}
