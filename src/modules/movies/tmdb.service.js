const ApiError = require('../../utils/ApiError');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (endpoint, queryParams = {}) => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new ApiError(500, 'TMDB API key is not configured');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, String(queryParams[key]));
    }
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.status_message || 'TMDB API error');
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError(504, 'TMDB API request timed out');
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch from TMDB');
  }
};

exports.getTrendingMovies = async (page = 1) => {
  return fetchFromTMDB('/trending/movie/week', { page });
};

exports.searchMovies = async (query, page = 1) => {
  return fetchFromTMDB('/search/movie', { query, page });
};

exports.getMovieDetails = async (tmdbId) => {
  return fetchFromTMDB(`/movie/${tmdbId}`, { append_to_response: 'videos,credits' });
};

exports.discoverMovies = async (queryParams = {}) => {
  return fetchFromTMDB('/discover/movie', queryParams);
};
