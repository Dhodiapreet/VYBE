import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Movies.css';


const FEATURED_MOVIE = {
  _id: 'f1', title: 'Interstellar Odyssey', posterUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80', releaseDate: '2024-11-05', genres: ['Sci-Fi', 'Adventure'], averageRating: 4.9,
  description: 'Embark on a cinematic journey through the cosmos where humanity seeks a new home amongst the stars. A visually stunning masterpiece that redefines space exploration and human resilience.'
};

import { apiRequest } from '../../services/api';

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  
  const [allMovies, setAllMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(8);
  
  const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Drama', 'Thriller', 'Horror', 'Comedy'];
  const years = ['All', '2024', '2023', '2022', '2021'];
  const sortOptions = ['Popularity', 'Rating (High to Low)', 'Release Date (Newest)', 'Title (A-Z)'];

  // Fetch movies once on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Fetch from TMDB trending endpoint instead of local /movies
        const res = await apiRequest('/movies/tmdb/trending');
        if (res && res.data) {
          // data.results for TMDB response, fallback to data if it's an array directly
          const moviesArray = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
          setAllMovies(moviesArray);
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Apply filters
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      let filtered = [...allMovies];
      
      if (searchQuery) {
        filtered = filtered.filter(m => m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      
      if (selectedGenre !== 'All') {
        filtered = filtered.filter(m => m.genres && m.genres.includes(selectedGenre));
      }

      if (selectedYear !== 'All') {
        filtered = filtered.filter(m => m.releaseDate && String(m.releaseDate).startsWith(selectedYear));
      }

      if (selectedSort === 'Rating (High to Low)') {
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      } else if (selectedSort === 'Release Date (Newest)') {
        filtered.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
      } else if (selectedSort === 'Title (A-Z)') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      setDisplayedMovies(filtered);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [allMovies, searchQuery, selectedGenre, selectedYear, selectedSort, loading]);

  const loadMore = () => {
    setLoadedCount(prev => prev + 4);
  };

  return (
    <div className="movies-page">
      <Header />
      
      <main className="movies-main">
        <section className="movies-intro">
          <div className="movies-intro-content">
            <h1>MOVIES</h1>
            <p>Discover your next favorite film. Browse through our curated collection of cinematic masterpieces.</p>
          </div>
          
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="movies-search-input"
                placeholder="Search movies by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {!searchQuery && selectedGenre === 'All' && selectedYear === 'All' && (
          <section className="featured-discovery-strip">
            <div className="featured-backdrop" style={{ backgroundImage: `url(${FEATURED_MOVIE.posterUrl})` }}>
              <div className="featured-overlay">
                <div className="featured-content">
                  <span className="featured-badge">Featured Discovery</span>
                  <h2>{FEATURED_MOVIE.title}</h2>
                  <div className="featured-meta">
                    <span className="featured-year">{FEATURED_MOVIE.releaseDate.substring(0, 4)}</span>
                    <span className="meta-separator">•</span>
                    <span className="featured-genre">{FEATURED_MOVIE.genres.join(', ')}</span>
                    <span className="meta-separator">•</span>
                    <span className="featured-rating">★ {FEATURED_MOVIE.averageRating.toFixed(1)}</span>
                  </div>
                  <p className="featured-desc">{FEATURED_MOVIE.description}</p>
                  <Link to={`/movies/${FEATURED_MOVIE._id}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Trailer
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="discovery-filter-bar">
          <div className="filter-group">
            <label>Genre</label>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="filter-group sort-group">
            <label>Sort By</label>
            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
              {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </section>

        <section className="movies-grid-section">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : displayedMovies.length === 0 ? (
            <div className="empty-state">
              <h3>No movies found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button className="btn-outline" onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedYear('All');
              }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="movies-grid">
                {displayedMovies.slice(0, loadedCount).map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
              
              {loadedCount < displayedMovies.length && (
                <div className="load-more-container">
                  <button className="btn-outline load-more-btn" onClick={loadMore}>
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="social-context">
          <div className="social-context-header">
            <h3>People are talking</h3>
          </div>
          <div className="reviews-strip">
            <div className="review-card">
              <div className="review-user">
                <div className="user-avatar">A</div>
                <div className="user-info">
                  <span className="user-name">Alex M.</span>
                  <span className="review-movie">on The Quantum Paradox</span>
                </div>
              </div>
              <p className="review-text">"Mind-bending from start to finish. The visuals are absolutely spectacular."</p>
              <div className="review-rating">★★★★★</div>
            </div>
            <div className="review-card">
              <div className="review-user">
                <div className="user-avatar">S</div>
                <div className="user-info">
                  <span className="user-name">Sarah K.</span>
                  <span className="review-movie">on Midnight Run</span>
                </div>
              </div>
              <p className="review-text">"A perfect blend of action and comedy. Haven't laughed this hard in a while."</p>
              <div className="review-rating">★★★★☆</div>
            </div>
            <div className="review-card">
              <div className="review-user">
                <div className="user-avatar">J</div>
                <div className="user-info">
                  <span className="user-name">James L.</span>
                  <span className="review-movie">on Neon Dreams</span>
                </div>
              </div>
              <p className="review-text">"Visually stunning but the plot falls a bit flat in the third act."</p>
              <div className="review-rating">★★★☆☆</div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
