import React from 'react';
import { Link } from 'react-router-dom';
import './MoctaleMediaCard.css';
export default function MoctaleMediaCard({ item, kind = 'movie', caption = '' }) {
  const target = kind === 'series' ? '/series/' + item.tmdbId : '/movies/' + item._id;
  const poster = item.posterUrl || 'https://via.placeholder.com/400x600/111111/ffffff?text=No+Poster';
  return (
    <Link to={target} className="moctale-media-card">
      <div className="moctale-media-poster"><img src={poster} alt={item.title} loading="lazy" /></div>
      <div className="moctale-media-copy"><h3>{item.title}</h3><p>{caption || (kind === 'series' ? 'Show' : 'Movie')}</p></div>
    </Link>
  );
}