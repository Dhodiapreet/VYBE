const express = require('express');
const { 
  getUserProfile, 
  getFollowers, 
  getFollowing 
} = require('./user.controller');
const { optionalAuth } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/:username', optionalAuth, getUserProfile);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

module.exports = router;
