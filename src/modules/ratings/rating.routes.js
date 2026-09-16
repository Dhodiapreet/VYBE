
const express = require('express');
const { createRating } = require('./rating.controller');
const { protect } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/', protect, createRating);
module.exports = router;
