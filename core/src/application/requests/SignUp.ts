import {RequestUseCase, UseCaseInvoker} from "../UseCase";
import {SignInResponse} from "./SignIn";

export type SignUpRequest = Readonly<{
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}>

export type SignUpResponse = SignInResponse

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly SignUp: SignUp
    }
}

export class SignUp extends RequestUseCase<SignUpRequest, SignUpResponse> {
    constructor(invoker?: UseCaseInvoker<SignUpRequest, SignUpResponse>) {
        super(SignUp.name, invoker);
    }
}
