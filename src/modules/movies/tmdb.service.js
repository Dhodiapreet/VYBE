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

exports.getPopularMovies = async (page = 1) => {
  return fetchFromTMDB('/movie/popular', { page });
};

exports.getTopRatedMovies = async (page = 1) => {
  return fetchFromTMDB('/movie/top_rated', { page });
};

exports.getNowPlayingMovies = async (page = 1) => {
  return fetchFromTMDB('/movie/now_playing', { page });
};

exports.getUpcomingMovies = async (page = 1) => {
  return fetchFromTMDB('/movie/upcoming', { page });
};

exports.getSimilarMovies = async (tmdbId, page = 1) => {
  return fetchFromTMDB('/movie/' + tmdbId + '/similar', { page });
};

exports.getTrendingSeries = async (page = 1) => {
  return fetchFromTMDB('/trending/tv/week', { page });
};

exports.getPopularSeries = async (page = 1) => {
  return fetchFromTMDB('/tv/popular', { page });
};

exports.getTopRatedSeries = async (page = 1) => {
  return fetchFromTMDB('/tv/top_rated', { page });
};

exports.getAiringTodaySeries = async (page = 1) => {
  return fetchFromTMDB('/tv/airing_today', { page });
};

exports.getOnTheAirSeries = async (page = 1) => {
  return fetchFromTMDB('/tv/on_the_air', { page });
};

exports.searchSeries = async (query, page = 1) => {
  return fetchFromTMDB('/search/tv', { query, page });
};

exports.getSimilarSeries = async (tmdbId, page = 1) => {
  return fetchFromTMDB('/tv/' + tmdbId + '/similar', { page });
};

exports.getSeriesDetails = async (tmdbId) => {
  return fetchFromTMDB('/tv/' + tmdbId, {
    append_to_response: 'credits,keywords,reviews,external_ids,videos,content_ratings,watch/providers',
    language: 'en-US'
  });
};

exports.searchPeople = async (query, page = 1) => {
  return fetchFromTMDB('/search/person', { query, page, include_adult: false });
};

exports.getPopularPeople = async (page = 1) => {
  return fetchFromTMDB('/person/popular', { page });
};

exports.getTrendingPeople = async (page = 1) => {
  return fetchFromTMDB('/trending/person/week', { page });
};

exports.getPersonDetails = async (tmdbId) => {
  return fetchFromTMDB('/person/' + tmdbId, {
    append_to_response: 'combined_credits,external_ids',
    language: 'en-US'
  });
};

exports.searchMovies = async (query, page = 1) => {
  return fetchFromTMDB('/search/movie', { query, page });
};

exports.getMovieDetails = async (tmdbId) => {
  return fetchFromTMDB(`/movie/${tmdbId}`, {
    append_to_response: 'videos,credits,keywords,reviews,external_ids,release_dates,watch/providers',
    language: 'en-US'
  });
};

exports.discoverMovies = async (queryParams = {}) => {
  return fetchFromTMDB('/discover/movie', queryParams);
};
