import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiRequest } from '../../services/api';
import './Collections.css';

const MOCK_COLLECTIONS = [
  {
    id: 'c1',
    name: 'Sci-Fi Masterpieces',
    description: 'The best science fiction movies ever made, exploring space, time, and humanity.',
    movieCount: 12,
    covers: [
      'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT1O.jpg',
      'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg'
    ]
  },
  {
    id: 'c2',
    name: 'Weekend Binge',
    description: 'Perfect movies to watch with friends on a lazy weekend.',
    movieCount: 5,
    covers: [
      'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
      'https://image.tmdb.org/t/p/w500/jtpQWEsW9zicOtyZ7XqA0mED95t.jpg'
    ]
  }
];

export default function Collections() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/collections');
        if (res && res.data) {
          // Map MongoDB _id to id if necessary
          setCollections(res.data.map(c => ({...c, id: c.id || c._id})));
        } else {
          setCollections([]);
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err);
        setCollections(MOCK_COLLECTIONS); // Graceful fallback
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      setError('Collection name is required');
      return;
    }
    
    try {
      const res = await apiRequest('/collections', {
        method: 'POST',
        body: JSON.stringify({
          name: newCollectionName.trim(),
          description: newCollectionDesc.trim(),
          isPublic: true
        })
      });
      if (res && res.data) {
        const newCol = { ...res.data, id: res.data.id || res.data._id };
        setCollections([newCol, ...collections]);
        setIsModalOpen(false);
        setNewCollectionName('');
        setNewCollectionDesc('');
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to create collection. Are you logged in?');
    }
  };

  return (
    <div className="collections-page">
      <Header />
      
      <main className="collections-main">
        <div className="collections-header">
          <div>
            <h1>My Collections</h1>
            <p className="subtitle">Organize and share your favorite movies.</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Collection
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading collections...</p>
          </div>
        ) : collections.length > 0 ? (
          <div className="collections-grid">
            {collections.map(collection => (
              <div 
                key={collection.id} 
                className="collection-card"
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                <div className="collection-covers">
                  {collection.covers && collection.covers.length > 0 ? (
                    <div className={`cover-collage count-${Math.min(collection.covers.length, 4)}`}>
                      {collection.covers.slice(0, 4).map((url, i) => (
                        <img key={i} src={url} alt="" className="collage-img" />
                      ))}
                    </div>
                  ) : (
                    <div className="cover-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                        <polyline points="4 14 10 8 16 14 20 10"></polyline>
                      </svg>
                    </div>
                  )}
                  <div className="movie-count-badge">
                    {collection.movieCount} {collection.movieCount === 1 ? 'Movie' : 'Movies'}
                  </div>
                </div>
                <div className="collection-info">
                  <h3>{collection.name}</h3>
                  {collection.description && <p>{collection.description}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h2>No Collections Yet</h2>
            <p>Create a collection to start organizing your favorite movies.</p>
            <button 
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Create Collection
            </button>
          </div>
        )}
      </main>

      <Footer />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Collection</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateCollection} className="collection-form">
              {error && <div className="form-error">{error}</div>}
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={newCollectionName}
                  onChange={e => {
                    setNewCollectionName(e.target.value);
                    if(error) setError('');
                  }}
                  placeholder="e.g. My Favorite Sci-Fi"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  value={newCollectionDesc}
                  onChange={e => setNewCollectionDesc(e.target.value)}
                  placeholder="What is this collection about?"
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
