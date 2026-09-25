#!/usr/bin/env bash
# Requires copernicusmarine CLI to be installed: `pip install copernicusmarine`
# Requires Copernicus Marine account (register for free at marine.copernicus.eu)

# Log in before running this command:
# copernicusmarine login

echo "Downloading GLORYS12V1 subset for the Bay of Bengal (Jan 1-10 2024)..."

copernicusmarine subset \
  --dataset-id cmems_mod_glo_phy_my_0.083deg_P1D-m \
  --variable thetao \
  --variable uo \
  --variable vo \
  --start-datetime "2024-01-01T00:00:00" \
  --end-datetime "2024-01-10T23:59:59" \
  --minimum-longitude 75.0 \
  --maximum-longitude 100.0 \
  --minimum-latitude 5.0 \
  --maximum-latitude 25.0 \
  --output-filename "glorys12v1_bob_202401.nc" \
  --output-directory . \
  --force-download

echo "Download complete."
