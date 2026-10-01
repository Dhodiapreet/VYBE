const express = require('express');
const { getRecommendations, getSurprise } = require('./recommendation.controller');
const router = express.Router();
router.get('/', getRecommendations);
router.get('/surprise', getSurprise);
module.exports = router;
