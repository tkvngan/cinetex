import {Schedule} from "core/dist/domain/entities";
import {QuerySchedules} from "core/dist/application/usecases/queries";
import {Repositories} from "../../repositories";
import {QueryScheduleCriteria} from "core/dist/application/usecases/queries/QuerySchedules";

export function QuerySchedulesInteractor(repositories: Repositories): QuerySchedules {
    return QuerySchedules(async (query: { criteria: QueryScheduleCriteria }): Promise<Schedule[]>  => {
        return await repositories.Schedule.querySchedules(query.criteria);
    })
}

