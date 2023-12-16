import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly GetTheatreById: GetTheatreById
    }
}

export class GetTheatreById extends QueryUseCase<{ id: string }, Theatre | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Theatre | undefined>) {
        super(GetTheatreById.name, invoker);
    }
}



