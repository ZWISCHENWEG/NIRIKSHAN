import numpy as np
from typing import List, Dict, Any, Optional

def detect_mld_temperature(depths: List[float], temps: List[float], ref_depth=10.0, threshold=0.2) -> Optional[Dict[str, Any]]:
    """
    Detects MLD using temperature threshold.
    Finds first depth where |T(z) - T_ref| >= threshold.
    """
    if not depths or not temps or len(depths) != len(temps):
        return None
        
    ref_idx = None
    for i, z in enumerate(depths):
        t = temps[i]
        if z >= ref_depth and t is not None and not np.isnan(t):
            ref_idx = i
            break
            
    if ref_idx is None:
        return None
        
    t_ref = temps[ref_idx]
    
    for i in range(ref_idx + 1, len(depths)):
        t = temps[i]
        if t is None or np.isnan(t):
            continue
            
        if abs(t - t_ref) >= threshold:
            return {
                "depth": depths[i],
                "reference_temperature": t_ref,
                "threshold_exceeded": abs(t - t_ref)
            }
            
    return None
