import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetAllSchedules extends QueryUseCase<{}, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{}, Schedule[]>) {
        super("GetAllSchedules", invoker);
    }
}



