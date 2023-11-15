import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetUserByEmail = QueryUseCase<{ email: string }, User | undefined>

export function GetUserByEmail(invoke: (query: { email: string }) => Promise<User | undefined>): GetUserByEmail {
    return { name: "GetUserByEmail", type: "query", invoke }
}


