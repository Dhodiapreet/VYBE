import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import StarRating from '../../components/Reviews/StarRating';
import './Profile.css';

const INITIAL_USER = {
  displayName: "Jane Doe",
  username: "@janedoe",
  avatarUrl: "https://via.placeholder.com/150x150/aa3bff/ffffff?text=JD",
  bio: "Cinematography enthusiast. Sci-fi geek. I write reviews about movies that make me feel something.",
  location: "Los Angeles, CA",
  joined: "March 2024",
  stats: {
    reviews: 42,
    ratings: 156,
    followers: 1205,
    following: 340
  }
};

const MOCK_WATCHLIST = [
  { _id: '1', title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', releaseDate: '2014-11-07', genres: ['Sci-Fi'], averageRating: 8.6 },
  { _id: '2', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2IGpbRXYS.jpg', releaseDate: '2024-03-01', genres: ['Sci-Fi'], averageRating: 8.8 },
  { _id: '3', title: 'Blade Runner 2049', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', releaseDate: '2017-10-06', genres: ['Sci-Fi'], averageRating: 8.0 },
  { _id: '4', title: 'Arrival', posterUrl: 'https://image.tmdb.org/t/p/w500/pEzxFxnXrbsO4aBUIx5vYF8SjD3.jpg', releaseDate: '2016-11-11', genres: ['Sci-Fi'], averageRating: 7.9 },
];

const MOCK_RATINGS = [
  { _id: '5', title: 'The Batman', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', releaseDate: '2022-03-04', genres: ['Action'], averageRating: 7.8, userRating: 9 },
  { _id: '6', title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', releaseDate: '2023-07-21', genres: ['History'], averageRating: 8.1, userRating: 10 },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    movieId: '6',
    movieTitle: 'Oppenheimer',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    rating: 10,
    date: 'July 25, 2023',
    content: "A masterclass in tension and sound design. Nolan weaves a dense, complicated story into something that feels deeply urgent. The Trinity test sequence is perhaps one of the most stressful cinematic experiences I've ever had."
  },
  {
    id: 2,
    movieId: '5',
    movieTitle: 'The Batman',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    rating: 9,
    date: 'March 10, 2022',
    content: "Gotham has never looked better. The procedural detective approach is exactly what this franchise needed. Pattinson is phenomenal as a younger, angrier Bruce Wayne."
  }
];

const MOCK_ACTIVITY = [
  { id: 1, type: 'review', movieTitle: 'Oppenheimer', time: '2 days ago' },
  { id: 2, type: 'list', action: 'Created a new collection "Sci-Fi Masterpieces"', time: '1 week ago' },
  { id: 3, type: 'follow', action: 'Followed @cinephile99', time: '2 weeks ago' },
];

export default function Profile() {
  const [user, setUser] = useState(INITIAL_USER);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    bio: user.bio,
    location: user.location,
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      displayName: editForm.displayName,
      bio: editForm.bio,
      location: editForm.location
    }));
    setIsEditModalOpen(false);
  };

  return (
    <div className="profile-page">
      <Header />
      
      <main className="profile-main">
        <section className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-info-container">
            <div className="profile-avatar-wrapper">
              <img src={user.avatarUrl} alt={user.displayName} className="profile-avatar" />
            </div>
            
            <div className="profile-details">
              <div className="profile-title-row">
                <div>
                  <h1 className="profile-name">{user.displayName}</h1>
                  <span className="profile-username">{user.username}</span>
                </div>
                <button 
                  className="btn-edit-profile"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </button>
              </div>
              
              <p className="profile-bio">{user.bio}</p>
              
              <div className="profile-meta">
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {user.location}
                </span>
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Joined {user.joined}
                </span>
              </div>
              
              <div className="profile-stats">
                <div className="stat-box">
                  <span className="stat-value">{user.stats.reviews}</span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{user.stats.ratings}</span>
                  <span className="stat-label">Ratings</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{user.stats.followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{user.stats.following}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-layout">
            <div className="main-col">
              <div className="tabs-nav">
                <button className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>Watchlist</button>
                <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                <button className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`} onClick={() => setActiveTab('ratings')}>Ratings</button>
                <button className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>Collections</button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'watchlist' && (
                  <div className="grid-view">
                    {MOCK_WATCHLIST.length > 0 ? (
                      MOCK_WATCHLIST.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                      ))
                    ) : (
                      <div className="empty-state">No movies in watchlist yet.</div>
                    )}
                  </div>
                )}

                {activeTab === 'ratings' && (
                  <div className="grid-view">
                    {MOCK_RATINGS.length > 0 ? (
                      MOCK_RATINGS.map(movie => (
                        <div key={movie._id} className="rating-card-wrapper" style={{ position: 'relative' }}>
                          <MovieCard movie={movie} />
                          <div className="user-rating-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '8px', zIndex: 10 }}>
                            <StarRating value={movie.userRating} size="small" readOnly />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No ratings yet.</div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="list-view">
                    {MOCK_REVIEWS.length > 0 ? (
                      MOCK_REVIEWS.map(review => (
                        <div key={review.id} className="review-item">
                          <img src={review.posterUrl} alt={review.movieTitle} className="review-poster" />
                          <div className="review-body">
                            <div className="review-header">
                              <h3 className="review-movie-title">
                                <Link to={`/movies/${review.movieId}`}>{review.movieTitle}</Link>
                              </h3>
                              <StarRating value={review.rating} size="small" readOnly />
                            </div>
                            <span className="review-date">{review.date}</span>
                            <p className="review-text">{review.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No reviews yet.</div>
                    )}
                  </div>
                )}

                {activeTab === 'collections' && (
                  <div className="empty-state">
                    No collections created yet.
                    <Link to="/collections" className="btn-create" style={{ display: 'inline-block', textDecoration: 'none' }}>Create Collection</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="side-col">
              <h3 className="sidebar-title">Recent Activity</h3>
              <div className="activity-list">
                {MOCK_ACTIVITY.map(act => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-icon"></div>
                    <div className="activity-details">
                      <p className="activity-text">
                        {act.type === 'review' ? `Reviewed ${act.movieTitle}` : act.action}
                      </p>
                      <span className="activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveProfile} className="edit-form">
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  name="displayName" 
                  value={editForm.displayName} 
                  onChange={handleEditChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={editForm.location} 
                  onChange={handleEditChange} 
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  value={editForm.bio} 
                  onChange={handleEditChange} 
                  rows="4"
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
