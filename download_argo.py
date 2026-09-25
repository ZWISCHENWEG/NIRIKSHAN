import urllib.parse
import urllib.request
import sys
import os

argo_url_base = "https://erddap.ifremer.fr/erddap/tabledap/ArgoFloats.nc"
query = (
    "data_mode,latitude,longitude,position_qc,time,time_qc,direction,"
    "platform_number,pres,pres_qc,pres_adjusted,pres_adjusted_qc,"
    "temp,temp_qc,temp_adjusted,temp_adjusted_qc,"
    "psal,psal_qc,psal_adjusted,psal_adjusted_qc"
    "&latitude>=5&latitude<=25"
    "&longitude>=75&longitude<=100"
    "&time>=2024-01-01T00:00:00Z&time<=2024-01-10T23:59:59Z"
)
url = f"{argo_url_base}?{urllib.parse.quote(query, safe='=&')}"

out_path = "../backend/data/scientific/argo_bob.nc"
print(f"Downloading Argo data from {url}")
try:
    urllib.request.urlretrieve(url, out_path)
    print(f"Success! Saved to {out_path} ({os.path.getsize(out_path)} bytes)")
except Exception as e:
    print(f"Failed: {e}")
