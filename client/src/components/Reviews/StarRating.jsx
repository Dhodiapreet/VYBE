import React, { useState } from 'react';
import './StarRating.css';

export default function StarRating({ 
  value = 0, 
  onChange, 
  maxStars = 10, 
  readOnly = false,
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (index) => {
    if (!readOnly && onChange) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly && onChange) {
      setHoverValue(0);
    }
  };

  const handleClick = (index) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  const displayValue = hoverValue > 0 ? hoverValue : value;

  return (
    <div 
      className={`star-rating star-rating-${size} ${readOnly ? 'read-only' : ''}`}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Rating"
    >
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= displayValue;
        
        return (
          <button
            key={starValue}
            type="button"
            className={`star-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onFocus={() => handleMouseEnter(starValue)}
            onBlur={handleMouseLeave}
            disabled={readOnly}
            aria-label={`Rate ${starValue} out of ${maxStars} stars`}
            aria-checked={value === starValue}
            role="radio"
          >
            ★
          </button>
        );
      })}
      {!readOnly && <span className="rating-text">{displayValue} / {maxStars}</span>}
    </div>
  );
}
