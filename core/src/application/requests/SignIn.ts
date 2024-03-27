import {RequestUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities/User";

export type SignInRequest = Readonly<{
    email: string;
    password: string;
}>

export type SignInResponse = {
    user: Omit<User, "password">
    token: string
}

declare module "../index" {
    export interface UseCaseDefinitions {
        readonly SignIn: SignIn
    }
}

export class SignIn extends RequestUseCase<SignInRequest, SignInResponse> {
    constructor(invoker?: UseCaseInvoker<SignInRequest, SignInResponse>) {
        super("SignIn", invoker);
    }
}
