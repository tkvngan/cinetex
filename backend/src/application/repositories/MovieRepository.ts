import {Movie} from "shared/dist/domain/entities/Movie";
import {MovieQueryCriteria} from "shared/dist/application/usecases/queries/GetMoviesByQuery";


export interface MovieRepository {

    getAllMovies(): Promise<Movie[]>;

    getMovieById(id: string): Promise<Movie | undefined>;

    getMovieByName(name: string): Promise<Movie | undefined>;

    getMoviesByQuery(criteria: MovieQueryCriteria): Promise<Movie[]>;

    addMovie(movie: Movie): Promise<Movie>;

    deleteMovieById(id: string): Promise<Movie | undefined>;

    deleteMovieByName(name: string): Promise<Movie | undefined>;

    deleteMoviesByQuery(criteria: MovieQueryCriteria): Promise<number>;

    deleteAllMovies(): Promise<number>;

    updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined>;
}
