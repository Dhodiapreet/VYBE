import React, { useState } from 'react';
import './Feed.css';
import { useNotifications } from '../../contexts/NotificationContext';

const MOCK_FEED = [
  {
    id: 1,
    type: 'review',
    user: { name: 'Sarah Jenkins', handle: '@sarahj', avatarInitial: 'S' },
    timestamp: '2 hours ago',
    content: 'Dune: Part Two is an absolute visual masterpiece. Villeneuve has outdone himself. The sound design alone is worth the IMAX ticket.',
    movie: { title: 'Dune: Part Two', year: 2024, rating: 5, poster: 'https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2JGjjc9CW.jpg' },
    likes: 124,
    comments: 18,
    isLiked: false
  },
  {
    id: 2,
    type: 'watchlist',
    user: { name: 'Marcus Chen', handle: '@marcus_c', avatarInitial: 'M' },
    timestamp: '4 hours ago',
    content: 'Added to Watchlist',
    movie: { title: 'Mickey 17', year: 2025, poster: 'https://image.tmdb.org/t/p/w300/60K3kG86z6N5kY0PZ53rO9xK3pL.jpg' },
    likes: 12,
    comments: 0,
    isLiked: true
  },
  {
    id: 3,
    type: 'rating',
    user: { name: 'Elena Rodriguez', handle: '@elenar', avatarInitial: 'E' },
    timestamp: '5 hours ago',
    content: 'Rated 4.5/5',
    movie: { title: 'Oppenheimer', year: 2023, rating: 4.5, poster: 'https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
    likes: 89,
    comments: 4,
    isLiked: false
  },
  {
    id: 4,
    type: 'follow',
    user: { name: 'David Kim', handle: '@dkim99', avatarInitial: 'D' },
    timestamp: '1 day ago',
    content: 'started following @sarahj',
    likes: 3,
    comments: 0,
    isLiked: false
  },
  {
    id: 5,
    type: 'discussion',
    user: { name: 'Alex Thompson', handle: '@alext', avatarInitial: 'A' },
    timestamp: '1 day ago',
    content: 'Who else thinks A24 is single-handedly saving the horror genre? Talk to Me was incredible, and I can\'t wait for MaXXXine.',
    likes: 245,
    comments: 56,
    isLiked: false
  }
];

const TRENDING_MOVIES = [
  { id: 1, title: 'Dune: Part Two', mentions: '12.4k' },
  { id: 2, title: 'Poor Things', mentions: '8.2k' },
  { id: 3, title: 'Civil War', mentions: '5.1k' },
  { id: 4, title: 'Late Night with the Devil', mentions: '3.8k' }
];

const ACTIVE_PEOPLE = [
  { id: 1, name: 'Roger Ebert Fan', handle: '@cinephile99', initial: 'R' },
  { id: 2, name: 'Mia Wong', handle: '@miaw', initial: 'M' },
  { id: 3, name: 'James Cameron', handle: '@avatarfan', initial: 'J' }
];

export default function Feed() {
  const [activeTab, setActiveTab] = useState('All');
  const [feedData, setFeedData] = useState(MOCK_FEED);
  const { addNotification } = useNotifications();

  const tabs = ['All', 'Reviews', 'Ratings', 'Following'];

  const filteredFeed = feedData.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Reviews') return item.type === 'review';
    if (activeTab === 'Ratings') return item.type === 'rating';
    if (activeTab === 'Following') return item.type === 'follow' || item.type === 'watchlist';
    return true;
  });

  const handleLike = (id) => {
    setFeedData(prev => prev.map(item => {
      if (item.id === id) {
        if (!item.isLiked) {
          addNotification({
            type: 'like',
            actor: { name: 'You', avatar: 'vybe' },
            action: 'liked a post by',
            target: { title: item.user.name, id: item.id }
          });
        }
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1
        };
      }
      return item;
    }));
  };

  const handleShare = () => {
    alert("Share functionality mocked!");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - 0.5 === rating) {
        stars.push(<span key={i} className="star half">★</span>); // simplified for mock
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return <div className="rating-stars">{stars}</div>;
  };

  return (
    <div className="feed-page">
      <div className="feed-header-section">
        <div className="feed-intro">
          <h1>Community Feed</h1>
          <p>See what your friends and fellow cinephiles are watching, rating, and reviewing.</p>
        </div>
      </div>

      <div className="feed-container">
        <main className="feed-main">
          <div className="feed-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`feed-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="feed-list">
            {filteredFeed.length === 0 ? (
              <div className="empty-state">
                <p>No activity found for this filter.</p>
              </div>
            ) : (
              filteredFeed.map(item => (
                <div key={item.id} className="feed-card">
                  <div className="feed-card-header">
                    <div className="user-avatar">{item.user.avatarInitial}</div>
                    <div className="user-info">
                      <span className="user-name">{item.user.name}</span>
                      <span className="user-handle">{item.user.handle}</span>
                    </div>
                    <span className="timestamp">{item.timestamp}</span>
                  </div>

                  <div className="feed-card-body">
                    {item.type === 'rating' && item.movie && renderStars(item.movie.rating)}
                    
                    <p className={`feed-text ${item.type === 'review' || item.type === 'discussion' ? 'feed-text-large' : ''}`}>
                      {item.content}
                    </p>

                    {item.movie && (
                      <div className="feed-movie-attachment">
                        <img 
                          src={item.movie.poster} 
                          alt={item.movie.title} 
                          className="movie-poster-thumb"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x150/16171d/aa3bff?text=No+Poster';
                          }}
                        />
                        <div className="movie-meta-info">
                          <h4>{item.movie.title}</h4>
                          <span className="movie-year">{item.movie.year}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="feed-card-actions">
                    <button 
                      className={`action-btn ${item.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                      aria-label="Like"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill={item.isLiked ? 'currentColor' : 'none'}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{item.likes}</span>
                    </button>
                    <button className="action-btn" aria-label="Comment">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>{item.comments}</span>
                    </button>
                    <button className="action-btn share-btn" onClick={handleShare} aria-label="Share">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        <aside className="feed-sidebar">
          <div className="sidebar-widget">
            <h3>Trending Discussions</h3>
            <ul className="trending-list">
              {TRENDING_MOVIES.map(movie => (
                <li key={movie.id} className="trending-item">
                  <span className="trending-title">{movie.title}</span>
                  <span className="trending-mentions">{movie.mentions} mentions</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-widget">
            <h3>Active Cinephiles</h3>
            <ul className="active-people-list">
              {ACTIVE_PEOPLE.map(person => (
                <li key={person.id} className="active-person-item">
                  <div className="user-avatar small">{person.initial}</div>
                  <div className="user-info">
                    <span className="user-name">{person.name}</span>
                    <span className="user-handle">{person.handle}</span>
                  </div>
                  <button className="btn-follow-small">Follow</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
