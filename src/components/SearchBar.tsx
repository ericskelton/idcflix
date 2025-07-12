import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchBar.css';

interface SearchBarProps {
  loading?: boolean;
}

const SearchBar = ({ loading = false }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<'movie' | 'tv'>(
    (searchParams.get('type') as 'movie' | 'tv') || 'movie'
  );

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSearchType((searchParams.get('type') as 'movie' | 'tv') || 'movie');
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?type=${searchType}&q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies or TV shows..."
            className="search-input"
            disabled={loading}
          />
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value as 'movie' | 'tv')}
            className="search-type-select"
            disabled={loading}
          >
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
