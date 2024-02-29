import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Repositories} from "../repositories/Repositories";
import {GetScheduleById} from "cinetex-core/dist/application/queries";

export class GetScheduleByIdInteractor extends GetScheduleById {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { id: string }): Promise<Schedule | undefined> {
        return await this.repositories.Schedule.getScheduleById(query.id);
    }
}
