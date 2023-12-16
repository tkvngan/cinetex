import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {User} from "../../domain/entities";

export class GetAllUsers extends QueryUseCase<{}, User[]> {
    constructor(invoker?: UseCaseInvoker<{}, User[]>) {
        super("GetAllUsers", invoker);
    }
}



