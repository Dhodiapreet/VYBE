import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const posterUrl = movie.posterUrl || 'https://via.placeholder.com/300x450/16171d/aa3bff?text=No+Poster';
  
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
  const genre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : '';
  const rating = movie.averageRating ? movie.averageRating.toFixed(1) : 'NR';

  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <div className="movie-poster-wrapper">
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="movie-poster"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/16171d/aa3bff?text=No+Poster';
          }}
        />
        <div className="movie-overlay">
          <button className="play-btn" aria-label="Play">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-meta">
          {releaseYear && <span className="movie-year">{releaseYear}</span>}
          {genre && (
            <>
              <span className="meta-separator">•</span>
              <span className="movie-genre">{genre}</span>
            </>
          )}
          <span className="meta-separator">•</span>
          <span className="movie-rating">★ {rating}</span>
        </div>
      </div>
    </Link>
  );
}
