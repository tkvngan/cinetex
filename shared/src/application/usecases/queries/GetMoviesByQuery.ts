import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {Genre, Movie, Rating} from "../../../domain/entities";
import {QueryUseCase, UseCaseProperties} from "../UseCase";

export type MovieQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export type GetMoviesByQuery = QueryUseCase<{ criteria: MovieQueryCriteria }, Movie[]>

export function GetMoviesByQuery(invoke: (query: { criteria: MovieQueryCriteria }) => Promise<Movie[]>): GetMoviesByQuery {
    return { name: "GetMoviesByQuery", type: "query", invoke }
}
;

