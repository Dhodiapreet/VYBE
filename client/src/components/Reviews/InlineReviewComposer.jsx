import React, { useMemo, useState } from 'react';
import './InlineReviewComposer.css';

const VIBES = [
  { key: 'SKIP', label: 'Skip', rating: 2, color: '#ff5b7d' },
  { key: 'TIMEPASS', label: 'Timepass', rating: 5, color: '#ffbf00' },
  { key: 'GO_FOR_IT', label: 'Go for it', rating: 8, color: '#00d4a5' },
  { key: 'PERFECTION', label: 'Perfection', rating: 10, color: '#a43cff' }
];

export default function InlineReviewComposer({ username = 'user', initialReview = null, onSubmit }) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [content, setContent] = useState(initialReview?.content || '');
  const [hasSpoilers, setHasSpoilers] = useState(initialReview?.hasSpoilers || false);
  const [error, setError] = useState('');

  const selectedKey = useMemo(() => {
    if (rating >= 9) return 'PERFECTION';
    if (rating >= 7) return 'GO_FOR_IT';
    if (rating >= 5) return 'TIMEPASS';
    if (rating > 0) return 'SKIP';
    return null;
  }, [rating]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) { setError('Select your VYBE first.'); return; }
    if (content.trim().length < 10) { setError('Write at least 10 characters.'); return; }
    setError('');
    await onSubmit({ rating, content: content.trim(), hasSpoilers });
    if (!initialReview) {
      setRating(0);
      setContent('');
      setHasSpoilers(false);
    }
  };

  return (
    <form className="inline-review-composer" onSubmit={handleSubmit}>
      <div className="inline-review-top">
        <div className="inline-review-user">
          <div className="inline-review-avatar">{username.charAt(0).toUpperCase()}</div>
          <div>
            <strong>@{username}</strong>
            <span>Share your VYBE</span>
          </div>
        </div>
        <div className="inline-vibe-picker" aria-label="Choose VYBE rating">
          {VIBES.map(vibe => (
            <button
              key={vibe.key}
              type="button"
              className={selectedKey === vibe.key ? `active ${vibe.key.toLowerCase()}` : ''}
              style={selectedKey === vibe.key ? { '--vibe-color': vibe.color } : undefined}
              onClick={() => setRating(vibe.rating)}
            >
              {vibe.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={event => setContent(event.target.value.slice(0, 1000))}
        placeholder="Write your review here..."
        maxLength={1000}
        aria-label="Write your review"
      />

      <div className="inline-review-bottom">
        <label className="inline-spoiler-toggle">
          <input type="checkbox" checked={hasSpoilers} onChange={event => setHasSpoilers(event.target.checked)} />
          <span /> Contains spoilers
        </label>
        <span className="inline-char-count">{content.length}/1000</span>
        {error && <span className="inline-review-error">{error}</span>}
        <button className="inline-post-button" type="submit" disabled={!rating || content.trim().length < 10}>Post</button>
      </div>
    </form>
  );
}