import {User} from "cinetex-core/dist/domain/entities";
import {GetUsersByQuery, UsersQuery} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {Credentials} from "cinetex-core/dist/security/Credentials";

export class GetUsersByQueryInteractor extends GetUsersByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: UsersQuery, credentials?: Credentials): Promise<Omit<User, "password">[]> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
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
