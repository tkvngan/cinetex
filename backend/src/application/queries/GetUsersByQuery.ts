import {User} from "cinetex-core/dist/domain/entities";
import {GetUsersByQuery, UsersQuery} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories";

export function GetUsersByQueryInteractor(repositories: Repositories): GetUsersByQuery {
    return GetUsersByQuery(async (query: UsersQuery): Promise<User[]>  => {
        return await repositories.User.queryUsers(query);
    })
}

