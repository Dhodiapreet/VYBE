const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('../movies/movie.model');
const { Song } = require('../music/music.model');

// Basic rule-based recommendations
exports.getRecommendations = asyncHandler(async (req, res) => {
  const [movies, songs] = await Promise.all([
    Movie.find().sort({ averageRating: -1 }).limit(5),
    Song.find().sort({ averageRating: -1 }).limit(5)
  ]);
  res.status(200).json(new ApiResponse(200, { movies, songs }));
});

exports.getSurprise = asyncHandler(async (req, res) => {
  const count = await Movie.countDocuments();
  const random = Math.floor(Math.random() * count);
  const movie = await Movie.findOne().skip(random);
  res.status(200).json(new ApiResponse(200, movie));
});
