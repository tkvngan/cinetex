import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Schedule} from "../../domain/entities";

export class GetSchedulesByMovieId extends QueryUseCase<{ movieId: string }, Schedule[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ movieId: string }, Schedule[]>) {
        super("GetSchedulesByMovieId", invokerFactory);
    }
}



