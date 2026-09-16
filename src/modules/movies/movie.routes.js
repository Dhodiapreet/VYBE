const express = require('express');
const { getMovies, getMovieById, createMovie } = require('./movie.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', protect, authorize('ADMIN'), createMovie);

module.exports = router;
