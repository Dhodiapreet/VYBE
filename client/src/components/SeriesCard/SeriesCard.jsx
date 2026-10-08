import React from 'react';
import { Link } from 'react-router-dom';
import './SeriesCard.css';

export default function SeriesCard({ series }) {
  const year = series.releaseDate ? new Date(series.releaseDate).getFullYear() : '';
  const genre = series.genres?.[0] || '';
  const rating = series.averageRating ? series.averageRating.toFixed(1) : 'NR';
  const poster = series.posterUrl || 'https://via.placeholder.com/300x450/16171d/aa3bff?text=No+Poster';
  return (
    <Link to={`/series/${series.tmdbId}`} className="series-card">
      <div className="series-poster-wrapper">
        <img src={poster} alt={series.title} className="series-poster" loading="lazy" />
        <div className="series-overlay"><span className="series-play">▶</span></div>
      </div>
      <div className="series-info">
        <h3 title={series.title}>{series.title}</h3>
        <div className="series-meta">
          {year && <span>{year}</span>}
          {genre && <><span>•</span><span>{genre}</span></>}
          <span>•</span><span>★ {rating}</span>
        </div>
      </div>
    </Link>
  );
}
