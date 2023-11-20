import {QueryMoviesCriteria, QueryMovies} from "core/dist/application/usecases/queries";
import {Movie} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";

export function QueryMoviesInteractor(repositories: Repositories): QueryMovies {
    return QueryMovies(async (query: { criteria: QueryMoviesCriteria }): Promise<Movie[]>  => {
        return await repositories.Movie.queryMovies(query.criteria);
    })
}

