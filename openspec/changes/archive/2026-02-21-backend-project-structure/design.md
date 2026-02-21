## Context

The Meander app currently has only documentation and Linear tickets with no backend implementation. This change establishes the foundational backend structure as a monorepo-ready component. The backend will eventually integrate with a Next.js web app, React Native mobile app, Postgres database, Redis cache, and external APIs (TfL, OSRM, Overpass, Nominatim). Python 3.9 is the target environment.

## Goals / Non-Goals

**Goals:**
- Create a scalable, maintainable FastAPI project structure that supports future growth
- Establish clear separation of concerns (API layer, business logic, external integrations, data models)
- Set up TDD workflow with pytest and test fixtures from day one
- Enable easy integration with frontend clients via CORS
- Provide configuration management for environment variables

**Non-Goals:**
- Implementing actual API endpoints (comes in MEA-37, MEA-34)
- Setting up Postgres or Redis (comes in MEA-27)
- Implementing external API adapters (comes in MEA-32)
- Implementing business logic (comes in MEA-34)

## Decisions

### 1. Monorepo Structure with backend/ Directory

**Decision:** Place backend at `backend/` root, not mixed with other apps.

**Rationale:**
- Supports multiple apps (web, mobile) in same repository
- Clear separation between backend and frontend concerns
- Industry standard for multi-app projects
- Easy to add web/ and mobile/ directories later

**Alternatives considered:**
- Backend at repository root: Would conflict with web/mobile app structure
- Separate repository: Overkill for early-stage project, adds coordination overhead

### 2. Directory Layout: 8-Core Structure

**Decision:** Use `app/`, `api/`, `services/`, `adapters/`, `models/`, `schemas/`, `core/`, `tests/`

**Rationale:**
- `app/`: Application entrypoint, config, FastAPI initialization - keeps startup logic separate
- `api/`: Route handlers - thin layer that delegates to services
- `services/`: Business logic - orchestrator, routing, places, geocoding services live here
- `adapters/`: External integrations - TfL, OSRM, Overpass, Nominatim adapters isolated here
- `models/`: SQLAlchemy database models - data persistence layer
- `schemas/`: Pydantic validation schemas - request/response contracts
- `core/`: Shared utilities - config, error handling, caching, logging
- `tests/`: All test code co-located with implementation

**Alternatives considered:**
- Fewer directories (e.g., merging api/ into app/): Less clear separation as app grows
- More directories (e.g., separate db/, utils/): Unnecessary complexity for MVP

### 3. Import Path Convention: PYTHONPATH Configuration

**Decision:** Imports use `from app.main import app` pattern, requiring PYTHONPATH to include `backend/`

**Rationale:**
- Standard FastAPI practice for multi-file projects
- Clearer import paths without `backend.` prefix everywhere
- Works naturally with pytest discovery when PYTHONPATH is set

**Alternatives considered:**
- `from backend.app.main import app`: Verbose, couples imports to directory structure
- Install as editable package (`pip install -e .`): Additional setup step, overkill

**Implementation:** Set PYTHONPATH in pytest configuration and development environment

### 4. Configuration: pydantic-settings with .env Files

**Decision:** Use pydantic-settings for environment-based configuration with .env.example template

**Rationale:**
- Type-safe configuration (pydantic validates at startup)
- Environment variable standard for 12-factor apps
- .env.example shows what's needed without committing secrets
- Future-proof for database URLs, API keys, feature flags

**Alternatives considered:**
- Hardcoded config: Not production-ready, can't vary between environments
- os.getenv() scattered everywhere: No type safety, easy to miss required vars
- Separate config management library: Overkill for MVP

**Environment variables to define:**
- `TFL_APP_ID`, `TFL_APP_KEY`: TfL Journey Planner API credentials
- `DATABASE_URL`: Postgres connection string (for future use)
- `REDIS_URL`: Redis connection string (for future use)
- `ENVIRONMENT`: development/staging/production
- `LOG_LEVEL`: debug/info/warning/error

### 5. CORS Middleware Pre-Configuration

**Decision:** Add CORS middleware in app/main.py from the start, even though web app doesn't exist yet

**Rationale:**
- Web app (Next.js) will call backend - avoiding CORS errors later
- Allows local development with different ports (backend on 8000, web on 3000)
- Minimal overhead to configure now vs debugging later
- Standard practice for API services with browser clients

**Configuration:** Allow localhost origins for development, restrict in production

### 6. Testing: TDD with pytest + conftest.py

**Decision:** Write failing test first (`test_structure.py`), then implement structure to make it pass

**Rationale:**
- Validates import structure actually works
- Catches circular import issues early
- Establishes test-driven development culture from day one
- `conftest.py` provides reusable fixtures for future tests (test app, test client)

