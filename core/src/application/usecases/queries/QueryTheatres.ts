import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type QueryTheatresCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export type QueryTheatres = QueryUseCase<{ criteria: QueryTheatresCriteria }, Theatre[]>

export function QueryTheatres(invoke: (query: { criteria: QueryTheatresCriteria }) => Promise<Theatre[]>): QueryTheatres {
    return { name: "GetTheatresByQuery", type: "query", invoke }
}


