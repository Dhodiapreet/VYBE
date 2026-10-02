import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Search.css';

// Mock Data
const MOCK_MOVIES = [
  { _id: '1', title: 'The Quantum Paradox', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', releaseDate: '2023-11-10', genres: ['Sci-Fi', 'Thriller'], averageRating: 4.8 },
  { _id: '2', title: 'Midnight Run', posterUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081524?w=500&q=80', releaseDate: '2024-01-15', genres: ['Action', 'Comedy'], averageRating: 4.2 },
  { _id: '3', title: 'Echoes of Silence', posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80', releaseDate: '2023-09-05', genres: ['Drama', 'Mystery'], averageRating: 4.5 },
  { _id: '4', title: 'Neon Dreams', posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80', releaseDate: '2024-03-22', genres: ['Sci-Fi', 'Action'], averageRating: 4.0 },
];

const MOCK_PEOPLE = [
  { id: '1', displayName: 'Alex Chen', username: 'alexc', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Sci-fi nerd and aspiring filmmaker.', tastes: ['Sci-Fi', 'Action'], followers: 120, following: 80, isFollowing: false },
  { id: '2', displayName: 'Jamie Doe', username: 'jamiedoe', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'I watch too many horror movies. Always looking for recommendations!', tastes: ['Horror', 'Thriller'], followers: 340, following: 300, isFollowing: true },
];

import { apiRequest } from '../../services/api';

const SEARCH_HISTORY_KEY = 'vybe_recent_searches';
const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary'];
const TABS = ['All', 'Movies', 'People', 'Reviews', 'Discussions'];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // API State
  const [searchResults, setSearchResults] = useState({ movies: [], people: [] });
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch from API when debouncedQuery changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults({ movies: [], people: [] });
        return;
      }
      try {
        setLoading(true);
        const res = await apiRequest(`/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res && res.data) {
          setSearchResults({ 
            movies: res.data.movies || [], 
            people: (res.data.users || []).map(u => ({
              id: u._id,
              username: u.username,
              displayName: u.username,
              avatar: u.profilePicture || `https://ui-avatars.com/api/?name=${u.username}`,
              bio: u.bio
            }))
          });
        }
      } catch (err) {
        console.error('Search API error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recent searches', error);
      }
    }
  }, []);
  
  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !e.target.closest('.search-input-container')) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      saveRecentSearch(query);
      setIsFocused(false);
      e.target.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
    setIsFocused(false);
  };

  // Map API results to local variables
  const filteredMovies = searchResults.movies || [];
  const filteredPeople = searchResults.people || [];
  
  // Since Reviews/Discussions aren't coming from this backend search endpoint right now,
  // we leave them empty or we can still mock them based on the query if we wanted.
  // We'll just leave them empty for a real integration.
  const filteredReviews = [];
  const filteredDiscussions = [];

  const hasResults = filteredMovies.length > 0 || filteredPeople.length > 0 || filteredReviews.length > 0 || filteredDiscussions.length > 0;

  // Render components
  const renderPersonCard = (person) => (
    <div key={person.id} className="person-result-card">
      <Link to={`/people/${person.username}`} className="person-result-info">
        <img src={person.avatar} alt={person.displayName} className="person-result-avatar" />
        <div className="person-result-details">
          <span className="person-result-name">{person.displayName}</span>
          <span className="person-result-username">@{person.username}</span>
        </div>
      </Link>
      <div className="person-result-actions">
        <button className="btn-small btn-follow">{person.isFollowing ? 'Following' : 'Follow'}</button>
        <button className="btn-small btn-message" onClick={() => navigate('/messages')}>Message</button>
      </div>
    </div>
  );

  const renderReviewCard = (review) => (
    <div key={review.id} className="review-result-card">
      <div className="review-result-header">
        <img src={review.author.avatar} alt={review.author.name} className="review-result-avatar" />
        <div className="review-result-meta">
          <Link to={`/people/${review.author.username}`}>{review.author.name}</Link> reviewed <Link to={`/movies/${review.movie._id}`}>{review.movie.title}</Link>
        </div>
      </div>
      <div className="review-result-rating">
        {'â˜…'.repeat(review.rating)}{'â˜†'.repeat(5 - review.rating)}
      </div>
      <div className="review-result-text">"{review.text}"</div>
    </div>
  );

  const renderDiscussionCard = (discussion) => (
    <div key={discussion.id} className="discussion-result-card">
      <h4 className="discussion-result-title">
        <Link to={`/movies/${discussion.movieId}/discussions`}>{discussion.title}</Link>
      </h4>
      <div className="discussion-result-meta">
        {discussion.movieTitle} â€¢ By <Link to={`/people/${discussion.author.username}`}>{discussion.author.name}</Link>
      </div>
      <div className="discussion-result-body">
        {discussion.body}
      </div>
      <div className="discussion-result-stats">
        <span>{discussion.replies} Replies</span>
        <span>{discussion.likes} Likes</span>
      </div>
    </div>
  );

  return (
    <div className="search-page">
      <Header />
      <main className="search-main">
        <section className="search-header-section">
          <h1>Global Search & Discovery</h1>
          <div className="search-input-container">
            <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, people, reviews, discussions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleSearchSubmit}
              aria-label="Global Search"
            />
            {query && (
              <button className="search-clear-btn" aria-label="Clear Search" onClick={() => setQuery('')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {isFocused && (query.trim().length > 0 || recentSearches.length > 0) && (
              <div className="search-dropdown" ref={dropdownRef}>
                {query.trim().length > 0 ? (
                  <div className="dropdown-section">
                    <div className="dropdown-header">Suggestions</div>
                    {/* Instant suggestions based on query */}
                    {MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(m => (
                      <button key={`s-m-${m._id}`} className="dropdown-item" onClick={() => handleSuggestionClick(m.title)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        {m.title}
                      </button>
                    ))}
                    {MOCK_PEOPLE.filter(p => p.displayName.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map(p => (
                      <button key={`s-p-${p.id}`} className="dropdown-item" onClick={() => handleSuggestionClick(p.displayName)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        {p.displayName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="dropdown-section">
                    <div className="dropdown-header">
                      Recent Searches
                      {recentSearches.length > 0 && <button className="clear-history-btn" onClick={clearHistory}>Clear</button>}
                    </div>
                    {recentSearches.map((term, i) => (
                      <button key={i} className="dropdown-item" onClick={() => handleSuggestionClick(term)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {!debouncedQuery.trim() ? (
          <section className="discovery-content">
            <div className="discovery-section-block">
              <h3>Browse by Genre</h3>
              <div className="genre-chips-container">
                {GENRES.map(genre => (
                  <Link to="/movies" key={genre} className="genre-chip">{genre}</Link>
                ))}
              </div>
            </div>
            
            <div className="discovery-section-block">
              <h3>Trending Movies</h3>
              <div className="search-movies-grid">
                {MOCK_MOVIES.map(movie => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>

            <div className="discovery-section-block">
              <h3>Active Cinephiles</h3>
              <div className="search-people-grid">
                {MOCK_PEOPLE.map(person => renderPersonCard(person))}
              </div>
            </div>
          </section>
        ) : (
          <>
            <div className="search-tabs">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`search-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <section className="results-section">
              {loading ? (
                <div className="search-empty-state">
                  <div className="loader" style={{margin: '0 auto 16px'}}></div>
                  <p>Searching...</p>
                </div>
              ) : !hasResults ? (
                <div className="search-empty-state">
                  <h3>No results found for "{debouncedQuery}"</h3>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="results-content">
                  {/* ALL TAB */}
                  {activeTab === 'All' && (
                    <>
                      {filteredMovies.length > 0 && (
                        <div className="results-section-block">
                          <div className="results-header">
                            <h2>Movies</h2>
                            <button className="view-all-link" onClick={() => setActiveTab('Movies')}>View All Movies</button>
                          </div>
                          <div className="search-movies-grid">
                            {filteredMovies.slice(0, 4).map(m => <MovieCard key={m._id} movie={m} />)}
                          </div>
                        </div>
                      )}

                      {filteredPeople.length > 0 && (
                        <div className="results-section-block" style={{ marginTop: '40px' }}>
                          <div className="results-header">
                            <h2>People</h2>
                            <button className="view-all-link" onClick={() => setActiveTab('People')}>View All People</button>
                          </div>
                          <div className="search-people-grid">
                            {filteredPeople.slice(0, 4).map(p => renderPersonCard(p))}
                          </div>
                        </div>
                      )}

                      {filteredReviews.length > 0 && (
                        <div className="results-section-block" style={{ marginTop: '40px' }}>
                          <div className="results-header">
                            <h2>Reviews</h2>
                            <button className="view-all-link" onClick={() => setActiveTab('Reviews')}>View All Reviews</button>
                          </div>
                          <div className="search-list-grid">
                            {filteredReviews.slice(0, 2).map(r => renderReviewCard(r))}
                          </div>
                        </div>
                      )}

                      {filteredDiscussions.length > 0 && (
                        <div className="results-section-block" style={{ marginTop: '40px' }}>
                          <div className="results-header">
                            <h2>Discussions</h2>
                            <button className="view-all-link" onClick={() => setActiveTab('Discussions')}>View All Discussions</button>
                          </div>
                          <div className="search-list-grid">
                            {filteredDiscussions.slice(0, 2).map(d => renderDiscussionCard(d))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* MOVIES TAB */}
                  {activeTab === 'Movies' && (
                    <div className="results-section-block">
                      <div className="results-header">
                        <h2>Movies</h2>
                      </div>
                      {filteredMovies.length > 0 ? (
                        <div className="search-movies-grid">
                          {filteredMovies.map(m => <MovieCard key={m._id} movie={m} />)}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text)' }}>No movies found matching "{debouncedQuery}".</p>
                      )}
                    </div>
                  )}

                  {/* PEOPLE TAB */}
                  {activeTab === 'People' && (
                    <div className="results-section-block">
                      <div className="results-header">
                        <h2>People</h2>
                      </div>
                      {filteredPeople.length > 0 ? (
                        <div className="search-people-grid">
                          {filteredPeople.map(p => renderPersonCard(p))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text)' }}>No people found matching "{debouncedQuery}".</p>
                      )}
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === 'Reviews' && (
                    <div className="results-section-block">
                      <div className="results-header">
                        <h2>Reviews</h2>
                      </div>
                      {filteredReviews.length > 0 ? (
                        <div className="search-list-grid">
                          {filteredReviews.map(r => renderReviewCard(r))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text)' }}>No reviews found matching "{debouncedQuery}".</p>
                      )}
                    </div>
                  )}

                  {/* DISCUSSIONS TAB */}
                  {activeTab === 'Discussions' && (
                    <div className="results-section-block">
                      <div className="results-header">
                        <h2>Discussions</h2>
                      </div>
                      {filteredDiscussions.length > 0 ? (
                        <div className="search-list-grid">
                          {filteredDiscussions.map(d => renderDiscussionCard(d))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text)' }}>No discussions found matching "{debouncedQuery}".</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
