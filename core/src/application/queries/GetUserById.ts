import {QueryUseCase} from "../UseCase";
import {User} from "../../domain/entities";

export type GetUserById = QueryUseCase<{ id: string }, Omit<User, "password"> | undefined>

export function GetUserById(invoke: (query: { id: string }) => Promise<Omit<User, "password"> | undefined>): GetUserById {
    return { name: "GetUserById", type: "query", invoke }
}


