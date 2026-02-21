def test_imports_work(app_fixture):
    """Verify all modules can be imported without errors."""
    from app.main import app
    from app.config import Settings

    assert app is not None
    assert Settings is not None


def test_fastapi_app_initializes(app_fixture):
    """Verify FastAPI app initializes correctly."""
    from app.main import app

    assert app.title == "Meander API"
    assert app.version == "0.1.0"


def test_settings_loads_from_environment(app_fixture):
    """Verify Settings class can be instantiated."""
    from app.config import Settings

    settings = Settings()

    assert settings.environment == "development"
    assert settings.log_level == "info"
    assert settings.database_url is not None
