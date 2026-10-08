import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MoctaleMediaCard from '../../components/MoctaleMediaCard';
import { apiRequest } from '../../services/api';
import './Home.css';

function PromoCard({ title, text }) {
  return (
    <div className="moctale-promo-card">
      <div className="moctale-promo-lines">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <a href="/search" className="moctale-promo-button">Discover now →</a>
      </div>
    </div>
  );
}

function FeedSection({ title, icon = '✦', items, caption, loading }) {
  const visible = items.slice(0, 10);
  return (
    <section className="moctale-section">
      <div className="moctale-section-head">
        <span className="moctale-section-icon" aria-hidden="true">{icon}</span>
        <h2 className="moctale-section-title">{title}</h2>
      </div>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : (
        <div className="moctale-home-grid">
          {visible.slice(0, 5).map((item, index) => (
            <MoctaleMediaCard key={item._id || item.tmdbId || index} item={item} caption={caption(index)} />
          ))}
          {visible.slice(5, 10).map((item, index) => (
            <MoctaleMediaCard key={item._id || item.tmdbId || index + 5} item={item} caption={caption(index + 5)} />
          ))}
          <PromoCard
            title="Discover Movies & Shows"
            text="Find your next favourite across theatres and OTT, then build your VYBE."
          />
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [movieSections, setMovieSections] = useState({
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError('');
        const endpoints = {
          trending: '/movies/tmdb/trending',
          popular: '/movies/tmdb/popular',
          topRated: '/movies/tmdb/top-rated',
          nowPlaying: '/movies/tmdb/now-playing',
          upcoming: '/movies/tmdb/upcoming'
        };

        const entries = await Promise.all(
          Object.entries(endpoints).map(async ([key, endpoint]) => {
            const response = await apiRequest(endpoint);
            return [key, response?.data?.results || []];
          })
        );

        if (!cancelled) {
          setMovieSections(Object.fromEntries(entries));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load titles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();
    return () => { cancelled = true; };
  }, []);

  const captions = useMemo(() => ({
    trending: index => index < 2 ? 'New Movie' : index === 2 ? 'Trailer' : 'New Movie',
    popular: index => index < 2 ? 'Movie • 2026' : 'Movie',
    topRated: index => 'Movie • Top Rated',
    nowPlaying: index => 'Now Playing',
    upcoming: index => 'Upcoming'
  }), []);

  return (
    <div className="home-page moctale-home">
      <Header />
      <main>
        {error && <div className="home-error">{error}</div>}

        <section className="moctale-section moctale-talk-section">
          <div className="moctale-section-head">
            <span className="moctale-section-icon" aria-hidden="true">📣</span>
            <h1 className="moctale-section-title">Talk Of The Town</h1>
          </div>

          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <div className="moctale-home-grid">
              {movieSections.trending.slice(0, 10).map((item, index) => (
                <MoctaleMediaCard
                  key={item._id || item.tmdbId || index}
                  item={item}
                  caption={captions.trending(index)}
                />
              ))}
              <PromoCard
                title="Discover Movies & Shows"
                text="Your next watch is waiting. Explore what's trending across the VYBE universe."
              />
            </div>
          )}
        </section>

        <div className="moctale-home-section-dark">
          <FeedSection
            title="Watch It With District"
            icon="✦"
            items={movieSections.popular}
            caption={(index) => index === 0 ? 'Movie • 2026' : 'Movie'}
            loading={loading}
          />
          <FeedSection
            title="Editor's Pick Of The Week"
            icon="✦"
            items={movieSections.topRated}
            caption={() => 'Movie'}
            loading={loading}
          />
          <FeedSection
            title="Don't Miss These"
            icon="✦"
            items={movieSections.nowPlaying}
            caption={() => 'Movie'}
            loading={loading}
          />
          <FeedSection
            title="Coming Soon"
            icon="✦"
            items={movieSections.upcoming}
            caption={() => 'Upcoming'}
            loading={loading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}