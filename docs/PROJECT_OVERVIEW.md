# Project Overview

**Project Name**: VYBE
**Type**: Social Discovery Platform (Movies, Music, Sports)
**Status**: Backend MVP Verified. Frontend is pending (future phase).

## Concept
VYBE is a unified social discovery platform bringing Movies, Music, and Sports together into one personalized ecosystem. Users can discover, rate, review, follow, share, and save content across these different domains in one place.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose (ODM)
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit
- **Testing**: Jest, Supertest

## Existing Features
- **Movies**: Discovery and details.
- **Music**: Songs, artists, and albums.
- **Sports**: Matches, teams, and players.
- **Ratings**: User ratings across entities with duplicate prevention.
- **Reviews**: Create and retrieve reviews for content.
- **Collections**: Grouping items across different models.
- **Watchlist**: Saving movies for later.
- **Social**: Follow/unfollow other users, artists, teams, etc.
- **Search**: Unified content search.
- **Recommendations**: General and randomized ("Surprise Me") content suggestions.
- **Notifications**: Retrieve and mark as read.
- **Admin**: User status management.
- **Auth**: Registration, login, JWT protection.

## Development Commands
- `npm start`: Runs `node server.js`
- `npm run dev`: Runs `nodemon server.js`
- `npm run seed`: Runs `node src/utils/seed.js`
- `npm test`: Runs `jest`

## Current Environment Issue
`npm test` currently fails due to a MongoDB connection timeout to `mongodb://127.0.0.1:27017/vybe_test`. This is a known environmental issue that should **not** be fixed by changing the database connection logic or introducing `mongodb-memory-server` without explicit approval.
