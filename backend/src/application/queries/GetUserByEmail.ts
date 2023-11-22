import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetUserByEmail} from "cinetex-core/dist/application/queries";

export function GetUserByEmailInteractor(repositories: Repositories): GetUserByEmail {
    return GetUserByEmail(async (query: { email: string }): Promise<User | undefined>  => {
        return await repositories.User.getUserByEmail(query.email);
    })
}

