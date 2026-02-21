## 1. Directory Structure Creation

- [x] 1.1 Create backend/ root directory at project root
- [x] 1.2 Create eight subdirectories: app/, api/, services/, adapters/, models/, schemas/, core/, tests/
- [x] 1.3 Add __init__.py file to each of the eight subdirectories to make them Python packages

## 2. Configuration Files

- [x] 2.1 Create backend/pyproject.toml with project metadata (name: meander-backend, version, python-requires: >=3.9)
- [x] 2.2 Add core dependencies to pyproject.toml: fastapi, uvicorn[standard], pydantic, pydantic-settings
- [x] 2.3 Add testing dependencies to pyproject.toml: pytest, pytest-asyncio, httpx
- [x] 2.4 Create backend/.env.example template with environment variables (TFL_APP_ID, TFL_APP_KEY, DATABASE_URL, REDIS_URL, ENVIRONMENT, LOG_LEVEL)
- [x] 2.5 Create backend/.gitignore with Python exclusions (venv/, __pycache__/, .env, *.pyc, .pytest_cache/, .coverage)

## 3. Application Entry Point

- [x] 3.1 Create backend/app/main.py with FastAPI app instance initialization
- [x] 3.2 Add CORS middleware to FastAPI app in backend/app/main.py (allow localhost origins for development)
- [x] 3.3 Create health check or root endpoint (optional, for verification that app starts)

## 4. Configuration Management

- [x] 4.1 Create backend/app/config.py with Settings class inheriting from pydantic BaseSettings
- [x] 4.2 Add Settings fields: tfl_app_id (Optional[str]), tfl_app_key (Optional[str]), database_url (str, default="sqlite:///./dev.db"), redis_url (str, default="redis://localhost:6379"), environment (str, default="development"), log_level (str, default="info")
- [x] 4.3 Verify Settings class can be instantiated and loads from environment variables

## 5. Core Utilities

- [x] 5.1 Create backend/core/__init__.py (empty, for future core utilities)
- [x] 5.2 Optionally create backend/core/errors.py with error schema matching architecture ({ error: { code, message, details } })
- [x] 5.3 Optionally create backend/core/config.py or keep config in app/config.py (per design decision)

## 6. Test Infrastructure

- [x] 6.1 Create backend/tests/__init__.py
- [x] 6.2 Create backend/tests/conftest.py with pytest fixtures
- [x] 6.3 Add `app` fixture to conftest.py that returns FastAPI test instance
- [x] 6.4 Add `client` fixture to conftest.py that returns AsyncClient for endpoint testing
- [x] 6.5 Create backend/tests/test_structure.py with TDD test for module imports

## 7. TDD Test Implementation

- [x] 7.1 Write failing test in test_structure.py that imports from app.main and app.config
- [x] 7.2 Verify test fails before implementing structure (run pytest backend/tests/test_structure.py)
- [x] 7.3 Implement directory structure and __init__.py files to make imports work
- [x] 7.4 Verify test passes after implementation (run pytest backend/tests/test_structure.py)
- [x] 7.5 Verify all eight directories can be imported successfully

## 8. Verification and Documentation

- [x] 8.1 Run `pytest backend/tests/` to ensure all tests pass
- [x] 8.2 Run `python -m app.main` (or `uvicorn app.main:app --reload`) to verify FastAPI app starts
- [x] 8.3 Verify CORS headers are present when making request to root endpoint (using curl or test client)
- [x] 8.4 Update project README.md with backend setup instructions (optional)
- [x] 8.5 Document PYTHONPATH requirement in README or DEVELOPMENT.md (optional)

## 9. Final Validation

- [x] 9.1 Verify directory structure matches design: backend/app/, backend/api/, backend/services/, backend/adapters/, backend/models/, backend/schemas/, backend/core/, backend/tests/
- [x] 9.2 Verify all __init__.py files exist and are importable
- [x] 9.3 Verify pyproject.toml is valid and dependencies install correctly
- [x] 9.4 Verify .env.example exists with all documented environment variables
- [x] 9.5 Verify .gitignore excludes correct files and allows .env.example
- [x] 9.6 Verify FastAPI app initializes without errors
- [x] 9.7 Verify Settings class loads from environment correctly
- [x] 9.8 Verify pytest fixtures (app, client) work correctly
- [x] 9.9 Verify all tests in test_structure.py pass
- [x] 9.10 Verify import paths work: `from app.main import app`, `from app.config import Settings`
