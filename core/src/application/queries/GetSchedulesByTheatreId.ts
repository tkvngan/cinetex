import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities/Schedule";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetSchedulesByTheatreId: GetSchedulesByTheatreId
    }
}

export class GetSchedulesByTheatreId extends QueryUseCase<{ theatreId: string }, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{ theatreId: string }, Schedule[]>) {
        super("GetSchedulesByTheatreId", invoker);
    }
}



