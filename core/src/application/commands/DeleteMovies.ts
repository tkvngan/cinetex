import {CommandUseCase, UseCaseInvoker} from "../UseCase";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly DeleteMovies: DeleteMovies
    }
}

export class DeleteMovies extends CommandUseCase<string[]> {
    constructor(invoker?: UseCaseInvoker<string[], void>) {
        super("DeleteMovies", invoker);
    }
}
