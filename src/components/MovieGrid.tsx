import type { Movie, TVShow } from '../services/tmdb';
import MovieCard from './MovieCard';
import './MovieGrid.css';

interface MovieGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  loading?: boolean;
  onItemClick: (id: number) => void;
}

const MovieGrid = ({ items, type, loading = false, onItemClick }: MovieGridProps) => {
  if (loading) {
    return (
      <div className="movie-grid-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>No {type === 'movie' ? 'movies' : 'TV shows'} found.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {items.map((item) => (
        <MovieCard
          key={item.id}
          item={item}
          type={type}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
