import {Movie} from "shared/dist/domain/entities";
import {GetAllMovies} from "shared/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export function GetAllMoviesInteractor(repositories: Repositories): GetAllMovies {
    return GetAllMovies(async (query: {}): Promise<Movie[]>  => {
        return await repositories.Movie.getAllMovies();
    })
}


