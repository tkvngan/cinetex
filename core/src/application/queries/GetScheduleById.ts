import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetScheduleById extends QueryUseCase<{ id: string }, Schedule | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Schedule | undefined>) {
        super("GetScheduleById", invoker);
    }
}



