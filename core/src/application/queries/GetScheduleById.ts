import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetScheduleById extends QueryUseCase<{ id: string }, Schedule | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ id: string }, Schedule | undefined>) {
        super("GetScheduleById", invokerFactory);
    }
}



