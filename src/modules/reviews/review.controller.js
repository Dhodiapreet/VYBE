
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Review = require('./review.model');

exports.getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'username profilePicture');
  res.status(200).json(new ApiResponse(200, reviews));
});
exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });
  res.status(201).json(new ApiResponse(201, review));
});
