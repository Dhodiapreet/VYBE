import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './PickOfTheWeek.css';

export default function PickOfTheWeek({ mainMovie, supportingMovies }) {
  if (!mainMovie) return null;

  const bgImage = mainMovie.posterUrl || 'https://via.placeholder.com/800x600/16171d/aa3bff?text=VYBE';

  return (
    <section className="pick-of-week-section">
      <div className="section-header">
        <div className="section-title-group">
          <span className="section-label">Curated by VYBE</span>
          <h2 className="section-title">VYBE PICK OF THE WEEK</h2>
        </div>
      </div>
      
      <div className="pow-container">
        <div className="pow-main">
          <div className="pow-image-wrapper">
            <img src={bgImage} alt={mainMovie.title} className="pow-image" />
            <div className="pow-overlay">
              <button className="play-btn large" aria-label="Play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="pow-info">
            <h3 className="pow-title">{mainMovie.title}</h3>
            <p className="pow-desc">{mainMovie.description}</p>
          </div>
        </div>
        
        {supportingMovies && supportingMovies.length > 0 && (
          <div className="pow-sidebar">
            <h4 className="pow-sidebar-title">More Top Picks</h4>
            <div className="pow-grid">
              {supportingMovies.map((movie, index) => (
                <MovieCard key={movie._id || index} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
