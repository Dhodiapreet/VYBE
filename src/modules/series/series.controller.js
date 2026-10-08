const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');
const tmdbService = require('../movies/tmdb.service');
const Series = require('./series.model');
const Rating = require('../ratings/rating.model');
const Review = require('../reviews/review.model');
const mongoose = require('mongoose');

const TV_GENRE_MAP = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids', 9648: 'Mystery',
  10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics', 37: 'Western'
};

const getSeriesCertification = (show, region = 'IN') => {
  const results = show.content_ratings?.results || [];
  const regionData = results.find(item => item.iso_3166_1 === region) || results[0];
  return regionData?.rating || null;
};

const getWatchProviders = (show, region = 'IN') => {
  const providers = show['watch/providers']?.results?.[region] || {};
  const all = [...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])];
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
  return { link: providers.link || null, providers: [...unique.values()].slice(0, 12) };
};

const mapSeries = (show) => {
  const genres = (show.genres || []).map(g => g.name).filter(Boolean);
  const mappedGenres = genres.length ? genres : (show.genre_ids || []).map(id => TV_GENRE_MAP[id]).filter(Boolean);
  const videos = show.videos?.results || [];
  const trailer = videos.find(v => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type));

  return {
    tmdbId: show.id,
    title: show.name || show.original_name || 'Unknown Series',
    originalTitle: show.original_name || show.name || null,
    description: show.overview || 'No description available',
    releaseDate: show.first_air_date ? new Date(show.first_air_date) : null,
    firstAirDate: show.first_air_date ? new Date(show.first_air_date) : null,
    lastAirDate: show.last_air_date ? new Date(show.last_air_date) : null,
    genres: mappedGenres,
    posterUrl: show.poster_path ? 'https://image.tmdb.org/t/p/w500' + show.poster_path : null,
    backdropUrl: show.backdrop_path ? 'https://image.tmdb.org/t/p/original' + show.backdrop_path : null,
    averageRating: show.vote_average ? Number((show.vote_average / 2).toFixed(1)) : 0,
    voteCount: show.vote_count || 0,
    popularity: show.popularity || 0,
    status: show.status || null,
    tagline: show.tagline || null,
    originalLanguage: show.original_language || null,
    numberOfSeasons: show.number_of_seasons || 0,
    numberOfEpisodes: show.number_of_episodes || 0,
    episodeRunTime: show.episode_run_time || [],
    type: show.type || null,
    createdBy: (show.created_by || []).map(p => p.name).filter(Boolean),
    networks: (show.networks || []).map(n => n.name).filter(Boolean),
    productionCompanies: (show.production_companies || []).map(c => c.name).filter(Boolean),
    productionDetails: (show.production_companies || []).map(c => ({
      tmdbId: c.id,
      name: c.name,
      logoUrl: c.logo_path ? 'https://image.tmdb.org/t/p/w185' + c.logo_path : null
    })),
    productionCountries: (show.production_countries || []).map(c => c.name).filter(Boolean),
    spokenLanguages: (show.spoken_languages || []).map(l => l.english_name || l.name).filter(Boolean),
    keywords: (show.keywords?.results || []).map(k => k.name).filter(Boolean),
    cast: (show.credits?.cast || []).slice(0, 12).map(p => ({
      tmdbId: p.id,
      name: p.name,
      character: p.character || null,
      profileUrl: p.profile_path ? 'https://image.tmdb.org/t/p/w185' + p.profile_path : null
    })),
    crew: (show.credits?.crew || [])
      .filter(p => ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer', 'Original Music Composer'].includes(p.job))
      .slice(0, 20)
      .map(p => ({
        tmdbId: p.id,
        name: p.name,
        job: p.job,
        profileUrl: p.profile_path ? 'https://image.tmdb.org/t/p/w185' + p.profile_path : null
      })),
    trailerUrl: trailer ? 'https://www.youtube.com/watch?v=' + trailer.key : null,
    homepage: show.homepage || null,
    imdbId: show.external_ids?.imdb_id || null,
    networkDetails: (show.networks || []).map(n => ({
      tmdbId: n.id,
      name: n.name,
      logoUrl: n.logo_path ? 'https://image.tmdb.org/t/p/w185' + n.logo_path : null
    })),
    certification: getSeriesCertification(show),
    watchProviders: getWatchProviders(show)
  };
};

