import {QueryUseCase} from "../UseCase";
import {Schedule} from "../../domain/entities";
import {QueryPattern, QueryRange} from "./QueryCriteria";
import {TheatresQuery} from "./GetTheatresByQuery";
import {MoviesQuery} from "./GetMoviesByQuery";

export type SchedulesQuery = {
    id: string | [string];
    movie?: never;
    theatre?: never;
    screen?: never;
    showDate?: never;
    showTime?: never;
} | {
    id?: never;
    movie?: MoviesQuery
    theatre?: TheatresQuery
    screen?: { id: number | [number]; name?: never } | { name: string | QueryPattern; id?: never };
    showDate?: string | [string] | QueryRange<string>;
    showTime?: string | [string] | QueryRange<string>;
}

export type GetSchedulesByQuery = QueryUseCase<SchedulesQuery, Schedule[]>

export function GetSchedulesByQuery(invoke: (query: SchedulesQuery) => Promise<Schedule[]>): GetSchedulesByQuery {
    return { name: "GetSchedulesByQuery", type: "query", invoke }
}
