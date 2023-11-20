import {QueryUseCase} from "../UseCase";
import {Schedule, ShowTime} from "../../../domain/entities";
import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";

export type SchedulesQuery = QueryCriteria & {
    theatreId?: string;
    movieId?: string;
    movieName?: string | QueryPattern;
    screenId?: number;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type GetSchedulesByQuery = QueryUseCase<SchedulesQuery, Schedule[]>

export function GetSchedulesByQuery(invoke: (query: SchedulesQuery) => Promise<Schedule[]>): GetSchedulesByQuery {
    return { name: "GetSchedulesByQuery", type: "query", invoke }
}


