import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type TheatresQuery = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export type GetTheatresByQuery = QueryUseCase<TheatresQuery, Theatre[]>

export function GetTheatresByQuery(invoke: (query: TheatresQuery) => Promise<Theatre[]>): GetTheatresByQuery {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}


