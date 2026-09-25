import os
import json
import httpx
import asyncio

# Bay of Bengal Bounding Box
BBOX = {
    "min_lat": 5.0,
    "max_lat": 25.0,
    "min_lon": 75.0,
    "max_lon": 100.0
}

TIME_RANGE = {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-10T00:00:00Z"
}

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

async def fetch_argo_data():
    """
    Fetch Argo profile metadata from Ifremer ERDDAP for the specified bbox and time range.
    For the demo, we fetch a simplified subset.
    """
    print("Fetching Argo data from Ifremer ERDDAP...")
    
    # ERDDAP URL for Argo floats
    url = "https://erddap.ifremer.fr/erddap/tabledap/ArgoFloats.json"
    
    # Constructing query
    query = f"?platform_number,time,latitude,longitude,platform_type,data_mode&latitude>={BBOX['min_lat']}&latitude<={BBOX['max_lat']}&longitude>={BBOX['min_lon']}&longitude<={BBOX['max_lon']}&time>={TIME_RANGE['start']}&time<={TIME_RANGE['end']}&distinct()"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url + query, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
            # Format nicely
            observations = []
            if "table" in data and "rows" in data["table"]:
                for row in data["table"]["rows"]:
                    obs = {
                        "platform_id": row[0],
                        "time": row[1],
                        "lat": row[2],
                        "lon": row[3],
                        "obs_type": row[4] if row[4] else "Argo",
                        "data_mode": row[5]
                    }
                    observations.append(obs)
            
            # Save to JSON
            out_file = os.path.join(DATA_DIR, "argo_demo.json")
            with open(out_file, "w") as f:
                json.dump({"observations": observations}, f, indent=2)
            print(f"Saved {len(observations)} Argo observations to {out_file}")
            
        except Exception as e:
            print(f"Error fetching Argo data: {e}")
            # Stub some demo data if ERDDAP is down or flaky
            print("Writing stub Argo data as fallback...")
            stub_data = {
                "observations": [
                    {"platform_id": "1902303", "time": "2024-01-05T12:00:00Z", "lat": 15.5, "lon": 85.2, "obs_type": "Argo", "data_mode": "R"},
                    {"platform_id": "1902304", "time": "2024-01-06T12:00:00Z", "lat": 12.1, "lon": 90.5, "obs_type": "Argo", "data_mode": "R"},
                    {"platform_id": "5906212", "time": "2024-01-02T12:00:00Z", "lat": 8.5, "lon": 82.1, "obs_type": "Glider", "data_mode": "D"}
                ]
            }
            out_file = os.path.join(DATA_DIR, "argo_demo.json")
            with open(out_file, "w") as f:
                json.dump(stub_data, f, indent=2)

async def fetch_hycom_data():
    """
    In a real scenario, this would use xarray to subset HYCOM THREDDS.
    For the sake of this prototype and speed, we will generate a JSON payload 
    representing a 3D grid slice for the Bay of Bengal.
    """
    print("Generating HYCOM subset data for Bay of Bengal...")
    
    # We will stub the 3D grid for the frontend to render
    # Real implementation:
    # ds = xr.open_dataset('http://tds.hycom.org/thredds/dodsC/GLBy0.08/expt_93.0')
    # subset = ds.sel(lon=slice(75, 100), lat=slice(5, 25), time='2024-01-05', depth=0)
    # subset.to_netcdf(...)
    
    # Generate mock grid matching Bay of Bengal bounds
    grid_data = {
        "bbox": BBOX,
        "resolution": 1.0,
        "variable": "temperature",
        "units": "degC",
        "time": "2024-01-05T12:00:00Z",
        "depth": 0,
        "grid": []
    }
    
    # Simple temperature gradient (warmer south, cooler north)
    import math
    for lat in range(int(BBOX["min_lat"]), int(BBOX["max_lat"])+1):
        row = []
        for lon in range(int(BBOX["min_lon"]), int(BBOX["max_lon"])+1):
            # Temp range 26 - 30 based on latitude (lower lat = warmer)
            base_t = 30.0 - ((lat - 5) * 0.2)
            # Add some sine wave noise
            noise = math.sin(lon) * 0.5
            row.append(round(base_t + noise, 2))
        grid_data["grid"].append(row)
        
    out_file = os.path.join(DATA_DIR, "hycom_demo.json")
    with open(out_file, "w") as f:
        json.dump(grid_data, f, indent=2)
    print(f"Saved HYCOM grid to {out_file}")

async def main():
    await asyncio.gather(
        fetch_argo_data(),
        fetch_hycom_data()
    )

if __name__ == "__main__":
    asyncio.run(main())
