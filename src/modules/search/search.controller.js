const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('../movies/movie.model');
const { Song, Artist } = require('../music/music.model');
const { Player, Team } = require('../sports/sports.model');

exports.universalSearch = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(200).json(new ApiResponse(200, [], 'Please provide a search query'));
  }

  // Regex for partial matching
  const regex = new RegExp(query, 'i');

  const [movies, songs, artists, players, teams] = await Promise.all([
    Movie.find({ $or: [{ title: regex }, { genres: regex }, { director: regex }] }).limit(5),
    Song.find({ $or: [{ title: regex }, { genres: regex }] }).limit(5),
    Artist.find({ name: regex }).limit(5),
    Player.find({ name: regex }).limit(5),
    Team.find({ name: regex }).limit(5)
  ]);

  res.status(200).json(new ApiResponse(200, {
    movies, songs, artists, players, teams
  }, 'Search results fetched successfully'));
});
