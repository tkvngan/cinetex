import {QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../domain/entities";

export type TheatresQuery = {
    id: string | [string];
    name?: never;
    location?: never;
    screenCount?: never;
} | {
    id?: never;
    name?: string | [string] |QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export type GetTheatresByQuery = QueryUseCase<TheatresQuery, Theatre[]>

export function GetTheatresByQuery(invoke: (query: TheatresQuery) => Promise<Theatre[]>): GetTheatresByQuery {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}
