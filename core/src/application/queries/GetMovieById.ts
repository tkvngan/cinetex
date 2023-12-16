import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly GetMovieById: GetMovieById
    }
}

export class GetMovieById extends QueryUseCase<{ id: string }, Movie | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Movie | undefined>) {
        super(GetMovieById.name, invoker);
    }
}



