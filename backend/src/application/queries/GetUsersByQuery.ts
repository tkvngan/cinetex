import {User} from "core/dist/domain/entities";
import {UsersQuery, GetUsersByQuery} from "core/dist/application/queries";
import {Repositories} from "../repositories";

export function GetUsersByQueryInteractor(repositories: Repositories): GetUsersByQuery {
    return GetUsersByQuery(async (query: UsersQuery): Promise<User[]>  => {
        return await repositories.User.queryUsers(query);
    })
}

