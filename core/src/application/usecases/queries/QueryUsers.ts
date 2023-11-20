import {QueryUseCase} from "../UseCase";
import {User} from "../../../domain/entities";
import {QueryCriteria, QueryPattern} from "./QueryCriteria";

export type QueryUsersCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export type QueryUsers = QueryUseCase<{ criteria: QueryUsersCriteria }, User[]>

export function QueryUsers(invoke: (query: { criteria: QueryUsersCriteria }) => Promise<User[]>): QueryUsers {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


