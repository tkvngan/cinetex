import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Schedule} from "../../domain/entities/Schedule";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetAllSchedules: GetAllSchedules
    }
}

export class GetAllSchedules extends QueryUseCase<{}, Schedule[]> {
    constructor(invoker?: UseCaseInvoker<{}, Schedule[]>) {
        super(GetAllSchedules.name, invoker);
    }
}



