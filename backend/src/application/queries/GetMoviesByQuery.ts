import {MoviesQuery, GetMoviesByQuery} from "core/dist/application/queries";
import {Movie} from "core/dist/domain/entities";
import {Repositories} from "../repositories";

export function GetMoviesByQueryInteractor(repositories: Repositories): GetMoviesByQuery {
    return GetMoviesByQuery(async (query: MoviesQuery): Promise<Movie[]>  => {
        return await repositories.Movie.getMoviesByQuery(query);
    })
}

