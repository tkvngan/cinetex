import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MoviesQuery} from "cinetex-core/dist/application/queries";

export interface MovieRepository {

    getAllMovies(): Promise<Movie[]>;

    getMovieById(id: string): Promise<Movie | undefined>;

    getMovieByName(name: string): Promise<Movie | undefined>;

    addMovie(movie: Movie): Promise<Movie>;

    deleteMovieById(id: string): Promise<Movie | undefined>;

    deleteMovieByName(name: string): Promise<Movie | undefined>;

    deleteMoviesByQuery(query: MoviesQuery): Promise<number>;

    deleteAllMovies(): Promise<number>;

    updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined>;

    getMoviesByQuery(query: MoviesQuery): Promise<Movie[]>;

}
