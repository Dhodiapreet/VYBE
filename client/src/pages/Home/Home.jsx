import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MovieSection from '../../components/MovieSection/MovieSection';
import PickOfTheWeek from '../../components/PickOfTheWeek/PickOfTheWeek';
import CommunityTeaser from '../../components/CommunityTeaser/CommunityTeaser';
import Footer from '../../components/Footer/Footer';
import { apiRequest } from '../../services/api';
import './Home.css';

export default function Home() {
  const [movieSections, setMovieSections] = useState({
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroTrailerUrl, setHeroTrailerUrl] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
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
            const results = response?.data?.results || [];
            return [key, results];
          })
        );

        setMovieSections(Object.fromEntries(entries));
      } catch (err) {
        console.error('Error fetching TMDB movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const heroMovie = movieSections.trending[0] || movieSections.popular[0] || null;

  useEffect(() => {
    let cancelled = false;
    const fetchHeroTrailer = async () => {
      if (!heroMovie?._id) {
        setHeroTrailerUrl(null);
        return;
      }

      try {
        const response = await apiRequest(`/movies/${heroMovie._id}`);
        if (!cancelled) {
          setHeroTrailerUrl(response?.data?.trailerUrl || null);
        }
      } catch (err) {
        console.warn('Could not load hero trailer:', err.message);
        if (!cancelled) setHeroTrailerUrl(null);
      }
    };

    fetchHeroTrailer();
    return () => {
      cancelled = true;
    };
  }, [heroMovie?._id]);

  const topRatedMovies = movieSections.topRated;
  const powMain = topRatedMovies[0] || movieSections.trending[0] || null;
  const powSupport = topRatedMovies.slice(1, 5);

  return (
    <div className="home-page">
      <Header />

      <main>
        <Hero featuredMovie={heroMovie} trailerUrl={heroTrailerUrl} />

        <div className="content-sections">
          <MovieSection
            title="TRENDING THIS WEEK"
            movies={movieSections.trending}
            loading={loading}
            error={error}
          />

          <MovieSection
            title="POPULAR MOVIES"
            movies={movieSections.popular}
            loading={loading}
            error={error}
          />

          {!loading && !error && powMain && (
            <PickOfTheWeek
              mainMovie={powMain}
              supportingMovies={powSupport}
            />
          )}

          <MovieSection
            title="TOP RATED"
            movies={movieSections.topRated}
            loading={loading}
            error={error}
          />

          <MovieSection
            title="NOW PLAYING"
            movies={movieSections.nowPlaying}
            loading={loading}
            error={error}
          />

          <CommunityTeaser />

          <MovieSection
            title="UPCOMING"
            movies={movieSections.upcoming}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
