import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Schedule, ShowTime} from "../../../domain/entities";
import {QueryCriteria, QueryPattern, QueryRange} from "./QueryCriteria";

export type QueryScheduleCriteria = QueryCriteria & {
    theatreId?: string;
    movieId?: string;
    movieName?: string | QueryPattern;
    auditoriumId?: number;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type QuerySchedules = QueryUseCase<{ criteria: QueryScheduleCriteria }, Schedule[]>

export function QuerySchedules(invoke: (query: { criteria: QueryScheduleCriteria }) => Promise<Schedule[]>): QuerySchedules {
    return { name: "GetSchedulesByQuery", type: "query", invoke }
}