const syncSeriesToDb = async (show) => {
  const mapped = mapSeries(show);
  return Series.findOneAndUpdate(
    { tmdbId: mapped.tmdbId },
    { $set: mapped },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const syncSeriesListToDb = async (shows) => Promise.all((shows || []).map(syncSeriesToDb));

const getVibeAnalytics = async (seriesId, tmdbRating = 0) => {
  const rows = await Rating.aggregate([
    { $match: { contentId: seriesId, onModel: 'Series' } },
    { $group: { _id: '$ratingValue', count: { $sum: 1 } } }
  ]);

  const values = { PERFECT: 5, 'LOVED IT': 4, LOVED_IT: 4, GOOD: 3, AVERAGE: 2, SKIP: 1 };
  const valid = rows.filter(row => values[row._id]);
  const totalVotes = valid.reduce((sum, row) => sum + row.count, 0);

  if (!totalVotes) {
    return {
      source: 'TMDB',
      score: Math.round((tmdbRating || 0) * 10),
      totalVotes: 0,
      breakdown: [],
      label: 'TMDB rating'
    };
  }

  const merged = new Map();
  const config = [
    ['SKIP', 'Skip', '#ff5b7d'],
    ['AVERAGE', 'Average', '#ffbf00'],
    ['GOOD', 'Good', '#00d4a5'],
    ['LOVED IT', 'Loved It', '#7d39eb'],
    ['LOVED_IT', 'Loved It', '#7d39eb'],
    ['PERFECT', 'Perfect', '#b14cff']
  ];

  for (const [key, label, color] of config) {
    const count = valid.find(row => row._id === key)?.count || 0;
    if (!count) continue;
    const current = merged.get(label) || { label, count: 0, color };
    current.count += count;
    merged.set(label, current);
  }

  const breakdown = [...merged.values()].map(item => ({
    label: item.label,
    count: item.count,
    percent: Number(((item.count / totalVotes) * 100).toFixed(1)),
    color: item.color
  }));

  const weighted = valid.reduce((sum, row) => sum + row.count * values[row._id], 0) / totalVotes;

  return {
    source: 'VYBE',
    score: Math.round(weighted * 20),
    totalVotes,
    breakdown,
    label: 'VYBE community votes'
  };
};

const normalizeCommunityReviews = (reviews) => reviews.map(review => ({
  id: review._id,
  username: review.user?.username || 'user',
  displayName: review.user?.username || 'User',
  avatar: (review.user?.username || 'U').charAt(0).toUpperCase(),
  rating: review.rating?.numericValue || 0,
  date: review.createdAt,
  content: review.text || '',
  hasSpoilers: false,
  likes: review.likesCount || 0,
  isLikedByMe: false
}));

const getCommunityReviews = async (seriesId) => {
  const reviews = await Review.find({ contentId: seriesId, onModel: 'Series' })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });
  return normalizeCommunityReviews(reviews);
};

const getList = (fetcher) => asyncHandler(async (req, res) => {
  const data = await fetcher(req.query.page || 1);
  const series = await syncSeriesListToDb(data.results || []);
  res.status(200).json(new ApiResponse(200, {
    ...data,
    results: series
  }, 'Series fetched'));
});

exports.getTrending = getList(tmdbService.getTrendingSeries);
exports.getPopular = getList(tmdbService.getPopularSeries);
exports.getTopRated = getList(tmdbService.getTopRatedSeries);
exports.getAiringToday = getList(tmdbService.getAiringTodaySeries);
exports.getOnTheAir = getList(tmdbService.getOnTheAirSeries);

exports.search = asyncHandler(async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) throw new ApiError(400, 'Search query is required');
  const data = await tmdbService.searchSeries(query, req.query.page || 1);
  const series = await syncSeriesListToDb(data.results || []);
  res.status(200).json(new ApiResponse(200, {
    ...data,
    results: series
  }, 'Series search results fetched'));
});

exports.getSimilar = asyncHandler(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) throw new ApiError(400, 'Invalid TMDB series ID');
  const data = await tmdbService.getSimilarSeries(Number(req.params.id), req.query.page || 1);
  const series = await syncSeriesListToDb(data.results || []);
  res.status(200).json(new ApiResponse(200, {
    ...data,
    results: series
  }, 'Similar series fetched'));
});

exports.getById = asyncHandler(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) throw new ApiError(400, 'Invalid TMDB series ID');

  const show = await tmdbService.getSeriesDetails(Number(req.params.id));
  const series = await syncSeriesToDb(show);

  const similarData = await tmdbService.getSimilarSeries(Number(req.params.id), 1);
  const similarSeries = await syncSeriesListToDb(similarData.results || []);

  const tmdbReviews = (show.reviews?.results || []).map(r => ({
    id: r.id,
    author: r.author,
    content: r.content,
    createdAt: r.created_at,
    rating: r.author_details?.rating || null,
    url: r.url
  }));

  const communityReviews = await getCommunityReviews(series._id);
  const vibe = await getVibeAnalytics(series._id, show.vote_average || 0);

  res.status(200).json(new ApiResponse(200, {
    ...series.toObject(),
    similarSeries,
    tmdbReviews,
    communityReviews,
    vibe
  }, 'Series details fetched'));
});
