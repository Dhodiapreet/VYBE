import React from 'react';
import './Hero.css';

export default function Hero({ featuredMovie }) {
  const bgImage = featuredMovie?.posterUrl || 'https://via.placeholder.com/1200x600/16171d/aa3bff?text=VYBE+Originals';

  return (
    <div className="hero-container">
      <div 
        className="hero-background" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-gradient"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">{featuredMovie?.title || 'Welcome to VYBE'}</h1>
        
        {featuredMovie && (
          <div className="hero-meta">
             {featuredMovie.releaseDate && <span>{new Date(featuredMovie.releaseDate).getFullYear()}</span>}
             {featuredMovie.genres && <span>{featuredMovie.genres.join(' • ')}</span>}
             {featuredMovie.durationMinutes && <span>{Math.floor(featuredMovie.durationMinutes / 60)}h {featuredMovie.durationMinutes % 60}m</span>}
             {featuredMovie.averageRating > 0 && <span className="hero-rating">★ {featuredMovie.averageRating.toFixed(1)}</span>}
          </div>
        )}

        <p className="hero-description">
          {featuredMovie?.description || 'Your ultimate destination for cinematic experiences. Explore curated lists, top picks, and exclusive content tailored just for you.'}
        </p>
        <div className="hero-actions">
          <button className="btn-primary">
            Explore Movies
          </button>
          <button className="btn-secondary">
            Discover Your VYBE
          </button>
        </div>
      </div>
    </div>
  );
}
