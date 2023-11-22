import {MoviesQuery, GetMoviesByQuery} from "cinetex-core/dist/application/queries";
import {Movie} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";

export function GetMoviesByQueryInteractor(repositories: Repositories): GetMoviesByQuery {
    return GetMoviesByQuery(async (query: MoviesQuery): Promise<Movie[]>  => {
        return await repositories.Movie.getMoviesByQuery(query);
    })
}

