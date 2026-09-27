import numpy as np
from typing import List, Tuple

def calculate_temperature_gradient(depths: List[float], temps: List[float]) -> Tuple[List[float], List[float]]:
    """
    Calculates dT/dz using adjacent points.
    Returns (gradient_depths, gradient_values).
    """
    if len(depths) < 2 or len(temps) < 2 or len(depths) != len(temps):
        return [], []
    
    grad_depths = []
    grad_values = []
    
    for i in range(len(depths) - 1):
        z1, z2 = depths[i], depths[i+1]
        t1, t2 = temps[i], temps[i+1]
        
        if z1 is None or z2 is None or t1 is None or t2 is None or np.isnan(z1) or np.isnan(z2) or np.isnan(t1) or np.isnan(t2):
            continue
            
        dz = z2 - z1
        if dz == 0:
            continue
            
        dt = t2 - t1
        grad_values.append(dt / dz)
        grad_depths.append((z1 + z2) / 2.0)
        
    return grad_depths, grad_values
