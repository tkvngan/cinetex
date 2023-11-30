import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetAllSchedules extends QueryUseCase<{}, Schedule[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{}, Schedule[]>) {
        super("GetAllSchedules", invokerFactory);
    }
}



