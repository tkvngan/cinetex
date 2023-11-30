import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {User} from "../../domain/entities";

export class GetAllUsers extends QueryUseCase<{}, User[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{}, User[]>) {
        super("GetAllUsers", invokerFactory);
    }
}



