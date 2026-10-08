import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiRequest } from '../../services/api';
import './People.css';

const TABS = [
  { key: 'All', label: 'All', icon: '✦' },
  { key: 'Hero', label: 'Hero', icon: '♂' },
  { key: 'Heroine', label: 'Heroine', icon: '♀' },
  { key: 'Director', label: 'Directors', icon: '🎬' },
  { key: 'Musician', label: 'Musicians', icon: '♫' },
  { key: 'Other', label: 'Other', icon: '◆' },
];

export default function People() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const query = searchQuery.trim();
      setLoading(true);
      setError('');
      try {
        const endpoint = query.length >= 2
          ? '/people/tmdb/search?query=' + encodeURIComponent(query)
          : '/people/tmdb/discover?category=' + encodeURIComponent(activeTab);
        const response = await apiRequest(endpoint);
        let results = response?.data?.results || [];
        if (query.length >= 2 && activeTab !== 'All') {
          results = results.filter(person => person.category === activeTab);
        }
        if (!cancelled) setPeople(results);
      } catch (requestError) {
        console.error('Failed to load people:', requestError);
        if (!cancelled) {
          setPeople([]);
          setError('Could not load real people right now.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, searchQuery.trim().length >= 2 ? 350 : 50);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeTab]);

  const visiblePeople = useMemo(() => people.slice(0, 24), [people]);

  return (
    <div className="people-page real-people-directory">
      <Header />
      <main className="people-main">
        <section className="people-intro people-intro-real">
          <span className="people-eyebrow">VYBE PEOPLE</span>
          <h1>Discover Real People</h1>
          <p>Explore real actors, actresses, directors, musicians and other creators from TMDB.</p>

          <div className="people-search-container">
            <div className="people-search-wrapper">
              <svg className="people-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="people-search-input"
                placeholder="Search actor, actress, director, musician..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                aria-label="Search real people"
              />
              {searchQuery && <button className="people-search-clear" type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>}
            </div>
          </div>
        </section>

        <nav className="people-tabs people-tabs-real" aria-label="People categories">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`people-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
            >
              <span className="people-tab-icon" aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="people-content real-people-content">
          <div className="real-people-toolbar">
            <div>
              <span className="real-people-kicker">TMDB • OFFICIAL PEOPLE DATA</span>
              <h2>{searchQuery.trim() ? `People matching “${searchQuery.trim()}”` : activeTab === 'All' ? 'Most Famous People' : TABS.find(tab => tab.key === activeTab)?.label}</h2>
            </div>
            <span className="real-people-count">{loading ? 'Loading…' : `${visiblePeople.length} people`}</span>
          </div>

          {loading ? (
            <div className="real-people-state"><span className="people-spinner" /><p>Loading real people...</p></div>
          ) : error ? (
            <div className="people-empty"><h3>{error}</h3><p>Try again in a moment.</p></div>
          ) : visiblePeople.length > 0 ? (
            <div className="people-grid real-people-grid">
              {visiblePeople.map(person => (
                <article className="real-person-card" key={person.tmdbId}>
                  <Link to={`/people/actor/${person.tmdbId}`} className="real-person-profile-link">
                    <div className="real-person-image-wrap">
                      {person.profileUrl ? <img src={person.profileUrl} alt={person.name} className="real-person-image" loading="lazy" /> : <div className="real-person-image real-person-placeholder">{person.name.charAt(0)}</div>}
                      <span className={`real-person-category ${String(person.category || 'Other').toLowerCase()}`}>{person.category || 'Other'}</span>
                    </div>
                  </Link>
                  <div className="real-person-body">
                    <Link to={`/people/actor/${person.tmdbId}`} className="real-person-name">{person.name}</Link>
                    <span className="real-person-department">{person.knownForDepartment || 'Entertainment'}</span>
                    {person.knownFor?.length > 0 && (
                      <div className="real-person-known-for">
                        {person.knownFor.slice(0, 3).map(item => <span key={`${item.mediaType}-${item.tmdbId}`}>{item.title}</span>)}
                      </div>
                    )}
                    <div className="real-person-footer">
                      <span>Popularity {Number(person.popularity || 0).toFixed(0)}</span>
                      <Link to={`/people/actor/${person.tmdbId}`}>View profile →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="people-empty"><h3>No real people found</h3><p>Try another name or choose a different category.</p></div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}