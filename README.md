# VYBE Backend

**Tagline:** "One platform. Every vibe."

VYBE is a unified social discovery platform combining Movies, Music, and Sports into a single personalized social ecosystem.

## Tech Stack
- **Node.js & Express.js**: Fast, scalable API framework.
- **MongoDB & Mongoose**: Flexible NoSQL database and ODM.
- **JWT & bcryptjs**: Stateless, secure authentication.
- **Zod**: Input schema validation.

## Architecture
This project uses a **Modular Monolith** architecture.
- **Routes -> Controllers -> Services -> Models -> Database**
- Thin controllers, fat services for business logic.

## Folder Structure
```
/src
  /config         # DB & Environment config
  /middleware     # Global & route-specific middleware (Auth, Errors)
  /utils          # Utilities, Error classes, Seed scripts
  /modules        # Domain-driven feature modules
    /auth
    /users
    /movies
    /music
    /sports
    /reviews
    /ratings
    /collections
    /social
    /search
```

## Setup Instructions

1. Clone the repository.
2. Run `npm install`.
3. Configure your `.env` file based on `.env.example`.
4. Run the seed command to populate demo data: `npm run seed`.
5. Start the server: `npm run dev` (development) or `npm start` (production).

## Environment Variables
Create a `.env` file in the root directory:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vybe
JWT_SECRET=supersecretvybekey2026
JWT_EXPIRES_IN=7d
```

## Available Scripts
- `npm run dev`: Start in development mode (nodemon).
- `npm start`: Start in production mode.
- `npm run seed`: Clears local DB and inserts realistic demo data.
- `npm test`: Runs the Jest test suite.

## Testing & API Validation
Use the included `npm test` script to validate basic functionality. For Postman, all endpoints are prefixed with `/api/v1/`. Send a `Bearer <token>` in the Authorization header for protected routes.

## Current Limitations
- External API integration is mocked via seed data to ensure demo reliability.
- Advanced Recommendation engine uses basic logic rather than complex Machine Learning.
- WebSockets for real-time notifications are scheduled for a future phase.
