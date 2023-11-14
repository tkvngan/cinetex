import {Schedule} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetAllSchedules} from "shared/dist/application/usecases/queries";

export function GetAllSchedulesInteractor(repositories: Repositories): GetAllSchedules {
    return GetAllSchedules(async (query: {}): Promise<Schedule[]>  => {
        return await repositories.Schedule.getAllSchedules();
    })
}

