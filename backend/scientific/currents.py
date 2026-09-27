import numpy as np
from typing import Optional, Tuple

def calculate_current_vector(u: float, v: float) -> Tuple[Optional[float], Optional[float]]:
    """
    Calculates speed and direction of motion (degrees clockwise from North).
    Direction: 0=North, 90=East, 180=South, 270=West.
    """
    if u is None or v is None or np.isnan(u) or np.isnan(v):
        return None, None
        
    speed = np.sqrt(u**2 + v**2)
    angle = np.degrees(np.arctan2(u, v))
    direction = (angle + 360.0) % 360.0
    
    return float(speed), float(direction)
