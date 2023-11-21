import {QueryPattern, QueryRange} from "./QueryCriteria";
import {Genre, Movie, Rating} from "../../domain/entities";
import {QueryUseCase} from "../UseCase";

export type MoviesQuery = {
    id: string | [string];
    name?: never;
    genre?: never;
    rating?: never;
    director?: never;
    cast?: never;
    releaseDate?: never;
} | {
    id?: never;
    name?: string | [string] | QueryPattern;
    genre?: Genre | Genre[];
    rating?: Rating | Rating[];
    director?: string | [string] | QueryPattern;
    cast?: string | string[] | QueryPattern;
    releaseDate?: string | string[] | QueryRange<string>;
}

export type GetMoviesByQuery = QueryUseCase<MoviesQuery, Movie[]>

export function GetMoviesByQuery(invoke: (query: MoviesQuery) => Promise<Movie[]>): GetMoviesByQuery {
    return { name: "GetMoviesByQuery", type: "query", invoke }
}
