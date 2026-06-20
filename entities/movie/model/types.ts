export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails extends MovieSearchResult {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface MovieSearchResponse {
  Search?: MovieSearchResult[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export interface MovieDetailsResponse {
  Response: "True" | "False";
  Error?: string;
}

export interface SearchMoviesParams {
  query: string;
  page?: number;
  year?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}
