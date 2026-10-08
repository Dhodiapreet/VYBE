
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Rating = require('./rating.model');

exports.createRating = asyncHandler(async (req, res) => {
  const ratingMap = {
    PERFECT: 5,
    'LOVED IT': 4,
    LOVED_IT: 4,
    GOOD: 3,
    AVERAGE: 2,
    SKIP: 1
  };
  req.body.numericValue = ratingMap[req.body.ratingValue] || req.body.numericValue || 0;
  req.body.user = req.user._id;
  const rating = await Rating.findOneAndUpdate(
    { user: req.user._id, contentId: req.body.contentId, onModel: req.body.onModel },
    req.body,
    { new: true, upsert: true }
  );
  res.status(200).json(new ApiResponse(200, rating));
});
