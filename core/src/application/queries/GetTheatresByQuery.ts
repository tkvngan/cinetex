import {ByPattern, ByRange} from "./QueryCriteria";
import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../domain/entities";

export type TheatresQuery = {
    id: string | [string];
    name?: never;
    location?: never;
    screenCount?: never;
} | {
    id?: never;
    name?: string | [string] |ByPattern;
    location?: ByPattern;
    screenCount?: number | ByRange<number>;
}

export type GetTheatresByQuery = QueryUseCase<TheatresQuery, Theatre[]>

export function GetTheatresByQuery(invoke: (query: TheatresQuery) => Promise<Theatre[]>): GetTheatresByQuery {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}
