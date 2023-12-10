import {CommandUseCase, UseCaseInvokerFactory} from "../UseCase";

export class DeleteMovies extends CommandUseCase<string[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<string[], void>) {
        super("DeleteMovies", invokerFactory);
    }
}
