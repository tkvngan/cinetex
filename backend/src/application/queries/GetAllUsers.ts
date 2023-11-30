import {User} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllUsers} from "cinetex-core/dist/application/queries";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";

export class GetAllUsersInteractor extends GetAllUsers {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {}, credentials?: SecurityCredentials): Promise<User[]> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        if (roles.includes("admin")) {
            return await this.repositories.User.getAllUsers();
        }
        throw new UnauthorizedException()
    }
}
