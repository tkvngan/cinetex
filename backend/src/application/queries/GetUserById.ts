import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";
import {GetUserById} from "cinetex-core/dist/application/queries";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {Credentials} from "cinetex-core/dist/security/Credentials";

export class GetUserByIdInteractor extends GetUserById {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {
        id: string
    }, credentials?: Credentials): Promise<Omit<User, "password"> | undefined> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        if (roles.includes("admin") || roles.includes("user") && credentials.user.id === query.id) {
            const user = await this.repositories.User.getUserById(query.id);
            if (user) {
                delete (user as any).password;
            }
            return user;
        }
        throw new UnauthorizedException()
    }
}
