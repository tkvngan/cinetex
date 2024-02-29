import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities/User";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetUserById: GetUserById
    }
}

export class GetUserById extends QueryUseCase<{ id: string }, Omit<User, "password"> | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Omit<User, "password"> | undefined>) {
        super(GetUserById.name, invoker);
    }
}



