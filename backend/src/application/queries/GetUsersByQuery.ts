import {User} from "cinetex-core/dist/domain/entities";
import {GetUsersByQuery, UsersQuery} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export class GetUsersByQueryInteractor extends GetUsersByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: UsersQuery, credentials?: SecurityCredentials): Promise<Omit<User, "password">[]> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        // GetUsersByQuery is only allowed for admin
        if (roles.includes("admin")) {
            const users = await this.repositories.User.queryUsers(query);
            users.forEach((user: User) => {
                delete (user as any).password;
            });
            return users
        }
        throw new UnauthorizedException();
    }
}
