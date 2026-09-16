<div align="center">

# 🎬 VYBE

### **One platform. Every vibe.**

**A unified social discovery platform for Movies, Music & Sports**

*Discover. Rate. Review. Follow. Share your vibe.*

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Dhodiapreet/VYBE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)]
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![Status](https://img.shields.io/badge/Backend-MVP%20Verified-22C55E?style=for-the-badge)](#-current-project-status)

</div>

---

## 📖 About the Project

**VYBE** is a unified social discovery platform designed to bring **Movies, Music, and Sports** together in one personalized ecosystem.

Instead of using separate platforms to discover entertainment and sports content, VYBE provides a single place where users can:

- 🎬 Discover Movies
- 🎵 Discover Music
- 🏏 Explore Sports
- ⭐ Rate content
- 📝 Write Reviews
- ❤️ Save Favorites
- 📌 Manage Watchlists
- 📚 Create Collections
- 👥 Follow other users
- 🔔 Receive Notifications
- 🤖 Get Personalized Recommendations
- 🔎 Search across multiple content categories
- 🛡️ Manage users through an Admin portal

### 🎯 Core Idea

> **One platform. Every vibe.**

VYBE is designed around the idea that a user's entertainment and sports interests are connected.

A user might:

**Watch a movie → rate it → review it → discover its music → explore an artist → follow a sports team → create a collection containing all of them.**

---

# ✨ Highlights

| Area | What is Included |
| :--- | :--- |
| 🎬 **Movies** | Movie discovery, details and seeded content |
| 🎵 **Music** | Songs, artists and albums |
| 🏏 **Sports** | Matches, teams and players |
| ⭐ **Ratings** | User ratings with duplicate prevention |
| 📝 **Reviews** | Create and retrieve user reviews |
| 📚 **Collections** | Create and manage personal collections |
| 📌 **Watchlist** | Save content for later |
| 👥 **Social** | Follow users and social interactions |
| 🔎 **Search** | Unified content search |
| 🤖 **Recommendations** | Rule-based personalized recommendations |
| 🎲 **Surprise Me** | Randomized discovery experience |
| 🔔 **Notifications** | User notification system |
| 🛡️ **Admin** | User management and role-based access |
| 🔐 **Authentication** | JWT-based authentication |
| 🔒 **Security** | Password hashing, validation, rate limiting & security middleware |
| 🧪 **API Testing** | 30/30 verified API endpoint tests |
| 🗄️ **Database** | MongoDB + Mongoose |
| 🏗️ **Architecture** | Modular Monolith |

---

# 🏗️ System Architecture

VYBE currently follows a **Modular Monolith** architecture.

```mermaid
flowchart TD

    Client[🌐 React Frontend]
    
    Client --> API[⚡ Express REST API]

    API --> Routes[🛣️ Routes]
    Routes --> Middleware[🔐 Middleware]
    Middleware --> Controllers[🎮 Controllers]
    Controllers --> Services[⚙️ Services]
    Services --> Models[📦 Mongoose Models]
    Models --> DB[(🍃 MongoDB)]

    Services --> Integrations[🔌 External API Integrations]

    Services --> Auth[🔑 Authentication]
    Services --> Social[👥 Social System]
    Services --> Recommendation[🤖 Recommendation Engine]
    Services --> Notification[🔔 Notification System]
    Services --> Admin[🛡️ Admin System]
