import React from 'react';
import type { Movie, TVShow } from '../services/tmdb';
import { getImageUrl } from '../services/tmdb';
import './MovieCard.css';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  onClick: (id: number) => void;
}

const MovieCard = ({ item, type, onClick }: MovieCardProps) => {
  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item.id);
    }
  };

  return (
    <div
      className="movie-card"
      onClick={() => onClick(item.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
    >
      <div className="movie-poster">
        <img
          src={getImageUrl(item.poster_path)}
          alt={title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.svg';
          }}
        />
        <div className="movie-overlay">
          <div className="movie-rating">
            ⭐ {item.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-year">{year}</p>
        <p className="movie-overview">
          {item.overview.length > 120 
            ? `${item.overview.substring(0, 120)}...` 
            : item.overview
          }
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
