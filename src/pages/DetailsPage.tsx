import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi, getImageUrl, type MovieDetails, type TVShowDetails } from '../services/tmdb';
import './DetailsPage.css';

type Details = MovieDetails | TVShowDetails;

const DetailsPage = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!type || !id) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let response;
        if (type === 'movie') {
          response = await tmdbApi.getMovieDetails(Number(id));
        } else {
          response = await tmdbApi.getTVShowDetails(Number(id));
        }
        setDetails(response);
      } catch (err) {
        setError('Failed to fetch details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="details-error">{error}</div>;
  }

  if (!details) {
    return <div className="details-error">No details found.</div>;
  }

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const runtime = 'runtime' in details ? details.runtime : (details.episode_run_time?.[0] || 'N/A');
  const genres = details.genres.map(g => g.name).join(', ');

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Go Back
      </button>
      <div className="details-content">
        <div className="details-poster">
          <img src={getImageUrl(details.poster_path, 'w500')} alt={title} />
        </div>
        <div className="details-info">
          <h1 className="details-title">{title}</h1>
          <p className="details-tagline">{details.tagline}</p>
          
          <div className="details-meta">
            <span>⭐ {details.vote_average.toFixed(1)}/10</span>
            <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
            {runtime !== 'N/A' && <span>{runtime} min</span>}
            <span>{type === 'movie' ? 'Movie' : 'TV Show'}</span>
          </div>

          <div className="details-section">
            <h2>Overview</h2>
            <p>{details.overview}</p>
          </div>

          <div className="details-section">
            <h2>Genres</h2>
            <p>{genres}</p>
          </div>

          {'homepage' in details && details.homepage && (
            <div className="details-section">
              <a href={details.homepage} target="_blank" rel="noopener noreferrer" className="homepage-link">
                Visit Homepage
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
