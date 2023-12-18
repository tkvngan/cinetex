import {RequestUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities";

export type SignInRequest = Readonly<{
    email: string;
    password: string;
}>

export type SignInResponse = {
    user: Omit<User, "password">
    token: string
}

declare module "../" {
    interface UseCaseDefinitions {
        readonly SignIn: SignIn
    }
}

export class SignIn extends RequestUseCase<SignInRequest, SignInResponse> {
    constructor(invoker?: UseCaseInvoker<SignInRequest, SignInResponse>) {
        super(SignIn.name, invoker);
    }
}
