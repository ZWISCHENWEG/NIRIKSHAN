from abc import ABC, abstractmethod
from typing import List, Optional
from models.data_models import Observation, ModelField, ProfileData, SarTrajectoryPoint

class DataAdapter(ABC):
    @abstractmethod
    def get_observations(self, bbox: Optional[str] = None, time: Optional[str] = None) -> List[Observation]:
        pass

    @abstractmethod
    def get_model_field(self, variable: str, depth: float, time: Optional[str] = None) -> ModelField:
        pass
        
    @abstractmethod
    def get_profile(self, lat: float, lon: float, time: Optional[str] = None) -> ProfileData:
        pass

    @abstractmethod
    def get_sar_drift(self, lat: float, lon: float, time: Optional[str] = None, hours: int = 72) -> 'SarResponse':
        pass
