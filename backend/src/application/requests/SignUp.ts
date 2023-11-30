import {Repositories} from "../repositories";
import {SignUp, SignUpRequest, SignUpResponse} from "cinetex-core/dist/application/requests";
import {ObjectId} from "mongodb";
import {SignJWT} from "jose";
import {secretKey, secureHash} from "../../infrastructure/security";
import {User} from "cinetex-core/dist/domain/entities";

export class SignUpInteractor extends SignUp {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(request: SignUpRequest): Promise<SignUpResponse> {
        const existingUser = await this.repositories.User.getUserByEmail(request.email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const passwordHash = await secureHash(request.password);
        const key = await secretKey();
        const userId = new ObjectId().toHexString();
        const roles: string[] = ["user"];
        const user: User = {
            ...request,
            id: userId,
            roles: roles,
            emailVerified: false,
            createdAt: new Date(),
        } as User
        delete (user as any).password;
        const jwtToken= await new SignJWT({user: user})
            .setIssuer("cinetex")
            .setSubject(request.email)
            .setExpirationTime("30m")
            .setAudience("cinetex")
            .setIssuedAt(new Date())
            .setProtectedHeader({alg: "HS256", typ: "JWT"})
            .sign(key)
        await this.repositories.User.createUser({
            ...user,
            password: passwordHash,
        })
        return {user: user, jwtToken: jwtToken}
    }
}
