import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllUsers} from "cinetex-core/dist/application/queries";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export function GetAllUsersInteractor(repositories: Repositories): GetAllUsers {
    return GetAllUsers(async (query: {}, credentials?: SecurityCredentials): Promise<User[]>  => {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        // GetUsersByQuery is only allowed for admin
        if (roles.includes("admin")) {
            return await repositories.User.getAllUsers();
        }
        throw new UnauthorizedException()
    })
}

