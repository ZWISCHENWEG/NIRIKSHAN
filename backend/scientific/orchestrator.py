from typing import List, Dict, Any, Optional
from models.data_models import ProfileData, DerivedFeature
import scientific.gradients as gradients
import scientific.thermocline as thermocline
import scientific.mixed_layer as mixed_layer
import scientific.currents as currents
import scientific.shear as shear

def calculate_all_features(profile_data: ProfileData) -> List[DerivedFeature]:
    features: List[DerivedFeature] = []
    
    depths = profile_data.modelDepths
    temps = profile_data.modelValues
    u_vals = profile_data.model_u_values or []
    v_vals = profile_data.model_v_values or []
    
    if not depths:
        return features
        
    # Temperature Gradient
    grad_depths, grad_values = gradients.calculate_temperature_gradient(depths, temps)
    
    # Thermocline
    thermocline_result = thermocline.detect_thermocline(grad_depths, grad_values)
    if thermocline_result:
        features.append(DerivedFeature(
            feature_id="thermocline_depth",
            feature_type="thermocline",
            value=thermocline_result["depth"],
            unit="m",
            depth=thermocline_result["depth"],
            method="Maximum absolute temperature gradient",
            parameters={"search_window": "0-300m", "max_gradient": thermocline_result["value"]},
            source_dataset="glorys12v1",
            source_variables=["thetao"],
            status="valid",
            limitations=["Requires valid temperature gradient profile within search window"]
        ))
        
    # Mixed Layer Depth
    mld_result = mixed_layer.detect_mld_temperature(depths, temps)
    if mld_result:
        features.append(DerivedFeature(
            feature_id="mixed_layer_depth",
            feature_type="mld",
            value=mld_result["depth"],
            unit="m",
            depth=mld_result["depth"],
            method="Temperature threshold from reference depth",
            parameters={"reference_depth": 10.0, "threshold": 0.2, "reference_temperature": mld_result["reference_temperature"]},
            source_dataset="glorys12v1",
            source_variables=["thetao"],
            status="valid",
            limitations=["Uses temperature only; density-based calculation unavailable"]
        ))
        
    # Current vector at surface (or nearest to surface)
    if u_vals and v_vals and len(u_vals) == len(depths) and len(v_vals) == len(depths):
        # Surface current
        surface_idx = None
        for i, d in enumerate(depths):
            if u_vals[i] is not None and v_vals[i] is not None:
                surface_idx = i
                break
                
        if surface_idx is not None:
            u_surf = u_vals[surface_idx]
            v_surf = v_vals[surface_idx]
            speed, direction = currents.calculate_current_vector(u_surf, v_surf)
            
            if speed is not None and direction is not None:
                features.append(DerivedFeature(
                    feature_id="surface_current_speed",
                    feature_type="current_speed",
                    value=speed,
                    unit="m/s",
                    depth=depths[surface_idx],
                    method="sqrt(u^2 + v^2)",
                    parameters={"u": u_surf, "v": v_surf},
                    source_dataset="glorys12v1",
                    source_variables=["uo", "vo"],
                    status="valid"
                ))
                
                features.append(DerivedFeature(
                    feature_id="surface_current_direction",
                    feature_type="current_direction",
                    value=direction,
                    unit="°",
                    depth=depths[surface_idx],
                    method="Direction of motion from North",
                    parameters={"u": u_surf, "v": v_surf},
                    source_dataset="glorys12v1",
                    source_variables=["uo", "vo"],
                    status="valid",
                    limitations=["0=North, 90=East"]
                ))
                
        # Current shear
        shear_depths, du, dv, shear_mags = shear.calculate_current_shear(depths, u_vals, v_vals)
        if shear_mags:
            # Find max shear
            max_idx = shear_mags.index(max(shear_mags))
            features.append(DerivedFeature(
                feature_id="max_current_shear",
                feature_type="current_shear",
                value=shear_mags[max_idx],
                unit="(m/s)/m",
                depth=shear_depths[max_idx],
                method="Maximum vertical shear magnitude",
                parameters={"du_dz": du[max_idx], "dv_dz": dv[max_idx]},
                source_dataset="glorys12v1",
                source_variables=["uo", "vo"],
                status="valid"
            ))

    return features
