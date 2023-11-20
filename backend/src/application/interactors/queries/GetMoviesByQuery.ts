import {MoviesQuery, GetMoviesByQuery} from "core/dist/application/usecases/queries";
import {Movie} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";

export function GetMoviesByQueryInteractor(repositories: Repositories): GetMoviesByQuery {
    return GetMoviesByQuery(async (query: MoviesQuery): Promise<Movie[]>  => {
        return await repositories.Movie.queryMovies(query);
    })
}

