import math
import pytest
from scientific.gradients import calculate_temperature_gradient
from scientific.thermocline import detect_thermocline
from scientific.mixed_layer import detect_mld_temperature
from scientific.currents import calculate_current_vector
from scientific.shear import calculate_current_shear

def test_temperature_gradient():
    depths = [0.0, 10.0, 20.0, 30.0]
    temps = [25.0, 25.0, 20.0, 15.0]
    
    grad_depths, grad_values = calculate_temperature_gradient(depths, temps)
    
    assert len(grad_depths) == 3
    assert grad_depths == [5.0, 15.0, 25.0]
    assert grad_values == [0.0, -0.5, -0.5]

def test_detect_thermocline():
    grad_depths = [5.0, 15.0, 25.0, 50.0]
    grad_values = [-0.1, -0.5, -1.2, -0.2]
    
    res = detect_thermocline(grad_depths, grad_values, min_depth=0.0, max_depth=100.0)
    assert res is not None
    assert res["depth"] == 25.0
    assert res["value"] == -1.2
    
def test_detect_thermocline_out_of_bounds():
    grad_depths = [5.0, 15.0, 25.0, 350.0]
    grad_values = [-0.1, -0.5, -1.2, -5.0]
    
    res = detect_thermocline(grad_depths, grad_values, min_depth=0.0, max_depth=300.0)
    assert res is not None
    assert res["depth"] == 25.0
    assert res["value"] == -1.2

def test_detect_mld_temperature():
    depths = [0.0, 5.0, 10.0, 20.0, 30.0, 40.0]
    temps = [25.5, 25.5, 25.4, 25.3, 25.1, 24.0]
    
    # Reference at 10m is 25.4
    # Threshold 0.2 means T <= 25.2
    # At 30m T=25.1, diff=0.3
    
    res = detect_mld_temperature(depths, temps, ref_depth=10.0, threshold=0.2)
    assert res is not None
    assert res["depth"] == 30.0
    assert res["reference_temperature"] == 25.4
    assert math.isclose(res["threshold_exceeded"], 0.3)

def test_calculate_current_vector():
    # u=1, v=0 -> East -> 90 degrees
    speed, dir_c = calculate_current_vector(1.0, 0.0)
    assert speed == 1.0
    assert dir_c == 90.0
    
    # u=0, v=1 -> North -> 0 degrees
    speed, dir_c = calculate_current_vector(0.0, 1.0)
    assert speed == 1.0
    assert dir_c == 0.0
    
    # u=-1, v=0 -> West -> 270 degrees
    speed, dir_c = calculate_current_vector(-1.0, 0.0)
    assert speed == 1.0
    assert dir_c == 270.0
    
    # u=0, v=-1 -> South -> 180 degrees
    speed, dir_c = calculate_current_vector(0.0, -1.0)
    assert speed == 1.0
    assert dir_c == 180.0

def test_calculate_current_shear():
    depths = [0.0, 10.0, 20.0]
    us = [1.0, 0.5, 0.0]
    vs = [0.0, 0.0, 0.0]
    
    z, du, dv, mag = calculate_current_shear(depths, us, vs)
    
    assert z == [5.0, 15.0]
    assert du == [-0.05, -0.05]
    assert dv == [0.0, 0.0]
    assert mag == [0.05, 0.05]
