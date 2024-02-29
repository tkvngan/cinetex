import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Repositories} from "../repositories/Repositories";
import {GetAllSchedules} from "cinetex-core/dist/application/queries";

export class GetAllSchedulesInteractor extends GetAllSchedules {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {}): Promise<Schedule[]> {
        return await this.repositories.Schedule.getAllSchedules();
    }
}
