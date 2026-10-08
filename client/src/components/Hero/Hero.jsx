import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

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

export default function Hero({ featuredMovie, trailerUrl }) {
  const bgImage =
    featuredMovie?.backdropUrl ||
    featuredMovie?.posterUrl ||
    'https://via.placeholder.com/1600x900/16171d/aa3bff?text=VYBE+Originals';

  const trailerId = getYouTubeId(trailerUrl || featuredMovie?.trailerUrl);
  const trailerSrc = trailerId
    ? `https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${trailerId}&iv_load_policy=3&disablekb=1`
    : null;

  return (
    <div className="home-hero-container">
      <div
        className={`home-hero-background ${trailerSrc ? 'has-trailer' : ''}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {trailerSrc && (
          <iframe
            className="home-hero-trailer"
            src={trailerSrc}
            title={`${featuredMovie?.title || 'Featured movie'} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            aria-hidden="true"
          />
        )}
        <div className="home-hero-video-cover"></div>
        <div className="home-hero-gradient"></div>
      </div>

      <div className="home-hero-content">
        {trailerId && <div className="home-hero-trailer-label">NOW PLAYING · TRAILER</div>}
        <h1 className="home-hero-title">{featuredMovie?.title || 'Welcome to VYBE'}</h1>

        {featuredMovie && (
          <div className="home-hero-meta">
            {featuredMovie.releaseDate && <span>{new Date(featuredMovie.releaseDate).getFullYear()}</span>}
            {featuredMovie.genres && <span>{featuredMovie.genres.join(' • ')}</span>}
            {featuredMovie.durationMinutes && <span>{Math.floor(featuredMovie.durationMinutes / 60)}h {featuredMovie.durationMinutes % 60}m</span>}
            {featuredMovie.averageRating > 0 && <span className="home-hero-rating">★ {featuredMovie.averageRating.toFixed(1)}</span>}
          </div>
        )}

        <p className="home-hero-description">
          {featuredMovie?.description || 'Your ultimate destination for cinematic experiences. Explore curated lists, top picks, and exclusive content tailored just for you.'}
        </p>
        <div className="home-hero-actions">
          <Link to="/movies" className="btn-primary">
            Explore Movies
          </Link>
          {trailerUrl && (
            <a href={trailerUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              Watch Trailer
            </a>
          )}
          <Link to="/search" className="btn-secondary">
            Discover Your VYBE
          </Link>
        </div>
      </div>
    </div>
  );
}
