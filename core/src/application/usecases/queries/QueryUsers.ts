import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {User} from "../../../domain/entities";
import {QueryCriteria, QueryPattern} from "./QueryCriteria";

export type QueryUserCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export type QueryUsers = QueryUseCase<{ criteria: QueryUserCriteria }, User[]>

export function QueryUsers(invoke: (query: { criteria: QueryUserCriteria }) => Promise<User[]>): QueryUsers {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


