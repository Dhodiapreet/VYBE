const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const ApiError = require('../../utils/apiError');
const Notification = require('./notification.model');

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('actor', 'username profilePicture')
    .sort('-createdAt')
    .limit(100);

  const formattedNotifications = notifications.map(notif => {
    return {
      id: notif._id,
      type: notif.type,
      actor: notif.actor ? { name: notif.actor.username, avatar: notif.actor.profilePicture || `https://ui-avatars.com/api/?name=${notif.actor.username}` } : { name: 'VYBE', avatar: 'vybe' },
      action: notif.action,
      target: notif.target ? { title: notif.target.title, id: notif.target.id } : null,
      actionSuffix: notif.actionSuffix,
      timestamp: notif.createdAt,
      isRead: notif.isRead
    };
  });

  res.status(200).json(new ApiResponse(200, formattedNotifications));
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  
  if (!notif) {
    throw new ApiError(404, 'Notification not found');
  }

  res.status(200).json(new ApiResponse(200, { id: notif._id, isRead: notif.isRead }));
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  res.status(200).json(new ApiResponse(200, { message: 'All notifications marked as read' }));
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  if (!notif) {
    throw new ApiError(404, 'Notification not found');
  }
  res.status(200).json(new ApiResponse(200, { message: 'Notification deleted' }));
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.status(200).json(new ApiResponse(200, { count }));
});
