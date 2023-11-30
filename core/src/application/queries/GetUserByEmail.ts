import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {User} from "../../domain/entities";

export class GetUserByEmail extends QueryUseCase<{ email: string }, Omit<User, "password"> | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ email: string }, Omit<User, "password"> | undefined>) {
        super("GetUserByEmail", invokerFactory);
    }
}



