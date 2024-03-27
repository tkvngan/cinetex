import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities/Movie";

declare module "../index" {
    export interface UseCaseDefinitions {
        readonly GetMovieById: GetMovieById
    }
}

export class GetMovieById extends QueryUseCase<{ id: string }, Movie | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Movie | undefined>) {
        super("GetMovieById", invoker);
    }
}



