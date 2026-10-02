import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './People.css';

// Mock Data
const MOCK_PEOPLE = [
  { id: '1', displayName: 'Alex Chen', username: 'alexc', avatar: 'https://i.pravatar.cc/150?u=1', bio: 'Sci-fi nerd and aspiring filmmaker.', tastes: ['Sci-Fi', 'Action'], followers: 120, following: 80, isFollowing: false, category: 'Movie Lovers' },
  { id: '2', displayName: 'Jamie Doe', username: 'jamiedoe', avatar: 'https://i.pravatar.cc/150?u=2', bio: 'I watch too many horror movies. Always looking for recommendations!', tastes: ['Horror', 'Thriller'], followers: 340, following: 300, isFollowing: true, category: 'Most Active' },
  { id: '3', displayName: 'Sam Smith', username: 'sam_s', avatar: 'https://i.pravatar.cc/150?u=3', bio: 'Classic cinema enthusiast.', tastes: ['Drama', 'Romance'], followers: 85, following: 110, isFollowing: false, category: 'Movie Lovers' },
  { id: '4', displayName: 'Taylor Swift', username: 'tswift_fan', avatar: 'https://i.pravatar.cc/150?u=4', bio: 'Musicals and rom-coms are my vibe.', tastes: ['Musical', 'Comedy'], followers: 1500, following: 400, isFollowing: false, category: 'Most Active' },
  { id: '5', displayName: 'Chris Lee', username: 'chris_lee99', avatar: 'https://i.pravatar.cc/150?u=5', bio: 'Action packed weekends only.', tastes: ['Action', 'Adventure'], followers: 210, following: 180, isFollowing: true, category: 'Movie Lovers' },
  { id: '6', displayName: 'Morgan Wright', username: 'morganw', avatar: 'https://i.pravatar.cc/150?u=6', bio: 'Documentaries and real-life stories.', tastes: ['Documentary', 'Biography'], followers: 95, following: 105, isFollowing: false, category: 'Movie Lovers' },
  { id: '7', displayName: 'Jordan Sparks', username: 'jsparks', avatar: 'https://i.pravatar.cc/150?u=7', bio: 'Reviewing every movie I watch on VYBE.', tastes: ['Sci-Fi', 'Fantasy'], followers: 890, following: 560, isFollowing: false, category: 'Most Active' },
  { id: '8', displayName: 'Casey Jones', username: 'caseyj', avatar: 'https://i.pravatar.cc/150?u=8', bio: 'Anime and animated features!', tastes: ['Animation', 'Fantasy'], followers: 420, following: 310, isFollowing: true, category: 'Most Active' },
];

export default function People() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Initialize data
  useEffect(() => {
    // Simulate network request
    const timer = setTimeout(() => {
      setPeople(MOCK_PEOPLE);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFollowToggle = (userId) => {
    const personToFollow = people.find(p => p.id === userId);
    if (personToFollow && !personToFollow.isFollowing) {
      addNotification({
        type: 'follow',
        actor: { name: personToFollow.displayName, avatar: personToFollow.avatar },
        action: 'started following you',
        target: null
      });
    }
    setPeople(prev => prev.map(person => {
      if (person.id === userId) {
        return {
          ...person,
          isFollowing: !person.isFollowing,
          followers: person.isFollowing ? person.followers - 1 : person.followers + 1
        };
      }
      return person;
    }));
  };


  const tabs = ['All', 'Movie Lovers', 'Most Active'];

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          person.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || person.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="people-page">
      <Header />
      
      <main className="people-main">
        <section className="people-intro">
          <h1>Discover the Community</h1>
          <p>Find friends, reviewers, and people with similar movie tastes on VYBE.</p>
          
          <div className="people-search-container">
            <div className="people-search-wrapper">
              <svg className="people-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="people-search-input"
                placeholder="Search by name or @username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search people"
              />
            </div>
          </div>
        </section>

        <div className="people-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`people-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="people-content">
          {loading ? (
            <div className="people-loading">Loading community members...</div>
          ) : filteredPeople.length > 0 ? (
            <div className="people-grid">
              {filteredPeople.map(person => (
                <article key={person.id} className="user-card">
                  <Link to={`/people/${person.username}`}>
                    <img src={person.avatar} alt={`${person.displayName}'s avatar`} className="user-avatar" />
                  </Link>
                  <div className="user-info">
                    <h3>
                      <Link to={`/people/${person.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {person.displayName}
                      </Link>
                    </h3>
                    <div className="user-username">
                      <Link to={`/people/${person.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        @{person.username}
                      </Link>
                    </div>
                    <p className="user-bio">{person.bio}</p>
                    
                    <div className="user-tastes">
                      {person.tastes.map(taste => (
                        <span key={taste} className="taste-tag">{taste}</span>
                      ))}
                    </div>

                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-value">{person.followers}</span>
                        <span className="stat-label">Followers</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{person.following}</span>
                        <span className="stat-label">Following</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button 
                        className="btn-follow"
                        onClick={() => navigate('/messages')}
                        style={{ background: 'transparent', border: '1px solid #45a29e', color: '#45a29e', flex: 1 }}
                      >
                        Message
                      </button>
                      <button 
                        className={`btn-follow ${person.isFollowing ? 'following' : 'follow'}`}
                        onClick={() => handleFollowToggle(person.id)}
                        aria-label={person.isFollowing ? `Unfollow ${person.displayName}` : `Follow ${person.displayName}`}
                        style={{ flex: 1 }}
                      >
                        {person.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="people-empty">
              <h3>No people found</h3>
              <p>Try adjusting your search or tab filters.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
