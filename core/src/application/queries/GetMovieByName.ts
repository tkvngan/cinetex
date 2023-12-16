import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities";

export class GetMovieByName extends QueryUseCase<{ name: string }, Movie | undefined> {
    constructor(invoker?: UseCaseInvoker<{ name: string }, Movie | undefined>) {
        super("GetMovieByName", invoker);
    }
}



