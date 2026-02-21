## ADDED Requirements

### Requirement: Backend directory structure exists
The system SHALL provide a complete backend directory structure with eight core directories: app/, api/, services/, adapters/, models/, schemas/, core/, and tests/.

#### Scenario: Verify all backend directories exist
- **WHEN** developer inspects the backend/ directory
- **THEN** eight directories MUST exist: app/, api/, services/, adapters/, models/, schemas/, core/, tests/

#### Scenario: Verify each directory is a Python package
- **WHEN** developer inspects each subdirectory
- **THEN** each directory MUST contain an __init__.py file

### Requirement: Python package configuration
The system SHALL provide pyproject.toml with project metadata and dependency definitions for FastAPI, testing, and configuration management.

#### Scenario: Verify pyproject.toml exists and is valid
- **WHEN** developer reads backend/pyproject.toml
- **THEN** the file MUST define project metadata (name, version, python version)
- **AND** MUST include dependencies: fastapi, uvicorn[standard], pydantic, pydantic-settings, pytest, pytest-asyncio, httpx
- **AND** MUST specify Python 3.9+ compatibility

#### Scenario: Verify dependencies can be installed
- **WHEN** developer runs `pip install -e backend/` (or `poetry install` if using poetry)
- **THEN** all dependencies MUST install successfully
- **AND** no version conflicts MUST occur

### Requirement: FastAPI application entrypoint
The system SHALL provide a FastAPI application initialized in backend/app/main.py with CORS middleware for cross-origin requests from frontend clients.

#### Scenario: Verify FastAPI app initializes
- **WHEN** developer imports `from app.main import app`
- **THEN** the import MUST succeed without errors
- **AND** the returned object MUST be an instance of FastAPI

#### Scenario: Verify CORS middleware is configured
- **WHEN** developer inspects app.main.app.middleware
- **THEN** CORSMiddleware MUST be present
- **AND** MUST allow origins for development (localhost)

### Requirement: Environment configuration
The system SHALL provide environment-based configuration using pydantic-settings with support for API keys, database URLs, and application settings.

#### Scenario: Verify Settings class exists
- **WHEN** developer imports `from app.config import Settings`
- **THEN** the import MUST succeed
- **AND** Settings MUST be a pydantic BaseSettings subclass

#### Scenario: Verify Settings loads from environment
- **WHEN** developer creates Settings() instance with environment variables set
- **THEN** Settings MUST load values from environment variables
- **AND** MUST provide type-safe access to settings (e.g., settings.tfl_app_id)

#### Scenario: Verify .env.example template exists
- **WHEN** developer reads backend/.env.example
- **THEN** the file MUST list all required environment variables with documentation
- **AND** MUST include: TFL_APP_ID, TFL_APP_KEY, DATABASE_URL, REDIS_URL, ENVIRONMENT, LOG_LEVEL

### Requirement: Testing infrastructure
The system SHALL provide pytest configuration with fixtures for the FastAPI test app and test client, following TDD principles.

#### Scenario: Verify test fixtures exist
- **WHEN** developer inspects backend/tests/conftest.py
- **THEN** `app` fixture MUST exist that provides FastAPI test instance
- **AND** `client` fixture MUST exist that provides AsyncClient for endpoint testing

#### Scenario: Verify structure test exists and fails initially
- **WHEN** developer runs `pytest backend/tests/test_structure.py`
- **THEN** test MUST fail initially (before structure is implemented)
- **AND** test MUST verify that all modules can be imported
- **AND** test MUST verify that FastAPI app initializes correctly

### Requirement: Import path convention
The system SHALL support import paths using the convention `from app.main import app`, `from app.config import Settings`, etc., requiring PYTHONPATH to include backend/.

#### Scenario: Verify imports work from any test file
- **WHEN** test file imports `from app.main import app` and `from app.config import Settings`
- **THEN** imports MUST succeed (assuming PYTHONPATH is set correctly)

#### Scenario: Verify pytest configuration includes backend/ in path
- **WHEN** developer inspects pytest configuration (pyproject.toml or pytest.ini)
- **THEN** configuration MUST include backend/ in Python search path
- **OR** MUST instruct pytest to run from backend/ directory

### Requirement: Python version compatibility
The system SHALL target Python 3.9+ compatibility, documented in pyproject.toml, and must not use Python 3.10+ specific features.

#### Scenario: Verify Python version specified
- **WHEN** developer reads backend/pyproject.toml
- **THEN** python_requires or equivalent field MUST specify ">=3.9"
- **AND** project README or documentation MUST note Python 3.9+ compatibility

#### Scenario: Verify no Python 3.10+ features used
- **WHEN** code review or linting tools inspect backend/ code
- **THEN** no match/case statements (Python 3.10+) MUST be present
- **AND** no other Python 3.10+ exclusive features MUST be used

### Requirement: Git configuration
The system SHALL provide .gitignore that excludes Python-specific artifacts and environment files.

#### Scenario: Verify .gitignore exists with proper exclusions
- **WHEN** developer reads backend/.gitignore
- **THEN** file MUST exclude: venv/, __pycache__/, .env, *.pyc, .pytest_cache/, .coverage
- **AND** MUST preserve .env.example for documentation
