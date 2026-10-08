import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommunityTeaser.css';

export default function CommunityTeaser() {
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const users = [
    { id: 1, name: 'Alex M.', avatar: 'https://via.placeholder.com/100/aa3bff/fff?text=AM', review: 'Mind-bending cinematography!' },
    { id: 2, name: 'Sarah J.', avatar: 'https://via.placeholder.com/100/4e00b3/fff?text=SJ', review: 'Best thriller of the year.' },
    { id: 3, name: 'Raj K.', avatar: 'https://via.placeholder.com/100/16171d/fff?text=RK', review: 'A must watch.' },
  ];

  return (
    <section className="community-teaser">
      <div className="community-content">
        <div className="community-header">
          <span className="section-label">Connect & Discover</span>
          <h2 className="community-title">Find Your VYBE Tribe</h2>
          <p className="community-subtitle">Join thousands of movie lovers. Share reviews, find people with your taste, and discover what's trending in your circle.</p>
        </div>
        
        <div className="community-cards">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar-wrapper">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <p className="user-review">"{user.review}"</p>
                <button
                  className="btn-follow"
                  type="button"
                  onClick={() => {
                    setFollowedUsers((prev) => {
                      const next = new Set(prev);
                      if (next.has(user.id)) {
                        next.delete(user.id);
                      } else {
                        next.add(user.id);
                      }
                      return next;
                    });
                  }}
                >
                  {followedUsers.has(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="community-actions">
          <Link to="/people" className="btn-primary">Find People</Link>
        </div>
      </div>
    </section>
  );
}
