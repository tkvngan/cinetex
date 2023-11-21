import {QueryUseCase} from "../UseCase";
import {User} from "../../domain/entities";
import {QueryPattern} from "./QueryCriteria";

export type UsersQuery = {
    id: string | [string];
    name?: never;
    email?: never;
    phoneNumber?: never;
} | {
    id?: never;
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export type GetUsersByQuery = QueryUseCase<UsersQuery, User[]>

export function GetUsersByQuery(invoke: (query: UsersQuery) => Promise<User[]>): GetUsersByQuery {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


