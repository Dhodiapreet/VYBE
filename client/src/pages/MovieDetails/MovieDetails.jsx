import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import ReviewList from '../../components/Reviews/ReviewList';
import ReviewComposer from '../../components/Reviews/ReviewComposer';
import InlineReviewComposer from '../../components/Reviews/InlineReviewComposer';
import './MovieDetails.css';

import { apiRequest } from '../../services/api';

const VIBE_LEVELS = [
  { label: 'Skip', color: '#ff5b7d', min: 0 },
  { label: 'Timepass', color: '#ffbf00', min: 40 },
  { label: 'Go for It', color: '#00d4a5', min: 60 },
  { label: 'Perfection', color: '#a43cff', min: 80 }
];

const getVibeLevel = (score = 0) => {
  return [...VIBE_LEVELS].reverse().find(level => score >= level.min) || VIBE_LEVELS[0];
};

const GENRE_COLORS = ['#1459c7', '#5b20bd', '#8b5a3c', '#ffbf00'];

const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
    const parts = parsed.pathname.split('/').filter(Boolean);
    const embedIndex = parts.indexOf('embed');
    return embedIndex >= 0 ? parts[embedIndex + 1] : null;
  } catch {
    return null;
  }
};

const buildGenreVibeChart = (genres = []) => {
  const uniqueGenres = [...new Set(genres.filter(Boolean))].slice(0, 4);
  if (!uniqueGenres.length) {
    return [{ label: 'Unclassified', percent: 100, color: '#6b6b76' }];
  }

  const percent = Number((100 / uniqueGenres.length).toFixed(1));
  return uniqueGenres.map((label, index) => ({
    label,
    percent: index === uniqueGenres.length - 1
      ? Number((100 - percent * (uniqueGenres.length - 1)).toFixed(1))
      : percent,
    color: GENRE_COLORS[index % GENRE_COLORS.length]
  }));
}

