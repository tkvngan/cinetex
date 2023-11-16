import {User} from "core/dist/domain/entities";
import {QueryUsers, QueryUserCriteria} from "core/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export function QueryUsersInteractor(repositories: Repositories): QueryUsers {
    return QueryUsers(async (query: { criteria: QueryUserCriteria }): Promise<User[]>  => {
        return await repositories.User.queryUsers(query.criteria);
    })
}

