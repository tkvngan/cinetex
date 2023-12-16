import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities";

export class GetUserByEmail extends QueryUseCase<{ email: string }, Omit<User, "password"> | undefined> {
    constructor(invoker?: UseCaseInvoker<{ email: string }, Omit<User, "password"> | undefined>) {
        super("GetUserByEmail", invoker);
    }
}



