const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
