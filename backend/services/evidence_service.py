import datetime
import uuid
from typing import Optional
from services.netcdf_adapter import NetCDFAdapter
from models.data_models import EvidenceCase, Provenance, Profile1D
from scientific.orchestrator import calculate_all_features

class EvidenceService:
    def __init__(self, data_adapter: NetCDFAdapter):
        self.data_adapter = data_adapter
        
    def get_evidence_case(self, observation_id: str) -> Optional[EvidenceCase]:
        # 1. locate the real observation
        # Because we don't have a direct get_observation_by_id in adapter, we'll fetch all and filter
        # In a real app this would be a DB/indexed query, but for now we iterate
        all_obs = self.data_adapter.get_observations()
        obs = next((o for o in all_obs if o.id == observation_id), None)
        
        if not obs:
            return None
            
        # 2. resolve its actual state
        lat = obs.lat
        lon = obs.lon
        time = obs.time
        
        # 3. match it against GLORYS, 4. load model profile, 5. load obs profile, 6. align depths, 7. residuals, 8. statistics
        # The data adapter's get_profile already does all of this.
        profile_data = self.data_adapter.get_profile(lat, lon, time)
        
        if not profile_data or not profile_data.metadata or not profile_data.statistics:
            return None
            
        # 9. assemble provenance
        provenance = Provenance(
            observation_dataset="Argo floats",
            model_dataset="Copernicus GLORYS12V1",
            model_variables=["thetao"],
            observation_variables=["temp"],
            observation_dataset_id="argo",
            model_dataset_id="glorys12v1",
            matching_method="nearest_neighbor",
            residual_definition="observation - model",
            profile_alignment_method="nearest_available_depth",
            limitations=[
                "nearest-neighbor spatial matching",
                "nearest-neighbor temporal matching",
                "nearest-depth profile alignment",
                "no vertical interpolation"
            ]
        )
        
        # 10. return one coherent EvidenceCase
        return EvidenceCase(
            id=str(uuid.uuid4()),
            observation=obs,
            model_match=profile_data.metadata.matching,
            observation_profile=Profile1D(
                depths=profile_data.observationDepths,
                values=profile_data.observationValues
            ),
            model_profile=Profile1D(
                depths=profile_data.modelDepths,
                values=profile_data.modelValues
            ),
            residual=Profile1D(
                depths=profile_data.residualDepths or [],
                values=profile_data.residualValues or []
            ),
            statistics=profile_data.statistics,
            provenance=provenance,
            features=calculate_all_features(profile_data),
            created_at=datetime.datetime.utcnow().isoformat() + "Z",
            status="Complete"
        )
