# Security and Authentication

## Authentication
- **Strategy**: JSON Web Tokens (JWT).
- **Registration**: Accepts user details, hashes password via `bcryptjs` (salt rounds: 10) in Mongoose pre-save hook, issues JWT token.
- **Login**: Compares entered password with stored hash via custom Mongoose method `matchPassword()`, issues JWT token.
- **JWT Protection**: `protect` middleware in `src/middleware/auth.middleware.js` verifies the Bearer token using `jsonwebtoken` and checks if the mapped user still exists in DB. Appends `req.user`.

## Authorization
- **Roles**: Models support 'USER' and 'ADMIN'.
- **Middleware**: `authorize(...roles)` in `auth.middleware.js` checks if `req.user.role` is in the allowed array. E.g., `authorize('ADMIN')` for movie creation or user management.

## Security Mechanisms (Implemented)
- **Helmet**: Secures HTTP headers (loaded globally in `app.js`).
- **CORS**: Enabled globally in `app.js` to handle Cross-Origin Resource Sharing.
- **Rate Limiting**: `express-rate-limit` is configured for `/api/` (Max 100 requests per 15 minutes per IP).
- **Body Parsing Limits**: `express.json` and `express.urlencoded` are limited to `10mb` to prevent payload abuse.
- **Data Validation**: Handled by `zod` for strict payload checking (in controllers).
- **Error Handling**: A centralized `errorHandler` (`error.middleware.js`) standardizes error responses and prevents stack traces or raw DB errors from leaking in production.

## Not Currently Verified
- Password reset logic.
- Email verification flows.
- 2FA/MFA implementation.
