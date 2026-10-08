const express = require('express');
const controller = require('./person.controller');
const router = express.Router();

router.get('/tmdb/discover', controller.discoverPeople);
router.get('/tmdb/search', controller.searchPeople);
router.get('/tmdb/:id', controller.getByTmdbId);

module.exports = router;
