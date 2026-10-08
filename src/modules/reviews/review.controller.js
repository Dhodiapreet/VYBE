const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Review = require('./review.model');

exports.getReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.contentId) filter.contentId = req.query.contentId;
  if (req.query.onModel) filter.onModel = req.query.onModel;

  const reviews = await Review.find(filter)
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, reviews));
});

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });
  const populated = await review.populate('user', 'username profilePicture');
  res.status(201).json(new ApiResponse(201, populated));
});
