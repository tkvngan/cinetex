import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Movie} from "../../domain/entities";

export class GetMovieById extends QueryUseCase<{ id: string }, Movie | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ id: string }, Movie | undefined>) {
        super("GetMovieById", invokerFactory);
    }
}



