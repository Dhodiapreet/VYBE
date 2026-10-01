# Architecture

## Paradigm
VYBE follows a **Modular Monolith Architecture**. The application is a single Node.js/Express.js backend, but functionality is strictly separated into domain-specific modules.

## Directory Structure
```text
src/
├── config/       # Database and environment configurations
├── middleware/   # Cross-cutting concerns (auth.middleware, error.middleware)
├── modules/      # Independent domain boundaries
├── utils/        # Shared helpers (ApiError, apiResponse, asyncHandler, seed.js)
└── app.js        # Express application assembly (mounts middleware and routes)
```

## Module Responsibilities (src/modules/)
- **admin**: Manages users and user statuses (Admin role only).
- **auth**: Handles user registration, login, and `/me` endpoints.
- **collections**: User-created lists mixing Movies, Songs, and Matches.
- **movies**: Movie discovery and creation (Admin only).
- **music**: Access to Songs, Artists, and Albums.
- **notifications**: User alerts and read-status tracking.
- **ratings**: Tracks user ratings on Movies, Songs, and Matches.
- **recommendations**: Algorithmic and randomized content suggestions.
- **reviews**: Text reviews for Movies, Songs, Albums, Artists, Matches.
- **search**: Unified global search endpoint.
- **social**: Following/unfollowing entities (Users, Artists, Teams, Players).
- **sports**: Matches, Teams, and Players access.
- **users**: Central User model and schema definitions.
- **watchlist**: Movie-specific "save for later" functionality.

## Layering per Module
Each module generally follows a standard separation of concerns:
- `*.routes.js`: Maps HTTP methods/paths to controller functions and applies middleware (e.g., `protect`, `authorize`).
- `*.controller.js`: Request/response handling, validation, business logic orchestration.
- `*.model.js`: Mongoose schema definitions, indexes, pre/post hooks, and virtuals.
- `*.service.js` (Optional): Advanced business logic (e.g., seen in `auth`).

## App.js Configuration
- Initializes Express.
- Mounts security middlewares: Helmet, CORS, Rate Limiting (100req/15m).
- Sets body parsers (JSON & URL-encoded up to 10mb).
- Defines base health check (`/api/v1/health`).
- Mounts all module routes.
- Defines 404 fallback and central error handler.
