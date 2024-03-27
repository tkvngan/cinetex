import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities/Theatre";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetTheatreById: GetTheatreById
    }
}

export class GetTheatreById extends QueryUseCase<{ id: string }, Theatre | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Theatre | undefined>) {
        super("GetTheatreById", invoker);
    }
}



