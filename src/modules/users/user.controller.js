const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');
const User = require('./user.model');
const Follow = require('../social/follow.model');
const Review = require('../reviews/review.model');
const Rating = require('../ratings/rating.model');

exports.getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const followersCount = await Follow.countDocuments({ followingId: user._id, onModel: 'User' });
  const followingCount = await Follow.countDocuments({ follower: user._id });
  const reviewsCount = await Review.countDocuments({ user: user._id });
  const ratingsCount = await Rating.countDocuments({ user: user._id });

  let isFollowing = false;
  if (req.user) {
    const followStatus = await Follow.findOne({ follower: req.user._id, followingId: user._id, onModel: 'User' });
    isFollowing = !!followStatus;
  }

  const userProfile = {
    id: user._id,
    username: user.username,
    displayName: user.username,
    avatarUrl: user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`,
    bio: user.bio,
    stats: {
      reviews: reviewsCount,
      ratings: ratingsCount,
      followers: followersCount,
      following: followingCount
    },
    isFollowing
  };

  res.status(200).json(new ApiResponse(200, userProfile, 'User profile retrieved'));
});

exports.getFollowers = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const follows = await Follow.find({ followingId: user._id, onModel: 'User' }).populate('follower', 'username profilePicture');
  
  const followersList = follows.map(f => ({
    id: f.follower._id,
    username: f.follower.username,
    displayName: f.follower.username,
    avatarUrl: f.follower.profilePicture || `https://ui-avatars.com/api/?name=${f.follower.username}`
  }));

  res.status(200).json(new ApiResponse(200, followersList, 'Followers retrieved'));
});

exports.getFollowing = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const follows = await Follow.find({ follower: user._id }).populate('followingId', 'username profilePicture');
  
  // followingId might be populated, but it could be polymorphic. 
  // since we only populated when onModel is 'User' we filter those
  const followingList = follows.filter(f => f.onModel === 'User').map(f => ({
    id: f.followingId._id,
    username: f.followingId.username,
    displayName: f.followingId.username,
    avatarUrl: f.followingId.profilePicture || `https://ui-avatars.com/api/?name=${f.followingId.username}`
  }));

  res.status(200).json(new ApiResponse(200, followingList, 'Following retrieved'));
});
