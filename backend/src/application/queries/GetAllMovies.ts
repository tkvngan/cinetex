import {Movie} from "cinetex-core/dist/domain/entities";
import {GetAllMovies} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories";

export function GetAllMoviesInteractor(repositories: Repositories): GetAllMovies {
    return GetAllMovies(async (query: {}): Promise<Movie[]>  => {
        return await repositories.Movie.getAllMovies();
    })
}

