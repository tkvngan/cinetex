import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetSchedulesByTheatreId: GetSchedulesByTheatreId
    }
}

export class GetSchedulesByTheatreId extends QueryUseCase<{ theatreId: string }, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{ theatreId: string }, Schedule[]>) {
        super(GetSchedulesByTheatreId.name, invoker);
    }
}



