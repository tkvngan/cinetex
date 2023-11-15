import {Schedule} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetAllSchedules} from "core/dist/application/usecases/queries";

export function GetAllSchedulesInteractor(repositories: Repositories): GetAllSchedules {
    return GetAllSchedules(async (query: {}): Promise<Schedule[]>  => {
        return await repositories.Schedule.getAllSchedules();
    })
}

