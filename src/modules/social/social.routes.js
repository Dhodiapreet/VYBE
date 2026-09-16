const express = require('express');
const { follow, unfollow } = require('./social.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/follow/:userId', protect, follow);
router.delete('/follow/:userId', protect, unfollow);
module.exports = router;
