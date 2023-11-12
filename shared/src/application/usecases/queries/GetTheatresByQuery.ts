import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type TheatreQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export type GetTheatresByQuery = QueryUseCase<{ criteria: TheatreQueryCriteria }, Theatre[]>

export function GetTheatresByQuery(invoke: (query: { criteria: TheatreQueryCriteria }) => Promise<Theatre[]>): GetTheatresByQuery {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}


