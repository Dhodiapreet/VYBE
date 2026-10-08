import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SeriesCard from '../../components/SeriesCard/SeriesCard';
import ReviewList from '../../components/Reviews/ReviewList';
import ReviewComposer from '../../components/Reviews/ReviewComposer';
import InlineReviewComposer from '../../components/Reviews/InlineReviewComposer';
import { apiRequest } from '../../services/api';
import './SeriesDetails.css';

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
};

const ratingToVibe = (rating) => {
  if (rating >= 9) return 'PERFECT';
  if (rating >= 7) return 'LOVED IT';
  if (rating >= 5) return 'GOOD';
  if (rating >= 3) return 'AVERAGE';
  return 'SKIP';
};

const normalizeReview = (review) => ({
  id: review.id || review._id,
  username: review.username || review.user?.username || 'user',
  displayName: review.displayName || review.user?.username || 'User',
  avatar: review.avatar || (review.user?.username || 'U').charAt(0).toUpperCase(),
  rating: review.rating?.numericValue || review.rating || 0,
  date: review.date || review.createdAt || review.updatedAt,
  content: review.content || review.text || '',
  hasSpoilers: review.hasSpoilers || false,
  likes: review.likes || review.likesCount || 0,
  isLikedByMe: review.isLikedByMe || false
});

