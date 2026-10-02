const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('../movies/movie.model');
const User = require('../users/user.model');
const { Song, Artist } = require('../music/music.model');
const { Player, Team } = require('../sports/sports.model');
const tmdbService = require('../movies/tmdb.service');
const { syncTmdbMoviesToDb } = require('../movies/movie.controller');

exports.universalSearch = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(200).json(new ApiResponse(200, [], 'Please provide a search query'));
  }

  // Escape regex to prevent ReDoS and NoSQL Injection
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, 'i');

  let movies = [];
  try {
    const tmdbRes = await tmdbService.searchMovies(query, 1);
    movies = await syncTmdbMoviesToDb(tmdbRes.results || []);
    movies = movies.slice(0, 10);
  } catch (err) {
    movies = await Movie.find({ $or: [{ title: regex }, { genres: regex }, { director: regex }] }).limit(10);
  }

  const [users, songs, artists, players, teams] = await Promise.all([
    User.find({ username: regex }).select('username profilePicture bio').limit(5),
    Song.find({ $or: [{ title: regex }, { genres: regex }] }).limit(5),
    Artist.find({ name: regex }).limit(5),
    Player.find({ name: regex }).limit(5),
    Team.find({ name: regex }).limit(5)
  ]);

  res.status(200).json(new ApiResponse(200, {
    movies, users, songs, artists, players, teams
  }, 'Search results fetched successfully'));
});
