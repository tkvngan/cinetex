import {Schedule} from "shared/dist/domain/entities";
import {QuerySchedules} from "shared/dist/application/usecases/queries";
import {Repositories} from "../../repositories";
import {QueryScheduleCriteria} from "shared/dist/application/usecases/queries/QuerySchedules";

export function QuerySchedulesInteractor(repositories: Repositories): QuerySchedules {
    return QuerySchedules(async (query: { criteria: QueryScheduleCriteria }): Promise<Schedule[]>  => {
        return await repositories.Schedule.querySchedules(query.criteria);
    })
}