**Test scope:**
- Verify all modules import without errors
- Verify FastAPI app initializes correctly
- Verify Settings class loads from environment

**Alternatives considered:**
- Skip tests now, add later: Loses TDD benefits, structure may have issues
- Comprehensive tests now: Overkill for structural work

### 7. Python 3.9 Compatibility

**Decision:** Target Python 3.9+ (current environment), document in pyproject.toml

**Rationale:**
- Your local environment is Python 3.9.6
- FastAPI and all dependencies support 3.9
- Reasonable minimum version for modern Python features
- Future-proof to upgrade to 3.10+ when convenient

**Constraint:** No use of Python 3.10+ features like match/case statements

### 8. Dependency Management: pyproject.toml

**Decision:** Use modern pyproject.toml for dependency management, not requirements.txt or setup.py

**Rationale:**
- Standard Python packaging format (PEP 621)
- Consolidates build system, dependencies, metadata
- Better IDE support and tooling integration
- Modern best practice over requirements.txt

**Core dependencies:**
- `fastapi`: Web framework
- `uvicorn[standard]`: ASGI server with standard extras
- `pydantic`: Validation
- `pydantic-settings`: Environment configuration
- `pytest`: Testing framework
- `pytest-asyncio`: Async test support
- `httpx`: Async HTTP client for testing FastAPI endpoints

## Risks / Trade-offs

### Risk: Circular Imports as App Grows
**Risk:** As services, models, and adapters are added, circular imports may emerge (e.g., `app/main.py` needs `services/orchestrator.py` which needs `models/itinerary.py`)

**Mitigation:**
- Keep API layer thin: route handlers delegate, don't import business logic directly
- Use dependency injection pattern in FastAPI (inject services rather than importing)
- Lazy imports where necessary (import inside functions)
- Document import patterns in `README.md` or architectural guidelines

### Risk: PYTHONPATH Configuration Friction
**Risk:** Developers may forget to set PYTHONPATH, causing import errors

**Mitigation:**
- Add PYTHONPATH to `.env.example` with clear comments
- Configure pytest to automatically include backend/ in path via `pytest.ini` or `pyproject.toml`
- Document in setup instructions: "source .env" or export PYTHONPATH
- Consider adding a dev script (make dev, npm-style scripts) that sets environment

### Risk: Structure Over-Engineering
**Risk:** 8 directories may be overkill for early-stage project with minimal code

**Trade-off:** More directories now vs restructure later
- Current: Some directories empty initially
- Alternative: Start with fewer directories, restructure as app grows
- **Decision:** Structure now - restructure is more expensive than empty directories

### Risk: Future Schema Migrations
**Risk:** When Postgres is added (MEA-27), alembic/ directory will be needed

**Mitigation:**
- Note this in design documentation
- Add alembic/ when starting Postgres work (MEA-27)
- No action needed now - this is known future work

## Migration Plan

### Deployment Steps
1. Create backend/ directory structure with all subdirectories
2. Add __init__.py files to make directories Python packages
3. Create pyproject.toml with dependencies and project metadata
4. Create .env.example template with documented environment variables
5. Create .gitignore for Python-specific files (venv/, __pycache__/, .env)
6. Create app/main.py with FastAPI initialization and CORS middleware
7. Create app/config.py with Settings class using pydantic-settings
8. Create tests/conftest.py with pytest fixtures (app, client)
9. Create tests/test_structure.py with failing TDD test
10. Implement structure until test passes (verify imports work)
11. Run `pytest tests/test_structure.py` to verify success

### Rollback Strategy
- Delete backend/ directory entirely (git clean -fd)
- No database or external systems affected (pure local structure)
- Git revert if committed

## Open Questions

1. **Should backend/ be an installable package?**
   - Currently: No, use PYTHONPATH approach
   - Alternative: `pip install -e .` for editable install
   - Decision: Defer - PYTHONPATH is simpler for now, can add package install later

2. **What should the minimum Python version be?**
   - Current: 3.9 (your environment)
   - Future consideration: Upgrade to 3.10+ for match/case, better type unions
   - Decision: 3.9 is fine for MVP, note in pyproject.toml

3. **Should we include Alembic now for future Postgres migrations?**
   - Current: No, defer to MEA-27
   - Rationale: No database models yet, migrations not needed
   - Decision: Add when starting Postgres work

4. **Should we pre-configure Redis client?**
   - Current: No, defer to MEA-27 or later
   - Rationale: No caching needs yet in MEA-48
   - Decision: Add Redis when implementing caching (likely MEA-34 or MEA-32)
