
const express = require('express');
const { getReviews, createReview } = require('./review.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/', getReviews);
router.post('/', protect, createReview);
module.exports = router;
