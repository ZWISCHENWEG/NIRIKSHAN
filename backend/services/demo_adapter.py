import json
import os
import random
from typing import List, Optional
from models.data_models import Observation, ModelField, ProfileData, Bounds, SarTrajectoryPoint, SarResponse, ObservationMetadata, ProfileMetadata, MatchingMetadata, ModelFieldMetadata, State, ProfileStatistics
from services.data_adapter import DataAdapter

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

class DemoDataAdapter(DataAdapter):
    def get_observations(self, bbox: Optional[str] = None, time: Optional[str] = None) -> List[Observation]:
        data = load_json("argo_demo.json")
        obs_list = []
        for obs in data.get("observations", []):
            obs_list.append(Observation(
                id=obs["platform_id"],
                type=obs["obs_type"],
                lat=obs["lat"],
                lon=obs["lon"],
                time=obs["time"],
                metadata=ObservationMetadata(
                    dataset_id="demo_argo",
                    source="demo",
                    coordinate_convention="lat/lon",
                    timestamp_convention="iso",
                    platform_id=obs["platform_id"],
                    additional_metadata={"data_mode": obs.get("data_mode")}
                )
            ))
        return obs_list

    def get_model_field(self, variable: str, depth: float, time: Optional[str] = None) -> ModelField:
        data = load_json("hycom_demo.json")
        bbox = data["bbox"]
        grid_values = data.get("grid", [])
        
        flat_vals = [val for row in grid_values for val in row]
        min_val = min(flat_vals) if flat_vals else 0.0
        max_val = max(flat_vals) if flat_vals else 0.0
        
        return ModelField(
            variable=data.get("variable", variable),
            units=data.get("units", ""),
            time=data.get("time", time or "2024-01-01T00:00:00Z"),
            depth=data.get("depth", depth),
            bounds=Bounds(
                minLat=bbox["min_lat"],
                maxLat=bbox["max_lat"],
                minLon=bbox["min_lon"],
                maxLon=bbox["max_lon"]
            ),
            values=grid_values,
            min=min_val,
            max=max_val,
            metadata=ModelFieldMetadata(
                dataset_id="demo_hycom",
                source="demo",
                variable=variable,
                source_variable=variable,
                units=data.get("units", ""),
                coordinate_convention="lat/lon",
                timestamp_convention="iso",
                requested_state=State(lat=0, lon=0, depth=depth, time=time),
                selected_state=State(lat=0, lon=0, depth=data.get("depth", depth), time=data.get("time", time or "2024-01-01T00:00:00Z"))
            )
        )

    def get_profile(self, lat: float, lon: float, time: Optional[str] = None) -> ProfileData:
        depths = list(range(0, 2000, 50))
        
        model_values = []
        for d in depths:
            if d < 100:
                model_values.append(28.0)
            elif d < 1000:
                model_values.append(28.0 - (d - 100) * 0.02)
            else:
                model_values.append(10.0 - (d - 1000) * 0.005)
                
        obs_values = [v + random.uniform(-0.5, 0.5) if v > 15 else v + random.uniform(-0.1, 0.1) for v in model_values]
        
        return ProfileData(
            modelDepths=[float(d) for d in depths],
            modelValues=model_values,
            observationDepths=[float(d) for d in depths],
            observationValues=obs_values,
            residualDepths=[float(d) for d in depths],
            residualValues=[ov - mv for ov, mv in zip(obs_values, model_values)],
            statistics=ProfileStatistics(
                bias=0.1,
                mae=0.15,
                rmse=0.2,
                valid_count=len(depths)
            ),
            metadata=ProfileMetadata(
                dataset_id_model="demo_model",
                dataset_id_obs="demo_obs",
                matching=MatchingMetadata(
                    method="demo",
                    requested_lat=lat,
                    selected_lat=lat,
                    requested_time=time,
                    selected_time=time
                )
            )
        )

    def get_sar_drift(self, lat: float, lon: float, time: Optional[str] = None, hours: int = 72) -> SarResponse:
        from datetime import datetime, timedelta
        
        try:
            start_time = datetime.fromisoformat(time.replace('Z', '+00:00')) if time else datetime(2024, 1, 1)
        except ValueError:
            start_time = datetime(2024, 1, 1)
            
        trajectory = []
        current_lat = lat
        current_lon = lon
        
        for h in range(hours):
            # Mock drift (mostly South-West)
            u = -0.01 + (random.random() - 0.5) * 0.015
            v = -0.008 + (random.random() - 0.5) * 0.015
            
            current_lat += v
            current_lon += u
            
            speed = (u**2 + v**2)**0.5
            direction = 225.0 # Mock SW
            
            trajectory.append(SarTrajectoryPoint(
                timestamp=(start_time + timedelta(hours=h)).isoformat() + "Z",
                lat=current_lat,
                lon=current_lon,
                velocity=speed,
                direction=direction
            ))
            
        from models.data_models import SarResponse, SarMetadata, State
        
        return SarResponse(
            trajectory=trajectory,
            metadata=SarMetadata(
                dataset_id="demo_sar",
                u_variable="mock_u",
                v_variable="mock_v",
                integration_method="euler",
                timestep="1h",
                duration=f"{hours}h",
                starting_position=State(lat=lat, lon=lon, time=time),
                known_limitations="This is mock data."
            )
        )
