# AI Engineering Rules & Contract

Future AI agents operating on VYBE must strictly adhere to the following constraints:

## 1. General Principles
1. **Inspect Before Modifying**: Always read relevant existing source code before creating new files or applying changes.
2. **Minimal Blast Radius**: Do not modify unrelated modules or duplicate functionality.
3. **No Secrets**: Never expose JWT secrets, API keys, passwords, or `.env` values in code, logs, or documentation.
4. **Stop for Decisions**: Ask the user before making decisions that materially affect architecture, security, data loss, cost, or user-visible behavior.

## 2. Architecture Constraints
1. **Preserve Architecture**: The backend architecture is a strictly organized Modular Monolith (`src/modules/*`). Preserve this unless explicitly instructed otherwise.
2. **Module Integrity**: Do not rewrite working modules unnecessarily. Do not assume all modules have identical structures.
3. **API Contracts**: Preserve existing API routes, methods, and payload structures unless explicitly instructed to change them.
4. **Dependencies**: Do not introduce unnecessary libraries, frameworks, or dependencies.

## 3. Current Project Constraints
- **Frozen Modules**: The Music and Sports modules are considered functionally complete for this MVP and are currently frozen unless explicitly requested.
- **Frontend Setup**: Frontend UI creation is deferred to a separate rebuild phase.
- **ML / Algorithmic**: Do not introduce machine learning or heavy recommendation architectures unless requested. The current recommendation logic is rule-based.
- **Test Workarounds**: Do not change the database connection strategy merely to make tests pass. Specifically, do not introduce `mongodb-memory-server` as a shortcut for the current MongoDB connection timeout issue.

## 4. Verification Requirements
- Verify all changes with tests, linting, type checks, or startup scripts.
- Report exact verification results.
- **Never claim a feature is complete without verifying it.**
