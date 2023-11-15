import {QueryMovies, QueryCriteria, QueryPattern, QueryRange} from "core/dist/application/usecases/queries";
import {Genre, Movie, Rating} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";

export type QueryMovieCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export function QueryMoviesInteractor(repositories: Repositories): QueryMovies {
    return QueryMovies(async (query: { criteria: QueryMovieCriteria }): Promise<Movie[]>  => {
        return await repositories.Movie.queryMovies(query.criteria);
    })
}

