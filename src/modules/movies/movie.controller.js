const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const Movie = require('./movie.model');
const ApiError = require('../../utils/ApiError');
const tmdbService = require('./tmdb.service');
const Rating = require('../ratings/rating.model');
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
    cast = tmdb.credits.cast.slice(0, 10).map(c => c.name);
  }

  const crew = Array.isArray(tmdb.credits?.crew) ? tmdb.credits.crew : [];
  const uniqueCrew = (jobs) => [...new Set(
    crew
      .filter(c => jobs.includes(c.job) && c.name)
      .map(c => c.name)
  )];

  const writers = uniqueCrew(['Writer', 'Screenplay', 'Story', 'Novel']);
  const producers = uniqueCrew(['Producer', 'Co-Producer', 'Executive Producer']);
  const musicBy = uniqueCrew(['Original Music Composer', 'Music', 'Composer', 'Music Supervisor']);
  const cinematographyBy = uniqueCrew(['Director of Photography', 'Cinematography']);
  const editors = uniqueCrew(['Editor']);

  const productionCompanies = Array.isArray(tmdb.production_companies)
    ? tmdb.production_companies.map(c => c.name).filter(Boolean)
    : [];
  const productionCountries = Array.isArray(tmdb.production_countries)
    ? tmdb.production_countries.map(c => c.name).filter(Boolean)
    : [];
  const spokenLanguages = Array.isArray(tmdb.spoken_languages)
    ? tmdb.spoken_languages.map(l => l.english_name || l.name).filter(Boolean)
    : [];
  const keywords = Array.isArray(tmdb.keywords?.keywords)
    ? tmdb.keywords.keywords.map(k => k.name).filter(Boolean)
    : [];

  const payload = {
    title: tmdb.title || tmdb.name || 'Unknown Title',
    originalTitle: tmdb.original_title || tmdb.title || tmdb.original_name || null,
    description: tmdb.overview || 'No description available',
    releaseDate: tmdb.release_date ? new Date(tmdb.release_date) : null,
    genres,
    posterUrl: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : null,
    backdropUrl: tmdb.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}` : null,
    averageRating: tmdb.vote_average ? Number((tmdb.vote_average / 2).toFixed(1)) : 0,
    totalRatings: tmdb.vote_count || 0,
    voteCount: tmdb.vote_count || 0,
    popularity: tmdb.popularity || 0,
    budget: tmdb.budget || 0,
    revenue: tmdb.revenue || 0,
    status: tmdb.status || null,
    tagline: tmdb.tagline || null,
    originalLanguage: tmdb.original_language || null,
    writers,
    producers,
    musicBy,
    cinematographyBy,
    editors,
    productionCompanies,
    productionCountries,
    spokenLanguages,
    keywords,
    imdbId: tmdb.external_ids?.imdb_id || null,
    homepage: tmdb.homepage || null,
  };

  if (director) payload.director = director;
  if (cast.length > 0) payload.cast = cast;
  if (trailerUrl) payload.trailerUrl = trailerUrl;
  if (tmdb.runtime) payload.durationMinutes = tmdb.runtime;

  return payload;
};

const getMovieCertification = (tmdb, region = 'IN') => {
  const releases = tmdb.release_dates?.results || [];
  const regionData = releases.find(item => item.iso_3166_1 === region) || releases[0];
  const certification = regionData?.release_dates?.map(item => item.certification).find(Boolean);
  return certification || null;
};

const getWatchProviders = (tmdb, region = 'IN') => {
  const providers = tmdb['watch/providers']?.results?.[region] || {};
  const all = [
    ...(providers.flatrate || []),
    ...(providers.rent || []),
    ...(providers.buy || [])
  ];
  const unique = new Map();
  all.forEach(provider => {
    if (provider.provider_id && provider.provider_name && !unique.has(provider.provider_id)) {
      unique.set(provider.provider_id, {
        id: provider.provider_id,
        name: provider.provider_name,
        logoUrl: provider.logo_path ? 'https://image.tmdb.org/t/p/w185' + provider.logo_path : null
      });
    }
  });
  return {
    link: providers.link || null,
    providers: [...unique.values()].slice(0, 12)
  };
};

const buildMoviePresentationData = (tmdb) => {
  const castDetails = (tmdb.credits?.cast || []).slice(0, 12).map(person => ({
    id: person.id,
    name: person.name,
    character: person.character || null,
    department: person.known_for_department || 'Acting',
    profileUrl: person.profile_path
      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
      : null
  }));

  const preferredCrewJobs = [
    'Director',
    'Writer',
    'Screenplay',
    'Story',
    'Producer',
    'Executive Producer',
    'Original Music Composer',
    'Music',
    'Composer',
    'Director of Photography',
    'Cinematography',
    'Editor'
  ];

  const crewDetails = (tmdb.credits?.crew || [])
    .filter(person => preferredCrewJobs.includes(person.job))
    .slice(0, 30)
    .map(person => ({
      id: person.id,
      name: person.name,
      job: person.job,
      department: person.department || null,
      profileUrl: person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : null
    }));

  const productionDetails = (tmdb.production_companies || []).map(company => ({
    id: company.id,
    name: company.name,
    logoUrl: company.logo_path
      ? `https://image.tmdb.org/t/p/w185${company.logo_path}`
      : null
  }));

  return {
    castDetails,
    crewDetails,
    productionDetails
  };
};

