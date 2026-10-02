import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import { apiRequest } from '../../services/api';
import './Watchlist.css';

const INITIAL_WATCHLIST = [
  {
    _id: '1',
    title: 'Dune: Part Two',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT1O.jpg',
    releaseDate: '2024-02-28',
    averageRating: 8.3,
    genres: ['Science Fiction', 'Adventure'],
    watched: false,
    addedAt: '2024-03-01'
  },
  {
    _id: '2',
    title: 'Oppenheimer',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    releaseDate: '2023-07-19',
    averageRating: 8.1,
    genres: ['Drama', 'History'],
    watched: true,
    addedAt: '2023-08-15'
  },
  {
    _id: '3',
    title: 'Poor Things',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    releaseDate: '2023-12-07',
    averageRating: 7.9,
    genres: ['Science Fiction', 'Romance', 'Comedy'],
    watched: false,
    addedAt: '2024-01-10'
  }
];

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'watched', 'unwatched'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'rating'

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const res = await apiRequest('/watchlist');
        if (res && res.data) {
          const mapped = res.data.map(item => ({
            ...item.movie,
            watchlistId: item._id,
            watched: item.watched,
            addedAt: item.createdAt || new Date().toISOString()
          }));
          setWatchlist(mapped);
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        console.error('Failed to load watchlist:', err);
        setWatchlist(INITIAL_WATCHLIST); // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleToggleWatched = async (id) => {
    const movie = watchlist.find(m => m._id === id);
    if (!movie) return;
    
    // Only 'mark watched' is implemented in API: PATCH /watchlist/:id/watched
    if (!movie.watched) {
      try {
        if (movie.watchlistId) {
          await apiRequest(`/watchlist/${movie.watchlistId}/watched`, { method: 'PATCH' });
        }
        setWatchlist(prev => prev.map(m => {
          if (m._id === id) {
            addNotification({ type: 'milestone', actor: { name: 'VYBE', avatar: 'vybe' }, action: 'You marked', target: { title: m.title, id: m._id }, actionSuffix: 'as watched!' });
            return { ...m, watched: true };
          }
          return m;
        }));
      } catch (err) {
        console.error('Failed to mark as watched', err);
      }
    }
  };

  const handleRemove = async (id) => {
    const movie = watchlist.find(m => m._id === id);
    if (!movie) return;
    try {
      // Backend does not have DELETE /watchlist/:id yet, so we just remove from UI for now
      setWatchlist(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Failed to remove from watchlist', err);
    }
  };

  const filteredAndSortedWatchlist = watchlist
    .filter(movie => {
      if (filterStatus === 'watched') return movie.watched;
      if (filterStatus === 'unwatched') return !movie.watched;
      return true;
    })
    .filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
      // 'recent' fallback
      return new Date(b.addedAt) - new Date(a.addedAt);
    });

  return (
    <div className="watchlist-page">
      <Header />
      
      <main className="watchlist-main">
        <div className="watchlist-header">
          <h1>My Watchlist</h1>
          <div className="watchlist-stats">
            <span>{watchlist.length} Movies</span>
            <span className="dot-separator">â€¢</span>
            <span>{watchlist.filter(m => m.watched).length} Watched</span>
          </div>
        </div>

        <div className="watchlist-controls">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search watchlist..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-sort-controls">
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="control-select"
            >
              <option value="all">All Movies</option>
              <option value="unwatched">Unwatched</option>
              <option value="watched">Watched</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your watchlist...</p>
          </div>
        ) : filteredAndSortedWatchlist.length > 0 ? (
          <div className="watchlist-grid">
            {filteredAndSortedWatchlist.map(movie => (
              <div key={movie._id} className="watchlist-item-wrapper">
                <MovieCard movie={movie} />
                <div className="watchlist-item-actions">
                  <button 
                    className={`btn-action ${movie.watched ? 'watched' : ''}`}
                    onClick={() => handleToggleWatched(movie._id)}
                    title={movie.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {movie.watched ? (
                        <>
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </>
                      ) : (
                        <circle cx="12" cy="12" r="10"></circle>
                      )}
                    </svg>
                    {movie.watched ? 'Watched' : 'Unwatched'}
                  </button>
                  <button 
                    className="btn-action remove"
                    onClick={() => handleRemove(movie._id)}
                    title="Remove from Watchlist"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2>Your Watchlist is Empty</h2>
            <p>
              {watchlist.length > 0 
                ? "No movies match your current filters." 
                : "You haven't added any movies to your watchlist yet."}
            </p>
            {watchlist.length > 0 ? (
              <button 
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/movies" className="btn-primary">
                Browse Movies
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
