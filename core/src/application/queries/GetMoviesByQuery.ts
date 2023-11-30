import {ByPattern, ByRange} from "./QueryCriteria";
import {Movie} from "../../domain/entities";
import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";

export type MoviesQuery = {
    id: string | [string];
    name?: never;
    genre?: never;
    director?: never;
    starring?: never;
    releaseDate?: never;
} | {
    id?: never;
    name?: string | [string] | ByPattern;
    genre?: string | string[];
    director?: string | [string] | ByPattern;
    starring?: string | string[] | ByPattern;
    releaseDate?: string | string[] | ByRange<string>;
}

export class GetMoviesByQuery extends QueryUseCase<MoviesQuery, Movie[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<MoviesQuery, Movie[]>) {
        super("GetMoviesByQuery", invokerFactory);
    }
}

