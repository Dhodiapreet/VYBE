import React, { useMemo, useState } from 'react';
import './ReviewList.css';

const getVibe = (rating = 0) => {
  if (rating >= 9) return { label: 'Perfection', className: 'perfection' };
  if (rating >= 7) return { label: 'Go For It', className: 'go-for-it' };
  if (rating >= 5) return { label: 'Timepass', className: 'timepass' };
  return { label: 'Skip', className: 'skip' };
};

const formatLikes = (count = 0) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace('.0','')}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0','')}K`;
  return String(count);
};

export default function ReviewList({
  reviews,
  currentUserUsername,
  onEditReview,
  onDeleteReview,
  onToggleLike
}) {
  const [sortBy, setSortBy] = useState('liked');
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});
  const [openMenu, setOpenMenu] = useState(null);

  const sortedReviews = useMemo(() => {
    return [...(reviews || [])].sort((a, b) => {
      if (sortBy === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'recent') return new Date(b.date || 0) - new Date(a.date || 0);
      return (b.likes || 0) - (a.likes || 0);
    });
  }, [reviews, sortBy]);

  const filteredReviews = showSpoilers ? sortedReviews : sortedReviews.filter(review => !review.hasSpoilers);

  const toggleSpoiler = id => setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="reviews-container">
      <div className="reviews-heading-row">
        <h2>User Reviews</h2>
        <div className="reviews-controls">
          <label className="review-sort-control">
          <span className="sort-icon" aria-hidden="true">↕</span>
          <select value={sortBy} onChange={event => setSortBy(event.target.value)} aria-label="Sort reviews">
            <option value="liked">Most Liked</option>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
          </select>
          <span className="sort-chevron" aria-hidden="true">⌄</span>
        </label>

        <label className="review-filter-toggle">
          <input type="checkbox" checked={showSpoilers} onChange={event => setShowSpoilers(event.target.checked)} />
          <span className="filter-box" />
          <span>Show Spoilers</span>
        </label>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="reviews-empty-state">
          <p>{reviews?.length ? 'No reviews match your filters.' : 'No reviews yet. Be the first to share your VYBE.'}</p>
        </div>
      ) : (
        <div className="reviews-list">
          {filteredReviews.map(review => {
            const isCurrentUser = review.username === currentUserUsername;
            const vibe = getVibe(review.rating);
            const isSpoilerHidden = review.hasSpoilers && !revealedSpoilers[review.id];
            const avatarImage = review.avatarUrl || review.userAvatarUrl;

            return (
              <article key={review.id} className="review-card">
                <div className="review-header-row">
                  <div className="review-user">
                    {avatarImage ? (
                      <img className="user-avatar review-avatar-image" src={avatarImage} alt="" />
                    ) : (
                      <div className="user-avatar">{(review.avatar || review.displayName || 'U').charAt(0).toUpperCase()}</div>
                    )}
                    <div className="user-info">
                      <div className="review-author-line">
                        <span className="user-name">{review.displayName}</span>
                        {review.verified && <span className="verified-badge" aria-label="Verified user">✓</span>}
                      </div>
                      <span className="review-date">{review.date ? new Date(review.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                  </div>
                  <div className={`review-vibe-badge ${vibe.className}`}>{vibe.label}</div>
                </div>

                <div className={`review-content ${isSpoilerHidden ? 'is-spoiler' : ''}`}>
                  {isSpoilerHidden ? (
                    <button className="spoiler-warning" onClick={() => toggleSpoiler(review.id)} type="button">
                      <strong>This review contains spoilers.</strong>
                      <span>Click to reveal</span>
                    </button>
                  ) : (
                    <p className="review-text">{review.content}</p>
                  )}
                </div>

                <div className="review-footer">
                  <div className="review-engagement">
                    <button className={`review-icon-button btn-like ${review.isLikedByMe ? 'liked' : ''}`} onClick={() => onToggleLike(review.id)} aria-label="Like review">
                      <svg viewBox="0 0 24 24" width="19" height="19" fill={review.isLikedByMe ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm0 11h9.28a2 2 0 0 0 1.97-1.65l1.38-7A2 2 0 0 0 17.67 10H14V5.5A3.5 3.5 0 0 0 10.5 2L7 10v11Z"/></svg>
                    </button>
                    <span>{formatLikes(review.likes)}</span>
                    {review.commentsCount != null && (
                      <>
                        <span className="review-comment-icon" aria-hidden="true">◯</span>
                        <span>{formatLikes(review.commentsCount)}</span>
                      </>
                    )}
                  </div>

                  {(isCurrentUser || review.hasSpoilers) && (
                    <div className="review-more-menu">
                      <button type="button" className="review-more-button" onClick={() => setOpenMenu(openMenu === review.id ? null : review.id)} aria-label="Review options">•••</button>
                      {openMenu === review.id && (
                        <div className="review-menu">
                          {isCurrentUser && <button type="button" onClick={() => { setOpenMenu(null); onEditReview(review); }}>Edit</button>}
                          {isCurrentUser && <button type="button" className="danger" onClick={() => { setOpenMenu(null); onDeleteReview(review.id); }}>Delete</button>}
                          {review.hasSpoilers && <button type="button" onClick={() => { setOpenMenu(null); toggleSpoiler(review.id); }}>{revealedSpoilers[review.id] ? 'Hide Spoilers' : 'Reveal Spoilers'}</button>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}