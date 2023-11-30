import {Schedule} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllSchedules} from "cinetex-core/dist/application/queries";

export class GetAllSchedulesInteractor extends GetAllSchedules {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {}): Promise<Schedule[]> {
        return await this.repositories.Schedule.getAllSchedules();
    }
}
