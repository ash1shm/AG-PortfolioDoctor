import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def sample_input():
    return {
        "holdings": [
            {"ticker": "AAPL", "weight": 25},
            {"ticker": "MSFT", "weight": 25},
            {"ticker": "AMZN", "weight": 25},
            {"ticker": "GOOGL", "weight": 25}
        ]
    }

def test_analyze_success(sample_input):
    response = client.post("/api/analyze", json=sample_input)
    if response.status_code != 200:
        print(f"Error response: {response.json()}")
    assert response.status_code == 200
    data = response.json()
    # Basic checks
    assert "diversification" in data
    assert "risk_profile" in data
    assert "simulation" in data
    assert "rebalancing_suggestions" in data
