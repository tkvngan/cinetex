import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetUserById = QueryUseCase<{ id: string }, User | undefined>

export function GetUserById(invoke: (query: { id: string }) => Promise<User | undefined>): GetUserById {
    return { name: "GetUserById", type: "query", invoke }
}


