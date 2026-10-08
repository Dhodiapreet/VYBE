import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SeriesCard from '../../components/SeriesCard/SeriesCard';
import { apiRequest } from '../../services/api';
import './Series.css';

export default function Series() {
  const [sections, setSections] = useState({ trending: [], popular: [], topRated: [], airingToday: [], onTheAir: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const loadSeries = async (searchQuery = '') => {
    try {
      setLoading(true); setError('');
      if (searchQuery.trim()) {
        const res = await apiRequest('/series/search?q=' + encodeURIComponent(searchQuery.trim()));
        setSections(prev => ({ ...prev, trending: res?.data?.results || [] }));
        return;
      }
      const endpoints = {
        trending: '/series/trending', popular: '/series/popular', topRated: '/series/top-rated',
        airingToday: '/series/airing-today', onTheAir: '/series/on-the-air'
      };
      const entries = await Promise.all(Object.entries(endpoints).map(async ([key, endpoint]) => {
        const res = await apiRequest(endpoint);
        return [key, res?.data?.results || []];
      }));
      setSections(Object.fromEntries(entries));
    } catch (err) {
      console.error('Series load error:', err); setError(err.message || 'Unable to load series');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadSeries(); }, []);

  return (
    <div className="series-page moctale-catalog-page">
      <Header />
      <main className="series-main">
        <section className="series-intro">
          <p className="series-eyebrow">VYBE TV</p><h1>SERIES</h1>
          <p>Discover real TV shows and series powered by TMDB.</p>
          <form onSubmit={e => { e.preventDefault(); loadSeries(query); }} className="series-search">
            <div className="series-search-input-wrapper">
              <svg className="series-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search series..." aria-label="Search series" />
            </div>
            <button className="btn-primary" type="submit">Search</button>
          </form>
        </section>
        {error && <div className="series-error">{error}</div>}
        {loading ? <div className="loading-state"><div className="spinner"></div><p>Loading series...</p></div> :
          [['TRENDING SERIES', sections.trending],['POPULAR SERIES', sections.popular],['TOP RATED SERIES', sections.topRated],['AIRING TODAY', sections.airingToday],['ON THE AIR', sections.onTheAir]].map(([title, items]) =>
            <section className="series-section" key={title}><div className="series-section-head"><h2>{title}</h2>{items.length>0&&<span>{items.length} titles</span>}</div>
              {items.length ? <div className="series-grid">{items.map(item => <SeriesCard key={item.tmdbId} series={item} />)}</div> : <p className="series-empty">No series found in this section.</p>}
            </section>
          )}
      </main><Footer />
    </div>
  );
}
