import {Movie} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetMovieByName} from "shared/dist/application/usecases/queries";

export function GetMovieByNameInteractor(repositories: Repositories): GetMovieByName {
    return GetMovieByName(async (query: { name: string }): Promise<Movie | undefined>  => {
        return await repositories.Movie.getMovieByName(query.name);
    })
}

