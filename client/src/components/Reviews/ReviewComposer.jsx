import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import './ReviewComposer.css';

export default function ReviewComposer({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialReview = null,
  movieTitle = "" 
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialReview) {
        setRating(initialReview.rating);
        setContent(initialReview.content);
        setHasSpoilers(initialReview.hasSpoilers || false);
      } else {
        setRating(0);
        setContent('');
        setHasSpoilers(false);
      }
      setError('');
    }
  }, [isOpen, initialReview]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters long.');
      return;
    }
    
    onSubmit({
      rating,
      content,
      hasSpoilers
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="review-composer-modal">
        <div className="composer-header">
          <h2>{initialReview ? 'Edit Review' : `Review ${movieTitle}`}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="composer-form">
          {error && <div className="error-message" role="alert">{error}</div>}
          
          <div className="form-group">
            <label>Your Rating</label>
            <StarRating 
              value={rating} 
              onChange={setRating} 
              size="large" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="review-content">Your Review</label>
            <textarea 
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you think of the movie?"
              rows="6"
              required
            />
            <span className="char-count">{content.length} / 2000</span>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={hasSpoilers}
                onChange={(e) => setHasSpoilers(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
              This review contains spoilers
            </label>
          </div>
          
          <div className="composer-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {initialReview ? 'Update Review' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
