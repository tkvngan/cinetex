import {GetMoviesByQuery, QueryCriteria, QueryPattern, QueryRange} from "shared/dist/application/usecases/queries";
import {Genre, Movie, Rating} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";

export type MovieQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export function GetMoviesByQueryInteractor(repositories: Repositories): GetMoviesByQuery {
    return GetMoviesByQuery(async (query: { criteria: MovieQueryCriteria }): Promise<Movie[]>  => {
        return await repositories.Movie.getMoviesByQuery(query.criteria);
    })
}


