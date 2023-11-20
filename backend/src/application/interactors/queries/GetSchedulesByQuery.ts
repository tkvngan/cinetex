import {Schedule} from "core/dist/domain/entities";
import {GetSchedulesByQuery} from "core/dist/application/usecases/queries";
import {Repositories} from "../../repositories";
import {SchedulesQuery} from "core/dist/application/usecases/queries/GetSchedulesByQuery";

export function GetSchedulesByQueryInteractor(repositories: Repositories): GetSchedulesByQuery {
    return GetSchedulesByQuery(async (query: SchedulesQuery): Promise<Schedule[]>  => {
        return await repositories.Schedule.querySchedules(query);
    })
}

