# VYBE Project History

This document records the major project decisions, implementation phases, and workflow changes that are important for understanding the current VYBE codebase.

It is a project-history record, not a replacement for source code, API contracts, architecture documentation, or Git history.

## Phase 0 — Backend Foundation

- VYBE was established as a Node.js + Express.js backend.
- MongoDB with Mongoose is the database layer.
- Authentication uses JWT and bcryptjs.
- Validation uses Zod.
- Security includes Helmet, CORS, and express-rate-limit.
- The backend follows a Modular Monolith structure under `src/modules/`.
- Domain modules include authentication, users, movies, music, sports, ratings, reviews, collections, watchlist, social, search, recommendations, notifications, and admin.

## Phase 1 — Backend MVP Features

The backend accumulated the following functional areas:

- Movie discovery and details.
- Music entities and discovery.
- Sports entities and discovery.
- Ratings with duplicate-prevention behavior.
- Reviews.
- Collections.
- Watchlist.
- Follow/unfollow social behavior.
- Search.
- Rule-based recommendations and "Surprise Me".
- Notifications.
- Admin user-status management.
- Registration, login, and JWT-protected routes.

The exact current API and model contracts are documented in `docs/API_CONTRACT.md` and `docs/DATABASE.md`.

## Phase 2 — Backend Testing and Reliability Work

- Jest and Supertest integration tests are present.
- MongoDB connectivity is required by the current test setup.
- The currently documented test-environment problem is a connection timeout against `mongodb://127.0.0.1:27017/vybe_test`.
- The project rules explicitly prohibit replacing the existing database strategy with `mongodb-memory-server` merely to bypass this issue.
- Test reliability remains a separate investigation phase.

## Phase 3 — Additional Backend Product Work

Historical VYBE development included additional backend/product work around social behavior, notifications, gamification, wrapped/analytics, recommendations, and related functionality.

Only behavior verified in the current repository should be treated as authoritative. Historical discussion or previous implementation plans must not be assumed to still exist after later changes.

## Phase 4 — Frontend Reset

The previous VYBE frontend was intentionally removed.

Current repository state:

- Backend remains the source of existing server functionality.
- The repository is currently backend-only.
- A new frontend will be rebuilt separately and incrementally.
- The frontend should reuse existing backend contracts rather than unnecessarily rewriting backend functionality.

## Phase 5 — Current Product Direction

The current planned direction is to focus VYBE on:

**Movies + social/community features around movies and pop culture.**

The intended product loop is:

`Discover movie → rate/review → share activity → discover people with similar interests → follow → discuss → discover more`

Planned social/community areas include profiles, follow/followers/following, feed/activity, people discovery, movie discussions, private chat, notifications, and moderation features.

These are planning targets, not statements that all of these features are currently implemented.

Music and Sports development are currently frozen unless explicitly requested.

## Phase 6 — Documentation and AI Context

Project documentation was created under:

- `docs/` for project facts and contracts.
- `ai/` for engineering rules and agent-specific operating guidance.

The documentation is intentionally conservative: unknown or unverified behavior should be marked as such instead of invented.

## Phase 7 — Git Repository Boundary Repair

The original Git repository was accidentally initialized at:

`C:\Users\PREET`

This caused the entire Windows user profile to appear inside Git status.

Investigation confirmed:

- The parent repository had no commits.
- VYBE was not tracked by that parent repository.
- The parent `.git` metadata was backed up to `C:\Users\PREET\vybe-parent-git-backup`.
- The accidental parent Git boundary was removed from `C:\Users\PREET`.
- A new Git repository was initialized at the actual VYBE project root:

`C:\Users\PREET\OneDrive\Desktop\AT\VYBE-master\VYBE-master`

Git must remain scoped to this VYBE directory.

## Phase 8 — ChatGPT + Antigravity Development Workflow

The development workflow was changed from manual prompt copying to a controlled agent workflow:

`User → ChatGPT → Remote Desktop Commander → Windows PC → Antigravity CLI (agy) → VYBE`

ChatGPT acts as the senior technical architect/controller.

Antigravity CLI acts as the coding/implementation agent.

The workflow is:

1. Inspect the existing project.
2. Understand the relevant architecture and contracts.
3. Define a focused implementation scope.
4. Delegate implementation to `agy` when appropriate.
5. Run relevant tests/build/lint/startup checks.
6. Read actual output and errors.
7. Iterate on verified failures.
8. Report exact changes and verification results.
9. Stop before material architectural decisions unless explicitly approved.

Antigravity CLI version verified during setup: `1.2.14`.

## Current State

At the time this history was created:

- Backend exists and is documented.
- Frontend is intentionally absent and will be rebuilt page-by-page.
- Git is correctly scoped to the VYBE repository.
- Project documentation exists under `docs/` and `ai/`.
- The MongoDB/Jest test-environment issue remains to be investigated.
- No frontend implementation should begin until the current workflow reaches the frontend-foundation phase.

## How to Maintain This File

Add a dated entry for every major project phase or architectural/workflow decision.

Each entry should include:

- Date.
- Phase/task.
- What changed.
- Why it changed.
- Verification result.
- Important constraints or follow-up work.

Do not use this file as a substitute for Git commits. Git records code state; this file records project history and decisions.

## Phase 9 � MongoDB/Jest Investigation (Step 4)

Date: 2026-10-01

The test failure was investigated without changing the database strategy or application source code.

Findings:
- Windows MongoDB service is running.
- MongoDB is listening on 127.0.0.1:27017.
- The configured MongoDB server uses bindIp 127.0.0.1 and port 27017.
- Direct Node.js + Mongoose connection to the test database succeeds.
- Loading src/app.js and then connecting directly with Mongoose also succeeds.
- npm test still fails inside Jest during the beforeAll() Mongoose connection.
- An isolated temporary Jest diagnostic connection also failed to complete.
- MongoDB logs show the Jest process reaches the MongoDB listener, but those connections end without completing the expected test connection.

Conclusion:
The issue is no longer best described as MongoDB being unavailable. Evidence currently points to the Jest execution environment / Mongoose interaction. No production database strategy was changed and no permanent diagnostic test was retained.

Next step: isolate the Jest/Mongoose runtime interaction and identify a minimal, architecture-preserving fix.

## Phase 10 � Jest/Mongoose Fix (Step 4.5)

Date: 2026-10-01

The Jest/Mongoose connection issue was fixed without replacing the MongoDB strategy.

Root cause isolation:
- TCP connectivity from Jest to 127.0.0.1:27017 worked.
- Direct Node.js MongoDB driver and Mongoose connections worked.
- The default Jest runner stalled during the MongoDB driver connection path.
- A focused test using jest-light-runner completed successfully, confirming the runner environment was the relevant boundary.

Implementation:
- Added jest-light-runner 0.8.1 as a development dependency.
- Configured Jest to use the light runner.
- Added tests/setup.js containing non-production test fixtures for JWT configuration.
- Configured a 30-second Jest timeout centrally.

Verification:
- npm test -- --runInBand --no-cache: PASS � 1 suite, 5 tests.
- npm test -- --no-cache: PASS � 1 suite, 5 tests.
- No application production database code was changed.
- No mongodb-memory-server was introduced or used.

The repository is now ready for a clean Git baseline before frontend work proceeds.
