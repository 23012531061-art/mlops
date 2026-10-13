from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_prediction():
    payload = {
        "area": 2000,
        "bedrooms": 3,
        "bathrooms": 2,
        "age": 10,
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert "predicted_price" in data
    assert isinstance(data["predicted_price"], float)


def test_invalid_prediction():
    payload = {
        "area": -100,
        "bedrooms": 3,
        "bathrooms": 2,
        "age": 10,
    }

    response = client.post("/predict", json=payload)
    assert response.status_code == 422
