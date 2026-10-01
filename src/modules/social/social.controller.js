const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Follow = require('./follow.model');

exports.follow = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.userId) {
    return res.status(400).json(new ApiResponse(400, null, 'Cannot follow yourself'));
  }
  const follow = await Follow.findOneAndUpdate(
    { follower: req.user._id, followingId: req.params.userId, onModel: 'User' },
    { follower: req.user._id, followingId: req.params.userId, onModel: 'User' },
    { new: true, upsert: true }
  );
  res.status(200).json(new ApiResponse(200, follow));
});
exports.unfollow = asyncHandler(async (req, res) => {
  await Follow.findOneAndDelete({ follower: req.user._id, followingId: req.params.userId, onModel: 'User' });
  res.status(200).json(new ApiResponse(200, null, 'Unfollowed successfully'));
});
