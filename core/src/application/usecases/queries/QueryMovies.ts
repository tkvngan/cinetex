import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {Genre, Movie, Rating} from "../../../domain/entities";
import {QueryUseCase} from "../UseCase";

export type QueryMoviesCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export type QueryMovies = QueryUseCase<{ criteria: QueryMoviesCriteria }, Movie[]>

export function QueryMovies(invoke: (query: { criteria: QueryMoviesCriteria }) => Promise<Movie[]>): QueryMovies {
    return { name: "GetMoviesByQuery", type: "query", invoke }
}
;

