import {Movie} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetMovieById} from "shared/dist/application/usecases/queries";

export function GetMovieByIdInteractor(repositories: Repositories): GetMovieById {
    return GetMovieById(async (query: { id: string }): Promise<Movie | undefined>  => {
        return await repositories.Movie.getMovieById(query.id);
    })
}


