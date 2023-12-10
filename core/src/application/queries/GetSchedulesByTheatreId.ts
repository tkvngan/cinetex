import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetSchedulesByTheatreId extends QueryUseCase<{ theatreId: string }, Schedule[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ theatreId: string }, Schedule[]>) {
        super("GetSchedulesByTheatreId", invokerFactory);
    }
}



