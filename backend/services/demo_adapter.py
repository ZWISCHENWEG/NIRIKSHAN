import json
import os
import random
from typing import List, Optional
from models.data_models import Observation, ModelField, ProfileData, Bounds
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
                metadata={"data_mode": obs.get("data_mode")}
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
            max=max_val
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
            depths=[float(d) for d in depths],
            modelValues=model_values,
            observationValues=obs_values
        )
