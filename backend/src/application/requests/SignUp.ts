import {Repositories, UserRepository} from "../repositories";
import {SignUp, SignUpRequest, SignUpResponse} from "cinetex-core/dist/application/requests/SignUp";
import {ObjectId} from "mongodb";
import {SignJWT} from "jose";
import {secretKey, secureHash} from "../../infrastructure/security";
import {User} from "cinetex-core/dist/domain/entities";

export function SignUpInteractor(repositories: Repositories): SignUp {
    return SignUp(async (request: SignUpRequest): Promise<SignUpResponse> => {
        const existingUser = await repositories.User.getUserByEmail(request.email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const passwordHash = await secureHash(request.password);
        const key = await secretKey();
        const userId = new ObjectId().toHexString();
        const roles: string[] = ["user"];
        const user = {
            ...request,
            id: userId,
            roles: roles,
            emailVerified: false,
            createdAt: new Date(),
        } as User
        delete (user as any).password;
        const token = await new SignJWT({ user: user })
            .setIssuer("cinetex")
            .setSubject(request.email)
            .setExpirationTime("30m")
            .setAudience("cinetex")
            .setIssuedAt(new Date())
            .setProtectedHeader({alg: "HS256", typ: "JWT"})
            .sign(key)
        await repositories.User.createUser({
            ...user,
            password: passwordHash,
        })
        return {user, token}
    })
}
