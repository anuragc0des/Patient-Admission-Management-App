from fastapi.testclient import TestClient

from app.config.options import PATIENT_OPTIONS
from app.main import app


def test_options_endpoint_returns_frontend_shape():
    with TestClient(app) as client:
        response = client.get("/api/options")

    assert response.status_code == 200
    assert response.json() == PATIENT_OPTIONS
    assert set(response.json()) == {"gender", "ward", "department", "doctor"}
    assert all(response.json()[key] for key in response.json())


def test_localhost_and_loopback_origins_are_allowed():
    origins = app.user_middleware[0].kwargs["allow_origins"]
    assert "http://localhost:5173" in origins
    assert "http://127.0.0.1:5173" in origins


def test_vite_fallback_port_is_allowed_by_cors():
    with TestClient(app) as client:
        response = client.get(
            "/api/options",
            headers={"Origin": "http://localhost:5174"},
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5174"
