import os
import math
import numpy as np
import xarray as xr
from typing import List, Optional
from datetime import datetime, timedelta

from models.data_models import (
    Observation, ModelField, ProfileData, Bounds, Grid, SarTrajectoryPoint,
    ObservationMetadata, ModelFieldMetadata, State, ProfileMetadata, MatchingMetadata,
    SarResponse, SarMetadata
)
from services.data_adapter import DataAdapter
from services.dataset_registry import DATASETS, VARIABLE_MAPPING

class NetCDFAdapter(DataAdapter):
    def __init__(self):
        self.glorys_ds = None
        self.argo_ds = None
        self._obs_cache = None
        self._profile_cache = {}
        
        glorys_path = DATASETS["glorys12v1"]["path"]
        argo_path = DATASETS["argo"]["path"]
        
        if os.path.exists(glorys_path):
            self.glorys_ds = xr.open_dataset(glorys_path)
        if os.path.exists(argo_path):
            self.argo_ds = xr.open_dataset(argo_path)
            
    def get_observations(self, bbox: Optional[str] = None, time: Optional[str] = None) -> List[Observation]:
        if self._obs_cache is not None:
            return self._obs_cache
            
        if self.argo_ds is None:
            return []
            
        ds = self.argo_ds
        obs_list = []
        
        max_obs = 100
        num_rows = len(ds.row)
        step = max(1, num_rows // max_obs)
        
        for i in range(0, num_rows, step):
            lat = float(ds.latitude[i].values)
            lon = float(ds.longitude[i].values)
            
            if np.isnan(lat) or np.isnan(lon):
                continue
                
            t_val = ds.time[i].values
            t_str = str(t_val)
            if 'T' not in t_str:
                t_str = t_str + 'T00:00:00'
                
            platform_id = str(ds.platform_number[i].values)
            metadata = ObservationMetadata(
                dataset_id="argo",
                source=DATASETS["argo"]["source"],
                coordinate_convention="latitude=degrees north, longitude=degrees east",
                timestamp_convention="ISO/UTC",
                platform_id=platform_id,
                additional_metadata={"data_mode": str(ds.data_mode[i].values)}
            )
                
            obs_list.append(Observation(
                id=f"argo_{i}",
                type="argo",
                lat=lat,
                lon=lon,
                time=t_str,
                metadata=metadata
            ))
            if len(obs_list) >= max_obs:
                break
                
        self._obs_cache = obs_list
        return obs_list

    def get_model_field(self, variable: str, depth: float, time: Optional[str] = None) -> ModelField:
        if self.glorys_ds is None:
            raise ValueError("GLORYS dataset not found")
            
        ds = self.glorys_ds
        
        req_state = State(depth=depth)
        if time:
            req_state.time = time
            try:
                t_dt = np.datetime64(time.replace('Z', ''))
                ds_sel = ds.sel(time=t_dt, method="nearest")
            except:
                ds_sel = ds.isel(time=0)
        else:
            ds_sel = ds.isel(time=0)
            
        ds_sel = ds_sel.sel(depth=depth, method="nearest")
        
        var_name = 'thetao' if variable == 'temperature' else variable
        if var_name not in ds_sel.data_vars:
            var_name = 'thetao'
            
        data_var = ds_sel[var_name]
        
        step = 4
        sub_lats = data_var.latitude.values[::step]
        sub_lons = data_var.longitude.values[::step]
        vals = data_var.values[::step, ::step]
        
        clean_vals = np.where(np.isnan(vals), None, vals).tolist()
        
        valid_vals = vals[~np.isnan(vals)]
        min_val = float(np.nanmin(vals)) if len(valid_vals) > 0 else 0.0
        max_val = float(np.nanmax(vals)) if len(valid_vals) > 0 else 0.0
        
        actual_time = str(data_var.time.values)
        if 'T' not in actual_time:
            actual_time += 'T00:00:00'
            
        selected_state = State(
            time=actual_time,
            depth=float(data_var.depth.values)
        )
        
        metadata = ModelFieldMetadata(
            dataset_id="glorys12v1",
            source=DATASETS["glorys12v1"]["source"],
            variable=variable,
            source_variable=var_name,
            units=data_var.attrs.get("units", "unknown"),
            coordinate_convention="latitude=degrees north, longitude=degrees east, depth=positive downward",
            timestamp_convention="ISO/UTC",
            requested_state=req_state,
            selected_state=selected_state
        )
            
        return ModelField(
            variable=var_name,
            units=data_var.attrs.get("units", "unknown"),
            time=actual_time,
            depth=float(data_var.depth.values),
            bounds=Bounds(
                minLat=float(sub_lats.min()),
                maxLat=float(sub_lats.max()),
                minLon=float(sub_lons.min()),
                maxLon=float(sub_lons.max())
            ),
            grid=Grid(
                lats=[float(x) for x in sub_lats],
                lons=[float(x) for x in sub_lons]
            ),
            values=clean_vals,
            min=min_val,
            max=max_val,
            metadata=metadata
        )
        
    def get_profile(self, lat: float, lon: float, time: Optional[str] = None) -> ProfileData:
        cache_key = f"{lat}_{lon}_{time}"
        if cache_key in self._profile_cache:
            return self._profile_cache[cache_key]
            
        model_depths = []
        model_values = []
        model_u_values = []
        model_v_values = []
        obs_depths = []
        obs_values = []
        
        req_time = time
        sel_time_model = None
        sel_time_obs = None
        sel_lat_model = None
        sel_lon_model = None
        sel_lat_obs = None
        sel_lon_obs = None
        
        if self.glorys_ds is not None:
            ds = self.glorys_ds
            if time:
                try:
                    t_dt = np.datetime64(time.replace('Z', ''))
                    ds_sel = ds.sel(time=t_dt, method="nearest")
                except:
                    ds_sel = ds.isel(time=0)
            else:
                ds_sel = ds.isel(time=0)
                
            profile = ds_sel.sel(latitude=lat, longitude=lon, method="nearest")
            
            sel_time_model = str(profile.time.values)
            sel_lat_model = float(profile.latitude.values)
            sel_lon_model = float(profile.longitude.values)
            
            theta = profile['thetao'].values
            d = profile['depth'].values
            u_vals = profile['uo'].values if 'uo' in profile else [None]*len(d)
            v_vals = profile['vo'].values if 'vo' in profile else [None]*len(d)
            
            for depth_val, t_val, u_val, v_val in zip(d, theta, u_vals, v_vals):
                if not np.isnan(depth_val):
                    model_depths.append(float(depth_val))
                    model_values.append(float(t_val) if not np.isnan(t_val) else None)
                    model_u_values.append(float(u_val) if u_val is not None and not np.isnan(u_val) else None)
                    model_v_values.append(float(v_val) if v_val is not None and not np.isnan(v_val) else None)
                    
        if self.argo_ds is not None:
            ds_argo = self.argo_ds
            lat_diff = np.abs(ds_argo.latitude.values - lat)
            lon_diff = np.abs(ds_argo.longitude.values - lon)
            dist = lat_diff + lon_diff
            
            dist_clean = np.where(np.isnan(dist), np.inf, dist)
            
            if len(dist_clean) > 0 and not np.isinf(dist_clean).all():
                closest_idx = int(np.argmin(dist_clean))
                p_num = ds_argo.platform_number[closest_idx].values
                t_val = ds_argo.time[closest_idx].values
                
                sel_time_obs = str(t_val)
                sel_lat_obs = float(ds_argo.latitude[closest_idx].values)
                sel_lon_obs = float(ds_argo.longitude[closest_idx].values)
                
                mask = (ds_argo.platform_number.values == p_num) & (ds_argo.time.values == t_val)
                
                raw_depths = ds_argo.pres.values[mask]
                raw_temps = ds_argo.temp.values[mask]
                
                for dp, tp in zip(raw_depths, raw_temps):
                    if not np.isnan(dp) and not np.isnan(tp):
                        obs_depths.append(float(dp))
                        obs_values.append(float(tp))
        
        # Calculate spatial separation if available
        spatial_sep = None
        if sel_lat_model is not None and sel_lat_obs is not None:
            spatial_sep = math.sqrt((sel_lat_model - sel_lat_obs)**2 + (sel_lon_model - sel_lon_obs)**2)
            
        temporal_sep = None
        if sel_time_model is not None and sel_time_obs is not None:
            try:
                dt_mod = np.datetime64(sel_time_model.replace('Z', ''))
                dt_obs = np.datetime64(sel_time_obs.replace('Z', ''))
                diff = dt_obs - dt_mod
                temporal_sep = float(diff / np.timedelta64(1, 'h'))
            except:
                pass

        residual_depths = []
        residual_values = []
        statistics = None

        if len(obs_depths) > 0 and len(model_depths) > 0:
            model_depths_arr = np.array(model_depths)
            for od, ov in zip(obs_depths, obs_values):
                idx = (np.abs(model_depths_arr - od)).argmin()
                nearest_mv = model_values[idx]
                residual_depths.append(od)
                if nearest_mv is not None:
                    residual_values.append(ov - nearest_mv) # residual = observation - model
                else:
                    residual_values.append(None)
                
        if len(residual_values) > 0:
            valid_res = [r for r in residual_values if r is not None]
            if len(valid_res) > 0:
                res_arr = np.array(valid_res)
                from models.data_models import ProfileStatistics
                statistics = ProfileStatistics(
                    bias=float(np.mean(res_arr)),
                    mae=float(np.mean(np.abs(res_arr))),
                    rmse=float(np.sqrt(np.mean(res_arr**2))),
                    valid_count=len(res_arr)
                )

        matching_meta = MatchingMetadata(
            method="nearest-neighbor",
            requested_lat=lat,
            selected_lat=sel_lat_model, # returning model as primary selected
            spatial_separation=spatial_sep,
            requested_time=req_time,
            selected_time=sel_time_model,
            temporal_separation=temporal_sep
        )
        
        metadata = ProfileMetadata(
            dataset_id_model="glorys12v1",
            dataset_id_obs="argo",
            matching=matching_meta
        )
        
        result = ProfileData(
            modelDepths=model_depths,
            modelValues=model_values,
            observationDepths=obs_depths,
            observationValues=obs_values,
            metadata=metadata,
            residualDepths=residual_depths if residual_depths else None,
            residualValues=residual_values if residual_values else None,
            statistics=statistics,
            model_u_values=model_u_values,
            model_v_values=model_v_values
        )
        
        self._profile_cache[cache_key] = result
        return result

    def get_sar_drift(self, lat: float, lon: float, time: Optional[str] = None, hours: int = 72) -> SarResponse:
        if self.glorys_ds is None:
            return SarResponse(
                trajectory=[],
                metadata=SarMetadata(
                    dataset_id="unknown",
                    u_variable="unknown",
                    v_variable="unknown",
                    integration_method="unknown",
                    timestep="unknown",
                    duration="0",
                    starting_position=State(lat=lat, lon=lon, time=time),
                    known_limitations="Dataset unavailable."
                )
            )
            
        ds = self.glorys_ds
        try:
            current_time = np.datetime64(time.replace('Z', '')) if time else ds.time.values[0]
        except:
            current_time = ds.time.values[0]
            
        if current_time < ds.time.values[0]:
            current_time = ds.time.values[0]
        if current_time > ds.time.values[-1]:
            current_time = ds.time.values[-1]
            
        trajectory = []
        current_lat = lat
        current_lon = lon
        
        for h in range(hours):
            try:
                point = ds.sel(
                    time=current_time, 
                    latitude=current_lat, 
                    longitude=current_lon, 
                    depth=0.5, 
                    method="nearest"
                )
                
                u = float(point.uo.values)
                v = float(point.vo.values)
                
                if np.isnan(u) or np.isnan(v):
                    u, v = 0.0, 0.0
                    
            except KeyError:
                u, v = 0.0, 0.0

            dx = u * 3600
            dy = v * 3600
            
            dlat = dy / 111000.0
            dlon = dx / (111000.0 * math.cos(math.radians(current_lat)))
            
            current_lat += dlat
            current_lon += dlon
            
            speed = math.sqrt(u**2 + v**2)
            direction = math.degrees(math.atan2(v, u))
            if direction < 0:
                direction += 360
                
            ts_str = str(current_time)
            if 'T' not in ts_str:
                ts_str += 'T00:00:00'
                
            trajectory.append(SarTrajectoryPoint(
                timestamp=ts_str + "Z",
                lat=current_lat,
                lon=current_lon,
                velocity=speed,
                direction=direction
            ))
            
            current_time = current_time + np.timedelta64(1, 'h')
            if current_time > ds.time.values[-1]:
                current_time = ds.time.values[-1]
                
        metadata = SarMetadata(
            dataset_id="glorys12v1",
            u_variable="uo",
            v_variable="vo",
            integration_method="Euler forward step",
            timestep="1h",
            duration=f"{hours}h",
            starting_position=State(lat=lat, lon=lon, time=time),
            known_limitations="Surface currents only, no windage or leeway physics, nearest-neighbor matching."
        )
                
        return SarResponse(
            trajectory=trajectory,
            metadata=metadata
        )
