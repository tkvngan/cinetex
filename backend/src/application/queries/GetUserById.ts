import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetUserById} from "cinetex-core/dist/application/queries";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export function GetUserByIdInteractor(repositories: Repositories): GetUserById {
    return GetUserById(async (query: { id: string }, credentials?: SecurityCredentials): Promise<Omit<User, "password"> | undefined>  => {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        // GetUserById is only allowed for admin or the user itself
        if (roles.includes("admin") || roles.includes("user") && credentials.user.id === query.id) {
            const user = await repositories.User.getUserById(query.id);
            if (user) {
                delete (user as any).password;
            }
            return user;
        }
        throw new UnauthorizedException()
    })
}

