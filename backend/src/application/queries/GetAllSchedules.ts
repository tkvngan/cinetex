import {Schedule} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllSchedules} from "cinetex-core/dist/application/queries";

export function GetAllSchedulesInteractor(repositories: Repositories): GetAllSchedules {
    return GetAllSchedules(async (query: {}): Promise<Schedule[]>  => {
        return await repositories.Schedule.getAllSchedules();
    })
}

