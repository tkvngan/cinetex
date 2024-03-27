import {ByPattern, ByRange} from "./QueryCriteria";
import {Movie} from "../../domain/entities/Movie";
import {QueryUseCase, UseCaseInvoker} from "../UseCase";

export type MoviesQuery = {
    id?: string | string[];
    name?: string | string[] | ByPattern;
    genres?: string | string[];
    director?: string | string[] | ByPattern;
    starring?: string | string[] | ByPattern;
    releaseDate?: string | string[] | ByRange<string>;
}

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetMoviesByQuery: GetMoviesByQuery
    }
}

export class GetMoviesByQuery extends QueryUseCase<MoviesQuery, Movie[]> {
    constructor(invoker?: UseCaseInvoker<MoviesQuery, Movie[]>) {
        super("GetMoviesByQuery", invoker);
    }
}

