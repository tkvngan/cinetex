import {QueryUseCase} from "../UseCase";
import {User} from "../../domain/entities";

export type GetUserByEmail = QueryUseCase<{ email: string }, Omit<User, "password"> | undefined>

export function GetUserByEmail(invoke: (query: { email: string }) => Promise<Omit<User, "password"> | undefined>): GetUserByEmail {
    return { name: "GetUserByEmail", type: "query", invoke }
}


