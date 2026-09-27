import os
from fastapi.testclient import TestClient
from main import app, data_adapter

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_readiness_check():
    response = client.get("/ready")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "ready"
    assert "mode" in json_data
    
    # We should have datasets populated in netcdf mode
    if json_data["mode"] == "netcdf":
        assert "glorys12v1" in json_data["datasets"]
        assert "argo" in json_data["datasets"]
