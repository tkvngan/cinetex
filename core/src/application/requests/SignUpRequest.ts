import {RequestUseCase} from "../UseCase";
import {User} from "../../domain/entities";

export type SignUpRequest = RequestUseCase<{ email: string; password: string }, User>

export function SignUpRequest(invoke: (request: { email: string; password: string }) => Promise<User>): SignUpRequest {
    return { name: "SignUpRequest", type: "request", invoke }
}
