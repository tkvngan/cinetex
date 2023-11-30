import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetUserByEmail} from "cinetex-core/dist/application/queries";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";

export class GetUserByEmailInteractor extends GetUserByEmail {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { email: string }, credentials?: SecurityCredentials): Promise<Omit<User, "password"> | undefined> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        // GetUserByEmail is only allowed for admin or the user itself
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
