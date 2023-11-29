import {RequestUseCase} from "../UseCase";
import {User} from "../../domain/entities";

export type SignUpRequest = Readonly<{
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}>

export type SignUpResponse = {
    user: Omit<User, "password">
    token: string
}

export type SignUp = RequestUseCase<SignUpRequest, SignUpResponse>

export function SignUp(invoke: (request: SignUpRequest) => Promise<SignUpResponse>): SignUp {
    return { name: "SignUp", type: "request", invoke }
}
