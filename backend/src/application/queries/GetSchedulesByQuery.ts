import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {GetSchedulesByQuery} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories/Repositories";
import {SchedulesQuery} from "cinetex-core/dist/application/queries/GetSchedulesByQuery";

export class GetSchedulesByQueryInteractor extends GetSchedulesByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: SchedulesQuery): Promise<Schedule[]> {
        return await this.repositories.Schedule.getSchedulesByQuery(query);
    }
}
