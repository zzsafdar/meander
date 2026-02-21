import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def app_fixture():
    return app


@pytest.fixture
def client(app_fixture):
    return TestClient(app_fixture)
