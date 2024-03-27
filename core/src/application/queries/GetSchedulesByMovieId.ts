import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities/Schedule";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetSchedulesByMovieId: GetSchedulesByMovieId
    }
}

export class GetSchedulesByMovieId extends QueryUseCase<{ movieId: string }, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{ movieId: string }, Schedule[]>) {
        super("GetSchedulesByMovieId", invoker);
    }
}



