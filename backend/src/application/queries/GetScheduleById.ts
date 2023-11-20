import {Schedule} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetScheduleById} from "core/dist/application/queries";

export function GetScheduleByIdInteractor(repositories: Repositories): GetScheduleById {
    return GetScheduleById(async (query: { id: string }): Promise<Schedule | undefined>  => {
        return await repositories.Schedule.getScheduleById(query.id);
    })
}

