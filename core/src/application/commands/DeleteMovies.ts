import {CommandUseCase, UseCaseInvoker} from "../UseCase";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly DeleteMovies: DeleteMovies
    }
}

export class DeleteMovies extends CommandUseCase<string[]> {
    constructor(invoker?: UseCaseInvoker<string[], void>) {
        super(DeleteMovies.name, invoker);
    }
}
