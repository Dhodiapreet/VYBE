const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Watchlist = require('./watchlist.model');

exports.getWatchlist = asyncHandler(async (req, res) => {
  const items = await Watchlist.find({ user: req.user._id }).populate('movie');
  res.status(200).json(new ApiResponse(200, items));
});
exports.addToWatchlist = asyncHandler(async (req, res) => {
  const item = await Watchlist.findOneAndUpdate(
    { user: req.user._id, movie: req.body.movieId },
    { user: req.user._id, movie: req.body.movieId },
    { new: true, upsert: true }
  );
  res.status(201).json(new ApiResponse(201, item));
});
exports.markWatched = asyncHandler(async (req, res) => {
  const item = await Watchlist.findByIdAndUpdate(req.params.id, { watched: true }, { new: true });
  res.status(200).json(new ApiResponse(200, item));
});