export default function MovieDetails() {
  const { id, tmdbId } = useParams();
  const contentId = id || tmdbId;
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local interaction state
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collections] = useState([
    { id: 'c1', name: 'Sci-Fi Masterpieces', hasMovie: false },
    { id: 'c2', name: 'Weekend Binge', hasMovie: true }
  ]);

  const currentUserUsername = 'janedoe';

  const [reviews, setReviews] = useState([]);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const { addNotification } = useNotifications();
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    // Scroll to top when ID changes
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(tmdbId ? `/movies/tmdb/${tmdbId}` : `/movies/${id}`);
        if (res && res.data) {
          setMovie(res.data);
          setVibe(res.data.vibe || null);
          setTmdbReviews(res.data.tmdbReviews || []);

          if (res.data.tmdbId) {
            try {
              const similarRes = await apiRequest(`/movies/tmdb/similar/${res.data.tmdbId}`);
              setSimilarMovies(similarRes?.data?.results || []);
            } catch (similarError) {
              console.warn('Could not fetch similar movies:', similarError.message);
              setSimilarMovies([]);
            }
          } else {
            setSimilarMovies([]);
          }

          try {
            const reviewsRes = await apiRequest(`/reviews?movie=${movie._id || contentId}`);
            const normalizedReviews = (reviewsRes?.data || [])
              .filter(review => review.onModel === 'Movie' && String(review.contentId) === String(movie?._id || contentId))
              .map(review => ({
                id: review._id,
                username: review.user?.username || 'user',
                displayName: review.user?.username || 'User',
                avatar: (review.user?.username || 'U').charAt(0).toUpperCase(),
                rating: review.rating?.numericValue || 0,
                date: review.createdAt || review.updatedAt,
                content: review.text || '',
                hasSpoilers: false,
                likes: review.likesCount || 0,
                isLikedByMe: false
              }));
            setReviews(normalizedReviews);
          } catch (error) {
            console.warn('Could not fetch reviews:', error.message);
            setReviews([]);
          }
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error('Failed to load movie', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, tmdbId]);

  if (loading) {
    return (
      <div className="movie-details-page moctale-detail-page">
        <Header />
        <main className="loading-container">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page moctale-detail-page">
        <Header />
        <main className="not-found-container">
          <h2>Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate('/movies')}>
            Back to Movies
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown';
  const vibeLevel = getVibeLevel(vibe?.score || 0);
  const vibeChart = buildGenreVibeChart(movie.genres || []);
  const trailerId = getYouTubeId(movie.trailerUrl);

  const handleOpenCollectionModal = () => {
    setIsCollectionModalOpen(true);
  };

  const handleOpenComposer = (review = null) => {
    setReviewToEdit(review);
    setIsComposerOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      if (reviewData.content || reviewData.text) {
        await apiRequest('/reviews', {
          method: 'POST',
          body: JSON.stringify({
            onModel: 'Movie',
            contentId: movie._id || contentId,
            text: reviewData.content || reviewData.text
          })
        });
      }
      if (reviewData.rating) {
        let rv = 'GOOD';
        if (reviewData.rating >= 9) rv = 'PERFECT';
        else if (reviewData.rating >= 7) rv = 'LOVED IT';
        else if (reviewData.rating <= 4) rv = 'SKIP';
        else if (reviewData.rating <= 6) rv = 'AVERAGE';

        await apiRequest('/ratings', {
          method: 'POST',
          body: JSON.stringify({
            onModel: 'Movie',
            contentId: movie._id || contentId,
            ratingValue: rv,
            numericValue: reviewData.rating
          })
        });
      }

      // Fallback local update for UI
      const newReview = {
        id: `new-${Date.now()}`,
        movieId: movie._id || contentId,
        username: currentUserUsername,
        displayName: 'You',
        avatar: 'Y',
        date: new Date().toISOString(),
        likes: 0,
        isLikedByMe: false,
        ...reviewData
      };
      setReviews(prev => [newReview, ...prev]);

      addNotification({ type: 'milestone', actor: { name: 'VYBE', avatar: 'vybe' }, action: 'You posted a review for', target: { title: movie?.title, id: movie?._id || contentId } });
    } catch (err) {
      console.error('Failed to submit review/rating', err);
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  const handleToggleLike = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        if (!r.isLikedByMe) {
          addNotification({ type: 'like', actor: { name: 'You', avatar: 'vybe' }, action: 'liked a review by', target: { title: r.displayName, id: movie?._id || contentId } });
        }
        return {
          ...r,
          isLikedByMe: !r.isLikedByMe,
          likes: r.isLikedByMe ? r.likes - 1 : r.likes + 1
        };
      }
      return r;
    }));
  };

  const currentUserReview = reviews.find(r => r.username === currentUserUsername);

  return (
    <div className="movie-details-page moctale-detail-page">
      <Header />

      <main className="movie-details-main">
        {/* Cinematic Backdrop Hero */}
        <section className={`movie-hero ${trailerId ? 'has-hero-trailer' : ''}`} style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}>
          {trailerId && (
            <div className="hero-trailer-media" aria-hidden="true">
              <iframe
                className="hero-trailer-iframe"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${trailerId}&iv_load_policy=3&disablekb=1`}
                title={`${movie.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex="-1"
              />
            </div>
          )}
          <div className="hero-trailer-fallback" aria-hidden="true"></div>
          <div className="hero-overlay">
            <div className="breadcrumbs">
              <Link to="/movies">Movies</Link>
              <span className="separator">/</span>
              <span className="current">{movie.title}</span>
            </div>

            <div className="hero-content">
              <div className="hero-poster-container">
                <img src={movie.posterUrl} alt={movie.title} className="hero-poster" />
              </div>

              <div className="hero-info">
                <h1 className="movie-title-large">{movie.title}</h1>

                <div className="movie-metadata-row">
                  <span className="meta-item year">{releaseYear}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item rating">★ {movie.averageRating?.toFixed(1) || 'NR'}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item runtime">{movie.durationMinutes ? `${Math.floor(movie.durationMinutes / 60)}h ${movie.durationMinutes % 60}m` : (movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown runtime')}</span>
                </div>
                <div className="context-badges">
                  <span className="context-badge">Movie</span>
                  {movie.productionCountries?.[0] && <span className="context-badge">{movie.productionCountries[0]}</span>}
                  {movie.originalLanguage && <span className="context-badge">{movie.originalLanguage.toUpperCase()}</span>}
                  {movie.certification && <span className="context-badge rating-badge">Age {movie.certification}</span>}
                  {movie.genres?.map(genre => <span key={genre} className="context-badge genre-badge">{genre}</span>)}
                </div>

                <p className="movie-description">{movie.description}</p>

                <div className="crew-info">
                  {movie.director && (
                    <div className="crew-block">
                      <span className="crew-label">Director</span>
                      <span className="crew-value">{movie.director}</span>
                    </div>
                  )}
                  {movie.writers?.length > 0 && (
                    <div className="crew-block">
                      <span className="crew-label">Writers</span>
                      <span className="crew-value">{movie.writers.join(', ')}</span>
                    </div>
                  )}
                  {movie.musicBy?.length > 0 && (
                    <div className="crew-block">
                      <span className="crew-label">Music</span>
                      <span className="crew-value">{movie.musicBy.join(', ')}</span>
                    </div>
                  )}
                  {movie.producers?.length > 0 && (
                    <div className="crew-block">
                      <span className="crew-label">Producers</span>
                      <span className="crew-value">{movie.producers.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    className="btn-primary action-btn"
                    onClick={() => movie.trailerUrl && window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer')}
                    disabled={!movie.trailerUrl}
                    title={movie.trailerUrl ? 'Watch trailer' : 'Trailer unavailable'}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Trailer
                  </button>
                  <button
                    className={`btn-secondary action-btn ${isInWatchlist ? 'active' : ''}`}
                    onClick={() => { setIsInWatchlist(!isInWatchlist); if (!isInWatchlist) addNotification({ type: 'watchlist', actor: { name: 'You', avatar: 'vybe' }, action: 'added', target: { title: movie.title, id: movie._id }, actionSuffix: 'to your watchlist' }); }}
                  >
                    <svg viewBox="0 0 24 24" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2-2z"></path>
                    </svg>
                    {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                  </button>
                  <button
                    className="btn-secondary action-btn"
                    onClick={handleOpenCollectionModal}                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Collect
                  </button>
                  <Link to={`/movies/${movie?._id || contentId}/discussions`} className="btn-secondary action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Discussions
                  </Link>
                  <button
                    className="btn-outline action-btn"
                    onClick={() => handleOpenComposer(currentUserReview)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {currentUserReview ? 'Edit Rating' : 'Rate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {movie.castDetails?.length > 0 && (
          <section className="people-section">
            <div className="section-header">
              <h2 className="section-title">Cast</h2>
            </div>
            <div className="people-scroller">
              {movie.castDetails.map(person => (
                <Link to={`/people/actor/${person.id}`} key={person.id} className="person-card person-card-link">
                  <div className="person-image-wrap">
                    {person.profileUrl ? (
                      <img src={person.profileUrl} alt={person.name} className="person-image" loading="lazy" />
                    ) : (
                      <div className="person-image person-placeholder">{person.name.charAt(0)}</div>
                    )}
                  </div>
                  <strong>{person.name}</strong>
                  {person.character && <span>{person.character}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {movie.crewDetails?.length > 0 && (
          <section className="people-section">
            <div className="section-header">
              <h2 className="section-title">Crew</h2>
            </div>
            <div className="people-scroller">
              {movie.crewDetails
                .filter((person, index, self) => index === self.findIndex(p => p.name === person.name && p.job === person.job))
                .slice(0, 12)
                .map(person => (
                  <Link to={`/people/actor/${person.id}`} key={`${person.id}-${person.job}`} className="person-card person-card-link">
                    <div className="person-image-wrap">
                      {person.profileUrl ? (
                        <img src={person.profileUrl} alt={person.name} className="person-image" loading="lazy" />
                      ) : (
                        <div className="person-image person-placeholder">{person.name.charAt(0)}</div>
                      )}
                    </div>
                    <strong>{person.name}</strong>
                    <span>{person.job}</span>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {movie.watchProviders?.providers?.length > 0 && (
          <section className="watch-providers-section">
            <div className="section-header">
              <h2 className="section-title">Where to Watch</h2>
              <span className="providers-region">India</span>
            </div>
            <div className="watch-providers-grid">
              {movie.watchProviders.providers.map(provider => (
                <div key={provider.id} className="watch-provider-card">
                  {provider.logoUrl ? <img src={provider.logoUrl} alt={provider.name} loading="lazy" /> : <span>{provider.name.charAt(0)}</span>}
                  <strong>{provider.name}</strong>
                </div>
              ))}
            </div>
            {movie.watchProviders.link && (
              <a href={movie.watchProviders.link} target="_blank" rel="noreferrer" className="watch-providers-link">See all viewing options</a>
            )}
          </section>
        )}

        {movie.productionDetails?.length > 0 && (
          <section className="production-section">
            <div className="section-header">
              <h2 className="section-title">Production</h2>
            </div>
            <div className="production-grid">
              {movie.productionDetails.map(company => (
                <div key={company.id} className="production-card">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} loading="lazy" />
                  ) : (
                    <div className="production-placeholder">{company.name.charAt(0)}</div>
                  )}
                  <span>{company.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {vibe && (
          <section className="vibe-section">
            <div className="vibe-header">
              <div>
                <p className="vibe-kicker">VYBE</p>
                <h2 className="section-title">VYBE Meter</h2>
                <p className="vibe-source">{vibe.label}</p>
              </div>
              {vibe.totalVotes > 0 && <span className="vibe-votes">{vibe.totalVotes} VYBE votes</span>}
            </div>

            <div className="vibe-layout">
              <div className="vibe-meter" aria-label={`VYBE score ${vibe.score} percent, ${vibeLevel.label}`}>
                <div
                  className="vibe-meter-ring"
                  style={{
                    '--vibe-score': `${Math.max(0, Math.min(100, vibe.score)) * 1.8}deg`,
                    '--vibe-color': vibeLevel.color
                  }}
                >
                  <div className="vibe-meter-center">
                    <strong>{vibe.score}%</strong>
                    <span className="vibe-level-label" style={{ color: vibeLevel.color }}>{vibeLevel.label}</span>
                    <small>{vibe.totalVotes > 0 ? 'VYBE score' : 'TMDB score'}</small>
                  </div>
                </div>
                <div className="vibe-category-legend">
                  {VIBE_LEVELS.map(level => (
                    <div key={level.label} className={`vibe-category-item ${vibeLevel.label === level.label ? 'active' : ''}`}>
                      <span className="vibe-category-dot" style={{ backgroundColor: level.color }} />
                      <span>{level.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vibe-chart-card">
                <div className="vibe-chart-header">
                  <h3>Vibe Chart</h3>
                  <span>TMDB genre mix</span>
                </div>
                <div className="vibe-chart-content">
                  <div
                    className="vibe-donut"
                    style={{
                      background: (() => {
                        let cursor = 0;
                        const segments = vibeChart.map(item => {
                          const start = cursor;
                          cursor += item.percent;
                          return `${item.color} ${start}% ${cursor}%`;
                        });
                        return `conic-gradient(${segments.join(', ')})`;
                      })()
                    }}
                  >
                    <div className="vibe-donut-center">
                      <strong>{vibeChart[0]?.label || 'Vibe'}</strong>
                      <span>{vibeChart[0]?.percent || 0}%</span>
                    </div>
                  </div>
                  <div className="vibe-legend">
                    {vibeChart.map(item => (
                      <div key={item.label} className="vibe-legend-row">
                        <span className="vibe-dot" style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                        <strong>{item.percent}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="movie-facts-section">
          <div className="section-header">
            <h2 className="section-title">Movie Details</h2>
          </div>
          <div className="movie-facts-grid">
            {movie.tagline && <div><strong>Tagline</strong><span>{movie.tagline}</span></div>}
            {movie.status && <div><strong>Status</strong><span>{movie.status}</span></div>}
            {movie.originalTitle && <div><strong>Original Title</strong><span>{movie.originalTitle}</span></div>}
            {movie.originalLanguage && <div><strong>Language</strong><span>{movie.originalLanguage.toUpperCase()}</span></div>}
            {movie.durationMinutes && <div><strong>Runtime</strong><span>{Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m</span></div>}
            {movie.productionCompanies?.length > 0 && <div><strong>Production</strong><span>{movie.productionCompanies.join(', ')}</span></div>}
            {movie.productionCountries?.length > 0 && <div><strong>Production Countries</strong><span>{movie.productionCountries.join(', ')}</span></div>}
            {movie.spokenLanguages?.length > 0 && <div><strong>Spoken Languages</strong><span>{movie.spokenLanguages.join(', ')}</span></div>}
            {movie.cinematographyBy?.length > 0 && <div><strong>Cinematography</strong><span>{movie.cinematographyBy.join(', ')}</span></div>}
            {movie.editors?.length > 0 && <div><strong>Editing</strong><span>{movie.editors.join(', ')}</span></div>}
            {movie.budget > 0 && <div><strong>Budget</strong><span>US$ {movie.budget.toLocaleString()}</span></div>}
            {movie.revenue > 0 && <div><strong>Revenue</strong><span>US$ {movie.revenue.toLocaleString()}</span></div>}
            {movie.voteCount > 0 && <div><strong>TMDB Votes</strong><span>{movie.voteCount.toLocaleString()}</span></div>}
            {movie.popularity > 0 && <div><strong>Popularity</strong><span>{movie.popularity.toFixed(1)}</span></div>}
            {movie.imdbId && <div><strong>IMDb</strong><span>{movie.imdbId}</span></div>}
          </div>
          {movie.keywords?.length > 0 && (
            <div className="movie-keywords">
              <strong>Keywords</strong>
              <div>{movie.keywords.map(keyword => <span key={keyword} className="keyword-chip">{keyword}</span>)}</div>
            </div>
          )}
          {movie.homepage && (
            <a href={movie.homepage} target="_blank" rel="noreferrer" className="btn-outline small movie-homepage-link">
              Official Movie Website
            </a>
          )}
        </section>

        {/* Similar/Related Movies */}
        {similarMovies.length > 0 && (
          <section className="similar-movies-section">
            <h2 className="section-title">Similar Movies</h2>
            <div className="movies-grid">
              {similarMovies.map(sm => (
                <MovieCard key={sm._id} movie={sm} />
              ))}
            </div>
          </section>
        )}

        {tmdbReviews.length > 0 && (
          <section className="social-context-section">
            <div className="section-header">
              <h2 className="section-title">TMDB Reviews</h2>
            </div>
            <div className="tmdb-review-list">
              {tmdbReviews.slice(0, 5).map(review => (
                <article key={review.id} className="tmdb-review-card">
                  <div className="tmdb-review-header">
                    <strong>{review.author}</strong>
                    <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p>{review.content}</p>
                  {review.url && <a href={review.url} target="_blank" rel="noreferrer">Read full review</a>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Social Context / Reviews */}
        <section className="social-context-section reviews-reference-section">
          <InlineReviewComposer
            username={currentUserUsername}
            initialReview={null}
            onSubmit={handleSubmitReview}
          />

          <ReviewList
            reviews={reviews}
            currentUserUsername={currentUserUsername}
            onEditReview={handleOpenComposer}
            onDeleteReview={handleDeleteReview}
            onToggleLike={handleToggleLike}
          />
        </section>

      </main>

      <Footer />

      <ReviewComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={handleSubmitReview}
        initialReview={reviewToEdit}
        movieTitle={movie.title}
      />

      {isCollectionModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCollectionModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', width: '100%', maxWidth: '400px',
            padding: '24px', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Add to Collection</h2>
              <button onClick={() => setIsCollectionModalOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer'
              }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {collections.map(c => (
                <button
                  key={c.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left'
                  }}
                  onClick={() => setIsCollectionModalOpen(false)}
                >
                  <span>{c.name}</span>
                  {c.hasMovie && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" width="16" height="16">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn-outline"
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                  setIsCollectionModalOpen(false);
                  navigate('/collections');
                }}
              >
                Create New Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
