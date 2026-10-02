import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import ReviewList from '../../components/Reviews/ReviewList';
import ReviewComposer from '../../components/Reviews/ReviewComposer';
import './MovieDetails.css';

const MOCK_MOVIES = [
  { _id: '1', title: 'The Quantum Paradox', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80', releaseDate: '2023-11-10', genres: ['Sci-Fi', 'Thriller'], averageRating: 4.8, runtime: 135, description: 'A physicist discovers a way to alter past events, but soon realizes that every change creates a parallel universe with its own catastrophic consequences. As realities begin to collapse, she must find the origin timeline before existence itself is erased.', director: 'Elena Rostova', cast: ['Sarah Jenkins', 'Michael Chang', 'David Oyelowo'] },
  { _id: '2', title: 'Midnight Run', posterUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081524?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081524?w=1200&q=80', releaseDate: '2024-01-15', genres: ['Action', 'Comedy'], averageRating: 4.2, runtime: 112, description: 'Two rival getaway drivers are accidentally hired for the same heist. Forced to work together while being hunted by the mob and the police, they must put their differences aside to survive the wildest night of their lives.', director: 'Marcus Bell', cast: ['John Doe', 'Jane Smith', 'Chris Evans'] },
  { _id: '3', title: 'Echoes of Silence', posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80', releaseDate: '2023-09-05', genres: ['Drama', 'Mystery'], averageRating: 4.5, runtime: 120, description: 'A deaf detective investigating a series of murders uncovers a conspiracy that goes deeper than anyone imagined.', director: 'Alan Smithee', cast: ['Emma Thompson', 'Idris Elba'] },
  { _id: '4', title: 'Neon Dreams', posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80', releaseDate: '2024-03-22', genres: ['Sci-Fi', 'Action'], averageRating: 4.0, runtime: 105, description: 'In a cyberpunk future, a rogue AI tries to save humanity from itself.', director: 'Luc Besson', cast: ['Scarlett Johansson'] },
  { _id: '5', title: 'The Last Horizon', posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80', releaseDate: '2022-12-18', genres: ['Adventure', 'Sci-Fi'], averageRating: 4.7, runtime: 150, description: 'The last manned mission to the edge of the universe discovers something impossible.', director: 'Christopher Nolan', cast: ['Matthew McConaughey', 'Anne Hathaway'] },
  { _id: 'f1', title: 'Interstellar Odyssey', posterUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80', backdropUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80', releaseDate: '2024-11-05', genres: ['Sci-Fi', 'Adventure'], averageRating: 4.9, runtime: 165, description: 'Embark on a cinematic journey through the cosmos where humanity seeks a new home amongst the stars. A visually stunning masterpiece that redefines space exploration and human resilience.', director: 'Ridley Scott', cast: ['Matt Damon', 'Jessica Chastain'] }
];

const INITIAL_MOCK_REVIEWS = [
  {
    id: 'r1',
    movieId: '1',
    username: 'moviebuff99',
    displayName: 'MovieBuff99',
    avatar: 'M',
    rating: 9,
    date: '2026-09-28T10:00:00Z',
    content: "Absolutely brilliant. The cinematography is out of this world, and the pacing keeps you on the edge of your seat the entire time. A must-watch for fans of the genre.",
    hasSpoilers: false,
    likes: 24,
    isLikedByMe: false
  },
  {
    id: 'r2',
    movieId: '1',
    username: 'cinemalover',
    displayName: 'CinemaLover',
    avatar: 'C',
    rating: 7,
    date: '2026-09-20T14:30:00Z',
    content: "Strong performances from the lead cast, though the middle act dragged a little bit. Still highly recommended.",
    hasSpoilers: true,
    likes: 8,
    isLikedByMe: true
  }
];

import { apiRequest } from '../../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Local mock state
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collections] = useState([
    { id: 'c1', name: 'Sci-Fi Masterpieces', hasMovie: false },
    { id: 'c2', name: 'Weekend Binge', hasMovie: true }
  ]);
  
  const currentUserUsername = 'janedoe';
  
  const [reviews, setReviews] = useState([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const { addNotification } = useNotifications();
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
    
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(`/movies/${id}`);
        if (res && res.data) {
          setMovie(res.data);
          
          // Also fetch reviews if we have a reviews endpoint, or keep mock reviews for now
          // If the backend has GET /reviews?movie=<id>, we could do it:
          try {
            const reviewsRes = await apiRequest(`/reviews?movie=${id}`);
            if (reviewsRes && reviewsRes.data) {
              setReviews(reviewsRes.data);
            }
          } catch(error) {
             console.warn('Could not fetch reviews, using mock data:', error.message);
             const movieReviews = INITIAL_MOCK_REVIEWS.filter(r => r.movieId === id);
             setReviews(movieReviews);
          }
        } else {
          setMovie(null);
        }
      } catch (error) {
        console.error('Failed to load movie', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-details-page">
        <Header />
        <main className="loading-container">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <Header />
        <main className="not-found-container">
          <h2>Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate('/movies')}>
            Back to Movies
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown';
  
  // Get similar movies (just taking the first 4 other movies for mock)
  const similarMovies = MOCK_MOVIES.filter(m => m._id !== id).slice(0, 4);

  const handleOpenComposer = (review = null) => {
    setReviewToEdit(review);
    setIsComposerOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      if (reviewData.content || reviewData.text) {
        await apiRequest('/reviews', {
          method: 'POST',
          body: JSON.stringify({
            onModel: 'Movie',
            contentId: id,
            text: reviewData.content || reviewData.text
          })
        });
      }
      if (reviewData.rating) {
        let rv = 'GOOD';
        if (reviewData.rating >= 9) rv = 'PERFECT';
        else if (reviewData.rating >= 7) rv = 'LOVED IT';
        else if (reviewData.rating <= 4) rv = 'SKIP';
        else if (reviewData.rating <= 6) rv = 'AVERAGE';
        
        await apiRequest('/ratings', {
          method: 'POST',
          body: JSON.stringify({
            onModel: 'Movie',
            contentId: id,
            ratingValue: rv,
            numericValue: reviewData.rating
          })
        });
      }

      // Fallback local update for UI
      const newReview = {
        id: `new-${Date.now()}`,
        movieId: id,
        username: currentUserUsername,
        displayName: 'You', 
        avatar: 'Y',
        date: new Date().toISOString(),
        likes: 0,
        isLikedByMe: false,
        ...reviewData
      };
      setReviews(prev => [newReview, ...prev]);
      
      addNotification({ type: 'milestone', actor: { name: 'VYBE', avatar: 'vybe' }, action: 'You posted a review for', target: { title: movie?.title, id: id } });
    } catch (err) {
      console.error('Failed to submit review/rating', err);
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  const handleToggleLike = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        if (!r.isLikedByMe) {
          addNotification({ type: 'like', actor: { name: 'You', avatar: 'vybe' }, action: 'liked a review by', target: { title: r.displayName, id: id } });
        }
        return {
          ...r,
          isLikedByMe: !r.isLikedByMe,
          likes: r.isLikedByMe ? r.likes - 1 : r.likes + 1
        };
      }
      return r;
    }));
  };

  const currentUserReview = reviews.find(r => r.username === currentUserUsername);

  return (
    <div className="movie-details-page">
      <Header />
      
      <main className="movie-details-main">
        {/* Cinematic Backdrop Hero */}
        <section className="movie-hero" style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}>
          <div className="hero-overlay">
            <div className="breadcrumbs">
              <Link to="/movies">Movies</Link>
              <span className="separator">/</span>
              <span className="current">{movie.title}</span>
            </div>
            
            <div className="hero-content">
              <div className="hero-poster-container">
                <img src={movie.posterUrl} alt={movie.title} className="hero-poster" />
              </div>
              
              <div className="hero-info">
                <h1 className="movie-title-large">{movie.title}</h1>
                
                <div className="movie-metadata-row">
                  <span className="meta-item year">{releaseYear}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item rating">★ {movie.averageRating?.toFixed(1) || 'NR'}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item runtime">{movie.durationMinutes ? `${Math.floor(movie.durationMinutes/60)}h ${movie.durationMinutes%60}m` : (movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : 'Unknown runtime')}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item genres">{movie.genres?.join(', ') || 'N/A'}</span>
                </div>
                
                <p className="movie-description">{movie.description}</p>
                
                <div className="crew-info">
                  {movie.director && (
                    <div className="crew-block">
                      <span className="crew-label">Director</span>
                      <span className="crew-value">{movie.director}</span>
                    </div>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <div className="crew-block">
                      <span className="crew-label">Cast</span>
                      <span className="crew-value">{movie.cast.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="action-buttons">
                  <button className="btn-primary action-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Trailer
                  </button>
                  <button 
                    className={`btn-secondary action-btn ${isInWatchlist ? 'active' : ''}`}
                    onClick={() => { setIsInWatchlist(!isInWatchlist); if (!isInWatchlist) addNotification({ type: 'watchlist', actor: { name: 'You', avatar: 'vybe' }, action: 'added', target: { title: movie.title, id: movie._id }, actionSuffix: 'to your watchlist' }); }}
                  >
                    <svg viewBox="0 0 24 24" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2-2z"></path>
                    </svg>
                    {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                  </button>
                  <button 
                    className="btn-secondary action-btn"
                    onClick={() => setIsCollectionModalOpen(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Collect
                  </button>
                  <Link to={`/movies/${id}/discussions`} className="btn-secondary action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Discussions
                  </Link>
                  <button 
                    className="btn-outline action-btn"
                    onClick={() => handleOpenComposer(currentUserReview)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {currentUserReview ? 'Edit Rating' : 'Rate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar/Related Movies */}
        {similarMovies.length > 0 && (
          <section className="similar-movies-section">
            <h2 className="section-title">Similar Movies</h2>
            <div className="movies-grid">
              {similarMovies.map(sm => (
                <MovieCard key={sm._id} movie={sm} />
              ))}
            </div>
          </section>
        )}

        {/* Social Context / Reviews */}
        <section className="social-context-section">
          <div className="section-header">
            <h2 className="section-title">Community Reviews</h2>
            {!currentUserReview && (
              <button 
                className="btn-outline small"
                onClick={() => handleOpenComposer()}
              >
                Write a Review
              </button>
            )}
          </div>
          
          <ReviewList 
            reviews={reviews} 
            currentUserUsername={currentUserUsername}
            onEditReview={handleOpenComposer}
            onDeleteReview={handleDeleteReview}
            onToggleLike={handleToggleLike}
          />
        </section>
        
      </main>
      
      <Footer />

      <ReviewComposer 
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={handleSubmitReview}
        initialReview={reviewToEdit}
        movieTitle={movie.title}
      />

      {isCollectionModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCollectionModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', width: '100%', maxWidth: '400px',
            padding: '24px', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Add to Collection</h2>
              <button onClick={() => setIsCollectionModalOpen(false)} style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer'
              }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {collections.map(c => (
                <button 
                  key={c.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left'
                  }}
                  onClick={() => setIsCollectionModalOpen(false)}
                >
                  <span>{c.name}</span>
                  {c.hasMovie && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" width="16" height="16">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn-outline" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                  setIsCollectionModalOpen(false);
                  navigate('/collections');
                }}
              >
                Create New Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
