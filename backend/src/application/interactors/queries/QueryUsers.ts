import {User} from "shared/dist/domain/entities";
import {QueryUsers, QueryCriteria, QueryPattern} from "shared/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export type QueryUserCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export function QueryUsersInteractor(repositories: Repositories): QueryUsers {
    return QueryUsers(async (query: { criteria: QueryUserCriteria }): Promise<User[]>  => {
        return await repositories.User.queryUsers(query.criteria);
    })
}
