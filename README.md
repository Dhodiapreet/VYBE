<div align="center">

# 🎬 VYBE

### **One Platform. Every Vibe.**

**A unified social discovery platform for Movies, Music & Sports**

*Discover • Rate • Review • Follow • Share your vibe.*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Dhodiapreet/VYBE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-REST%20API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Status](https://img.shields.io/badge/Full_Stack-MVP_Verified-22C55E?style=for-the-badge)](#-current-project-status)

</div>

---

## 📌 Project Snapshot

| Category | Details |
|:---|:---|
| **Project** | VYBE |
| **Type** | Social Discovery Platform |
| **Domains** | Movies • Music • Sports |
| **Architecture** | Modular Monolith |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT |
| **Validation** | Zod |
| **Security** | bcryptjs • Helmet • CORS • Rate Limiting |
| **Testing** | Jest + Supertest |
| **API Version** | `/api/v1` |
| **Backend Status** | 🟢 Completed & Verified |
| **API Verification** | 🟢 27 / 27 Passed |
| **Frontend Status** | 🟢 Complete (MVP) |

---

# 📖 About VYBE

**VYBE** is a unified social discovery platform designed to bring **Movies, Music, and Sports** together in one personalized ecosystem.

Instead of switching between separate platforms to discover entertainment and sports content, VYBE aims to provide one place where users can:

- 🎬 Discover Movies
- 🎵 Discover Music
- 🏏 Explore Sports
- ⭐ Rate content
- 📝 Write reviews
- ❤️ Save favorites
- 📌 Manage watchlists
- 📚 Create collections
- 👥 Follow other users
- 🔔 Receive notifications
- 🤖 Get personalized recommendations
- 🔎 Search across content categories
- 🛡️ Access role-based administration

### 🎯 Core Idea

> **One platform. Every vibe.**

A user's interests are connected across different content types.

For example:

```text
🎬 Watch a Movie
       ↓
⭐ Rate it
       ↓
📝 Review it
       ↓
🎵 Discover related Music
       ↓
🎤 Explore an Artist
       ↓
🏏 Follow a Sports Team
       ↓
📚 Add everything to a Collection
```

---

# ❗ Problem Statement

Modern entertainment discovery is fragmented across multiple platforms.

A user may need different applications for:

```text
🎬 Movies
+
🎵 Music
+
🏏 Sports
+
⭐ Ratings & Reviews
+
👥 Social Discovery
```

This creates a disconnected experience.

### Problems VYBE aims to address

- Fragmented content discovery
- Separate entertainment profiles
- Limited cross-domain personalization
- Disconnected social interaction
- Difficulty organizing different types of content
- Recommendations limited to individual platforms

---

# 💡 Proposed Solution

VYBE combines multiple content ecosystems into a single platform.

```mermaid
flowchart TD

    VYBE["🎬 🎵 🏏 VYBE"]

    VYBE --> MOVIES["🎬 MOVIES"]
    VYBE --> MUSIC["🎵 MUSIC"]
    VYBE --> SPORTS["🏏 SPORTS"]

    MOVIES --> M1["Discovery"]
    MOVIES --> M2["Ratings & Reviews"]
    MOVIES --> M3["Genres & Details"]

    MUSIC --> MU1["Songs"]
    MUSIC --> MU2["Artists"]
    MUSIC --> MU3["Albums"]

    SPORTS --> S1["Matches"]
    SPORTS --> S2["Teams"]
    SPORTS --> S3["Players"]

    M1 --> USER["👤 USER"]
    M2 --> USER
    M3 --> USER
    MU1 --> USER
    MU2 --> USER
    MU3 --> USER
    S1 --> USER
    S2 --> USER
    S3 --> USER

    USER --> SOCIAL["👥 Social"]
    USER --> PERSONAL["🎯 Personalization"]

    PERSONAL --> RECOMMEND["🤖 Recommendations"]
```

---

# ✨ Highlights

| Area | What is Included | Status |
|:---|:---|:---:|
| 🎬 **Movies** | Movie discovery, details and seeded content | 🟢 |
| 🎵 **Music** | Songs, artists and albums | 🟢 |
| 🏏 **Sports** | Matches, teams and players | 🟢 |
| ⭐ **Ratings** | User ratings with duplicate prevention | 🟢 |
| 📝 **Reviews** | Create and retrieve reviews | 🟢 |
| 📚 **Collections** | Personal content collections | 🟢 |
| 📌 **Watchlist** | Save content for later | 🟢 |
| 👥 **Social** | User follow system | 🟢 |
| 🔎 **Search** | Unified content search | 🟢 |
| 🤖 **Recommendations** | Rule-based recommendations | 🟢 |
| 🎲 **Surprise Me** | Randomized discovery | 🟢 |
| 🔔 **Notifications** | User notification system | 🟢 |
| 🛡️ **Admin** | User management & role-based access | 🟢 |
| 🔐 **Authentication** | JWT-based authentication | 🟢 |
| 🔒 **Security** | Hashing, validation, rate limiting & middleware | 🟢 |
| 🧪 **API Testing** | 30/30 verified endpoints | 🟢 |
| 🗄️ **Database** | MongoDB + Mongoose | 🟢 |
| 🏗️ **Architecture** | Modular Monolith | 🟢 |

---

# 🏗️ System Architecture

VYBE currently follows a **Modular Monolith Architecture**.

The backend remains one deployable application while functionality is separated into independent domain modules.

```mermaid
flowchart TD

    CLIENT["🌐 React Frontend"]

    CLIENT --> API["⚡ Express REST API"]

    API --> ROUTES["🛣️ Routes"]
    ROUTES --> MIDDLEWARE["🔐 Middleware"]

    MIDDLEWARE --> CONTROLLERS["🎮 Controllers"]
    CONTROLLERS --> SERVICES["⚙️ Services"]
    SERVICES --> MODELS["📦 Mongoose Models"]
    MODELS --> DB[("🍃 MongoDB")]

    SERVICES --> INTEGRATIONS["🔌 External Integrations"]
    SERVICES --> RECOMMENDATION["🤖 Recommendation Engine"]
    SERVICES --> SOCIAL["👥 Social System"]
    SERVICES --> NOTIFICATIONS["🔔 Notifications"]
    SERVICES --> ADMIN["🛡️ Admin System"]
```

---

# 🔄 Request Flow

Every API request follows a predictable flow:

```text
┌──────────────────────┐
│   🌐 Client Request  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    🛣️ API Routes     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   🔐 Middleware      │
│                      │
│ • Authentication     │
│ • Authorization      │
│ • Validation         │
│ • Rate Limiting      │
│ • Security           │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   🎮 Controllers     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    ⚙️ Services       │
│   Business Logic     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ 📦 Mongoose Models   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    🍃 MongoDB        │
└──────────────────────┘
```

### Architectural Principle

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

### Design Philosophy

- **Thin Controllers** — Handle HTTP requests and responses.
- **Service Layer** — Contains business logic.
- **Models** — Define database structures and constraints.
- **Middleware** — Handles cross-cutting concerns.
- **Utilities** — Reusable application functionality.
- **Modules** — Keep domain functionality separated.

---

# 📂 Project Structure

```text
VYBE/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   └── seed.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.service.js
│   │   │
│   │   ├── users/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── movies/
│   │   │   ├── movie.model.js
│   │   │   ├── movie.controller.js
│   │   │   ├── movie.service.js
│   │   │   └── movie.routes.js
│   │   │
│   │   ├── music/
│   │   │   ├── song/
│   │   │   ├── artist/
│   │   │   └── album/
│   │   │
│   │   ├── sports/
│   │   │   ├── match/
│   │   │   ├── team/
│   │   │   └── player/
│   │   │
│   │   ├── reviews/
│   │   ├── ratings/
│   │   ├── collections/
│   │   ├── social/
│   │   └── search/
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── api.test.js
│
├── .env
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── README.md
└── VYBE_Postman_Collection.json
```

> **Architecture Note:** The project uses a feature/module-oriented structure so new functionality can be added without unnecessarily affecting existing modules.

---

# 🧩 Backend Modules

## 🔐 Authentication

Responsible for:

- User registration
- User login
- Password hashing
- JWT generation
- JWT verification
- Protected routes
- Current-user authentication

### Endpoints

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

---

## 👤 Users

The user module manages:

- User information
- Profiles
- User status
- User relationships
- User activity

Users form the central entity of the VYBE ecosystem.

---

## 🎬 Movies

Movie functionality provides:

- Movie discovery
- Movie listing
- Movie details
- Genres
- Ratings
- Reviews
- Movie-related interactions

### Endpoints

```http
GET /api/v1/movies
GET /api/v1/movies/:id
```

---

## 🎵 Music

The Music ecosystem is organized into:

```text
Music
├── Songs
├── Artists
└── Albums
```

### Endpoints

```http
GET /api/v1/music/songs
GET /api/v1/music/songs/:id
GET /api/v1/music/artists
GET /api/v1/music/albums
```

### Future Expansion

- Artist following
- Playlists
- Music recommendations
- Genre-based discovery
- Personalized music feeds

---

## 🏏 Sports

The Sports ecosystem contains:

```text
Sports
├── Matches
├── Teams
└── Players
```

### Endpoints

```http
GET /api/v1/sports/matches
GET /api/v1/sports/matches/live
GET /api/v1/sports/teams
GET /api/v1/sports/players
```

The architecture can later support live sports APIs and real-time updates.

---

## 📝 Reviews

Users can create and retrieve reviews for supported content.

```http
GET  /api/v1/reviews
POST /api/v1/reviews
```

Protected operations require authentication.

---

## ⭐ Ratings

VYBE supports a quick-rating concept:

```text
🔥 PERFECT
❤️ LOVED_IT
👍 GOOD
😐 AVERAGE
⏭️ SKIP
```

Ratings can become signals for the user's taste profile and recommendation engine.

```http
POST /api/v1/ratings
```

Duplicate rating behavior is controlled at the application/database level.

---

## 📚 Collections

Users can create personal collections.

Example:

```text
📚 Weekend Vibes
│
├── 🎬 Interstellar
├── 🎵 Favorite Song
└── 🏏 Favorite Match
```

### Endpoints

```http
GET  /api/v1/collections
POST /api/v1/collections
```

---

## 📌 Watchlist

Authenticated users can save content for later.

```http
GET  /api/v1/watchlist
POST /api/v1/watchlist
```

The architecture can later support:

- Movies
- TV shows
- Music
- Sports events

---

## 👥 Social System

VYBE includes a basic social relationship system.

Users can follow other users and build their social discovery network.

```http
POST /api/v1/social/follow/:userId
```

The API also prevents invalid self-following behavior.

### Planned Social Features

```text
Followers
Following
Activity Feed
Likes
Comments
Shares
Blocking
Reporting
```

---

## 🔎 Universal Search

VYBE provides a unified search endpoint:

```http
GET /api/v1/search?q=movie
```

Conceptually:

```text
              🔎 Search
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     Movies     Music     Sports
        │         │         │
        └─────────┼─────────┘
                  ↓
        🔎 Unified Results
```

---

## 🤖 Recommendation System

The current recommendation engine uses **rule-based logic**.

Potential recommendation signals include:

- User ratings
- Favorites
- Watchlist
- Genres
- Content categories
- User interactions

### Endpoints

```http
GET /api/v1/recommendations
GET /api/v1/recommendations/surprise
```

### Recommendation Evolution

```text
Rule-Based
    ↓
Content-Based
    ↓
Collaborative Filtering
    ↓
Hybrid Recommendation
    ↓
Machine Learning
```

---

## 🔔 Notifications

The notification module provides user notification data.

```http
GET /api/v1/notifications
```

Future notification events may include:

- New followers
- Likes
- Comments
- Recommendations
- Sports updates
- System notifications

---

## 🛡️ Admin System

VYBE contains protected administrative APIs.

### Current Capabilities

- View users
- Manage user status
- Monitor platform activity
- Role-based access

### Endpoints

```http
GET   /api/v1/admin/users
PATCH /api/v1/admin/users/:id/status
```

Admin routes require:

```text
Valid JWT
   +
ADMIN role
```

A normal user attempting to access an Admin-only endpoint receives:

```text
HTTP 403 Forbidden
```

---

# 🔐 Authentication & Authorization

VYBE uses **JWT-based authentication**.

```mermaid
sequenceDiagram

    participant U as 👤 User
    participant API as ⚡ VYBE API
    participant DB as 🍃 MongoDB

    U->>API: Register
    API->>DB: Create User
    DB-->>API: User Created
    API-->>U: Registration Response

    U->>API: Login
    API->>DB: Find User
    DB-->>API: User Data
    API-->>U: JWT Token

    U->>API: Protected Request
    API->>API: Verify JWT
    API->>DB: Process Request
    DB-->>API: Result
    API-->>U: JSON Response
```

Protected APIs use:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🗄️ Database Architecture

VYBE uses:

## **MongoDB + Mongoose**

Conceptually, the database contains:

```text
MongoDB
│
├── Users
├── Movies
├── Songs
├── Artists
├── Albums
├── Matches
├── Teams
├── Players
├── Reviews
├── Ratings
├── Collections
├── Watchlist
├── Social Relationships
└── Notifications
```

### Database Flow

```text
VYBE API
   ↓
Mongoose ODM
   ↓
MongoDB
```

### Local Development URI

```text
mongodb://127.0.0.1:27017/vybe
```

---

# 🔗 Data Relationships

```mermaid
erDiagram

    USER ||--o{ REVIEW : writes
    USER ||--o{ RATING : creates
    USER ||--o{ COLLECTION : owns
    USER ||--o{ WATCHLIST : maintains
    USER ||--o{ NOTIFICATION : receives

    USER }o--o{ USER : follows

    MOVIE ||--o{ REVIEW : receives
    MOVIE ||--o{ RATING : receives

    SONG ||--o{ REVIEW : receives
    SONG ||--o{ RATING : receives

    MATCH ||--o{ RATING : receives
```

---

# 📡 API Architecture

All APIs use versioning:

```text
/api/v1/
```

Examples:

```text
/api/v1/auth/login
/api/v1/movies
/api/v1/music/songs
/api/v1/sports/matches
/api/v1/search?q=...
```

API versioning makes future API changes easier without immediately breaking existing clients.

---

# 📋 API Endpoints

| Module | Method | Endpoint | Auth |
|:---|:---:|:---|:---:|
| Health | `GET` | `/api/v1/health` | ❌ |
| Auth | `POST` | `/api/v1/auth/register` | ❌ |
| Auth | `POST` | `/api/v1/auth/login` | ❌ |
| Auth | `GET` | `/api/v1/auth/me` | ✅ |
| Movies | `GET` | `/api/v1/movies` | ❌ |
| Movies | `GET` | `/api/v1/movies/:id` | ❌ |
| Music | `GET` | `/api/v1/music/songs` | ❌ |
| Music | `GET` | `/api/v1/music/songs/:id` | ❌ |
| Music | `GET` | `/api/v1/music/artists` | ❌ |
| Music | `GET` | `/api/v1/music/albums` | ❌ |
| Sports | `GET` | `/api/v1/sports/matches` | ❌ |
| Sports | `GET` | `/api/v1/sports/matches/live` | ❌ |
| Sports | `GET` | `/api/v1/sports/teams` | ❌ |
| Sports | `GET` | `/api/v1/sports/players` | ❌ |
| Search | `GET` | `/api/v1/search?q=...` | ❌ |
| Reviews | `GET` | `/api/v1/reviews` | ❌ |
| Reviews | `POST` | `/api/v1/reviews` | ✅ |
| Ratings | `POST` | `/api/v1/ratings` | ✅ |
| Collections | `GET` | `/api/v1/collections` | ✅ |
| Collections | `POST` | `/api/v1/collections` | ✅ |
| Watchlist | `GET` | `/api/v1/watchlist` | ✅ |
| Watchlist | `POST` | `/api/v1/watchlist` | ✅ |
| Social | `POST` | `/api/v1/social/follow/:userId` | ✅ |
| Recommendations | `GET` | `/api/v1/recommendations` | ✅ |
| Recommendations | `GET` | `/api/v1/recommendations/surprise` | ✅ |
| Notifications | `GET` | `/api/v1/notifications` | ✅ |
| Admin | `GET` | `/api/v1/admin/users` | 🛡️ |
| Admin | `PATCH` | `/api/v1/admin/users/:id/status` | 🛡️ |

---

# ❤️ API Response Philosophy

The backend uses controlled JSON responses.

Example:

```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "environment": "development",
    "timestamp": "..."
  }
}
```

A consistent response structure makes frontend integration easier.

---

# 🌱 Seed / Demo Data

The project includes a seed system for reliable development and demonstrations.

The seed data contains representative:

```text
👤 Users
🛡️ Admin User
🎬 Movies
🎵 Music
🏏 Sports Data
⭐ Ratings
📝 Reviews
👥 Social Interactions
```

Run:

```bash
npm run seed
```

This prepares the local MongoDB database with demonstration data.

---

# 🛡️ Security

Security is treated as a core backend requirement.

### Implemented Security

- 🔐 Password hashing using bcrypt
- 🎟️ JWT authentication
- 🛡️ Role-based authorization
- 🚦 Rate limiting
- 🪖 Helmet security headers
- 🌐 CORS configuration
- 📦 Request body size limits
- ✅ Input validation
- 🧹 Centralized error handling
- 🔑 Environment-based secrets
- 🚫 Unauthorized Admin protection
- 🗃️ Database-level uniqueness constraints

### Authentication Flow

```text
                 👤 USER
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
      REGISTER               LOGIN
          │                   │
          ↓                   ↓
   Password Hash        Verify Password
          │                   │
          ↓                   ↓
       MongoDB             JWT Token
                              │
                              ↓
                     Protected API
```

---

# 🔑 Environment Configuration

Create a local `.env` file:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/vybe

JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN=7d
```

### ⚠️ Never Commit Secrets

Never commit:

```text
.env
JWT secrets
Database passwords
API keys
Access tokens
Private credentials
```

The repository should contain:

```text
.env.example
```

with placeholder values only.

---

# 🧪 Testing & Verification

The backend has been runtime-verified against a running local MongoDB instance.

## 🟢 Latest Verification

```text
╔══════════════════════════════════════╗
║        VYBE BACKEND TEST             ║
╠══════════════════════════════════════╣
║ Total Endpoints Tested : 27          ║
║ Passed                 : 27          ║
║ Failed                 : 0           ║
║ Broken Endpoints       : 0           ║
╚══════════════════════════════════════╝
```

### Verification Result

# 🟢 27 / 27 Endpoints Passed

### Verified Areas

```text
✅ Health Check
✅ Registration
✅ Login
✅ Protected Authentication
✅ Movies
✅ Music
✅ Sports
✅ Search
✅ Reviews
✅ Ratings
✅ Collections
✅ Watchlist
✅ Social
✅ Recommendations
✅ Notifications
✅ Admin Authorization
✅ Error Handling
✅ Invalid ObjectId Handling
```

### HTTP Status Verification

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

The verification also covers unauthenticated and unauthorized request handling.

---

# 📮 Postman

The repository includes:

```text
VYBE_Postman_Collection.json
```

Import the collection into Postman to test the available APIs.

For protected APIs:

```text
Authorization
      ↓
Bearer Token
      ↓
<JWT_TOKEN>
```

---

# 💻 Tech Stack

| Technology | Purpose |
|:---|:---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Zod** | Request validation |
| **Helmet** | Security headers |
| **CORS** | Cross-origin request handling |
| **Jest** | Automated testing |
| **Supertest** | API testing |
| **Nodemon** | Development server |
| **Git** | Version control |
| **GitHub** | Collaboration |

---

# 🚀 Getting Started

## 1. Prerequisites

Install:

- Node.js 20+
- npm
- MongoDB Community Server
- Git
- Postman *(recommended)*

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify MongoDB:

```bash
mongod --version
```

---

## 2. Clone Repository

```bash
git clone https://github.com/Dhodiapreet/VYBE.git
cd VYBE
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment

Create:

```text
.env
```

Use `.env.example` as the safe template.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vybe
JWT_SECRET=change-this-to-a-long-random-secret
JWT_EXPIRES_IN=7d
```

---

## 5. Start MongoDB

Make sure MongoDB is running.

### Windows

```powershell
Get-Service MongoDB
```

Expected:

```text
Status     Name
------     ----
Running    MongoDB
```

---

## 6. Seed Database

```bash
npm run seed
```

This inserts the demonstration data.

---

## 7. Start Development Server

```bash
npm run dev
```

Expected:

```text
Server running on port 5000
MongoDB Connected
```

---

## 8. Verify API

Open:

```text
http://localhost:5000/api/v1/health
```

Expected:

```json
{
  "success": true,
  "message": "API is healthy"
}
```

---

# ⚙️ Available Scripts

| Command | Purpose |
|:---|:---|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm run seed` | Populate demo database |
| `npm test` | Run test suite |

---

# 📊 Current Project Status

## 🟢 Full-Stack MVP — Completed & Verified

`	ext
╔══════════════════════════════════════════════╗
║              VYBE FULL-STACK MVP             ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📐 Architecture              🟢 Complete     ║
║  ⚙️ Express Backend            🟢 Complete     ║
║  🗄️ MongoDB                    🟢 Complete     ║
║  🔐 Authentication             🟢 Complete     ║
║  🛡️ Security Hardening         🟢 Complete     ║
║  🎬 Movies (TMDB)             🟢 Complete     ║
║  🎵 Music                     🟡 Deferred Focus║
║  🏏 Sports                    🟡 Deferred Focus║
║  🔎 Search                    🟢 Complete     ║
║  📝 Reviews                   🟢 Complete     ║
║  ⭐ Ratings                   🟢 Complete     ║
║  📚 Collections               🟢 Complete     ║
║  📌 Watchlist                 🟢 Complete     ║
║  👥 Social                    🟢 Complete     ║
║  🔔 Notifications             🟢 Complete     ║
║  🧪 API Verification          🟢 27/27 Passed ║
║                                              ║
║  ⚛️ React Frontend             🟢 Complete     ║
║  🔗 Frontend Integration      🟢 Complete     ║
║  🚀 Production Deployment     🔵 Next Phase   ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

# 📈 Development Progress

## Early Phases (1-15) — Foundation & Backend MVP

**Status: 🟢 Completed**

- Project Architecture & Node.js/Express setup
- MongoDB + Mongoose Integration
- Authentication (JWT, bcrypt)
- Core Modules (Movies, Music, Sports, Search)
- Social & Personalization (Reviews, Ratings, Watchlist, Collections)
- Initial API Verification & Postman setup
- React App Setup (Vite)

---

## Phase 16 — Frontend Integration QA
**Status: 🟢 Completed**

---

## Phase 17 — Backend API Integration
**Status: 🟢 Completed**

---

## Phase 18 — Integration QA
**Status: 🟢 Completed**

---

## Phase 19 — TMDB Real Movie Data Integration
**Status: 🟢 Completed**

---

## Phase 20 — Real Social Backend APIs
**Status: 🟢 Completed**

---

## Phase 21 — Real Notifications
**Status: 🟢 Completed**

---

## Phase 22 — Security & Hardening
**Status: 🟢 Completed**
- Helmet, CORS, Rate Limiting, Input Validation

---

## Phase 23 — Full Testing & Final QA
**Status: 🟡 PAUSED**
- Started today, currently paused before completion.

---

## Phase 24 — Deployment
**Status: 🔵 Next Phase**
- Next step after final QA.


# 🟡 Overall Project State

```text
VYBE PROJECT
│
├── 📐 Planning                 🟢 Completed
├── ⚙️ Backend API              🟢 Completed
├── 🗄️ MongoDB                  🟢 Completed
├── 🔐 Authentication           🟢 Completed
├── 🛡️ Security Hardening       🟢 Completed
├── 🎬 Movies (TMDB API)        🟢 Completed
├── 🎵 Music                    🟡 API Built / Deferred MVP Focus
├── 🏏 Sports                   🟡 API Built / Deferred MVP Focus
├── 🔎 Search                   🟢 Completed
├── 👥 Social                   🟢 Completed
├── 🔔 Notifications            🟢 Completed
├── 🧪 API Verification         🟢 27/27 Passed
│
├── ⚛️ React Frontend            🟢 MVP Completed
├── 🔗 Frontend Integration      🟢 Completed
├── 🔌 Real TMDB API             🟢 Completed
├── ⚡ Real-Time DMs             🟡 Mocked (UI only)
└── 🚀 Production Deployment     🔵 Next (Phase 24)
```

### 🎯 Current Milestone

> **Phase 23 — Full Testing & Final QA (PAUSED before completion)**

### ➡️ Next Major Milestone

> **Phase 24 — Production Deployment**

---

# 🛣️ Development Roadmap

`mermaid
flowchart LR
    A['⚙️ Backend MVP'] --> B['⚛️ React Frontend']
    B --> C['🔗 API and TMDB Integration']
    C --> D['🛡️ Security and Hardening']
    D --> E['🧪 Final QA Paused']
    E --> F['🚀 Deployment']
`

### Phase 1-15 — Backend Foundation & Frontend Initial 🟢
**Status: Completed**

### Phase 16-22 — Integration, Social, TMDB & Security 🟢
**Status: Completed**

### Phase 23 — Full Testing & Final QA 🟡
**Status: Paused**

### Phase 24 — Deployment 🔵
**Status: Next**

---

# ⚠️ Current Limitations

The current release represents the **VYBE Movie + Social Community MVP**. 

Intentional known limitations and mocks:

- **Music & Sports**: While backend API endpoints exist, these domains are not the active implementation focus and are not presented as fully implemented current frontend features.
- **Messaging (DMs)**: The real-time messaging UI is mocked intentionally; no backend socket/messaging infrastructure exists yet.
- **Global Feed/Activity**: Mock-only areas where real backend aggregation does not yet exist.
- **Collections/Profile**: Some minor fallback areas exist.
- **External APIs**: Real movie data is served via TMDB integration. 
- **Production Deployment**: Cloud deployment is pending Phase 24.
---

# 🔮 Future Scope

## 🤖 Advanced Recommendation Engine

Future versions can introduce:

```text
Content-Based Filtering
        ↓
Collaborative Filtering
        ↓
Hybrid Recommendations
        ↓
Machine Learning
        ↓
Personalized Ranking
```

---

## ⚡ Real-Time Features

Potential future functionality:

- Live sports updates
- Real-time notifications
- Chat
- Live activity feeds
- Reactions
- Real-time comments

---

## 🏆 Gamification

Possible features:

```text
XP
Levels
Badges
Challenges
Streaks
Leaderboards
Achievements
```

---

## 📊 VYBE Analytics

Users could eventually see:

```text
🎬 Movies Watched
🎵 Songs Discovered
🏏 Sports Followed
⭐ Rating Statistics
🎤 Top Artists
🏆 Favorite Teams
🔥 Favorite Genres
📅 Monthly Activity
```

---

## 🎁 VYBE Wrapped

A personalized yearly summary could include:

```text
╔══════════════════════════════╗
║          YOUR VYBE           ║
╠══════════════════════════════╣
║ 🎬 Top Movies                ║
║ 🎵 Top Artists               ║
║ 🏏 Favorite Teams            ║
║ ⭐ Rating Statistics         ║
║ 🔥 Favorite Genres           ║
║ 📊 Activity Summary          ║
╚══════════════════════════════╝
```

---

# 🌐 External API Strategy

The current MVP uses seeded data to keep demonstrations reliable.

Future versions can integrate legitimate external providers for:

```text
🎬 Movie Metadata
🎵 Music Metadata
🏏 Sports Data
```

External integrations should remain isolated from core business logic so providers can be changed without rewriting the main application modules.

---

# 🧠 Engineering Principles

VYBE follows these software engineering principles:

### 🧩 Separation of Concerns

Each layer has a clearly defined responsibility.

### ♻️ DRY

Avoid unnecessary code duplication.

### 🧱 SOLID

Design modules to remain maintainable and extensible.

### 🔐 Security First

Authentication, authorization and validation are treated as first-class concerns.

### 📡 API Consistency

Use consistent endpoint naming and response structures.

### 🛠️ Maintainability

Prefer readable, modular code over unnecessary complexity.

### 🧪 Verify Before Claiming Complete

Features should be considered verified only after actual runtime/API testing.

---

# 👥 Team Development

VYBE is developed collaboratively using GitHub.

Recommended responsibilities can be divided into:

| Area | Responsibility |
|:---|:---|
| ⚙️ Backend | API, business logic, authentication |
| ⚛️ Frontend | React UI and API integration |
| 🗄️ Database | MongoDB models and relationships |
| 🧪 Testing | API testing and validation |
| 📚 Documentation | README, architecture and reports |

---

# 🌿 Git Workflow

Recommended branch structure:

```text
main
 │
 ├── feature/auth
 ├── feature/movies
 ├── feature/music
 ├── feature/sports
 ├── feature/frontend
 └── feature/testing
```

### Create a feature branch

```bash
git checkout -b feature/feature-name
```

### Stage changes

```bash
git add .
```

### Commit

```bash
git commit -m "feat: add feature"
```

### Push

```bash
git push origin feature/feature-name
```

Then create a Pull Request for review.

---

# 🎓 Project Explanation

## What is VYBE?

> VYBE is a unified social discovery platform that combines Movies, Music and Sports into one personalized ecosystem.

## Why did we build VYBE?

> We wanted to reduce fragmented content discovery by creating one platform where users can discover entertainment, interact with content, connect with other users and receive personalized recommendations.

## Why MongoDB?

> MongoDB provides flexible document-based storage suitable for multiple content domains and user interaction data. Mongoose provides schema modeling, validation and database abstraction.

## Why Express.js?

> Express.js provides a lightweight and flexible framework for building REST APIs in Node.js.

## Why Modular Monolith?

> We selected a modular monolith because it provides clear separation between business domains while keeping development, testing and deployment simpler than a microservices architecture.

## How does authentication work?

> Users register and their passwords are securely hashed. During login, the server verifies the credentials and generates a JWT. The client sends the JWT with protected requests, and authentication middleware verifies it before allowing access.

## What has been completed?

> The Full-Stack MVP has been implemented. This includes the Node/Express backend with TMDB integration, robust security hardening, and a React frontend. The social discovery core (Movies, Watchlist, Collections, Ratings, Reviews, Notifications, and Following) is complete and integrated. 27 backend API tests are currently passing.
## What is next?

> The next major milestone is Phase 24: Production Deployment. After successful testing and QA (Phase 23, currently paused), the app will be deployed. Future extensions will target Music/Sports integration and real-time messaging/feeds.
---

# 🧪 Recommended Demo Flow

For a project demonstration:

`	ext
1. Start MongoDB
       ↓
2. Start VYBE Backend (
pm run dev in root)
       ↓
3. Start React Frontend (
pm run dev in /client)
       ↓
4. Register User / Login in Browser
       ↓
5. Browse TMDB Trending Movies on Home
       ↓
6. Search for Real Movies (TMDB)
       ↓
7. View Movie Details & Discussions
       ↓
8. Create Rating / Review
       ↓
9. Add to Watchlist / Collection
       ↓
10. Explore Social (Find People, Follow Users)
       ↓
11. View Notifications
`
---

# 📌 Project Summary

| Category | Current State |
|:---|:---|
| **Project** | VYBE |
| **Vision** | One Platform. Every Vibe. |
| **Type** | Social Discovery Platform |
| **Domains** | Movies • Music • Sports |
| **Architecture** | Modular Monolith |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JWT |
| **Password Security** | bcryptjs |
| **Validation** | Zod |
| **Testing** | Jest + Supertest |
| **API Version** | v1 |
| **Verified Endpoints** | 27 |
| **Passed** | 27 |
| **Failed** | 0 |
| **Backend Status** | 🟢 Completed & Verified |
| **Frontend Status** | 🟢 Complete (MVP) |
| **Deployment** | 🔵 Next (Phase 24) |

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

### 1. Create a branch

```bash
git checkout -b feature/amazing-feature
```

### 2. Make your changes

```bash
git add .
```

### 3. Commit

```bash
git commit -m "feat: add amazing feature"
```

### 4. Push

```bash
git push origin feature/amazing-feature
```

### 5. Open a Pull Request

Review the changes before merging into the main branch.

---

# 📄 License

This project is currently developed as an **educational / academic software project**.

The licensing model may be updated when VYBE moves toward public production deployment.

---

<div align="center">

# 🎬 🎵 🏏

## **VYBE**

### **One Platform. Every Vibe.**

**Movies • Music • Sports • Social Discovery**

<br/>

### 🟢 Backend MVP — Completed & Verified

**27 / 27 API Endpoints Passed**

<br/>

Built with ❤️ using

**Node.js • Express.js • MongoDB • Mongoose • JWT**

<br/>

⭐ **If you find VYBE interesting, consider starring the repository!**

</div>
