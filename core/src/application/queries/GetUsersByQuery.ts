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

export type GetUsersByQuery = QueryUseCase<UsersQuery, Omit<User, "password">[]>

export function GetUsersByQuery(invoke: (query: UsersQuery) => Promise<Omit<User, "password">[]>): GetUsersByQuery {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


