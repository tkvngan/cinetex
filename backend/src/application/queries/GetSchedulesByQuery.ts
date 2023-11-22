import {Schedule} from "cinetex-core/dist/domain/entities";
import {GetSchedulesByQuery} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories";
import {SchedulesQuery} from "cinetex-core/dist/application/queries/GetSchedulesByQuery";

export function GetSchedulesByQueryInteractor(repositories: Repositories): GetSchedulesByQuery {
    return GetSchedulesByQuery(async (query: SchedulesQuery): Promise<Schedule[]>  => {
        return await repositories.Schedule.getSchedulesByQuery(query);
    })
}

