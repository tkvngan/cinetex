import {Repositories} from "../repositories";
import {SignIn, SignInRequest, SignInResponse} from "cinetex-core/dist/application/requests/SignIn";
import {secretKey} from "../../infrastructure/security";
import {SignJWT} from "jose";
import bcrypt from "bcrypt";

export function SignInInteractor(repositories: Repositories): SignIn {
    return SignIn(async (request: SignInRequest): Promise<SignInResponse> => {
        const user = await repositories.User.getUserByEmail(request.email);
        if (!user) {
            throw new Error("User not found");
        }
        const isValidPassword = await bcrypt.compare(request.password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }
        delete (user as any).password;
        const key = await secretKey();
        const token = await new SignJWT({user: user})
            .setIssuer("cinetex")
            .setSubject(request.email)
            .setExpirationTime("30m")
            .setAudience("cinetex")
            .setIssuedAt(new Date())
            .setProtectedHeader({alg: "HS256", typ: "JWT"})
            .sign(key)
        return {user, token}
    });
}
