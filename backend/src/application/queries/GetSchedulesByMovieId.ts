import {GetSchedulesByMovieId} from "cinetex-core/dist/application/queries";
import {Schedule} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";

export class GetSchedulesByMovieIdInteractor extends GetSchedulesByMovieId {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(request: { movieId: string }): Promise<Schedule[]> {
        return (await this.repositories.Schedule.getAllSchedules())
            .filter(schedule => {
                console.log("schedule: ", JSON.stringify(schedule, null, 2))
                const scheduleMovieId = schedule.movieId
                const requestMovieId = request.movieId
                return schedule.movieId === request.movieId
            })
    }
}
