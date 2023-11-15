import {User} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetUserById} from "core/dist/application/usecases/queries";

export function GetUserByIdInteractor(repositories: Repositories): GetUserById {
    return GetUserById(async (query: { id: string }): Promise<User | undefined>  => {
        return await repositories.User.getUserById(query.id);
    })
}

