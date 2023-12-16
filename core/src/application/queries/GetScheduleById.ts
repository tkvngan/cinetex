import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly GetScheduleById: GetScheduleById
    }
}

export class GetScheduleById extends QueryUseCase<{ id: string }, Schedule | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Schedule | undefined>) {
        super(GetScheduleById.name, invoker);
    }
}



