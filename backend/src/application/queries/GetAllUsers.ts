import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllUsers} from "cinetex-core/dist/application/queries";

export function GetAllUsersInteractor(repositories: Repositories): GetAllUsers {
    return GetAllUsers(async (query: {}): Promise<User[]>  => {
        return await repositories.User.getAllUsers();
    })
}

