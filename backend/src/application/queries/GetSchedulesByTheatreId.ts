import {GetSchedulesByTheatreId} from "cinetex-core/dist/application/queries";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Repositories} from "../repositories/Repositories";

export class GetSchedulesByTheatreIdInteractor extends GetSchedulesByTheatreId {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(request: { theatreId: string }): Promise<Schedule[]> {
        return (await this.repositories.Schedule.getAllSchedules())
            .filter(schedule => schedule.theatreId === request.theatreId)
    }
}
