export interface State {
  lat?: number;
  lon?: number;
  time?: string;
  depth?: number;
}

export interface MatchingMetadata {
  method: string;
  requested_lat?: number;
  selected_lat?: number;
  spatial_separation?: number;
  requested_time?: string;
  selected_time?: string;
  temporal_separation?: number;
  requested_depth?: number;
  selected_depth?: number;
}

export interface ObservationMetadata {
  dataset_id: string;
  source: string;
  coordinate_convention: string;
  timestamp_convention: string;
  platform_id: string;
  additional_metadata?: Record<string, any>;
}

export interface Observation {
  id: string;
  type: string;
  lat: number;
  lon: number;
  time: string;
  depth?: number;
  variables?: Record<string, number>;
  metadata?: ObservationMetadata;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface Grid {
  lats: number[];
  lons: number[];
}

export interface ModelFieldMetadata {
  dataset_id: string;
  source: string;
  variable: string;
  source_variable: string;
  units: string;
  coordinate_convention: string;
  timestamp_convention: string;
  requested_state: State;
  selected_state: State;
}

export interface ModelField {
  variable: string;
  units: string;
  time: string;
  depth: number;
  bounds: Bounds;
  grid?: Grid;
  values?: (number | null)[][];
  min: number;
  max: number;
  metadata?: ModelFieldMetadata;
}

export interface ProfileMetadata {
  dataset_id_model: string;
  dataset_id_obs: string;
  matching: MatchingMetadata;
}

export interface ProfileStatistics {
  bias?: number;
  mae?: number;
  rmse?: number;
  valid_count: number;
}

export interface ProfileData {
  modelDepths: number[];
  modelValues: number[];
  observationDepths: number[];
  observationValues: number[];
  metadata?: ProfileMetadata;
  residualDepths?: number[];
  residualValues?: number[];
  statistics?: ProfileStatistics;
}

export interface Provenance {
  observation_dataset: string;
  model_dataset: string;
  model_variables: string[];
  observation_variables: string[];
  observation_dataset_id: string;
  model_dataset_id: string;
  matching_method: string;
  residual_definition: string;
  profile_alignment_method: string;
  dataset_source?: string;
  dataset_version?: string;
  requested_state?: State;
  selected_state?: State;
  calculation_method?: string;
  calculation_parameters?: Record<string, any>;
  units?: string;
  limitations?: string[];
}

export interface Profile1D {
  depths: number[];
  values: number[];
}

export interface DerivedFeature {
  feature_id: string;
  feature_type: string;
  value: number | null;
  unit: string;
  depth: number | null;
  method: string;
  parameters: Record<string, any> | null;
  source_dataset: string;
  source_variables: string[];
  status: string;
  limitations: string[] | null;
}

export interface EvidenceCase {
  id: string;
  observation: Observation;
  model_match: MatchingMetadata;
  observation_profile: Profile1D;
  model_profile: Profile1D;
  residual: Profile1D;
  statistics: ProfileStatistics;
  provenance: Provenance;
  features: DerivedFeature[] | null;
  created_at: string;
  status: string;
}

export interface CurrentVector {
  lat: number;
  lon: number;
  depth: number;
  time: string;
  u: number;
  v: number;
}

export interface SarTrajectoryPoint {
  timestamp: string;
  lat: number;
  lon: number;
  velocity: number;
  direction: number;
}

export interface SarMetadata {
  dataset_id: string;
  u_variable: string;
  v_variable: string;
  integration_method: string;
  timestep: string;
  duration: string;
  starting_position: State;
  known_limitations: string;
  evidence_case_id?: string;
}

export interface SarResponse {
  trajectory: SarTrajectoryPoint[];
  metadata: SarMetadata;
}

export interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ScientificSnapshot {
  id: string;
  created_at: string;
  application_mode: string;
  observation?: Observation;
  evidence_case?: EvidenceCase;
  analytical_cursor?: Record<string, any>;
  selected_state?: State;
  derived_features?: DerivedFeature[];
  response_scenario?: SarResponse;
  provenance?: Provenance;
  version: string;
}
