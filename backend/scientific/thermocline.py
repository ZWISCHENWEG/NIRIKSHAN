import numpy as np
from typing import List, Dict, Any, Optional

def detect_thermocline(grad_depths: List[float], grad_values: List[float], min_depth=0.0, max_depth=300.0) -> Optional[Dict[str, Any]]:
    """
    Detects thermocline as the depth of maximum |dT/dz| within search window.
    """
    if not grad_depths or not grad_values or len(grad_depths) != len(grad_values):
        return None
        
    valid_indices = [
        i for i, z in enumerate(grad_depths)
        if min_depth <= z <= max_depth and not np.isnan(grad_values[i])
    ]
    
    if not valid_indices:
        return None
        
    max_idx = max(valid_indices, key=lambda i: abs(grad_values[i]))
    
    return {
        "depth": grad_depths[max_idx],
        "value": grad_values[max_idx]
    }
