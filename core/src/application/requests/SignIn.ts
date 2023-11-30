import {RequestUseCase, UseCaseInvokerFactory} from "../UseCase";
import {User} from "../../domain/entities";

export type SignInRequest = Readonly<{
    email: string;
    password: string;
}>

export type SignInResponse = {
    user: Omit<User, "password">
    jwtToken: string
}

export class SignIn extends RequestUseCase<SignInRequest, SignInResponse> {
    constructor(invokerFactory?: UseCaseInvokerFactory<SignInRequest, SignInResponse>) {
        super("SignIn", invokerFactory);
    }
}
