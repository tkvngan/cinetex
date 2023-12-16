import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities";

export class GetUserById extends QueryUseCase<{ id: string }, Omit<User, "password"> | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Omit<User, "password"> | undefined>) {
        super("GetUserById", invoker);
    }
}



