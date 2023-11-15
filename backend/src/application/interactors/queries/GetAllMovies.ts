import {Movie} from "core/dist/domain/entities";
import {GetAllMovies} from "core/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export function GetAllMoviesInteractor(repositories: Repositories): GetAllMovies {
    return GetAllMovies(async (query: {}): Promise<Movie[]>  => {
        return await repositories.Movie.getAllMovies();
    })
}

