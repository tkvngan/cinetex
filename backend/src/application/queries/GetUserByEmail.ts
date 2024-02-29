import {User} from "cinetex-core/dist/domain/entities/User";
import {Repositories} from "../repositories/Repositories";
import {GetUserByEmail} from "cinetex-core/dist/application/queries";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";

export class GetUserByEmailInteractor extends GetUserByEmail {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { email: string }, credentials?: Credentials): Promise<Omit<User, "password"> | undefined> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        if (roles.includes("admin") || roles.includes("user") && credentials.user.email === query.email) {
            const user = await this.repositories.User.getUserByEmail(query.email);
            if (user) {
                delete (user as any).password;
            }
            return user;
        }
        throw new UnauthorizedException()
    }
}
