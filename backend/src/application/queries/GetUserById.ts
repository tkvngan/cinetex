import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetUserById} from "cinetex-core/dist/application/queries";

export function GetUserByIdInteractor(repositories: Repositories): GetUserById {
    return GetUserById(async (query: { id: string }): Promise<User | undefined>  => {
        return await repositories.User.getUserById(query.id);
    })
}
