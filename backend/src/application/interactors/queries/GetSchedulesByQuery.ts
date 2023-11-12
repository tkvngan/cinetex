import {Schedule, ShowTime} from "shared/dist/domain/entities";
import {GetSchedulesByQuery, QueryCriteria, QueryPattern, QueryRange} from "shared/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export type ScheduleQueryCriteria = QueryCriteria & {
    theatreId?: string;
    movieId?: string;
    movieName?: string | QueryPattern;
    screenId?: number;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export function GetSchedulesByQueryInteractor(repositories: Repositories): GetSchedulesByQuery {
    return GetSchedulesByQuery(async (query: { criteria: ScheduleQueryCriteria }): Promise<Schedule[]>  => {
        return await repositories.Schedule.getSchedulesByQuery(query.criteria);
    })
}


