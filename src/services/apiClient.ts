import type { Observation, ProfileData, ModelField } from './types';

const API_BASE_URL = '/api';

export const apiClient = {
  getObservations: async (bbox?: string, time?: string): Promise<Observation[]> => {
    const params = new URLSearchParams();
    if (bbox) params.append('bbox', bbox);
    if (time) params.append('time', time);
    const qs = params.toString() ? `?${params.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/observations${qs}`);
    if (!response.ok) throw new Error('Failed to fetch observations');
    return response.json();
  },

  getProfile: async (lat: number, lon: number, time?: string): Promise<ProfileData> => {
    const params = new URLSearchParams();
    params.append('lat', lat.toString());
    params.append('lon', lon.toString());
    if (time) params.append('time', time);
    
    const response = await fetch(`${API_BASE_URL}/profile?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },
  
  getModelField: async (variable: string, depth: number, time?: string): Promise<ModelField> => {
    const params = new URLSearchParams();
    params.append('variable', variable);
    params.append('depth', depth.toString());
    if (time) params.append('time', time);
    
    const response = await fetch(`${API_BASE_URL}/model-field?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch model field');
    return response.json();
  }
};
