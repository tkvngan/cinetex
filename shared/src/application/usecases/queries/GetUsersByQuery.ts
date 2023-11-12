import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {User} from "../../../domain/entities";
import {QueryCriteria, QueryPattern} from "./QueryCriteria";

export type UserQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    email?: string | QueryPattern;
    phoneNumber?: string | QueryPattern;
}

export type GetUsersByQuery = QueryUseCase<{ criteria: UserQueryCriteria }, User[]>

export function GetUsersByQuery(invoke: (query: { criteria: UserQueryCriteria }) => Promise<User[]>): GetUsersByQuery {
    return { name: "GetUsersByQuery", type: "query", invoke }
}


