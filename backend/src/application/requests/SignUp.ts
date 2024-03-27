import {Repositories} from "../repositories/Repositories";
import {SignUp, SignUpRequest, SignUpResponse} from "cinetex-core/dist/application/requests";
import {ObjectId} from "mongodb";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UserAlreadyExistsException} from "cinetex-core/dist/application/exceptions/Exceptions";
import {createSecureHash, createSecureToken} from "../../security/SecurityUtils";

export class SignUpInteractor extends SignUp {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(request: SignUpRequest): Promise<SignUpResponse> {
        const existingUser = await this.repositories.User.getUserByEmail(request.email);
        if (existingUser) {
            throw new UserAlreadyExistsException();
        }
        const passwordHash = await createSecureHash(request.password);
        const userId = new ObjectId().toHexString();
        const roles: string[] = ["user"];
        const createAt = new Date()
        const user: User = {
            ...request,
            id: userId,
            roles: roles,
            emailVerified: false,
            createdAt: createAt,
        } as User
        delete (user as any).password;
        const token = await createSecureToken(user)
        await this.repositories.User.createUser({
            ...user,
            password: passwordHash,
        })
        return {user: user, token: token}
    }
}
