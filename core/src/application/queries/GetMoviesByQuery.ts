import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {Genre, Movie, Rating} from "../../domain/entities";
import {QueryUseCase} from "../UseCase";

export type MoviesQuery = QueryCriteria & {
    name?: string | QueryPattern;
    genres?: Genre[];
    rating?: Rating;
    director?: string | QueryPattern;
    cast?: string[];
    releaseDate?: string | QueryRange<string>;
}

export type GetMoviesByQuery = QueryUseCase<MoviesQuery, Movie[]>

export function GetMoviesByQuery(invoke: (query: MoviesQuery) => Promise<Movie[]>): GetMoviesByQuery {
    return { name: "GetMoviesByQuery", type: "query", invoke }
}
;

