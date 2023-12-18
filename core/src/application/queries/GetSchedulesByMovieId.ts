import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetSchedulesByMovieId: GetSchedulesByMovieId
    }
}

export class GetSchedulesByMovieId extends QueryUseCase<{ movieId: string }, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{ movieId: string }, Schedule[]>) {
        super(GetSchedulesByMovieId.name, invoker);
    }
}



