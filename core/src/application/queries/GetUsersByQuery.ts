import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
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

export class GetUsersByQuery extends QueryUseCase<UsersQuery, Omit<User, "password">[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<UsersQuery, Omit<User, "password">[]>) {
        super("GetUsersByQuery", invokerFactory);
    }
}



