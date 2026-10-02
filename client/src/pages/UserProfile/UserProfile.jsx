import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import StarRating from '../../components/Reviews/StarRating';
import '../Profile/Profile.css'; // Reuse profile layout
import './UserProfile.css';

import { apiRequest } from '../../services/api';

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [isFollowing, setIsFollowing] = useState(false);

  
  // Modals
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'
  const [modalList, setModalList] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/users/${username}`);
        if (response && response.data) {
          setUser(response.data);
          setIsFollowing(response.data.isFollowing);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      if (isFollowing) {
        await apiRequest(`/social/follow/${user.id}`, { method: 'DELETE' });
      } else {
        await apiRequest(`/social/follow/${user.id}`, { method: 'POST' });
        // Optional: trigger local notification or real-time event if connected
      }
      setIsFollowing(!isFollowing);
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1
        }
      }));
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  const openModal = async (type) => {
    setModalType(type);
    setLoadingModal(true);
    setModalList([]);
    try {
      const response = await apiRequest(`/users/${username}/${type}`);
      if (response && response.data) {
        setModalList(response.data);
      }
    } catch (err) {
      console.error(`Failed to load ${type}:`, err);
    } finally {
      setLoadingModal(false);
    }
  };
  const closeModal = () => setModalType(null);

  if (loading) {
    return (
      <div className="user-profile-page">
        <Header />
        <main style={{ padding: '64px', textAlign: 'center', color: '#888' }}>Loading profile...</main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <Header />
        <main style={{ padding: '64px', textAlign: 'center' }}>
          <h2>User not found</h2>
          <button className="btn-back" onClick={() => navigate('/people')}>Back to People</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <Header />
      
      <div className="back-nav">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
      </div>

      <main>
        <section className="profile-hero">
          <div className="profile-info-container">
            <div className="profile-avatar-wrapper">
              <img src={user.avatarUrl} alt={`${user.displayName}'s avatar`} className="profile-avatar" />
            </div>
            <div className="profile-details">
              <div className="profile-title-row">
                <div>
                  <h1 className="profile-name">{user.displayName}</h1>
                  <div className="profile-username">@{user.username}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-follow-profile"
                    onClick={() => navigate('/messages')}
                    style={{ background: 'transparent', border: '1px solid #45a29e', color: '#45a29e' }}
                  >
                    Message
                  </button>
                  <button 
                    className={`btn-follow-profile ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowToggle}
                    aria-label={isFollowing ? `Unfollow ${user.displayName}` : `Follow ${user.displayName}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
              
              <p className="profile-bio">{user.bio}</p>

              {user.tastes && user.tastes.length > 0 && (
                <div className="user-taste-summary">
                  {user.tastes.map(taste => (
                    <span key={taste} className="taste-tag-profile">{taste}</span>
                  ))}
                </div>
              )}
              
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
                <div className="stat-box clickable-stat" onClick={() => openModal('followers')} role="button" tabIndex={0}>
                  <span className="stat-value">{user.stats.followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-box clickable-stat" onClick={() => openModal('following')} role="button" tabIndex={0}>
                  <span className="stat-value">{user.stats.following}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>

              {user.mutualFollowers && user.mutualFollowers.length > 0 && (
                <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                  Followed by {user.mutualFollowers.map(u => '@'+u).join(', ')}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-layout">
            <div className="main-col">
              <div className="tabs-nav">
                <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>Activity</button>
                <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                <button className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`} onClick={() => setActiveTab('ratings')}>Ratings</button>
                <button className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>Watchlist</button>
                <button className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>Collections</button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'activity' && (
                  <div className="list-view">
                    {MOCK_ACTIVITY.length > 0 ? (
                      MOCK_ACTIVITY.map(act => (
                        <div key={act.id} className="review-item" style={{ alignItems: 'center' }}>
                           <div className="activity-icon" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(170, 59, 255, 0.2)', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                             {act.type === 'review' ? '📝' : act.type === 'list' ? '📋' : '👥'}
                           </div>
                           <div>
                             <div style={{ fontSize: '16px', color: '#ddd' }}>
                               {act.type === 'review' ? `Reviewed ${act.movieTitle}` : act.action}
                             </div>
                             <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{act.time}</div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No recent activity.</div>
                    )}
                  </div>
                )}

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
                        <div key={movie._id} className="rating-card-wrapper">
                          <MovieCard movie={movie} />
                          <div className="user-rating-badge">
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
                    No public collections.
                  </div>
                )}
              </div>
            </div>

            <div className="side-col">
              <h3 className="sidebar-title">Taste Profile</h3>
              <div className="activity-list">
                 {user.tastes && user.tastes.map((taste, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                      <div className="activity-details" style={{ justifyContent: 'center' }}>
                        <p className="activity-text">{taste} Enthusiast</p>
                      </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'followers' ? 'Followers' : 'Following'}</h2>
              <button className="btn-close" onClick={closeModal} aria-label="Close modal">&times;</button>
            </div>
            
            <div className="followers-list-modal">
              {loadingModal ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Loading...</p>
              ) : modalList.length > 0 ? (
                modalList.map(f => (
                  <div key={f.id} className="follower-item">
                    <Link to={`/people/${f.username}`} className="follower-info" onClick={closeModal}>
                      <img src={f.avatarUrl} alt={f.displayName} className="follower-avatar" />
                      <div className="follower-details">
                        <h4 className="follower-name">{f.displayName}</h4>
                        <p className="follower-username">@{f.username}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No {modalType} found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
