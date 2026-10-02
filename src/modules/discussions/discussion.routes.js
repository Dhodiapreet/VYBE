const express = require('express');
const { 
  getDiscussionsByMovie, 
  createDiscussion, 
  toggleLike, 
  addReply 
} = require('./discussion.controller');
const { protect } = require('../../middleware/auth.middleware');
// optional auth is useful to see if user liked a discussion
const { optionalAuth } = require('../../middleware/auth.middleware'); 

const router = express.Router();

router.get('/movie/:movieId', optionalAuth, getDiscussionsByMovie);
router.post('/', protect, createDiscussion);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/replies', protect, addReply);

module.exports = router;
