import {QueryUseCase} from "../UseCase";
import {Schedule} from "../../domain/entities";
import {ByPattern, ByRange} from "./QueryCriteria";
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
    screen?: { id: number | [number]; name?: never } | { name: string | ByPattern; id?: never };
    showDate?: string | [string] | ByRange<string>;
    showTime?: string | [string] | ByRange<string>;
}

export type GetSchedulesByQuery = QueryUseCase<SchedulesQuery, Schedule[]>

export function GetSchedulesByQuery(invoke: (query: SchedulesQuery) => Promise<Schedule[]>): GetSchedulesByQuery {
    return { name: "GetSchedulesByQuery", type: "query", invoke }
}
