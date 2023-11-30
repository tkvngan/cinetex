import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Movie} from "../../domain/entities";

export class GetMovieByName extends QueryUseCase<{ name: string }, Movie | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ name: string }, Movie | undefined>) {
        super("GetMovieByName", invokerFactory);
    }
}



