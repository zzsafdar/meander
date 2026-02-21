## Why

The project currently has no backend foundation. To build the London itinerary planner's API services (routing, places, geocoding, itinerary orchestration), we need a consistent, scalable project structure that follows FastAPI best practices. This establishes the foundation for all subsequent backend development, enabling developers to easily add new components and discover existing ones.

## What Changes

- Create `backend/` directory with 8 subdirectories: `app/`, `api/`, `services/`, `adapters/`, `models/`, `schemas/`, `core/`, `tests/`
- Set up Python package structure with `__init__.py` files in all directories
- Create `backend/pyproject.toml` with FastAPI dependencies (fastapi, uvicorn, pydantic, pytest)
- Create `backend/app/main.py` as FastAPI application entrypoint with CORS middleware
- Create `backend/app/config.py` for environment-based configuration using pydantic-settings
- Create `backend/.env.example` template for environment variables (TfL keys, DB URLs, Redis URL)
- Create `backend/.gitignore` for Python-specific ignores
- Create `backend/tests/conftest.py` with pytest fixtures for test app/client
- Create `backend/tests/test_structure.py` with TDD test verifying all module imports succeed
- Follow TDD approach: write failing test first, implement structure to make it pass

## Capabilities

### New Capabilities
- `backend-structure`: Provides the foundational project layout and Python package structure for the FastAPI backend service

### Modified Capabilities
- (None - this is new foundation work)

## Impact

- Creates the backend module structure as a monorepo-ready directory (`backend/`)
- Establishes Python 3.9+ compatibility with modern dependency management via pyproject.toml
- Sets up CORS middleware for future web app integration
- Provides import path conventions: `from app.main import app`, `from app.config import Settings`
- Enables subsequent tickets: MEA-27 (Postgres models), MEA-37 (API endpoints), MEA-34 (itinerary engine), MEA-32 (external adapters)
- Dependencies: fastapi, uvicorn[standard], pydantic, pydantic-settings, pytest, pytest-asyncio, httpx
