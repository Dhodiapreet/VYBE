# VYBE Phase 22 - Security & Hardening Report

## Executive Summary
A comprehensive security audit and hardening phase was conducted on the VYBE Modular Monolith and React frontend. The primary goal was to identify and remediate concrete vulnerabilities without introducing architectural redesigns or breaking existing functionality. Several vulnerabilities were patched, specifically concerning DoS (Denial of Service) vectors via unescaped regular expressions, permissive CORS configurations, and broad request payload limits. 

## Vulnerabilities Identified & Fixed

### 1. NoSQL Injection / ReDoS (Regular Expression Denial of Service)
**Location:** 
- `src/modules/search/search.controller.js` (universalSearch endpoint)
- `src/modules/movies/movie.controller.js` (searchTmdbMovies endpoint fallback)

**Issue:** User-provided search queries were passed directly to `new RegExp(query, 'i')` without escaping regex metacharacters. Malicious users could inject complex regex patterns that dramatically spike CPU usage and crash the Node.js event loop, or perform NoSQL injection attacks.
**Fix:** Introduced regex escaping for all user input prior to constructing the RegExp object (`query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`).

### 2. Permissive CORS Configuration
**Location:** `src/app.js`
**Issue:** CORS was globally enabled for all origins (`app.use(cors())`), potentially exposing authenticated endpoints to CSRF or unintended cross-origin data reads.
**Fix:** Hardened CORS policy to explicitly check `process.env.CORS_ORIGIN` or `process.env.CLIENT_URL`, defaulting to wildcard for development fallback but supporting production lockdown. Restricted allowed methods and enabled `credentials: true`.

### 3. Missing Reverse Proxy Trust for Rate Limiting
**Location:** `src/app.js`
**Issue:** `express-rate-limit` relies on IP addresses. Without `app.set('trust proxy', 1)`, if the application is deployed behind a reverse proxy or load balancer (e.g., Nginx, Heroku, AWS ELB), all requests appear to originate from the proxy's IP, leading to global rate limits blocking legitimate users.
**Fix:** Added `app.set('trust proxy', 1)` and updated the rate limiter configuration to use standard headers (`standardHeaders: true`, `legacyHeaders: false`).

### 4. Excessive Payload Limits
**Location:** `src/app.js`
**Issue:** `express.json` and `express.urlencoded` were configured with a `10mb` limit, which is unnecessarily high for a standard API and increases the risk of memory exhaustion DoS attacks.
**Fix:** Lowered the request body parsing limit to `1mb`, which is more than sufficient for standard JSON payloads (movie metadata, reviews, user profiles).

## Security Controls Audited & Validated

- **Auth & JWT Handling:** JWTs are signed with a securely configured secret and reasonable expiration (`7d`). `verify` usage correctly handles invalid or expired tokens in the middleware. 
- **Password Hashing:** Bcrypt is used correctly (with salt rounds) in the Mongoose `pre('save')` hook, preventing plaintext password storage.
- **Zod Validation:** Input validation correctly enforces schema constraints for authentication (register, login) and discussions (creation, replies). This prevents mass assignment and unexpected data types.
- **Error Middleware:** The centralized error handler safely intercepts errors and redacts stack traces in non-development environments (`process.env.NODE_ENV !== 'development'`), preventing sensitive application structure leakage.
- **IDOR / BOLA Prevention:**
  - **Notifications:** Endpoints for marking as read or deleting notifications (`notification.controller.js`) enforce `recipient: req.user._id`, ensuring users cannot mutate others' notifications.
  - **Social Follows:** The `follow` endpoint explicitly rejects self-following and accurately models the relationship owner.
  - **Discussions:** Modification capabilities are generally safe or appropriately limited.
- **Helmet:** Properly loaded to apply standard secure HTTP headers.
- **TMDB Secret Handling:** TMDB API calls are proxied securely through the backend. The API key remains strictly server-side and is never exposed to the client bundle.
- **Dependencies:** Both backend (`npm audit`) and frontend (`npm run lint`, `npm audit`) reported 0 active vulnerabilities in existing libraries. No risky upgrades were necessary.

## Remaining Risks & Limitations

- **Frontend Token Storage (localStorage):** The React frontend currently relies on `localStorage` to persist the JWT token. While standard for many React architectures, this exposes the token to Cross-Site Scripting (XSS) attacks. A stronger, though architecturally complex alternative, would be transitioning to HttpOnly cookies for session management. As per the constraints to preserve existing functional behavior without redesigning architecture, this is documented but unaltered. 
- **Missing Resource Ownership Constraints (Discussions):** Users can create discussions and reply, but currently lack the ability to delete or edit their own posts. While not an immediate vulnerability (as no unprivileged access exists), this is a product gap that should be built with ownership checks when introduced.

## Verification
- Both backend and frontend testing routines completed successfully:
  - `npm run test` (Backend): **Pass** (All 27 assertions met, 4 test suites passing, process exited 0).
  - `npm run lint` (Frontend): **Pass** (Process exited 0, minor React hooks warnings observed but no security/syntax errors).
  - `npm run build` (Frontend): **Pass** (Process exited 0, successfully bundled production assets).
  - `npm audit` (Both): **Pass** (0 vulnerabilities found).
