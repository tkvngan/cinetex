import {RequestUseCase} from "../UseCase";
import {User} from "../../domain/entities";

export type SignInRequest = Readonly<{
    email: string;
    password: string;
}>

export type SignInResponse = {
    user: Omit<User, "password">
    token: string
}

export type SignIn = RequestUseCase<SignInRequest, SignInResponse>

export function SignIn(invoke: (request: SignInRequest) => Promise<SignInResponse>): SignIn {
    return { name: "SignIn", type: "request", invoke }
}
