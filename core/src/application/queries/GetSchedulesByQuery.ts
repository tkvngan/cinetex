import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities/Schedule";
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
    screen?: {
        name?: never
    } | {
        name: string | ByPattern;
    };
    showDate?: string | [string] | ByRange<string>;
    showTime?: string | [string] | ByRange<string>;
}

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetSchedulesByQuery: GetSchedulesByQuery
    }
}

export class GetSchedulesByQuery extends QueryUseCase<SchedulesQuery, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<SchedulesQuery, Schedule[]>) {
        super(GetSchedulesByQuery.name, invoker);
    }
}

