import {Movie} from "core/dist/domain/entities/Movie";
import {QueryMovieCriteria} from "core/dist/application/usecases/queries";

export interface MovieRepository {

    getAllMovies(): Promise<Movie[]>;

    getMovieById(id: string): Promise<Movie | undefined>;

    getMovieByName(name: string): Promise<Movie | undefined>;

    addMovie(movie: Movie): Promise<Movie>;

    deleteMovieById(id: string): Promise<Movie | undefined>;

    deleteMovieByName(name: string): Promise<Movie | undefined>;

    deleteMoviesByQuery(criteria: QueryMovieCriteria): Promise<number>;

    deleteAllMovies(): Promise<number>;

    updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined>;

    queryMovies(criteria: QueryMovieCriteria): Promise<Movie[]>;

}
