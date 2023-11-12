import {User} from "shared/dist/domain/entities";
import {GetUsersByQuery, QueryCriteria, QueryPattern} from "shared/dist/application/usecases/queries";
import {Repositories} from "../../repositories";

export type UserQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export function GetUsersByQueryInteractor(repositories: Repositories): GetUsersByQuery {
    return GetUsersByQuery(async (query: { criteria: UserQueryCriteria }): Promise<User[]>  => {
        return await repositories.User.getUsersByQuery(query.criteria);
    })
}


