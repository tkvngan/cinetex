import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities/Movie";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetMovieByName: GetMovieByName
    }
}

export class GetMovieByName extends QueryUseCase<{ name: string }, Movie | undefined> {
    constructor(invoker?: UseCaseInvoker<{ name: string }, Movie | undefined>) {
        super(GetMovieByName.name, invoker);
    }
}



