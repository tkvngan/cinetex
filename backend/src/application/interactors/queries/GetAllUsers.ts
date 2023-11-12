import {User} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetAllUsers} from "shared/dist/application/usecases/queries";

export function GetAllUsersInteractor(repositories: Repositories): GetAllUsers {
    return GetAllUsers(async (query: {}): Promise<User[]>  => {
        return await repositories.User.getAllUsers();
    })
}


