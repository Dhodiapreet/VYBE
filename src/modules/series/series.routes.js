const express = require('express');
const controller = require('./series.controller');
const router = express.Router();

router.get('/trending', controller.getTrending);
router.get('/popular', controller.getPopular);
router.get('/top-rated', controller.getTopRated);
router.get('/airing-today', controller.getAiringToday);
router.get('/on-the-air', controller.getOnTheAir);
router.get('/search', controller.search);
router.get('/similar/:id', controller.getSimilar);
router.get('/:id', controller.getById);

module.exports = router;
