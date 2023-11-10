import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";
import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type TheatreQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export type GetTheatresByQuery = QueryUseCase<{ criteria: TheatreQueryCriteria }, Theatre[]>
