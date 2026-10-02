const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('./movie.model');
const ApiError = require('../../utils/ApiError');
const tmdbService = require('./tmdb.service');
const mongoose = require('mongoose');

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const mapTmdbToVybeMovie = (tmdb) => {
  let genres = [];
  if (tmdb.genres && Array.isArray(tmdb.genres)) {
    genres = tmdb.genres.map(g => g.name);
  } else if (tmdb.genre_ids && Array.isArray(tmdb.genre_ids)) {
    genres = tmdb.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);
  }

  let trailerUrl = null;
  if (tmdb.videos && tmdb.videos.results) {
    const trailer = tmdb.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (trailer) trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
  }

  let director = null;
  if (tmdb.credits && tmdb.credits.crew) {
    const dir = tmdb.credits.crew.find(c => c.job === 'Director');
    if (dir) director = dir.name;
  }

  let cast = [];
  if (tmdb.credits && tmdb.credits.cast) {
    cast = tmdb.credits.cast.slice(0, 5).map(c => c.name);
  }

  const payload = {
    title: tmdb.title || tmdb.name || 'Unknown Title',
    description: tmdb.overview || 'No description available',
    releaseDate: tmdb.release_date ? new Date(tmdb.release_date) : null,
    genres: genres,
    posterUrl: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : null,
    backdropUrl: tmdb.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}` : null,
  };

  if (director) payload.director = director;
  if (cast.length > 0) payload.cast = cast;
  if (trailerUrl) payload.trailerUrl = trailerUrl;
  if (tmdb.runtime) payload.durationMinutes = tmdb.runtime;

  return payload;
};

const syncTmdbMoviesToDb = async (tmdbMovies) => {
  if (!tmdbMovies || tmdbMovies.length === 0) return [];
  
  const bulkOps = tmdbMovies.map(tmdb => {
    const mapped = mapTmdbToVybeMovie(tmdb);
    return {
      updateOne: {
        filter: { tmdbId: tmdb.id },
        update: { $set: mapped },
        upsert: true
      }
    };
  });
  
  await Movie.bulkWrite(bulkOps);
  const tmdbIds = tmdbMovies.map(t => t.id);
  // Sort them as they were returned from TMDB
  const localMovies = await Movie.find({ tmdbId: { $in: tmdbIds } });
  
  // Reorder localMovies to match tmdbMovies order based on tmdbId
  const idMap = new Map();
  localMovies.forEach(m => idMap.set(m.tmdbId, m));
  return tmdbIds.map(id => idMap.get(id)).filter(Boolean);
};
exports.syncTmdbMoviesToDb = syncTmdbMoviesToDb;

exports.getMovies = asyncHandler(async (req, res) => {
  // If we just want all local movies without TMDB fallback (e.g. for general local fetching)
  const movies = await Movie.find().limit(20).sort({ averageRating: -1 });
  res.status(200).json(new ApiResponse(200, movies, 'Movies fetched successfully'));
});

exports.getMovieById = asyncHandler(async (req, res) => {
  let movie = await Movie.findById(req.params.id);
  if (!movie) throw new ApiError(404, 'Movie not found');
  
  // If it's a TMDB movie and doesn't have durationMinutes (means it wasn't fetched with full details)
  if (movie.tmdbId && !movie.durationMinutes) {
    try {
      const fullTmdb = await tmdbService.getMovieDetails(movie.tmdbId);
      const fullMapped = mapTmdbToVybeMovie(fullTmdb);
      Object.assign(movie, fullMapped);
      await movie.save();
    } catch (e) {
      // Ignore TMDB error, return the partial movie we have
      console.warn('Failed to upgrade movie from TMDB:', e);
    }
  }

  res.status(200).json(new ApiResponse(200, movie, 'Movie fetched successfully'));
});

exports.createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(new ApiResponse(201, movie, 'Movie created successfully'));
});

exports.getTmdbTrending = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  try {
    const data = await tmdbService.getTrendingMovies(page);
    const localMovies = await syncTmdbMoviesToDb(data.results || []);
    res.status(200).json(new ApiResponse(200, { ...data, results: localMovies }, 'Trending movies fetched and normalized'));
  } catch (err) {
    // Graceful fallback
    const movies = await Movie.find().limit(20).sort({ averageRating: -1 });
    res.status(200).json(new ApiResponse(200, { page: 1, results: movies, total_pages: 1, total_results: movies.length }, 'Fallback to local movies'));
  }
});

exports.searchTmdbMovies = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) throw new ApiError(400, 'Search query is required');
  const page = req.query.page || 1;
  try {
    const data = await tmdbService.searchMovies(query, page);
    const localMovies = await syncTmdbMoviesToDb(data.results || []);
    res.status(200).json(new ApiResponse(200, { ...data, results: localMovies }, 'TMDB search results fetched and normalized'));
  } catch (err) {
    // Graceful fallback
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');
    const movies = await Movie.find({ $or: [{ title: regex }, { genres: regex }, { director: regex }] }).limit(20);
    res.status(200).json(new ApiResponse(200, { page: 1, results: movies, total_pages: 1, total_results: movies.length }, 'Fallback to local movies'));
  }
});

exports.getTmdbMovieDetails = asyncHandler(async (req, res) => {
  const tmdbId = req.params.tmdbId;
  try {
    const data = await tmdbService.getMovieDetails(tmdbId);
    const [localMovie] = await syncTmdbMoviesToDb([data]);
    res.status(200).json(new ApiResponse(200, localMovie, 'TMDB movie details fetched and normalized'));
  } catch (err) {
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) throw new ApiError(404, 'Movie not found in DB or TMDB');
    res.status(200).json(new ApiResponse(200, movie, 'Fallback to local movie'));
  }
});

exports.discoverTmdbMovies = asyncHandler(async (req, res) => {
  const queryParams = { ...req.query };
  try {
    const data = await tmdbService.discoverMovies(queryParams);
    const localMovies = await syncTmdbMoviesToDb(data.results || []);
    res.status(200).json(new ApiResponse(200, { ...data, results: localMovies }, 'TMDB discover results fetched and normalized'));
  } catch (err) {
    const movies = await Movie.find().limit(20);
    res.status(200).json(new ApiResponse(200, { page: 1, results: movies, total_pages: 1, total_results: movies.length }, 'Fallback to local movies'));
  }
});
