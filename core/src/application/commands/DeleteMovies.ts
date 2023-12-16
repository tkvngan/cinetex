import {CommandUseCase, UseCaseInvoker} from "../UseCase";

export class DeleteMovies extends CommandUseCase<string[]> {
    constructor(invoker?: UseCaseInvoker<string[], void>) {
        super("DeleteMovies", invoker);
    }
}
