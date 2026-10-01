# Database Documentation

**Engine**: MongoDB via Mongoose

## Mongoose Models

### User (`User`)
- **Fields**: `username`, `email`, `password`, `role` (USER/ADMIN), `profilePicture`, `bio`.
- **Validation**: Email regex, min/max lengths.
- **Hooks**: Pre-save hook uses bcrypt to hash passwords.
- **Methods**: `matchPassword(enteredPassword)`.

### Movie (`Movie`)
- **Fields**: `title`, `description`, `releaseDate`, `genres`, `director`, `cast`, `posterUrl`, `trailerUrl`, `durationMinutes`, `averageRating`, `totalRatings`.
- **Indexes**: Text index on title, description, genres, director. Indexes on genres, averageRating.

### Music (`Artist`, `Album`, `Song`)
- **Artist**: `name`, `bio`, `imageUrl`, `genres`. Text index on name.
- **Album**: `title`, `artist` (Ref: Artist), `releaseDate`, `coverUrl`.
- **Song**: `title`, `artist` (Ref: Artist), `album` (Ref: Album), `durationSeconds`, `previewUrl`, `genres`, `averageRating`. Text index on title, genres.

### Sports (`Team`, `Player`, `Match`)
- **Team**: `name`, `sport`, `logoUrl`. Text index on name, sport.
- **Player**: `name`, `team` (Ref: Team), `sport`, `role`, `imageUrl`. Text index on name.
- **Match**: `title`, `sport`, `teamA` (Ref: Team), `teamB` (Ref: Team), `startTime`, `status` (UPCOMING/LIVE/COMPLETED), `score`.

### Rating (`Rating`)
- **Fields**: `user` (Ref: User), `onModel` (Movie/Song/Match), `contentId` (Dynamic Ref), `ratingValue` (PERFECT/LOVED IT/GOOD/AVERAGE/SKIP), `numericValue`.
- **Uniqueness**: Compound unique index on `{ user, contentId, onModel }` preventing multiple ratings.

### Review (`Review`)
- **Fields**: `user` (Ref: User), `onModel` (Movie/Song/Album/Artist/Match), `contentId` (Dynamic Ref), `text`, `likesCount`.
- **Indexes**: On `contentId/onModel`, and `user`.

### Watchlist (`Watchlist`)
- **Fields**: `user` (Ref: User), `movie` (Ref: Movie), `watched` (Boolean).
- **Uniqueness**: Compound unique index on `{ user, movie }`.

### Collection (`Collection`)
- **Fields**: `user` (Ref: User), `title`, `description`, `isPublic`, `items` (Array of Dynamic Refs).

### Social (`Follow`)
- **Fields**: `follower` (Ref: User), `onModel` (User/Artist/Team/Player), `followingId` (Dynamic Ref).
- **Uniqueness**: Compound unique index on `{ follower, followingId, onModel }`.

### Social (`Favorite`)
- *Not currently verified* (File exists but detailed schema not explicitly mapped here, likely similar to Follow).

### Notification (`Notification`)
- *Not currently verified* (File exists but schema structure is abstracted).
