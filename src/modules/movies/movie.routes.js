const express = require('express');
const { getMovies, getMovieById, createMovie, getTmdbTrending, searchTmdbMovies, getTmdbMovieDetails, discoverTmdbMovies } = require('./movie.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

// TMDB Routes
router.get('/tmdb/trending', getTmdbTrending);
router.get('/tmdb/search', searchTmdbMovies);
router.get('/tmdb/discover', discoverTmdbMovies);
router.get('/tmdb/:tmdbId', getTmdbMovieDetails);

// Existing Routes
router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', protect, authorize('ADMIN'), createMovie);

module.exports = router;
