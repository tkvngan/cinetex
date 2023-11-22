import {QueryUseCase} from "../UseCase";
import {User} from "../../domain/entities";
import {ByPattern} from "./QueryCriteria";

export type UsersQuery = {
    id: string | [string];
    name?: never;
    email?: never;
    phoneNumber?: never;
} | {
    id?: never;
    name?: string | ByPattern;
    email?: string | ByPattern;
    phoneNumber?: string | ByPattern;
}

export type GetUsersByQuery = QueryUseCase<UsersQuery, User[]>

export function GetUsersByQuery(invoke: (query: UsersQuery) => Promise<User[]>): GetUsersByQuery {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


