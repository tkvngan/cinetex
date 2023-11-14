import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type QueryTheatreCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    auditoriumCount?: number | QueryRange<number>;
}

export type QueryTheatres = QueryUseCase<{ criteria: QueryTheatreCriteria }, Theatre[]>

export function QueryTheatres(invoke: (query: { criteria: QueryTheatreCriteria }) => Promise<Theatre[]>): QueryTheatres {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}


