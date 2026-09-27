import numpy as np
from typing import List, Tuple

def calculate_current_shear(depths: List[float], us: List[float], vs: List[float]) -> Tuple[List[float], List[float], List[float], List[float]]:
    """
    Returns grad_depths, du_dz_vals, dv_dz_vals, shear_mags
    """
    if len(depths) < 2 or len(us) < 2 or len(vs) < 2 or len(depths) != len(us) or len(depths) != len(vs):
        return [], [], [], []
        
    grad_depths = []
    du_dz_vals = []
    dv_dz_vals = []
    shear_mags = []
    
    for i in range(len(depths) - 1):
        z1, z2 = depths[i], depths[i+1]
        u1, u2 = us[i], us[i+1]
        v1, v2 = vs[i], vs[i+1]
        
        if (np.isnan(z1) or np.isnan(z2) or 
            u1 is None or u2 is None or np.isnan(u1) or np.isnan(u2) or 
            v1 is None or v2 is None or np.isnan(v1) or np.isnan(v2)):
            continue
            
        dz = z2 - z1
        if dz == 0:
            continue
            
        du_dz = (u2 - u1) / dz
        dv_dz = (v2 - v1) / dz
        mag = np.sqrt(du_dz**2 + dv_dz**2)
        
        grad_depths.append((z1 + z2) / 2.0)
        du_dz_vals.append(du_dz)
        dv_dz_vals.append(dv_dz)
        shear_mags.append(mag)
        
    return grad_depths, du_dz_vals, dv_dz_vals, shear_mags
