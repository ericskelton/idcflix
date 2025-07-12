// TMDB API configuration and service functions

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API headers for authentication
const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json;charset=utf-8'
};

// Types for TMDB API responses
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: any[];
  production_countries: any[];
  revenue: number;
  runtime: number;
  spoken_languages: any[];
  status: string;
  tagline: string;
}

export interface TVShowDetails extends TVShow {
  created_by: any[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  networks: any[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: any[];
  production_countries: any[];
  seasons: any[];
  spoken_languages: any[];
  status: string;
  tagline: string;
  type: string;
}

// Helper function to build image URLs
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-image.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API service functions
export const tmdbApi = {
  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse<Movie>> => {
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  // Search TV shows
  searchTVShows: async (query: string, page: number = 1): Promise<SearchResponse<TVShow>> => {
    const response = await fetch(`${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to search TV shows');
    return response.json();
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<SearchResponse<Movie>> => {
    const response = await fetch(`${BASE_URL}/movie/popular?page=${page}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get popular movies');
    return response.json();
  },

  // Get popular TV shows
  getPopularTVShows: async (page: number = 1): Promise<SearchResponse<TVShow>> => {
    const response = await fetch(`${BASE_URL}/tv/popular?page=${page}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get popular TV shows');
    return response.json();
  },

  // Get trending movies/TV shows
  getTrending: async (mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<SearchResponse<Movie | TVShow>> => {
    const response = await fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get trending content');
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get movie details');
    return response.json();
  },

  // Get TV show details
  getTVShowDetails: async (tvId: number): Promise<TVShowDetails> => {
    const response = await fetch(`${BASE_URL}/tv/${tvId}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get TV show details');
    return response.json();
  },

  // Get movie genres
  getMovieGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await fetch(`${BASE_URL}/genre/movie/list`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get movie genres');
    return response.json();
  },

  // Get TV genres
  getTVGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await fetch(`${BASE_URL}/genre/tv/list`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to get TV genres');
    return response.json();
  },

  // Discover movies with filters
  discoverMovies: async (params: {
    page?: number;
    genre?: number;
    year?: number;
    sortBy?: string;
  } = {}): Promise<SearchResponse<Movie>> => {
    const searchParams = new URLSearchParams({
      page: params.page?.toString() || '1',
      ...(params.genre && { with_genres: params.genre.toString() }),
      ...(params.year && { year: params.year.toString() }),
      ...(params.sortBy && { sort_by: params.sortBy }),
    });

    const response = await fetch(`${BASE_URL}/discover/movie?${searchParams}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to discover movies');
    return response.json();
  },

  // Discover TV shows with filters
  discoverTVShows: async (params: {
    page?: number;
    genre?: number;
    year?: number;
    sortBy?: string;
  } = {}): Promise<SearchResponse<TVShow>> => {
    const searchParams = new URLSearchParams({
      page: params.page?.toString() || '1',
      ...(params.genre && { with_genres: params.genre.toString() }),
      ...(params.year && { first_air_date_year: params.year.toString() }),
      ...(params.sortBy && { sort_by: params.sortBy }),
    });

    const response = await fetch(`${BASE_URL}/discover/tv?${searchParams}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to discover TV shows');
    return response.json();
  },
};
