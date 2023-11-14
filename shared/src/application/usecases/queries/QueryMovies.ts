import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {Genre, Movie, Rating} from "../../../domain/entities";
import {QueryUseCase, UseCaseProperties} from "../UseCase";

export type QueryMovieCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export type QueryMovies = QueryUseCase<{ criteria: QueryMovieCriteria }, Movie[]>

export function QueryMovies(invoke: (query: { criteria: QueryMovieCriteria }) => Promise<Movie[]>): QueryMovies {
    return { name: "GetMoviesByQuery", type: "query", invoke }
}
;

