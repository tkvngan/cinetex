import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly GetAllUsers: GetAllUsers
    }
}

export class GetAllUsers extends QueryUseCase<{}, User[]> {
    constructor(invoker?: UseCaseInvoker<{}, User[]>) {
        super(GetAllUsers.name, invoker);
    }
}



