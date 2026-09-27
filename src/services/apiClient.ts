import type { Observation, ProfileData, ModelField, SarResponse, ApiError, EvidenceCase } from './types';

const API_BASE_URL = '/api';

const requestCache = new Map<string, { data: any, timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithHandling<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = requestCache.get(url);
  
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }
  
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }

  const promise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Failed to fetch. Status: ${response.status}`);
        }
        throw new Error(errorData.message || 'API Error');
      }
      const data = await response.json();
      requestCache.set(url, { data, timestamp: Date.now() });
      return data;
    } finally {
      pendingRequests.delete(url);
    }
  })();
  
  pendingRequests.set(url, promise);
  return promise;
}

export const apiClient = {
  getObservations: async (bbox?: string, time?: string): Promise<Observation[]> => {
    const params = new URLSearchParams();
    if (bbox) params.append('bbox', bbox);
    if (time) params.append('time', time);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchWithHandling<Observation[]>(`${API_BASE_URL}/observations${qs}`);
  },

  getProfile: async (lat: number, lon: number, time?: string): Promise<ProfileData> => {
    const params = new URLSearchParams();
    params.append('lat', lat.toString());
    params.append('lon', lon.toString());
    if (time) params.append('time', time);
    return fetchWithHandling<ProfileData>(`${API_BASE_URL}/profile?${params.toString()}`);
  },
  
  getEvidence: async (observationId: string): Promise<EvidenceCase> => {
    return fetchWithHandling<EvidenceCase>(`${API_BASE_URL}/evidence/${observationId}`);
  },
  
  getModelField: async (variable: string, depth: number, time?: string): Promise<ModelField> => {
    const params = new URLSearchParams();
    params.append('variable', variable);
    params.append('depth', depth.toString());
    if (time) params.append('time', time);
    return fetchWithHandling<ModelField>(`${API_BASE_URL}/model-field?${params.toString()}`);
  },

  getSarDrift: async (lat: number, lon: number, time?: string, hours: number = 72): Promise<SarResponse> => {
    const params = new URLSearchParams();
    params.append('lat', lat.toString());
    params.append('lon', lon.toString());
    if (time) params.append('time', time);
    params.append('hours', hours.toString());
    return fetchWithHandling<SarResponse>(`${API_BASE_URL}/sar/drift?${params.toString()}`);
  }
};
