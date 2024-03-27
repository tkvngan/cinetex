import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities/Schedule";
import {ByPattern, ByRange} from "./QueryCriteria";
import {TheatresQuery} from "./GetTheatresByQuery";
import {MoviesQuery} from "./GetMoviesByQuery";

export type SchedulesQuery = {
    id?: string | string[];
    movie?: MoviesQuery;
    theatre?: TheatresQuery;
    screenId?: number | number[];
    showDate?: string | string[] | ByRange<string>;
    showTime?: string | string[] | ByRange<string>;
}

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetSchedulesByQuery: GetSchedulesByQuery
    }
}

export class GetSchedulesByQuery extends QueryUseCase<SchedulesQuery, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<SchedulesQuery, Schedule[]>) {
        super("GetSchedulesByQuery", invoker);
    }
}

