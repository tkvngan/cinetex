import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities/User";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetAllUsers: GetAllUsers
    }
}

export class GetAllUsers extends QueryUseCase<{}, User[]> {
    constructor(invoker?: UseCaseInvoker<{}, User[]>) {
        super(GetAllUsers.name, invoker);
    }
}



