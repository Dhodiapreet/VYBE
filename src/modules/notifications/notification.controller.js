const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Notification = require('./notification.model');

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json(new ApiResponse(200, notifications));
});
exports.markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.status(200).json(new ApiResponse(200, notif));
});
