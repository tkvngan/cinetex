import {Movie} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetMovieById} from "cinetex-core/dist/application/queries";

export function GetMovieByIdInteractor(repositories: Repositories): GetMovieById {
    return GetMovieById(async (query: { id: string }): Promise<Movie | undefined>  => {
        return await repositories.Movie.getMovieById(query.id);
    })
}

