import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { apiRequest } from '../../services/api';
import './PersonDetails.css';

const FilmographyCard = ({ item }) => {
  const href = item.mediaType === 'Series' ? `/series/${item.tmdbId}` : `/movies/tmdb/${item.tmdbId}`;
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
  return (
    <Link to={href} className="filmography-card">
      <div className="filmography-poster">
        {item.posterUrl ? <img src={item.posterUrl} alt={item.title} loading="lazy" /> : <div className="filmography-fallback">{item.title.charAt(0)}</div>}
        <span className="filmography-type">{item.mediaType}</span>
      </div>
      <div className="filmography-copy">
        <h3>{item.title}</h3>
        <div className="filmography-meta">
          {year && <span>{year}</span>}
          {year && item.averageRating > 0 && <span>•</span>}
          {item.averageRating > 0 && <span>★ {item.averageRating.toFixed(1)}</span>}
        </div>
        {item.character && <p>as {item.character}</p>}
        {item.job && !item.character && <p>{item.job}</p>}
      </div>
    </Link>
  );
};

export default function PersonDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await apiRequest(`/people/tmdb/${id}`);
        if (!cancelled) setPerson(response?.data || null);
      } catch (err) {
        console.error('Failed to load person:', err);
        if (!cancelled) { setPerson(null); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const filtered = useMemo(() => {
    if (!person) return [];
    if (activeTab === 'movies') return person.movies || [];
    if (activeTab === 'series') return person.series || [];
    return [...(person.movies || []), ...(person.series || [])].sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    });
  }, [person, activeTab]);

  if (loading) return <div className="person-details-page"><Header /><main className="person-state"><span className="person-spinner" /><p>Loading person...</p></main><Footer /></div>;
  if (error || !person) return <div className="person-details-page"><Header /><main className="person-state"><h2>Person Not Found</h2><Link className="btn-primary" to="/movies">Back to Movies</Link></main><Footer /></div>;

  return (
    <div className="person-details-page">
      <Header />
      <main className="person-details-main">
        <section className="person-hero">
          <div className="person-hero-inner">
            <div className="person-profile-media">
              {person.profileUrl ? <img src={person.profileUrl} alt={person.name} /> : <div className="person-profile-fallback">{person.name.charAt(0)}</div>}
            </div>
            <div className="person-profile-copy">
              <span className="person-eyebrow">CAST &amp; CREW</span>
              <h1>{person.name}</h1>
              {person.knownForDepartment && <p className="person-role">{person.knownForDepartment}</p>}
              <div className="person-facts">
                {person.birthday && <span>Born {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                {person.placeOfBirth && <span>• {person.placeOfBirth}</span>}
                <span>• {person.totalCredits} film &amp; TV credits</span>
              </div>
              {person.biography && <p className="person-biography">{person.biography}</p>}
              <div className="person-actions">
                {person.imdbId && <a className="person-action secondary" href={`https://www.imdb.com/name/${person.imdbId}/`} target="_blank" rel="noreferrer">IMDb ↗</a>}
                {person.homepage && <a className="person-action secondary" href={person.homepage} target="_blank" rel="noreferrer">Official Site ↗</a>}
              </div>
            </div>
          </div>
        </section>

        <section className="filmography-section">
          <div className="filmography-heading">
            <div>
              <span className="person-eyebrow">FILMOGRAPHY</span>
              <h2>{person.name} in Movies &amp; Series</h2>
            </div>
            <div className="filmography-tabs" role="tablist">
              <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All <span>{(person.movies?.length || 0) + (person.series?.length || 0)}</span></button>
              <button className={activeTab === 'movies' ? 'active' : ''} onClick={() => setActiveTab('movies')}>Movies <span>{person.movies?.length || 0}</span></button>
              <button className={activeTab === 'series' ? 'active' : ''} onClick={() => setActiveTab('series')}>Series <span>{person.series?.length || 0}</span></button>
            </div>
          </div>
          {filtered.length > 0 ? <div className="filmography-grid">{filtered.map((item) => <FilmographyCard key={`${item.mediaType}-${item.tmdbId}`} item={item} />)}</div> : <div className="filmography-empty">No titles found for this person.</div>}
        </section>
      </main>
      <Footer />
    </div>
  );
};