const getVibeAnalytics = async (movieId, tmdbRating = 0) => {
  const rows = await Rating.aggregate([
    { $match: { contentId: movieId, onModel: 'Movie' } },
    { $group: { _id: '$ratingValue', count: { $sum: 1 } } }
  ]);

  const values = {
    PERFECT: 5,
    'LOVED IT': 4,
    LOVED_IT: 4,
    GOOD: 3,
    AVERAGE: 2,
    SKIP: 1
  };

  const normalized = rows
    .map(row => ({ key: row._id, count: row.count }))
    .filter(row => values[row.key]);

  const totalVotes = normalized.reduce((sum, row) => sum + row.count, 0);

  if (totalVotes === 0) {
    return {
      source: 'TMDB',
      score: Math.round((tmdbRating || 0) * 10),
      totalVotes: 0,
      breakdown: [],
      label: 'TMDB rating'
    };
  }

  const breakdownMap = new Map(normalized.map(row => [row.key, row.count]));
  const ordered = [
    ['SKIP', 'Skip', '#ff5b7d', 1],
    ['AVERAGE', 'Average', '#ffbf00', 2],
    ['GOOD', 'Good', '#00d4a5', 3],
    ['LOVED IT', 'Loved It', '#7d39eb', 4],
    ['LOVED_IT', 'Loved It', '#7d39eb', 4],
    ['PERFECT', 'Perfect', '#b14cff', 5]
  ];

  const merged = new Map();
  ordered.forEach(([key, label, color, score]) => {
    const count = breakdownMap.get(key) || 0;
    if (!count) return;
    const existing = merged.get(label);
    merged.set(label, {
      label,
      count: (existing?.count || 0) + count,
      color,
      score
    });
  });

  const breakdown = [...merged.values()].map(item => ({
    label: item.label,
    count: item.count,
    percent: Number(((item.count / totalVotes) * 100).toFixed(1)),
    color: item.color
  }));

  const weighted = normalized.reduce((sum, row) => sum + row.count * values[row.key], 0) / totalVotes;

  return {
    source: 'VYBE',
    score: Math.round(weighted * 20),
    totalVotes,
    breakdown,
    label: 'VYBE community votes'
  };
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
  let movie;
  if (mongoose.isValidObjectId(req.params.id)) {
    movie = await Movie.findById(req.params.id);
  }

  if (!movie && /^\d+$/.test(req.params.id)) {
    try {
      const tmdb = await tmdbService.getMovieDetails(Number(req.params.id));
      const [normalized] = await syncTmdbMoviesToDb([tmdb]);
      movie = normalized;
    } catch (e) {
      console.warn('Failed to resolve direct TMDB movie ID:', e.message);
    }
  }

  if (!movie) throw new ApiError(404, 'Movie not found');

  let tmdbReviews = [];
  let presentation = { castDetails: [], crewDetails: [], productionDetails: [] };
  let vibe = null;

  if (movie.tmdbId) {
    try {
      const fullTmdb = await tmdbService.getMovieDetails(movie.tmdbId);
      const fullMapped = mapTmdbToVybeMovie(fullTmdb);
      Object.assign(movie, fullMapped);
      await movie.save();

      presentation = {
        ...buildMoviePresentationData(fullTmdb),
        certification: getMovieCertification(fullTmdb),
        watchProviders: getWatchProviders(fullTmdb)
      };

      tmdbReviews = (fullTmdb.reviews?.results || []).map(review => ({
        id: review.id,
        author: review.author,
        authorDetails: review.author_details || {},
        content: review.content,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        url: review.url
      }));

      vibe = await getVibeAnalytics(movie._id, fullTmdb.vote_average || 0);
    } catch (e) {
      console.warn('Failed to upgrade movie from TMDB:', e.message);
    }
  }

  res.status(200).json(new ApiResponse(200, {
    ...movie.toObject(),
    ...presentation,
    tmdbReviews,
    vibe
  }, 'Movie fetched successfully'));
});

exports.createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(new ApiResponse(201, movie, 'Movie created successfully'));
});

const getTmdbList = async (req, res, fetcher, successMessage, fallbackMessage) => {
  const page = req.query.page || 1;
  try {
    const data = await fetcher(page);
    const localMovies = await syncTmdbMoviesToDb(data.results || []);
    return res.status(200).json(new ApiResponse(200, { ...data, results: localMovies }, successMessage));
  } catch (err) {
    const movies = await Movie.find().limit(20).sort({ averageRating: -1 });
    return res.status(200).json(new ApiResponse(200, { page: 1, results: movies, total_pages: 1, total_results: movies.length }, fallbackMessage));
  }
};

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

exports.getTmdbPopular = asyncHandler(async (req, res) =>
  getTmdbList(req, res, tmdbService.getPopularMovies, 'Popular movies fetched and normalized', 'Fallback to local movies')
);

exports.getTmdbTopRated = asyncHandler(async (req, res) =>
  getTmdbList(req, res, tmdbService.getTopRatedMovies, 'Top rated movies fetched and normalized', 'Fallback to local movies')
);

exports.getTmdbNowPlaying = asyncHandler(async (req, res) =>
  getTmdbList(req, res, tmdbService.getNowPlayingMovies, 'Now playing movies fetched and normalized', 'Fallback to local movies')
);

exports.getTmdbUpcoming = asyncHandler(async (req, res) =>
  getTmdbList(req, res, tmdbService.getUpcomingMovies, 'Upcoming movies fetched and normalized', 'Fallback to local movies')
);

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

exports.getTmdbSimilar = asyncHandler(async (req, res) => {
  try {
    const data = await tmdbService.getSimilarMovies(req.params.tmdbId, req.query.page || 1);
    const localMovies = await syncTmdbMoviesToDb(data.results || []);
    res.status(200).json(new ApiResponse(200, { ...data, results: localMovies }, 'Similar movies fetched and normalized'));
  } catch (err) {
    res.status(200).json(new ApiResponse(200, { page: 1, results: [], total_pages: 0, total_results: 0 }, 'No similar movies available'));
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
