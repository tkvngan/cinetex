import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities/User";
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

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetUsersByQuery: GetUsersByQuery
    }
}

export class GetUsersByQuery extends QueryUseCase<UsersQuery, Omit<User, "password">[]> {
    constructor(invoker?: UseCaseInvoker<UsersQuery, Omit<User, "password">[]>) {
        super(GetUsersByQuery.name, invoker);
    }
}



