import {Movie} from "@cinetex/shared/domain/entities/Movie";

export interface Repository {

    getAllMovies(): Promise<Movie[]>;
}
