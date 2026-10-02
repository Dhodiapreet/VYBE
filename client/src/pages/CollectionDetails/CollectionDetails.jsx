import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import './CollectionDetails.css';

const INITIAL_COLLECTION = {
  id: 'c1',
  name: 'Sci-Fi Masterpieces',
  description: 'The best science fiction movies ever made, exploring space, time, and humanity.',
  movies: [
    {
      _id: '1',
      title: 'Dune: Part Two',
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT1O.jpg',
      releaseDate: '2024-02-28',
      averageRating: 8.3
    },
    {
      _id: '2',
      title: 'Oppenheimer',
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      releaseDate: '2023-07-19',
      averageRating: 8.1
    }
  ]
};

export default function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch based on ID
    window.scrollTo(0, 0);
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Mock loading logic
      if (id === 'c1' || id === 'c2') {
        setCollection({ ...INITIAL_COLLECTION, id });
        setEditName(INITIAL_COLLECTION.name);
        setEditDesc(INITIAL_COLLECTION.description);
      } else {
        // Fallback for newly created mock collections
        setCollection({
          id,
          name: 'Custom Collection',
          description: 'A mock collection for this ID',
          movies: []
        });
        setEditName('Custom Collection');
        setEditDesc('A mock collection for this ID');
      }
      setLoading(false);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleRemoveMovie = (movieId) => {
    setCollection(prev => ({
      ...prev,
      movies: prev.movies.filter(m => m._id !== movieId)
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    setCollection(prev => ({
      ...prev,
      name: editName.trim(),
      description: editDesc.trim()
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteCollection = () => {
    // Mock delete
    navigate('/collections');
  };

  if (loading) {
    return (
      <div className="collection-details-page">
        <Header />
        <main className="loading-state">
          <div className="spinner"></div>
          <p>Loading collection...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collection-details-page">
        <Header />
        <main className="empty-state">
          <h2>Collection Not Found</h2>
          <button className="btn-primary" onClick={() => navigate('/collections')}>
            Back to Collections
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="collection-details-page">
      <Header />
      
      <main className="collection-details-main">
        <div className="breadcrumbs">
          <Link to="/collections">Collections</Link>
          <span className="separator">/</span>
          <span className="current">{collection.name}</span>
        </div>

        <div className="collection-header-section">
          <div className="collection-info-main">
            <h1>{collection.name}</h1>
            <p className="collection-desc">{collection.description}</p>
            <div className="collection-meta">
              <span>{collection.movies.length} Movies</span>
            </div>
          </div>
          <div className="collection-actions">
            <button 
              className="btn-outline"
              onClick={() => setIsEditModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
            <button 
              className="btn-outline danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>

        {collection.movies.length > 0 ? (
          <div className="collection-movies-grid">
            {collection.movies.map(movie => (
              <div key={movie._id} className="collection-movie-wrapper">
                <MovieCard movie={movie} />
                <button 
                  className="btn-remove-movie"
                  onClick={() => handleRemoveMovie(movie._id)}
                  title="Remove from Collection"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </div>
            <h2>This collection is empty</h2>
            <p>Go to any movie page and click "Add to Collection" to add movies here.</p>
            <Link to="/movies" className="btn-primary">Browse Movies</Link>
          </div>
        )}
      </main>

      <Footer />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Collection</h2>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveEdit} className="collection-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Collection</h2>
              <button className="btn-close" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{collection.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="btn-primary danger" onClick={handleDeleteCollection}>Delete Collection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
