import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tmdbApi, type Movie, type TVShow } from '../services/tmdb';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentView = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const res =
            currentView === 'movie'
              ? await tmdbApi.searchMovies(searchQuery)
              : await tmdbApi.searchTVShows(searchQuery);
          
          if (currentView === 'movie') setMovies(res.results as Movie[]);
          else setTVShows(res.results as TVShow[]);

        } else {
          const [popularMovies, popularTV] = await Promise.all([
            tmdbApi.getPopularMovies(),
            tmdbApi.getPopularTVShows(),
          ]);
          setMovies(popularMovies.results);
          setTVShows(popularTV.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [searchParams, currentView, searchQuery]);

  const handleItemClick = (id: number) => {
    navigate(`/${currentView}/${id}`);
  };

  const currentItems = currentView === 'movie' ? movies : tvShows;

  return (
    <>
      <SearchBar loading={loading} />
      <div className="content-section">
        <h2 className="section-title">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : `Popular ${currentView === 'movie' ? 'Movies' : 'TV Shows'}`}
        </h2>
        <MovieGrid
          items={currentItems}
          type={currentView}
          loading={loading}
          onItemClick={handleItemClick}
        />
      </div>
    </>
  );
};

export default HomePage;
