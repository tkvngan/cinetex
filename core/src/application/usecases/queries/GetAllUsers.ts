import {QueryUseCase} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetAllUsers = QueryUseCase<{}, User[]>

export function GetAllUsers(invoke: (query: {}) => Promise<User[]>): GetAllUsers {
    return { name: "GetAllUsers", type: "query", invoke }
}


