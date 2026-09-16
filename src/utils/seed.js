require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../modules/users/user.model');
const Movie = require('../modules/movies/movie.model');
const { Artist, Album, Song } = require('../modules/music/music.model');
const { Team, Player, Match } = require('../modules/sports/sports.model');
const Review = require('../modules/reviews/review.model');
const Rating = require('../modules/ratings/rating.model');
const Collection = require('../modules/collections/collection.model');
const Follow = require('../modules/social/follow.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const clearDB = async () => {
  await User.deleteMany();
  await Movie.deleteMany();
  await Artist.deleteMany();
  await Album.deleteMany();
  await Song.deleteMany();
  await Team.deleteMany();
  await Player.deleteMany();
  await Match.deleteMany();
  await Review.deleteMany();
  await Rating.deleteMany();
  await Collection.deleteMany();
  await Follow.deleteMany();
  console.log('Database cleared');
};

const seedData = async () => {
  try {
    await clearDB();

    // 1. Users
    const admin = await User.create({ username: 'admin', email: 'admin@vybe.com', password: 'password123', role: 'ADMIN' });
    const user1 = await User.create({ username: 'johndoe', email: 'john@example.com', password: 'password123' });
    const user2 = await User.create({ username: 'janedoe', email: 'jane@example.com', password: 'password123' });

    // 2. Movies
    const interstellar = await Movie.create({
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      releaseDate: new Date('2014-11-07'),
      genres: ['Sci-Fi', 'Drama', 'Adventure'],
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      durationMinutes: 169
    });
    const inception = await Movie.create({
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      releaseDate: new Date('2010-07-16'),
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
      durationMinutes: 148
    });

    // 3. Music
    const arRahman = await Artist.create({ name: 'A.R. Rahman', genres: ['Soundtrack', 'Indian Pop'] });
    const coldplay = await Artist.create({ name: 'Coldplay', genres: ['Alternative Rock', 'Pop'] });
    const rockstar = await Album.create({ title: 'Rockstar', artist: arRahman._id, releaseDate: new Date('2011-09-30') });
    const kunFayaKun = await Song.create({ title: 'Kun Faya Kun', artist: arRahman._id, album: rockstar._id, durationSeconds: 473, genres: ['Sufi', 'Soundtrack'] });
    const vivaLaVida = await Song.create({ title: 'Viva La Vida', artist: coldplay._id, durationSeconds: 242, genres: ['Pop'] });

    // 4. Sports
    const rcb = await Team.create({ name: 'Royal Challengers Bengaluru', sport: 'Cricket' });
    const mi = await Team.create({ name: 'Mumbai Indians', sport: 'Cricket' });
    const virat = await Player.create({ name: 'Virat Kohli', team: rcb._id, sport: 'Cricket', role: 'Batsman' });
    const rohit = await Player.create({ name: 'Rohit Sharma', team: mi._id, sport: 'Cricket', role: 'Batsman' });
    const match1 = await Match.create({ title: 'RCB vs MI', sport: 'Cricket', teamA: rcb._id, teamB: mi._id, startTime: new Date('2026-04-10T20:00:00Z'), status: 'UPCOMING' });

    // 5. Interactions (Reviews, Ratings, Collections, Follows)
    await Rating.create({ user: user1._id, onModel: 'Movie', contentId: interstellar._id, ratingValue: 'PERFECT', numericValue: 5 });
    await Review.create({ user: user1._id, onModel: 'Movie', contentId: interstellar._id, text: 'Absolutely mind-blowing visually and emotionally.', likesCount: 12 });
    
    await Collection.create({
      user: user1._id,
      title: 'Late Night Vibes',
      description: 'Perfect for 2 AM',
      items: [
        { onModel: 'Movie', contentId: interstellar._id },
        { onModel: 'Song', contentId: kunFayaKun._id }
      ]
    });

    await Follow.create({ follower: user2._id, onModel: 'User', followingId: user1._id });
    await Follow.create({ follower: user1._id, onModel: 'Player', followingId: virat._id });

    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
