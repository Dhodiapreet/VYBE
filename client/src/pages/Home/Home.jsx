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
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/movies');
        if (response && response.data) {
          setMovies(response.data);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const heroMovie = movies.length > 0 ? movies[0] : null;

  // Safe slicing helper
  const getSlice = (start, end) => {
    if (!movies || movies.length === 0) return [];
    const len = movies.length;
    if (len >= end) return movies.slice(start, end);
    // if we have fewer movies, just return whatever we can by wrapping or just duplicating some
    const result = [];
    for (let i = start; i < end; i++) {
      result.push({ ...movies[i % len], _id: movies[i % len]._id + '-' + i }); // prevent duplicate keys
    }
    return result;
  };

  const talkOfTheTown = getSlice(0, 10);
  const watchWithVybe = getSlice(5, 15);
  
  const powMain = movies.length > 10 ? movies[10] : movies[0];
  const powSupport = getSlice(11, 15);

  const netflix = getSlice(2, 10);
  const jiohotstar = getSlice(4, 12);
  const prime = getSlice(6, 14);
  const crunchyroll = getSlice(8, 16);

  return (
    <div className="home-page">
      <Header />
      
      <main>
        <Hero featuredMovie={heroMovie} />
        
        <div className="content-sections">
          <MovieSection 
            title="TALK OF THE TOWN" 
            movies={talkOfTheTown} 
            loading={loading} 
            error={error} 
          />
          
          <MovieSection 
            title="WATCH IT WITH VYBE" 
            movies={watchWithVybe} 
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
            sectionLabel="Streaming Now"
            title="WORTH WATCHING — NETFLIX" 
            movies={netflix} 
            loading={loading} 
            error={error} 
          />
          
          <MovieSection 
            sectionLabel="Streaming Now"
            title="DON'T MISS THESE — JIOHOTSTAR" 
            movies={jiohotstar} 
            loading={loading} 
            error={error} 
          />

          <CommunityTeaser />
          
          <MovieSection 
            sectionLabel="Streaming Now"
            title="WORTH WATCHING — PRIME VIDEO" 
            movies={prime} 
            loading={loading} 
            error={error} 
          />
          
          <MovieSection 
            sectionLabel="Streaming Now"
            title="WORTH WATCHING — CRUNCHYROLL" 
            movies={crunchyroll} 
            loading={loading} 
            error={error} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
