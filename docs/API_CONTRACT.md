# API Contract

Base URL for all routes: `/api/v1`

## System
- `GET /health` : Returns 200 health status, environment, and timestamp. (Public)

## Auth (`/auth`)
- `POST /register` : Register a new user. Expects `username`, `email`, `password`. (Public)
- `POST /login` : Authenticate user. Expects `email`, `password`. (Public)
- `GET /me` : Get current authenticated user details. (Protected)

## Admin (`/admin`)
- `GET /users` : List users. (Protected, Admin only)
- `PATCH /users/:id/status` : Update user status. (Protected, Admin only)

## Movies (`/movies`)
- `GET /` : Fetch movies. (Public)
- `GET /:id` : Get single movie details. (Public)
- `POST /` : Create a movie. (Protected, Admin only)

## Music (`/music`)
- `GET /songs` : Fetch songs. (Public)
- `GET /songs/:id` : Get single song details. (Public)
- `GET /artists` : Fetch artists. (Public)
- `GET /albums` : Fetch albums. (Public)

## Sports (`/sports`)
- `GET /matches` : Fetch sports matches. (Public)
- `GET /matches/live` : Fetch currently live matches. (Public)
- `GET /teams` : Fetch teams. (Public)
- `GET /players` : Fetch players. (Public)

## Search (`/search`)
- `GET /?q={query}` : Universal content search. (Public)

## Social (`/social`)
- `POST /follow/:userId` : Follow an entity (User, Artist, Team, Player). (Protected)
- `DELETE /follow/:userId` : Unfollow an entity. (Protected)

## Reviews (`/reviews`)
- `GET /` : Fetch reviews. (Public)
- `POST /` : Create a review. (Protected)

## Ratings (`/ratings`)
- `POST /` : Create a rating. (Protected)

## Collections (`/collections`)
- `GET /` : Fetch collections. (Public)
- `POST /` : Create a collection. (Protected)

## Watchlist (`/watchlist`)
- `GET /` : Fetch user's watchlist. (Protected)
- `POST /` : Add movie to watchlist. (Protected)
- `PATCH /:id/watched` : Mark watchlist item as watched. (Protected)

## Recommendations (`/recommendations`)
- `GET /` : Fetch user recommendations. (Public)
- `GET /surprise` : Fetch randomized surprise content. (Public)

## Notifications (`/notifications`)
- `GET /` : Fetch notifications. (Protected)
- `PATCH /:id/read` : Mark notification as read. (Protected)
