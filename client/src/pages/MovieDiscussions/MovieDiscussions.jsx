import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiRequest } from '../../services/api';
import './MovieDiscussions.css';




export default function MovieDiscussions() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSpoilers, setShowSpoilers] = useState({});

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newHasSpoiler, setNewHasSpoiler] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [replyBody, setReplyBody] = useState('');
  const { addNotification } = useNotifications();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch real movie data
        const res = await apiRequest(`/movies/${id}`);
        if (res && res.data) {
          setMovie(res.data);
        } else {
          setMovie(null);
        }
        
        // Fetch real discussions
        const discRes = await apiRequest(`/discussions/movie/${id}`);
        if (discRes && discRes.data) {
          setDiscussions(discRes.data);
        } else {
          setDiscussions([]);
        }
      } catch (err) {
        console.error('Failed to load movie for discussions:', err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-discussions-page">
        <Header />
        <main className="loading-container" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-discussions-page">
        <Header />
        <main className="not-found-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h2>Movie Not Found</h2>
          <button className="btn-primary" onClick={() => navigate('/movies')}>Back to Movies</button>
        </main>
        <Footer />
      </div>
    );
  }

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown';

  // Filter discussions
  let filteredDiscussions = discussions.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeTab === 'Popular') {
    filteredDiscussions = [...filteredDiscussions].sort((a, b) => b.likes - a.likes);
  } else if (activeTab === 'Recent') {
    filteredDiscussions = [...filteredDiscussions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      setFormError('Title and body are required.');
      return;
    }
    
    try {
      const response = await apiRequest('/discussions', {
        method: 'POST',
        body: JSON.stringify({
          movieId: id,
          title: newTitle.trim(),
          body: newBody.trim(),
          tags: newTags.split(',').map(t => t.trim()).filter(t => t),
          hasSpoiler: newHasSpoiler
        })
      });
      
      const newDiscussion = response.data;
      setDiscussions([newDiscussion, ...discussions]);
      setIsCreating(false);
      
      // Reset form
      setNewTitle('');
      setNewBody('');
      setNewTags('');
      setNewHasSpoiler(false);
      setFormError('');

      addNotification({
        type: 'milestone',
        actor: { name: 'VYBE', avatar: 'vybe' },
        action: 'You started a discussion on',
        target: { title: movie?.title, id: id }
      });
    } catch (err) {
      console.error('Failed to create discussion', err);
      setFormError('Failed to create discussion. Please try again.');
    }
  };

  const handleLike = async (discussionId, e) => {
    if (e) e.stopPropagation();
    
    try {
      const response = await apiRequest(`/discussions/${discussionId}/like`, { method: 'POST' });
      const { likes, isLiked } = response.data;
      
      setDiscussions(discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, isLiked, likes };
        }
        return d;
      }));
      
      if (selectedDiscussion && selectedDiscussion.id === discussionId) {
        setSelectedDiscussion({ ...selectedDiscussion, isLiked, likes });
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    
    try {
      const response = await apiRequest(`/discussions/${selectedDiscussion.id}/replies`, {
        method: 'POST',
        body: JSON.stringify({ body: replyBody.trim() })
      });
      
      const newReply = response.data;
      
      const updatedSelected = {
        ...selectedDiscussion,
        replies: [...selectedDiscussion.replies, newReply]
      };
      
      setSelectedDiscussion(updatedSelected);
      setDiscussions(discussions.map(d => d.id === updatedSelected.id ? updatedSelected : d));
      setReplyBody('');

      addNotification({
        type: 'reply',
        actor: { name: 'You', avatar: 'vybe' },
        action: 'replied to a discussion by',
        target: { title: selectedDiscussion.author.name, id: id }
      });
    } catch (err) {
      console.error('Failed to add reply', err);
    }
  };

  const toggleSpoiler = (discussionId, e) => {
    if (e) e.stopPropagation();
    setShowSpoilers(prev => ({ ...prev, [discussionId]: true }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="movie-discussions-page">
      <Header />
      
      <main className="movie-discussions-main">
        <Link to={`/movies/${id}`} className="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Movie Details
        </Link>
        
        <div className="discussion-context-header">
          <img src={movie.posterUrl} alt={movie.title} className="context-poster" />
          <div className="context-info">
            <h1 className="context-title">{movie.title} - Discussions</h1>
            <div className="context-meta">
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{movie.genres?.join(', ') || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="discussions-layout">
          <div className="discussions-controls">
            <div className="tabs">
              {['All', 'Popular', 'Recent'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="search-and-create">
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn-primary" onClick={() => setIsCreating(true)}>
                New Discussion
              </button>
            </div>
          </div>

          <div className="discussion-list">
            {filteredDiscussions.length === 0 ? (
              <div className="empty-state">
                <h3>No discussions found</h3>
                <p>Be the first to start a conversation about {movie.title}!</p>
              </div>
            ) : (
              filteredDiscussions.map(d => {
                const isSpoilerVisible = showSpoilers[d.id] || !d.hasSpoiler;
                return (
                  <div key={d.id} className="discussion-card" onClick={() => setSelectedDiscussion(d)}>
                    <div className="discussion-header">
                      <div className="author-info">
                        <div className="avatar">{d.author.avatar}</div>
                        <div>
                          <span className="author-name">{d.author.name}</span>
                          <span className="timestamp">{formatDate(d.timestamp)}</span>
                        </div>
                      </div>
                      {d.hasSpoiler && <span className="spoiler-badge">SPOILERS</span>}
                    </div>
                    
                    <h3 className="discussion-title">{d.title}</h3>
                    
                    {!isSpoilerVisible ? (
                      <div className="spoiler-overlay" onClick={(e) => toggleSpoiler(d.id, e)}>
                        Content contains spoilers. Click to reveal.
                      </div>
                    ) : (
                      <p className="discussion-preview">{d.body}</p>
                    )}
                    
                    <div className="discussion-footer">
                      <div className="tags">
                        {d.tags.map((tag, idx) => <span key={idx} className="tag">{tag}</span>)}
                      </div>
                      <div className="stats">
                        <div className="stat">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          {d.replies.length}
                        </div>
                        <div className="stat" onClick={(e) => handleLike(d.id, e)} style={{ cursor: 'pointer', color: d.isLiked ? '#ff5555' : 'inherit' }}>
                          <svg viewBox="0 0 24 24" fill={d.isLiked ? "#ff5555" : "none"} stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {d.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Create Discussion Modal */}
      {isCreating && (
        <div className="modal-overlay" onClick={() => setIsCreating(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Discussion</h2>
              <button className="close-btn" onClick={() => setIsCreating(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What do you want to discuss?" />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Content</label>
                  <textarea id="body" className="form-control" value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Share your thoughts..."></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="tags">Tags (comma separated)</label>
                  <input type="text" id="tags" className="form-control" value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="e.g. Theories, Ending, Characters" />
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" id="spoiler" checked={newHasSpoiler} onChange={e => setNewHasSpoiler(e.target.checked)} />
                  <label htmlFor="spoiler" style={{ margin: 0 }}>This post contains spoilers</label>
                </div>
                {formError && <div className="error-text">{formError}</div>}
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Post Discussion</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Detail Modal */}
      {selectedDiscussion && (
        <div className="modal-overlay" onClick={() => setSelectedDiscussion(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDiscussion.title}</h2>
              <button className="close-btn" onClick={() => setSelectedDiscussion(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-author-bar">
                <div className="author-info">
                  <div className="avatar">{selectedDiscussion.author.avatar}</div>
                  <div>
                    <span className="author-name">{selectedDiscussion.author.name}</span>
                    <span className="timestamp">{formatDate(selectedDiscussion.timestamp)}</span>
                  </div>
                </div>
                {selectedDiscussion.hasSpoiler && <span className="spoiler-badge">SPOILERS</span>}
              </div>
              
              <div className="detail-body">
                {(!showSpoilers[selectedDiscussion.id] && selectedDiscussion.hasSpoiler) ? (
                  <div className="spoiler-overlay" onClick={() => toggleSpoiler(selectedDiscussion.id)}>
                    Content contains spoilers. Click to reveal.
                  </div>
                ) : (
                  selectedDiscussion.body
                )}
              </div>
              
              <div className="detail-actions">
                <button className={`action-btn ${selectedDiscussion.isLiked ? 'liked' : ''}`} onClick={() => handleLike(selectedDiscussion.id)}>
                  <svg viewBox="0 0 24 24" fill={selectedDiscussion.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {selectedDiscussion.likes} Likes
                </button>
                <div className="tags">
                  {selectedDiscussion.tags.map((tag, idx) => <span key={idx} className="tag">{tag}</span>)}
                </div>
              </div>
              
              <div className="replies-section">
                <h3>{selectedDiscussion.replies.length} Replies</h3>
                
                <form className="reply-form" onSubmit={handleReplySubmit}>
                  <div className="reply-input-group">
                    <div className="avatar">U</div>
                    <textarea 
                      className="form-control" 
                      placeholder="Add a reply..."
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" disabled={!replyBody.trim()}>Reply</button>
                  </div>
                </form>
                
                <div className="reply-list">
                  {selectedDiscussion.replies.map(reply => (
                    <div key={reply.id} className="reply-card">
                      <div className="avatar">{reply.author.avatar}</div>
                      <div className="reply-content">
                        <div className="reply-header">
                          <span className="author-name">{reply.author.name}</span>
                          <span className="timestamp">{formatDate(reply.timestamp)}</span>
                        </div>
                        <p className="reply-body">{reply.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