export default function SeriesDetails() {
  const { id } = useParams();
  const { addNotification } = useNotifications();
  const [series, setSeries] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUserUsername = 'janedoe';

  const loadSeries = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/series/' + id);
      const data = response?.data || null;
      setSeries(data);
      setReviews((data?.communityReviews || []).map(normalizeReview));
    } catch (error) {
      console.error('Failed to load series:', error);
      setSeries(null);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSeries();
  }, [id]);

  const currentUserReview = useMemo(
    () => reviews.find(review => review.username === currentUserUsername),
    [reviews]
  );

  const handleSubmitReview = async (reviewData) => {
    try {
      await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          onModel: 'Series',
          contentId: series._id,
          text: reviewData.content || reviewData.text
        })
      });

      await apiRequest('/ratings', {
        method: 'POST',
        body: JSON.stringify({
          onModel: 'Series',
          contentId: series._id,
          ratingValue: ratingToVibe(reviewData.rating),
          numericValue: reviewData.rating
        })
      });

      await loadSeries();
      addNotification({
        type: 'milestone',
        actor: { name: 'VYBE', avatar: 'vybe' },
        action: 'You posted a review for',
        target: { title: series.title, id: series._id }
      });
    } catch (error) {
      console.error('Failed to submit series review/rating:', error);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const handleToggleLike = (reviewId) => {
    setReviews(prev => prev.map(review => review.id === reviewId
      ? { ...review, isLikedByMe: !review.isLikedByMe, likes: review.isLikedByMe ? Math.max(0, review.likes - 1) : review.likes + 1 }
      : review
    ));
  };

  if (loading) {
    return <div className="series-details-page"><Header /><main className="series-details-state">Loading series details...</main><Footer /></div>;
  }

  if (!series) {
    return (
      <div className="series-details-page">
        <Header />
        <main className="series-details-state">
          <h2>Series Not Found</h2>
          <Link to="/series" className="btn-primary">Back to Series</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const releaseYear = series.releaseDate ? new Date(series.releaseDate).getFullYear() : 'Unknown';
  const vibe = series.vibe || { source: 'TMDB', score: Math.round((series.averageRating || 0) * 20), totalVotes: 0, breakdown: [], label: 'TMDB rating' };
  const vibeLevel = getVibeLevel(vibe.score || 0);
  const vibeChart = buildGenreVibeChart(series.genres || []);
  const similarSeries = series.similarSeries || [];
  const runtime = series.episodeRunTime?.length
    ? Math.round(series.episodeRunTime.reduce((sum, value) => sum + Number(value || 0), 0) / series.episodeRunTime.length)
    : null;
  const lastAirDate = series.lastAirDate
    ? new Date(series.lastAirDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  const visibleKeywords = (series.keywords || []).filter(Boolean).slice(0, 8);
  const trailerId = getYouTubeId(series.trailerUrl);

  return (
    <div className="series-details-page">
      <Header />
      <main className="series-details-main">
        <section className={`series-hero ${trailerId ? 'has-hero-trailer' : ''}`} style={{ backgroundImage: `url(${series.backdropUrl || series.posterUrl})` }}>
          {trailerId && (
            <div className="hero-trailer-media" aria-hidden="true">
              <iframe
                className="hero-trailer-iframe"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${trailerId}&iv_load_policy=3&disablekb=1`}
                title={`${series.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex="-1"
              />
            </div>
          )}
          <div className="hero-trailer-fallback" aria-hidden="true"></div>
          <div className="series-hero-overlay">
            <div className="series-breadcrumbs"><Link to="/series">Series</Link><span>/</span><span>{series.title}</span></div>
            <div className="series-hero-content">
              <div className="series-hero-poster"><img src={series.posterUrl} alt={series.title} /></div>
              <div className="series-hero-info">
                <h1>{series.title}</h1>
                {series.tagline && <p className="series-tagline">{series.tagline}</p>}
                <div className="series-meta-row">
                  <span>{releaseYear}</span><span>•</span><span>★ {series.averageRating?.toFixed(1) || 'NR'}</span>
                  <span>•</span><span>{series.numberOfSeasons} Seasons</span><span>•</span><span>{series.numberOfEpisodes} Episodes</span>
                  {series.status && <><span>•</span><span>{series.status}</span></>}
                </div>
                <div className="context-badges">
                  <span className="context-badge">Series</span>
                  {series.productionCountries?.[0] && <span className="context-badge">{series.productionCountries[0]}</span>}
                  {series.originalLanguage && <span className="context-badge">{series.originalLanguage.toUpperCase()}</span>}
                  {series.certification && <span className="context-badge rating-badge">Age {series.certification}</span>}
                  {series.genres?.map(genre => <span key={genre} className="context-badge genre-badge">{genre}</span>)}
                </div>
                {series.createdBy?.length > 0 && <p className="series-creator"><strong>Created by</strong> {series.createdBy.join(', ')}</p>}
                <p className="series-overview">{series.description}</p>
                <div className="series-hero-actions">
                  {series.trailerUrl && <button className="btn-primary" onClick={() => window.open(series.trailerUrl, '_blank', 'noopener,noreferrer')}>Watch Trailer</button>}
                  {series.homepage && <a className="btn-secondary" href={series.homepage} target="_blank" rel="noreferrer">Official Website</a>}
                  <button className="btn-outline" onClick={() => setIsComposerOpen(true)}>{currentUserReview ? 'Edit Rating' : 'Rate & Review'}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {series.cast?.length > 0 && (
          <section className="series-content-section">
            <div className="series-section-heading"><h2>Cast</h2></div>
            <div className="series-people-row">
              {series.cast.map(person => (
                <Link to={`/people/actor/${person.tmdbId || person.id}`} className="series-person-card series-person-card-link" key={person.tmdbId || person.id}>
                  <div className="series-person-photo">
                    {person.profileUrl ? <img src={person.profileUrl} alt={person.name} loading="lazy" /> : <span>{person.name.charAt(0)}</span>}
                  </div>
                  <strong>{person.name}</strong><span>{person.character || ''}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {series.crew?.length > 0 && (
          <section className="series-content-section">
            <div className="series-section-heading"><h2>Crew</h2></div>
            <div className="series-people-row">
              {series.crew.map((person, index) => (
                <Link to={`/people/actor/${person.tmdbId || person.id}`} className="series-person-card series-person-card-link" key={(person.tmdbId || person.id) + '-' + index}>
                  <div className="series-person-photo">
                    {person.profileUrl ? <img src={person.profileUrl} alt={person.name} loading="lazy" /> : <span>{person.name.charAt(0)}</span>}
                  </div>
                  <strong>{person.name}</strong><span>{person.job}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(
          series.productionDetails?.length ||
          series.networkDetails?.length ||
          series.productionCompanies?.length ||
          series.productionCountries?.length ||
          series.spokenLanguages?.length
        ) > 0 && (
          <section className="movie-facts-section series-production-details">
            <div className="section-header">
              <h2 className="section-title">Production</h2>
            </div>
            <div className="movie-facts-grid">
              {(series.productionDetails?.length > 0 || series.productionCompanies?.length > 0) && (
                <div>
                  <strong>Production Companies</strong>
                  <span>{(series.productionDetails?.length ? series.productionDetails.map(company => company.name) : series.productionCompanies).join(', ')}</span>
                </div>
              )}
              {(series.networkDetails?.length > 0 || series.networks?.length > 0) && (
                <div>
                  <strong>Networks</strong>
                  <span>{(series.networkDetails?.length ? [...new Set(series.networkDetails.map(network => network.name))] : series.networks).join(', ')}</span>
                </div>
              )}
              {series.productionCountries?.length > 0 && (
                <div>
                  <strong>Production Countries</strong>
                  <span>{series.productionCountries.join(', ')}</span>
                </div>
              )}
              {series.spokenLanguages?.length > 0 && (
                <div>
                  <strong>Spoken Languages</strong>
                  <span>{series.spokenLanguages.join(', ')}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {series.watchProviders?.providers?.length > 0 && (
          <section className="series-content-section watch-providers-section">
            <div className="series-section-heading"><h2>Where to Watch</h2><span className="providers-region">India</span></div>
            <div className="watch-providers-grid">
              {series.watchProviders.providers.map(provider => (
                <div key={provider.id} className="watch-provider-card">
                  {provider.logoUrl ? <img src={provider.logoUrl} alt={provider.name} loading="lazy" /> : <span>{provider.name.charAt(0)}</span>}
                  <strong>{provider.name}</strong>
                </div>
              ))}
            </div>
            {series.watchProviders.link && (
              <a href={series.watchProviders.link} target="_blank" rel="noreferrer" className="watch-providers-link">See all viewing options</a>
            )}
          </section>
        )}

        <section className="series-content-section vibe-section">
          <div className="series-section-heading">
            <div><p className="vibe-kicker">VYBE</p><h2>VYBE Meter</h2><p className="vibe-source">{vibe.label}</p></div>
            {vibe.totalVotes > 0 && <span className="vibe-votes">{vibe.totalVotes} VYBE votes</span>}
          </div>
          <div className="vibe-layout">
            <div className="vibe-meter" aria-label={`VYBE score ${vibe.score} percent, ${vibeLevel.label}`}>
              <div className="vibe-meter-ring" style={{ '--vibe-score': `${Math.max(0, Math.min(100, vibe.score)) * 1.8}deg`, '--vibe-color': vibeLevel.color }}>
                <div className="vibe-meter-center">
                  <strong>{vibe.score}%</strong>
                  <span className="vibe-level-label" style={{ color: vibeLevel.color }}>{vibeLevel.label}</span>
                  <small>{vibe.totalVotes ? 'VYBE score' : 'TMDB score'}</small>
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
              <div className="vibe-chart-header"><h3>Vibe Chart</h3><span>TMDB genre mix</span></div>
              <div className="vibe-chart-content">
                <div className="vibe-donut" style={{ background: `conic-gradient(${vibeChart.reduce((acc, item) => { const start = acc.cursor; acc.parts.push(`${item.color} ${start}% ${start + item.percent}%`); acc.cursor += item.percent; return acc; }, { cursor: 0, parts: [] }).parts.join(', ')})` }}>
                  <div className="vibe-donut-center">
                    <strong>{vibeChart[0]?.label || 'Vibe'}</strong>
                    <span>{vibeChart[0]?.percent || 0}%</span>
                  </div>
                </div>
                <div className="vibe-legend">{vibeChart.map(item => <div className="vibe-legend-row" key={item.label}><span className="vibe-dot" style={{ backgroundColor: item.color }}></span><span>{item.label}</span><strong>{item.percent}%</strong></div>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="movie-facts-section series-facts-section">
          <div className="section-header">
            <h2 className="section-title">Series Details</h2>
          </div>
          <div className="movie-facts-grid">
            {series.tagline && <div><strong>Tagline</strong><span>{series.tagline}</span></div>}
            {series.status && <div><strong>Status</strong><span>{series.status}{lastAirDate ? ` • Last aired ${lastAirDate}` : ''}</span></div>}
            {series.originalTitle && <div><strong>Original Title</strong><span>{series.originalTitle}</span></div>}
            {series.type && <div><strong>Type</strong><span>{series.type}</span></div>}
            {runtime && <div><strong>Episode Runtime</strong><span>{runtime} min/episode</span></div>}
            {series.numberOfSeasons != null && <div><strong>Seasons</strong><span>{series.numberOfSeasons}</span></div>}
            {series.numberOfEpisodes != null && <div><strong>Episodes</strong><span>{series.numberOfEpisodes}</span></div>}
            {series.originalLanguage && <div><strong>Language</strong><span>{series.originalLanguage.toUpperCase()}</span></div>}
            {series.spokenLanguages?.length > 0 && <div><strong>Spoken Languages</strong><span>{series.spokenLanguages.join(', ')}</span></div>}
            {series.productionCompanies?.length > 0 && <div><strong>Production</strong><span>{series.productionCompanies.join(', ')}</span></div>}
            {series.productionCountries?.length > 0 && <div><strong>Production Countries</strong><span>{series.productionCountries.join(', ')}</span></div>}
            {series.createdBy?.length > 0 && <div><strong>Created By</strong><span>{series.createdBy.join(', ')}</span></div>}
            {series.averageRating != null && <div><strong>TMDB Rating</strong><span>{series.averageRating.toFixed(1)} / 5.0</span></div>}
            {series.voteCount > 0 && <div><strong>TMDB Votes</strong><span>{series.voteCount.toLocaleString()}</span></div>}
            {series.popularity > 0 && <div><strong>Popularity</strong><span>{series.popularity.toFixed(1)}</span></div>}
            {series.imdbId && <div><strong>IMDb</strong><span>{series.imdbId}</span></div>}
          </div>
          {visibleKeywords.length > 0 && (
            <div className="movie-keywords">
              <strong>Keywords &amp; Themes</strong>
              <div>{visibleKeywords.map(keyword => <span key={keyword} className="keyword-chip">{keyword}</span>)}</div>
            </div>
          )}
        </section>

        {series.tmdbReviews?.length > 0 && (
          <section className="series-content-section">
            <div className="series-section-heading"><h2>TMDB Reviews</h2></div>
            <div className="series-review-grid">{series.tmdbReviews.slice(0, 6).map(review => <article key={review.id}><div><strong>{review.author}</strong><span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span></div><p>{review.content}</p>{review.url && <a href={review.url} target="_blank" rel="noreferrer">Read full review</a>}</article>)}</div>
          </section>
        )}

        <section className="series-content-section reviews-reference-section">
          <InlineReviewComposer
            username={currentUserUsername}
            initialReview={null}
            onSubmit={handleSubmitReview}
          />

          <ReviewList
            reviews={reviews}
            currentUserUsername={currentUserUsername}
            onEditReview={review => { setReviewToEdit(review); setIsComposerOpen(true); }}
            onDeleteReview={handleDeleteReview}
            onToggleLike={handleToggleLike}
          />
        </section>

        {similarSeries.length > 0 && (
          <section className="series-content-section">
            <div className="series-section-heading"><h2>More Series You May Like</h2></div>
            <div className="similar-series-grid">{similarSeries.filter(item => item.tmdbId !== series.tmdbId).slice(0, 12).map(item => <SeriesCard key={item.tmdbId} series={item} />)}</div>
          </section>
        )}
      </main>

      <Footer />
      <ReviewComposer isOpen={isComposerOpen} onClose={() => { setIsComposerOpen(false); setReviewToEdit(null); }} onSubmit={handleSubmitReview} initialReview={reviewToEdit} movieTitle={series.title} />
    </div>
  );
}
