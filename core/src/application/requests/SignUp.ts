import {RequestUseCase, UseCaseInvokerFactory} from "../UseCase";
import {User} from "../../domain/entities";
import {SignInResponse} from "./SignIn";

export type SignUpRequest = Readonly<{
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}>

export type SignUpResponse = SignInResponse

export class SignUp extends RequestUseCase<SignUpRequest, SignUpResponse> {
    constructor(invokerFactory?: UseCaseInvokerFactory<SignUpRequest, SignUpResponse>) {
        super("SignUp", invokerFactory);
    }
}
