import {QueryUseCase} from "../UseCase";
import {Schedule, ShowTime} from "../../../domain/entities";
import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";

export type ScheduleQueryCriteria = QueryCriteria & {
    theatreId?: string;
    movieId?: string;
    movieName?: string | QueryPattern;
    screenId?: number;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type GetSchedulesByQuery = QueryUseCase<{ criteria: ScheduleQueryCriteria }, Schedule[]>
