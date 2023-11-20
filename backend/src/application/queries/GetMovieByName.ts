import {Movie} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetMovieByName} from "core/dist/application/queries";

export function GetMovieByNameInteractor(repositories: Repositories): GetMovieByName {
    return GetMovieByName(async (query: { name: string }): Promise<Movie | undefined>  => {
        return await repositories.Movie.getMovieByName(query.name);
    })
}

