from typing import List, Dict

FEATURE_REGISTRY: Dict[str, Dict] = {
    "temperature_gradient": {
        "public_name": "Temperature Vertical Gradient",
        "source_variables": ["thetao"],
        "unit": "°C/m",
        "calculation_method": "Vertical derivative (dT/dz)",
        "required_data": ["Temperature profile with actual depth coordinates"],
        "implemented": True
    },
    "thermocline_depth": {
        "public_name": "Thermocline Depth",
        "source_variables": ["thetao"],
        "unit": "m",
        "calculation_method": "Maximum absolute temperature gradient",
        "required_data": ["Temperature gradient profile", "Valid search window"],
        "implemented": True
    },
    "mixed_layer_depth": {
        "public_name": "Mixed Layer Depth",
        "source_variables": ["thetao"],
        "unit": "m",
        "calculation_method": "Temperature threshold from reference depth",
        "required_data": ["Temperature profile", "Reference depth (10m)", "Threshold (0.2°C)"],
        "implemented": True
    },
    "current_speed": {
        "public_name": "Current Speed",
        "source_variables": ["uo", "vo"],
        "unit": "m/s",
        "calculation_method": "sqrt(u^2 + v^2)",
        "required_data": ["Valid uo and vo components"],
        "implemented": True
    },
    "current_direction": {
        "public_name": "Current Direction",
        "source_variables": ["uo", "vo"],
        "unit": "°",
        "calculation_method": "Direction of motion (atan2(u,v)*180/pi) from North",
        "required_data": ["Valid uo and vo components"],
        "implemented": True
    },
    "current_shear": {
        "public_name": "Current Shear",
        "source_variables": ["uo", "vo"],
        "unit": "(m/s)/m",
        "calculation_method": "Vertical derivative of u and v",
        "required_data": ["Valid uo and vo profiles with actual depth coordinates"],
        "implemented": True
    }
}
