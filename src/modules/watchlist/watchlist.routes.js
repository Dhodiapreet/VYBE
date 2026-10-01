const express = require('express');
const { getWatchlist, addToWatchlist, markWatched } = require('./watchlist.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/', protect, getWatchlist);
router.post('/', protect, addToWatchlist);
router.patch('/:id/watched', protect, markWatched);
module.exports = router;
