import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';
import './MovieSection.css';

export default function MovieSection({ title, movies, loading, error, showSeeAll = true, sectionLabel = null }) {
  const rowRef = useRef(null);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <section className="movie-section">
      <div className="section-header">
        <div className="section-title-group">
          {sectionLabel && <span className="section-label">{sectionLabel}</span>}
          <h2 className="section-title">{title}</h2>
        </div>
        {movies && movies.length > 0 && (
          <div className="section-actions">
            {showSeeAll && <Link to="/movies" className="see-all-link">See all</Link>}
            <div className="scroll-controls">
              <button className="scroll-btn prev" onClick={scrollLeft} aria-label="Scroll left">‹</button>
              <button className="scroll-btn next" onClick={scrollRight} aria-label="Scroll right">›</button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="movie-section-state">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="movie-section-state error">
          <p>Unable to load titles. Please try again later.</p>
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="movie-row-container">
          <div className="movie-row" ref={rowRef}>
            {movies.map((movie, index) => (
              <MovieCard key={movie._id || index} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <div className="movie-section-state empty">
          <p>No titles currently available.</p>
        </div>
      )}
    </section>
  );
}
