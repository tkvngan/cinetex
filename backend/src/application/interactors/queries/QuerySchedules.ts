import {Schedule} from "core/dist/domain/entities";
import {QuerySchedules} from "core/dist/application/usecases/queries";
import {Repositories} from "../../repositories";
import {QuerySchedulesCriteria} from "core/dist/application/usecases/queries/QuerySchedules";

export function QuerySchedulesInteractor(repositories: Repositories): QuerySchedules {
    return QuerySchedules(async (query: { criteria: QuerySchedulesCriteria }): Promise<Schedule[]>  => {
        return await repositories.Schedule.querySchedules(query.criteria);
    })
}

