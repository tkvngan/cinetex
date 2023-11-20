import {QueryUseCase} from "../UseCase";
import {Schedule, ShowTime} from "../../../domain/entities";
import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";

export type QuerySchedulesCriteria = QueryCriteria & {
    theatreId?: string;
    movieId?: string;
    movieName?: string | QueryPattern;
    screenId?: number;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type QuerySchedules = QueryUseCase<{ criteria: QuerySchedulesCriteria }, Schedule[]>

export function QuerySchedules(invoke: (query: { criteria: QuerySchedulesCriteria }) => Promise<Schedule[]>): QuerySchedules {
    return { name: "GetSchedulesByQuery", type: "query", invoke }
}


