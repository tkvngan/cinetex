import {Repositories} from "../repositories/Repositories";
import {SignIn, SignInRequest, SignInResponse} from "cinetex-core/dist/application/requests";
import {createSecureToken, verifyPassword} from "../../security/SecurityUtils";
import {User} from "cinetex-core/dist/domain/entities/User";
import {InvalidPasswordException, UserNotFoundException} from "cinetex-core/dist/application/exceptions/Exceptions";

export class SignInInteractor extends SignIn {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(request: SignInRequest): Promise<SignInResponse> {
        const user: User | undefined = await this.repositories.User.getUserByEmail(request.email);
        if (!user) {
            throw new UserNotFoundException()
        }
        if (! await verifyPassword(request.password, user.password)) {
            throw new InvalidPasswordException()
        }
        delete (user as any).password;
        const token = await createSecureToken(user)
        return {user: user, token: token}
    }
}
