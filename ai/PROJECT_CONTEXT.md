# VYBE Project Context for AI Agents

## Purpose

This file is the compact historical and operational context that an AI coding agent should read before making substantial changes to VYBE.

For authoritative implementation details, inspect the actual source code and consult the more specific documents under `docs/` and `ai/`.

## Current Repository

Project root:

`C:\Users\PREET\OneDrive\Desktop\AT\VYBE-master\VYBE-master`

Backend stack:

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Zod
- Helmet
- CORS
- express-rate-limit
- Jest + Supertest

Architecture:

**Modular Monolith**

`src/modules/*` contains domain-specific backend modules. Preserve this architecture unless the user explicitly approves an architectural change.

## Current Product Direction

VYBE is currently being reshaped around:

**Movie discovery + movie-focused social/community features.**

The frontend is being rebuilt page-by-page.

Music and Sports development are frozen unless explicitly requested.

Do not assume that historical frontend code still exists.

## Important Historical Decisions

- The previous frontend was intentionally removed.
- The backend remains the existing foundation.
- New frontend work should reuse existing backend APIs.
- The current frontend should be created as a separate frontend application within the project structure when the frontend phase begins.
- The Git repository was accidentally initialized at `C:\Users\PREET`; this was repaired. The VYBE directory is now the Git root.
- The accidental parent Git metadata was backed up at `C:\Users\PREET\vybe-parent-git-backup`.

## Current Engineering Workflow

ChatGPT is the senior technical architect/controller.

Antigravity CLI (`agy`) is the implementation agent.

Preferred loop:

`Inspect → Plan → Implement → Test → Review → Fix → Verify → Report`

Do not blindly overwrite files.

Do not ask the user to manually copy prompts between ChatGPT and Antigravity when the connected CLI workflow can perform the task.

## Mandatory Rules

1. Inspect before modifying.
2. Preserve existing architecture.
3. Keep blast radius minimal.
4. Do not expose secrets.
5. Do not invent undocumented behavior.
6. Preserve API contracts unless a change is explicitly requested.
7. Avoid unnecessary dependencies.
8. Do not modify unrelated modules.
9. Verify changes with appropriate tests/build/startup checks.
10. Report exact verification results.
11. Stop for decisions involving architecture, security, data loss, cost, or major user-visible behavior.
12. Do not use `mongodb-memory-server` as a shortcut for the current MongoDB test timeout.
13. Do not introduce ML/recommendation architecture unless explicitly requested.

## Current Known Test Issue

The documented baseline issue is a MongoDB connection timeout involving:

`mongodb://127.0.0.1:27017/vybe_test`

This requires investigation. Do not assume the fix is to change the database strategy.

## Documentation Map

- `docs/PROJECT_OVERVIEW.md` — project overview and current environment status.
- `docs/ARCHITECTURE.md` — backend architecture.
- `docs/API_CONTRACT.md` — API routes/contracts.
- `docs/DATABASE.md` — Mongoose models and relationships.
- `docs/SECURITY_AUTH.md` — authentication and security.
- `docs/TESTING.md` — test setup and known test issue.
- `docs/FRONTEND_STATUS.md` — frontend status.
- `ai/ENGINEERING_RULES.md` — mandatory AI engineering contract.
- `docs/PROJECT_HISTORY.md` — project history and major decisions.

## Source of Truth Rule

When this context conflicts with the actual repository, inspect the repository and treat current source code as authoritative for implementation behavior.

When this context conflicts with an explicit current user instruction, follow the current user instruction unless it violates a higher-priority constraint.

When something is uncertain, say so and inspect rather than guessing.
