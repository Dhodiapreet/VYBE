
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Collection = require('./collection.model');

exports.getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ isPublic: true }).populate('user', 'username');
  res.status(200).json(new ApiResponse(200, collections));
});
exports.createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create({ ...req.body, user: req.user._id });
  res.status(201).json(new ApiResponse(201, collection));
});
