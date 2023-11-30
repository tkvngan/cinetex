import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {User} from "../../domain/entities";

export class GetUserById extends QueryUseCase<{ id: string }, Omit<User, "password"> | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ id: string }, Omit<User, "password"> | undefined>) {
        super("GetUserById", invokerFactory);
    }
}



