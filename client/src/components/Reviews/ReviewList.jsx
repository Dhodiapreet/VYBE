import React, { useState } from 'react';
import StarRating from './StarRating';
import './ReviewList.css';

export default function ReviewList({ 
  reviews, 
  currentUserUsername, 
  onEditReview, 
  onDeleteReview,
  onToggleLike
}) {
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'highest', 'liked'
  const [filterSpoilers, setFilterSpoilers] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-empty-state">
        <p>No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else if (sortBy === 'liked') {
      return b.likes - a.likes;
    }
    return 0;
  });

  const filteredReviews = filterSpoilers 
    ? sortedReviews.filter(r => !r.hasSpoilers)
    : sortedReviews;

  return (
    <div className="reviews-container">
      <div className="reviews-controls">
        <div className="sort-controls">
          <label htmlFor="sort-reviews">Sort by:</label>
          <select 
            id="sort-reviews"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="select-sort"
          >
            <option value="recent">Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="liked">Most Liked</option>
          </select>
        </div>
        <div className="filter-controls">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filterSpoilers}
              onChange={(e) => setFilterSpoilers(e.target.checked)}
            />
            <span className="custom-checkbox"></span>
            Hide Spoilers
          </label>
        </div>
      </div>

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <p className="no-filtered-results">No reviews match your filters.</p>
        ) : (
          filteredReviews.map(review => {
            const isCurrentUser = review.username === currentUserUsername;
            const isSpoilerHidden = review.hasSpoilers && !revealedSpoilers[review.id];
            
            return (
              <div key={review.id} className="review-card">
                <div className="review-header-row">
                  <div className="review-user">
                    <div className="user-avatar">{review.avatar}</div>
                    <div className="user-info">
                      <span className="user-name">{review.displayName}</span>
                      <span className="user-username">@{review.username}</span>
                    </div>
                  </div>
                  <div className="review-meta">
                    <StarRating value={review.rating} readOnly size="small" />
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="review-content">
                  {isSpoilerHidden ? (
                    <div className="spoiler-warning">
                      <p>This review contains spoilers.</p>
                      <button className="btn-outline small" onClick={() => toggleSpoiler(review.id)}>
                        Reveal Spoilers
                      </button>
                    </div>
                  ) : (
                    <p className="review-text">{review.content}</p>
                  )}
                </div>

                <div className="review-footer">
                  <button 
                    className={`btn-like ${review.isLikedByMe ? 'liked' : ''}`}
                    onClick={() => onToggleLike(review.id)}
                  >
                    <svg viewBox="0 0 24 24" fill={review.isLikedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span>{review.likes} {review.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  {isCurrentUser && (
                    <div className="review-actions">
                      <button className="btn-action edit" onClick={() => onEditReview(review)}>
                        Edit
                      </button>
                      <button className="btn-action delete" onClick={() => onDeleteReview(review.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
