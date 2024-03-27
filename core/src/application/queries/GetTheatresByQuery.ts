import {ByPattern, ByRange} from "./QueryCriteria";
import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities/Theatre";

export type TheatresQuery = {
    id: string | string[];
    name?: never;
    location?: never;
    screenCount?: never;
} | {
    id?: never;
    name?: string | string[] | ByPattern;
    location?: ByPattern;
    screenCount?: number | ByRange<number>;
}

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetTheatresByQuery: GetTheatresByQuery
    }
}

export class GetTheatresByQuery extends QueryUseCase<TheatresQuery, Theatre[]> {
    constructor(invoker?: UseCaseInvoker<TheatresQuery, Theatre[]>) {
        super("GetTheatresByQuery", invoker);
    }
}

