const express = require('express');
const { getUsers, updateUserStatus } = require('./admin.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/users', protect, authorize('ADMIN'), getUsers);
router.patch('/users/:id/status', protect, authorize('ADMIN'), updateUserStatus);
module.exports = router;
