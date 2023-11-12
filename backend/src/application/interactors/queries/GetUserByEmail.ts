import {User} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetUserByEmail} from "shared/dist/application/usecases/queries";

export function GetUserByEmailInteractor(repositories: Repositories): GetUserByEmail {
    return GetUserByEmail(async (query: { email: string }): Promise<User | undefined>  => {
        return await repositories.User.getUserByEmail(query.email);
    })
}


