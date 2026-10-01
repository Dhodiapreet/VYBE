import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import './Home.css';

const sectionNames = ['TALK OF THE TOWN','WATCH IT WITH VYBE','VYBE PICK OF THE WEEK','WORTH WATCHING — NETFLIX',"DON'T MISS THESE — JIOHOTSTAR",'WORTH WATCHING — PRIME','WORTH WATCHING — CRUNCHYROLL'];

function MovieCard({ movie }) {
  return <article className="movie-card">
    <div className="movie-poster">{movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} loading="lazy" /> : <div className="poster-fallback">{movie.title?.[0] || 'V'}</div>}
      <span className="movie-rating">★ {Number(movie.averageRating || 0).toFixed(1)}</span>
    </div>
    <h3>{movie.title}</h3>
    <p>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'} {movie.genres?.length ? '• ' + movie.genres.slice(0,2).join(' • ') : ''}</p>
  </article>;
}

function MovieSection({ title, movies }) {
  return <section className="movie-section">
    <div className="section-heading"><div><span className="section-kicker">VYBE</span><h2>{title}</h2></div><a href="/movies" className="section-link">Explore →</a></div>
    <div className="movie-row">{movies.map(movie => <MovieCard key={movie._id} movie={movie} />)}</div>
  </section>;
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [state, setState] = useState('loading');
  useEffect(() => {
    apiRequest('/movies').then(result => {
      const data = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
      setMovies(data); setState(data.length ? 'ready' : 'empty');
    }).catch(() => setState('error'));
  }, []);

  return <div className="home-page">
    <header className="site-header">
      <a className="brand" href="/home">VYBE<span>.</span></a>
      <nav><a href="/home">Home</a><a href="/movies">Movies</a><a href="/search">Search</a></nav>
      <div className="header-actions"><a href="/login">Log in</a><a className="signup" href="/signup">Sign up</a></div>
    </header>
    <main>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy"><span className="hero-label">ONE PLATFORM. EVERY VIBE.</span><h1>Find something<br /><em>worth feeling.</em></h1><p>Discover movies, share your taste, and find your next VYBE.</p><div className="hero-actions"><a className="primary-button" href="/movies">Explore movies ↗</a><a className="secondary-button" href="/search">Search VYBE</a></div></div>
        <div className="hero-mark">VYBE</div>
      </section>
      {state === 'loading' && <div className="state-card">Loading your VYBE…</div>}
      {state === 'error' && <div className="state-card error">Unable to load movies. Please try again.</div>}
      {state === 'empty' && <div className="state-card">No movies are available yet.</div>}
      {state === 'ready' && sectionNames.map((name, i) => <MovieSection key={name} title={name} movies={movies.slice((i * 3) % movies.length, ((i * 3) % movies.length) + 8)} />)}
    </main>
    <footer className="site-footer"><div><a className="brand" href="/home">VYBE<span>.</span></a><p>One platform. Every vibe.</p></div><div className="footer-links"><a href="/movies">Movies</a><a href="/search">Search</a><a href="/login">Login</a></div><small>© 2026 VYBE. Made for movie people.</small></footer>
  </div>;
}
