const express = require('express');
const { getNotifications, markAsRead } = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
module.exports = router;
