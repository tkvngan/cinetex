import {Pattern, Range} from "./Repository";
import {Movie, Genre, Rating} from "@cinetex/shared/domain/entities/Movie";


export type MovieSearchCriteria = {
    name?: string | Pattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | Pattern;
    cast?: string[];
    releaseDate?: string | Range<string>;
}

export interface MovieRepository {
    getAllMovies(): Promise<Movie[]>;

    getMovie(id: string): Promise<Movie | undefined>;

    getMovieByName(name: string): Promise<Movie | undefined>;

    getMovies(criteria: MovieSearchCriteria): Promise<Movie[]>;

    addMovie(movie: Movie): Promise<Movie>;

    deleteMovie(id: string): Promise<Movie | undefined>;

    deleteMovieByName(name: string): Promise<Movie | undefined>;

    deleteMovies(criteria: MovieSearchCriteria): Promise<number>;

    deleteAllMovies(): Promise<number>;

    updateMovie(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined>;
}
